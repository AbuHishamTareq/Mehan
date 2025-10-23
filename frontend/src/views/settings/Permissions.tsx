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
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";
import { hasPermission } from "../../lib/authorization";
import { useAuth } from "../../hooks/useAuth";

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
    const { user } = useAuth();

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

    type ExportType = "csv" | "excel" | "pdf";
    type ExportScope = "all" | "current" | "selected";

    const userPermissions = user?.permissions || [];

    const canAdd = hasPermission(`create_permission`, userPermissions);
    // const canPrint = hasPermission(`print-domain`, userPermissions);
    const canExport = hasPermission(`export_permission`, userPermissions);
    const canActivateDeactivate = hasPermission(
        `active_deactive_permission`,
        userPermissions
    );
    const canEdit = hasPermission(`edit_permission`, userPermissions);
    const canView = hasPermission(`view_permission`, userPermissions);

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

    // TRANSLATE MODEL FORM
    const translatedConfig = {
        ...PermissionModelFormConfig,
        moduleTitle: t("managePermissions"),
        title: t("addNewPermission"),
        description: t("permissionDesc"),
        addButton: {
            ...PermissionModelFormConfig.addButton,
            label: t("addNewPermission"),
            className: `${PermissionModelFormConfig.addButton.className} ${font}`,
        },
        fields: PermissionModelFormConfig.fields.map((field) => {
            // Add dynamic options if the field is "department"
            const baseField =
                field.name === "module"
                    ? { ...field, options: modules }
                    : field;

            return {
                ...baseField,
                label: t(baseField.key), // translate label
                placeholder: t(baseField.key + "Placeholder"), // translate placeholder
                className: `${baseField.className ?? ""} ${font}`,
            };
        }),
        buttons: PermissionModelFormConfig.buttons.map((btn) => ({
            ...btn,
            label: t(btn.key === "cancel" ? "cancel" : "saveChanges"),
        })),
    };

    // TRANSLATE TABLES HEADERS
    const columns = PermissionTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    // TRANSLATE TOOLTIP FOR ACTION BUTTONS
    const actions = PermissionTableConfig.actions.map((action) => ({
        ...action,
        label: t(action.label),
        tooltip: t(action.tooltip),
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

    // EXPORT TO CSV, EXCEL AND PDF
    const exportData = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const data = permissions.permissions.data;

        let dataToExport = data;
        let fileName = "permissions";

        if (scope === "current") {
            dataToExport = data; // if you want pagination, replace with current page slice
            fileName = `permissions_page_${permissions.permissions.from}`;
        } else if (scope === "selected") {
            if (selectedRows.length === 0) {
                toast({
                    title: "Notification",
                    description: "No rows selected to export.",
                    variant: "destructive",
                    className: font,
                });
                return;
            }
            dataToExport = data.filter((d) => selectedRows.includes(d.id!));
            fileName = `permissions_selected_${selectedRows.length}`;
        }

        generateAndDownloadFile({
            data: dataToExport,
            columns: PermissionTableConfig.columns,
            fileName,
            toast,
            t,
            type,
        });
    };

    // EXPORT CSV
    // EXPORT ALL PAGES TO CSV
    const handleExportAllCSV = async () => {
        exportData("csv", "all");
    };

    // EXPORT CURRENT PAGE TO CSV
    const handleCurrentPageExportCSV = () => {
        exportData("csv", "current");
    };

    // EXPORT SELECTED ROWS TO CSV
    const handleExportSelectedCSV = () => {
        exportData("csv", "selected");
    };

    // EXPORT EXCEL
    // EXPORT ALL PAGES TO EXCEL
    const handleExportAllExcel = async () => {
        exportData("excel", "all");
    };

    // EXPORT CURRENT PAGE TO EXCEL
    const handleCurrentPageExportExcel = () => {
        exportData("excel", "current");
    };

    // EXPORT SELECTED ROWS TO EXCEL
    const handleExportSelectedExcel = () => {
        exportData("excel", "selected");
    };

    // EXPORT PDF
    // EXPORT ALL PAGES TO PDF
    const handleExportAllPdf = async () => {
        exportData("pdf", "all");
    };

    // EXPORT CURRENT PAGE TO PDF
    const handleCurrentPageExportPdf = () => {
        exportData("pdf", "current");
    };

    // EXPORT SELECTED ROWS TO PDF
    const handleExportSelectedPdf = () => {
        exportData("pdf", "selected");
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
                        title={isRTL ? "الصلاحية" : "permision"}
                        exportAllCsvFn={handleExportAllCSV}
                        exportCurrentPageCsv={handleCurrentPageExportCSV}
                        exportSelectedRowsCsv={handleExportSelectedCSV}
                        exportAllExcelFn={handleExportAllExcel}
                        exportCurrentPageExcel={handleCurrentPageExportExcel}
                        exportSelectedRowsExcel={handleExportSelectedExcel}
                        exportAllPdfFn={handleExportAllPdf}
                        exportCurrentPagePdf={handleCurrentPageExportPdf}
                        exportSelectedRowsPdf={handleExportSelectedPdf}
                        showImportButton={false}
                        canExport={canExport}
                        canActivateDeactivate={canActivateDeactivate}
                    />
                </div>

                {/* Search & Add Permission */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder={t("searchPermission")}
                            className={`h-10 w-full border border-blue-200 ${font} ${
                                isRTL ? "pl-10 pr-4" : "pr-10 pl-4"
                            }`}
                            {...register("search")}
                        />
                        <Search
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 ${
                                isRTL ? "left-4 scale-x-[-1]" : "right-4"
                            }`}
                        />
                    </div>
                    <CustomModelForm
                        title={
                            mode === "view"
                                ? t("viewPermission")
                                : mode === "edit"
                                ? t("editPermission")
                                : translatedConfig.title
                        }
                        description={
                            mode === "view"
                                ? ""
                                : mode === "edit"
                                ? t("editPermissionDesc")
                                : translatedConfig.description
                        }
                        addButton={
                            canAdd ? translatedConfig.addButton : undefined
                        }
                        fields={translatedConfig.fields}
                        buttons={translatedConfig.buttons}
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
                    actions={actions}
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
                    canEdit={canEdit}
                    canView={canView}
                    canActivateDeactivate={canActivateDeactivate}
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
