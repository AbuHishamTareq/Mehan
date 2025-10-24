import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { useCallback, useEffect, useState, useRef } from "react";
import { CustomModelForm } from "../../components/custom-model-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import type { LinkProps, UserProps, SelectOptions } from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { UserModelFormConfig } from "../../config/forms/user-model-form";
import { UserController } from "../../controllers/UserController";
import { UserTableConfig } from "../../config/tables/user-table";
import { BulkAction } from "../../components/bulk-action";
import { FileText, Search, Upload } from "lucide-react";
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "../../components/ui/button";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../lib/authorization";

interface UserFormSchemaValue {
    name: string;
    email: string;
    password?: string | undefined;
    confirm_password?: string | undefined;
    department: string;
    designation: string;
    mobile_number: string;
    is_active?: boolean;
}

interface UserFormValue extends UserFormSchemaValue {
    role?: string;
    search?: string;
    perPage?: number;
}

interface UserPaginationProps {
    data: UserProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface UserIndexProps {
    users: UserPaginationProps;
}

const Users = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();
    const { user } = useAuth();

    const [modelOpen, setModelOpen] = useState(false);
    const [users, setUsers] = useState<UserIndexProps>({
        users: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [departments, setDepartments] = useState<SelectOptions[]>([]);
    const [designations, setDesignations] = useState<SelectOptions[]>([]);
    const [roles, setRoles] = useState<SelectOptions[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

    // Persist current perPage
    const [currentPerPage, setCurrentPerPage] = useState(10);

    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    type ExportType = "csv" | "excel" | "pdf";
    type ExportScope = "all" | "current" | "selected";

    const userPermissions = user?.permissions || [];
    const canAdd = hasPermission(`create_user`, userPermissions);
    // const canPrint = hasPermission(`print-domain`, userPermissions);
    const canExport = hasPermission(`export_user`, userPermissions);
    const canImport = hasPermission(`import_user`, userPermissions);
    const canActivateDeactivate = hasPermission(
        `active_deactive_user`,
        userPermissions
    );
    const canEdit = hasPermission(`edit_user`, userPermissions);
    const canDelete = hasPermission(`delete_user`, userPermissions);
    const canView = hasPermission(`view_user`, userPermissions);
    const canRestore = hasPermission(`restore_user`, userPermissions);
    const canReset = hasPermission(`reset_user_password`, userPermissions);

    const getUserSchema = (mode: "create" | "edit" | "view") =>
        yup.object({
            name: yup.string().required("User name is required"),
            email: yup
                .string()
                .email("Email must be in a valid format")
                .required("Email is required"),
            password:
                mode === "create"
                    ? yup.string().required("Password is required")
                    : yup.string().notRequired(),
            confirm_password:
                mode === "create"
                    ? yup
                          .string()
                          .required("Confirm password is required")
                          .oneOf([yup.ref("password")], "Passwords must match")
                    : yup
                          .string()
                          .oneOf([yup.ref("password")], "Passwords must match")
                          .notRequired(),
            department: yup.string().required("Department is required"),
            designation: yup.string().required("Designation is required"),
            role: yup.string().required("Role is required"),
            mobile_number: yup
                .string()
                .matches(/^[0-9]+$/, "Only numbers are allowed")
                .min(10, "Mobile Number must be at least 10 digits")
                .max(15, "Mobile Number must not exceed 15 digits")
                .required("Mobile Number is required"),
        });

    const defaultFormValues: UserFormValue = {
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        mobile_number: "",
        confirm_password: "",
        is_active: true,
        role: "",
        search: "",
        perPage: currentPerPage,
    };

    const schema = getUserSchema(mode);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
        setValue,
    } = useForm<UserFormValue>({
        resolver: yupResolver(schema as any),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");
    const initialMount = useRef(true);

    const fetchUserData = useCallback(
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
                const response = await UserController.fetchUsers({
                    search,
                    perPage,
                    page,
                });

                setUsers(response);
                setDepartments(response.departments);
                setDesignations(response.designations);
                setRoles(response.roles);
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
        fetchUserData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch on search change
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchUserData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchUserData]);

    // TRANSLATE MODEL FORM
    const translatedConfig = {
        ...UserModelFormConfig,
        moduleTitle: t("manageUsers"),
        title: t("addNewUser"),
        description: t("userDescription"),
        addButton: {
            ...UserModelFormConfig.addButton,
            label: t("addNewUser"),
            className: `${UserModelFormConfig.addButton.className} ${font}`,
        },
        fields: UserModelFormConfig.fields.map((field) => {
            // Add dynamic options if the field is "department"
            const baseField =
                field.name === "department"
                    ? { ...field, options: departments }
                    : field.name === "designation"
                    ? { ...field, options: designations }
                    : field.name === "role"
                    ? { ...field, options: roles }
                    : field;

            return {
                ...baseField,
                label: t(baseField.key), // translate label
                placeholder: t(baseField.key + "Placeholder"), // translate placeholder
                className: `${baseField.className ?? ""} ${font}`,
            };
        }),
        buttons: UserModelFormConfig.buttons.map((btn) => ({
            ...btn,
            label: t(btn.key === "cancel" ? "cancel" : "saveChanges"),
        })),
    };

    // TRANSLATE TABLES HEADERS
    const columns = UserTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    // TRANSLATE TOOLTIP FOR ACTION BUTTONS
    const actions = UserTableConfig.actions.map((action) => ({
        ...action,
        label: t(action.label),
        tooltip: t(action.tooltip),
    }));

    const onSubmit = async (data: UserFormValue) => {
        setFormSubmitting(true);
        try {
            if (mode === "edit" && selectedUser) {
                const response = await UserController.updateUser(
                    selectedUser.id!,
                    data as UserProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "User updated successfully !",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await UserController.addUser(
                    data as UserProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "User added successfully !",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            // Always fetch with current perPage
            fetchUserData(searchValue, currentPerPage);
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedUser(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (mode: "create" | "view" | "edit", user?: UserProps) => {
        setMode(mode);
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: user.password,
                department: user.department_id?.toString() ?? "",
                designation: user.designation_id?.toString() ?? "",
                mobile_number: user.mobile_number?.toString() ?? "",
                role: user.roles?.[0] ?? "",
            });
            setSelectedUser(user);
        }
        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selection
        setValue("perPage", perPage);
        fetchUserData(searchValue, perPage); // immediately fetch
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleToggle = async (id: number, checked: boolean) => {
        try {
            await UserController.activeDeactivate(id, checked);
            fetchUserData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    const handleDelete = async (id: number) => {
        const user = users.users.data.find((d) => d.id === id);
        if (!user) return;

        const result = await Swal.fire({
            title: t("areYouSure"),
            text: `${t("deleteMessage")} "${user.name}" !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626", // red
            cancelButtonColor: "#6b7280", // gray
            confirmButtonText: t("yesDeleted"),
            cancelButtonText: t("cancel"),
            reverseButtons: true,
            background: "#f9fafb",

            customClass: {
                title: `${font}`,
                htmlContainer: `${font}`,
                confirmButton: `${font}`,
                cancelButton: `${font}`,
            },
        });

        if (result.isConfirmed) {
            try {
                await UserController.deleteUser(id);
                toast({
                    title: "Notification",
                    description: t("userDeleteMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchUserData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    const handleRestore = async (id: number) => {
        const user = users.users.data.find((d) => d.id === id);
        if (!user) return;

        const result = await Swal.fire({
            title: t("areYouSure"),
            text: `${t("restoreMessage")} "${user.name}" !`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2E6F40", // dark green
            cancelButtonColor: "#dc2626", // red
            confirmButtonText: t("yesRestored"),
            cancelButtonText: t("cancel"),
            reverseButtons: true,
            background: "#f9fafb",

            customClass: {
                title: `${font}`,
                htmlContainer: `${font}`,
                confirmButton: `${font}`,
                cancelButton: `${font}`,
            },
        });

        if (result.isConfirmed) {
            try {
                await UserController.restoreUser(id);
                toast({
                    title: "Notification",
                    description: t("userRestoreMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchUserData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    const handleReset = async (id: number) => {
        const user = users.users.data.find((d) => d.id === id);
        if (!user) return;

        const result = await Swal.fire({
            title: t("areYouSure"),
            text: `${t("resetMessage")} "${user.name}" !`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2E6F40", // dark green
            cancelButtonColor: "#dc2626", // red
            confirmButtonText: t("yesReset"),
            cancelButtonText: t("cancel"),
            reverseButtons: true,
            background: "#f9fafb",

            customClass: {
                title: `${font}`,
                htmlContainer: `${font}`,
                confirmButton: `${font}`,
                cancelButton: `${font}`,
            },
        });

        if (result.isConfirmed) {
            try {
                const response = await UserController.resetUser(id);
                console.log(response);

                Swal.fire({
                    title: `${t("resetSuccess")} "${response.new_password}"`,
                    icon: "success",
                    draggable: true,

                    customClass: {
                        title: `${font}`,
                        htmlContainer: `${font}`,
                        confirmButton: `${font}`,
                        cancelButton: `${font}`,
                    },
                });

                fetchUserData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    // EXPORT TO CSV, EXCEL AND PDF
    const exportData = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const data = users.users.data;

        let dataToExport = data;
        let fileName = "users";

        if (scope === "current") {
            dataToExport = data; // if you want pagination, replace with current page slice
            fileName = `users_page_${users.users.from}`;
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
            fileName = `users_selected_${selectedRows.length}`;
        }

        generateAndDownloadFile({
            data: dataToExport,
            columns: UserTableConfig.columns,
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

    // IMPORT EXCEL
    // DOWNLOAD IMPORT ECVEL TEMPLATE
    const handleDownloadTemplate = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");

            // Define columns with headers
            worksheet.columns = [
                { header: "Name*", key: "name", width: 25 },
                { header: "Email*", key: "email", width: 25 },
                { header: "Password*", key: "password", width: 25 },
                { header: "Department*", key: "department", width: 25 },
                { header: "Designation*", key: "designation", width: 25 },
                { header: "Mobile Number*", key: "mobile_number", width: 25 },
                { header: "Role*", key: "role", width: 25 },
            ];

            // Make headers bold and required fields red
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = {
                    bold: true,
                    color: {
                        argb: cell.value?.toString().includes("*")
                            ? "FFFF0000"
                            : "FF000000",
                    },
                };
            });

            // Add example row
            worksheet.addRow({
                name: "Majed Ahmed",
                email: "majed@outlook.com",
                password: "123",
                department: "Finance Department",
                designation: "Accountant",
                mobile_number: "0541223412",
                role: "Administrator",
            });

            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer();

            // Trigger download
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "users.xlsx");

            toast({
                title: "Success",
                description: "Excel template downloaded successfully.",
                variant: "success",
            });
        } catch (error) {
            console.error("Excel template download failed:", error);
            toast({
                title: "Error",
                description: "Failed to download Excel template.",
                variant: "destructive",
            });
        }
    };

    // IMPORT THE EXCEL FILE
    const handleImport = async (file: File) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Error",
                description: "Please upload an Excel file.",
                variant: "destructive",
            });
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "File size must be less than 10MB.",
                variant: "destructive",
            });
            return;
        }

        setIsImporting(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await UserController.importUsers(formData);

            // Show success message with statistics
            let message = `Import completed! ${response.imported_count} users imported successfully.`;
            if (response.skipped_count > 0) {
                message += ` ${response.skipped_count} users were skipped.`;
            }

            toast({
                title: "Import Successful",
                description: message,
                variant: "success",
            });

            setIsImportOpen(false);

            // Show warnings if any
            if (response.warnings && response.warnings.length > 0) {
                console.warn("Import warnings:", response.warnings);
                // You could show these in a modal or additional toast
                toast({
                    title: "Import Warnings",
                    description: `${response.warnings.length} warnings occurred. Check console for details.`,
                    variant: "destructive",
                });
            }

            // Refresh the users list
            await fetchUserData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Import failed:", error);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="bg-gradient-card min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-2 animate-fade-in border-b">
                    <h1 className={`text-3xl font-bold text-gray-900 ${font}`}>
                        {t("usersTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 mb-4 ${font}`}>
                        {t("usersSubtitle")}
                    </p>
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 mb-4 border-b">
                    <BulkAction
                        selectedRows={selectedRows}
                        onClearSelection={() => setSelectedRows([])}
                        data={users.users.data}
                        bulkActivateFn={(ids) =>
                            UserController.bulkActivate(ids)
                        }
                        bulkDeactivateFn={(ids) =>
                            UserController.bulkDeactivate(ids)
                        }
                        onSuccess={() =>
                            fetchUserData(searchValue, currentPerPage)
                        }
                        title={isRTL ? "المستخدم" : "user"}
                        exportAllCsvFn={handleExportAllCSV}
                        exportCurrentPageCsv={handleCurrentPageExportCSV}
                        exportSelectedRowsCsv={handleExportSelectedCSV}
                        exportAllExcelFn={handleExportAllExcel}
                        exportCurrentPageExcel={handleCurrentPageExportExcel}
                        exportSelectedRowsExcel={handleExportSelectedExcel}
                        exportAllPdfFn={handleExportAllPdf}
                        exportCurrentPagePdf={handleCurrentPageExportPdf}
                        exportSelectedRowsPdf={handleExportSelectedPdf}
                        onToggleImport={() => setIsImportOpen((prev) => !prev)}
                        isImportOpen={canImport ? isImportOpen : false}
                        showImportButton={canImport ? true : false}
                        canExport={canExport}
                        canActivateDeactivate={canActivateDeactivate}
                    />
                </div>

                {/* Import Section - Show above search and add button */}
                {isImportOpen && (
                    <div className="mb-4 border-b">
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-green-600" />
                                    <span
                                        className={`font-medium text-green-800 ${font}`}
                                    >
                                        {t("importUsers")}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Download Template */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadTemplate}
                                        className={`flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:text-black ${font}`}
                                    >
                                        <FileText className="w-4 h-4" />
                                        {t("downloadTemplate")}
                                    </Button>

                                    {/* Import File */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="border-green-300 text-green-700 hover:bg-green-50 hover:text-black"
                                        disabled={isImporting}
                                    >
                                        <label
                                            className={`flex items-center gap-2 cursor-pointer ${font}`}
                                        >
                                            <Upload className="w-4 h-4" />
                                            {isImporting
                                                ? t("importing")
                                                : t("importFile")}
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx,.xls"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        handleImport(file);
                                                    }
                                                    e.target.value = "";
                                                }}
                                                disabled={isImporting}
                                            />
                                        </label>
                                    </Button>
                                </div>
                            </div>
                            <div
                                className={`mt-2 text-sm text-green-600 ${font}`}
                            >
                                {t("userImportNote")}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Add Designation */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder={t("searchUser")}
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
                                ? t("viewUser")
                                : mode === "edit"
                                ? t("editUser")
                                : UserModelFormConfig.title
                        }
                        description={
                            mode === "view"
                                ? t("veiwUserDesc")
                                : mode === "edit"
                                ? t("editUserDesc")
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
                    data={users.users.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as UserProps)}
                    onEdit={(row) => openModel("edit", row as UserProps)}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onReset={handleReset}
                    isModel={true}
                    from={users.users.from}
                    enableSelection={true}
                    selectedRows={selectedRows}
                    onSelectionChange={handleSelectionChange}
                    onStatusToggle={(id, checked) => handleToggle(id, checked)}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canRestore={canRestore}
                    canView={canView}
                    canReset={canReset}
                    canActivateDeactivate={canActivateDeactivate}
                />

                {/* Pagination */}
                <div className="px-6 pb-4 border border-blue-200 bg-blue-50 rounded-b">
                    {users.users && (
                        <Pagination
                            paginateData={users.users}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchUserData(searchValue, currentPerPage, page)
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
