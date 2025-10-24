import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { useCallback, useEffect, useState, useRef } from "react";
import { CustomModelForm } from "../../components/custom-model-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import {
    type PermissionProps,
    type LinkProps,
    type RoleProps,
} from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { RoleController } from "../../controllers/RoleController";
import { RoleTableConfig } from "../../config/tables/role-table";
import { RoleModelFormConfig } from "../../config/forms/role-model-form";
import { BulkAction } from "../../components/bulk-action";
import { Search } from "lucide-react";
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../lib/authorization";

interface RoleFormValue {
    label: string;
    description?: string;
    permissions: number[];
    search?: string;
    perPage?: number;
}

interface RolePaginationProps {
    data: RoleProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface RoleIndexProps {
    roles: RolePaginationProps;
}

const schema = yup.object({
    label: yup.string().required("Role is required"),
    permissions: yup
        .array()
        .of(yup.number().required())
        .min(1, "Select at least one permission")
        .required("Permissions are required"),
});

const PermissionsAndRoles = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();

    const [modelOpen, setModelOpen] = useState(false);
    const [roles, setRoles] = useState<RoleIndexProps>({
        roles: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedRole, setSelectedRole] = useState<RoleProps | null>(null);
    const [permissions, setPermissions] = useState<PermissionProps[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const { user, initAuth } = useAuth();

    type ExportType = "csv" | "excel" | "pdf";
    type ExportScope = "all" | "current" | "selected";

    // Persist current perPage in state
    const [currentPerPage, setCurrentPerPage] = useState(10);

    const defaultFormValues: RoleFormValue = {
        label: "",
        description: "",
        permissions: [],
        search: "",
        perPage: currentPerPage,
    };

    const userPermissions = user?.permissions || [];
    const canAdd = hasPermission(`create_role`, userPermissions);
    // const canPrint = hasPermission(`print-domain`, userPermissions);
    const canExport = hasPermission(`export_role`, userPermissions);
    const canActivateDeactivate = hasPermission(
        `active_deactive_role`,
        userPermissions
    );
    const canEdit = hasPermission(`edit_role`, userPermissions);
    const canView = hasPermission(`view_role`, userPermissions);
    console.log(user?.roles);
    const userRole = user?.roles;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
        setValue,
    } = useForm<RoleFormValue>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");

    const initialMount = useRef(true);

    const fetchRoleData = useCallback(
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
                const response = await RoleController.fetchRoles({
                    search,
                    perPage,
                    page,
                });
                setRoles(response);
                setPermissions(response.permissions);
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
        fetchRoleData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch data when search changes
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchRoleData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchRoleData]);

    // TRANSLATE MODEL FORM
    const translatedConfig = {
        ...RoleModelFormConfig,
        moduleTitle: t("manageRoles"),
        title: t("addNewRole"),
        description: t("roleDesc"),
        addButton: {
            ...RoleModelFormConfig.addButton,
            label: t("addNewRole"),
            className: `${RoleModelFormConfig.addButton.className} ${font}`,
        },
        fields: RoleModelFormConfig.fields.map((field) => ({
            ...field,
            label: t(field.key),
            placeholder: t(field.key + "Placeholder"),
            className: `${field.className ?? ""} ${font}`,
        })),
        buttons: RoleModelFormConfig.buttons.map((btn) => ({
            ...btn,
            label: t(btn.key === "cancel" ? "cancel" : "saveChanges"),
        })),
    };

    // TRANSLATE TABLES HEADERS
    const columns = RoleTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    // TRANSLATE TOOLTIP FOR ACTION BUTTONS
    const actions = RoleTableConfig.actions.map((action) => ({
        ...action,
        label: t(action.label),
        tooltip: t(action.tooltip),
    }));

    const onSubmit = async (data: RoleFormValue) => {
        setFormSubmitting(true);
        try {
            const payload: RoleProps = {
                label: data.label,
                description: data.description,
                permissions: data.permissions,
                removed_at: null,
            };

            if (mode === "edit" && selectedRole) {
                const response = await RoleController.updateRole(
                    selectedRole.id!,
                    payload
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Role updated successfully !",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await RoleController.addRole(payload);
                toast({
                    title: "Notification",
                    description:
                        response.message || "Role added successfully !",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            fetchRoleData(searchValue, currentPerPage);
            initAuth();
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedRole(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (mode: "create" | "view" | "edit", role?: RoleProps) => {
        setMode(mode);

        if (role) {
            // Flatten role.permissions to IDs for the form
            const formData = {
                ...role,
                permissions: Array.isArray(role.permissions)
                    ? role.permissions.map((p: PermissionProps) => p.id)
                    : [],
            };

            reset(formData);
            setSelectedRole(role);
        }

        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selected perPage
        setValue("perPage", perPage);
        fetchRoleData(searchValue, perPage); // immediately fetch
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleToggle = async (id: number, checked: boolean) => {
        try {
            await RoleController.activeDeactivate(id, checked);
            fetchRoleData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    // EXPORT TO CSV, EXCEL AND PDF
    const exportData = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const data = roles.roles.data;

        let dataToExport = data;
        let fileName = "roles";

        if (scope === "current") {
            dataToExport = data; // if you want pagination, replace with current page slice
            fileName = `departments_page_${roles.roles.from}`;
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
            fileName = `departments_selected_${selectedRows.length}`;
        }

        generateAndDownloadFile({
            data: dataToExport,
            columns: RoleTableConfig.columns,
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
                        {t("permissionsAndRolesTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 mb-4 ${font}`}>
                        {t("permissionsAndRolesSubtitle")}
                    </p>
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 mb-4 border-b">
                    <BulkAction
                        selectedRows={selectedRows}
                        onClearSelection={() => setSelectedRows([])}
                        data={roles.roles.data}
                        bulkActivateFn={(ids) =>
                            RoleController.bulkActivate(ids)
                        }
                        bulkDeactivateFn={(ids) =>
                            RoleController.bulkDeactivate(ids)
                        }
                        onSuccess={() =>
                            fetchRoleData(searchValue, currentPerPage)
                        }
                        title={isRTL ? "الدور" : "role"}
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

                {/* Search & Add Role */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder={t("searchRole")}
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
                                ? t("viewRole")
                                : mode === "edit"
                                ? t("editRole")
                                : translatedConfig.title
                        }
                        description={
                            mode === "view"
                                ? t("veiwRoleDesc")
                                : mode === "edit"
                                ? t("editRoleDesc")
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
                        extraData={{ permissions }}
                        userRole={userRole}
                    />
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    actions={actions}
                    data={roles.roles.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as RoleProps)}
                    onEdit={(row) => openModel("edit", row as RoleProps)}
                    isModel={true}
                    from={roles.roles.from}
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
                    {roles.roles && (
                        <Pagination
                            paginateData={roles.roles}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchRoleData(searchValue, currentPerPage, page)
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionsAndRoles;
