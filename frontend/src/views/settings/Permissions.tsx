/* eslint-disable react-hooks/exhaustive-deps */

import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { useCallback, useEffect, useState, useRef } from "react";
import { CustomModelForm } from "../../components/custom-model-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import type {
    LinkProps,
    PermissionProps,
    SelectOptions,
} from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { PermissionModelFormConfig } from "../../config/forms/permission-model-form";
import { PermissionController } from "../../controllers/PermissionController";
import { PermissionTableConfig } from "../../config/tables/permission-table";
import { BulkAction } from "../../components/bulk-action";
import { Search } from "lucide-react";

interface PermissionFormValue {
    module: string;
    label: string;
    description?: string;
    is_active?: boolean;
    search?: string;
    perPage?: number;
}

interface PermissionPaginationProps {
    data: PermissionProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface PermissionIndexProps {
    permissions: PermissionPaginationProps;
}

const schema = yup.object({
    module: yup.string().required("Module is required"),
    label: yup.string().required("Permission is required"),
});

const Permissions = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();

    const [modelOpen, setModelOpen] = useState(false);
    const [permissions, setPermissions] = useState<PermissionIndexProps>({
        permissions: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [modules, setModules] = useState<SelectOptions[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedPermission, setSelectedPermission] =
        useState<PermissionProps | null>(null);

    // Persist current perPage
    const [currentPerPage, setCurrentPerPage] = useState(10);

    const defaultFormValues: PermissionFormValue = {
        module: "",
        label: "",
        description: "",
        is_active: true,
        search: "",
        perPage: currentPerPage,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
        setValue,
    } = useForm<PermissionFormValue>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");
    const initialMount = useRef(true);

    const dynamicOptionsFields = PermissionModelFormConfig.fields.map((field) =>
        field.name === "module" ? { ...field, options: modules } : field
    );

    const fetchPermissionData = useCallback(
        async (
            search?: string,
            perPage: number = currentPerPage,
            page?: number,
            triggerPageLoading: boolean = false
        ) => {
            try {
                if (triggerPageLoading) {
                    setPageLoading(true);
                }
                const response = await PermissionController.fetchPermissions({
                    search,
                    perPage,
                    page,
                });
                setPermissions(response);
                setModules(response.modules);
            } catch (error) {
                console.error(error);
            } finally {
                if (triggerPageLoading) {
                    setPageLoading(false);
                }
            }
        },
        [currentPerPage]
    );

    // Initial fetch
    useEffect(() => {
        fetchPermissionData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch on search change
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchPermissionData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchPermissionData]);

    const columns = PermissionTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    const onSubmit = async (data: PermissionFormValue) => {
        setFormSubmitting(true);
        try {
            if (mode === "edit" && selectedPermission) {
                const response = await PermissionController.updatePermission(
                    selectedPermission.id!,
                    data as PermissionProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Permission updated successfully !",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await PermissionController.addPermmission(
                    data as PermissionProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Permission added successfully !",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            // Always fetch with current perPage
            fetchPermissionData(searchValue, currentPerPage);
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedPermission(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (
        mode: "create" | "view" | "edit",
        permission?: PermissionProps
    ) => {
        setMode(mode);
        if (permission) {
            reset({
                module: permission.module_id?.toString() ?? "",
                label: permission.label,
                description: permission.description,
            });
            setSelectedPermission(permission);
        }
        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selection
        setValue("perPage", perPage);
        fetchPermissionData(searchValue, perPage); // immediately fetch
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleToggle = async (id: number, checked: boolean) => {
        try {
            await PermissionController.activeDeactivate(id, checked);
            fetchPermissionData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    return (
        <div className="bg-gradient-card min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-2 animate-fade-in border-b">
                    <h1 className={`text-3xl font-bold text-gray-900 ${font}`}>
                        {t("permissionsTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 mb-4 ${font}`}>
                        {t("permissionsSubtitle")}
                    </p>
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 mb-4 border-b">
                    <BulkAction
                        selectedRows={selectedRows}
                        onClearSelection={() => setSelectedRows([])}
                        data={permissions.permissions.data}
                        bulkActivateFn={(ids) =>
                            PermissionController.bulkActivate(ids)
                        }
                        bulkDeactivateFn={(ids) =>
                            PermissionController.bulkDeactivate(ids)
                        }
                        onSuccess={() =>
                            fetchPermissionData(searchValue, currentPerPage)
                        }
                        title="permision"
                    />
                </div>

                {/* Search & Add Permission */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder="Search Permissions..."
                            className="h-10 w-full pr-10 border border-blue-200" // add padding-right for icon
                            {...register("search")}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    </div>
                    <CustomModelForm
                        title={
                            mode === "view"
                                ? "View Permission"
                                : mode === "edit"
                                ? "Edit Permission"
                                : PermissionModelFormConfig.title
                        }
                        description={PermissionModelFormConfig.description}
                        addButton={PermissionModelFormConfig.addButton}
                        fields={dynamicOptionsFields}
                        buttons={PermissionModelFormConfig.buttons}
                        register={register}
                        errors={errors}
                        isSubmitting={formSubmitting}
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        open={modelOpen}
                        onOpenChange={handleModelToggle}
                        mode={mode}
                    />
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    actions={PermissionTableConfig.actions}
                    data={permissions.permissions.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as PermissionProps)}
                    onEdit={(row) => openModel("edit", row as PermissionProps)}
                    isModel={true}
                    from={permissions.permissions.from}
                    enableSelection={true}
                    selectedRows={selectedRows}
                    onSelectionChange={handleSelectionChange}
                    onStatusToggle={(id, checked) => handleToggle(id, checked)}
                />

                {/* Pagination */}
                <div className="px-6 pb-4 border border-blue-200 bg-blue-50 rounded-b">
                    {permissions.permissions && (
                        <Pagination
                            paginateData={permissions.permissions}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchPermissionData(
                                    searchValue,
                                    currentPerPage,
                                    page
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Permissions;
