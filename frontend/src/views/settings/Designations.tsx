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
    DesignationProps,
    SelectOptions,
} from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { DesignationModelFormConfig } from "../../config/forms/designation-model-form";
import { DesignationController } from "../../controllers/DesignationController";
import { DesignationTableConfig } from "../../config/tables/designation-table";
import { BulkAction } from "../../components/bulk-action";
import { FileText, Search, Upload } from "lucide-react";
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "../../components/ui/button";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../lib/authorization";

interface DesignationFormValue {
    en_name: string;
    ar_name: string;
    department: string;
    is_active?: boolean;
    search?: string;
    perPage?: number;
}

interface DesignationPaginationProps {
    data: DesignationProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface DesignationIndexProps {
    designations: DesignationPaginationProps;
}

const schema = yup.object({
    en_name: yup.string().required("English name is required"),
    ar_name: yup.string().required("Arabic name is required"),
    department: yup.string().required("Department is required"),
});

const Designations = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();
    const { user } = useAuth();

    const [modelOpen, setModelOpen] = useState(false);
    const [designations, setDesignations] = useState<DesignationIndexProps>({
        designations: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [departments, setDepartments] = useState<SelectOptions[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedDesignation, setSelectedDesignation] =
        useState<DesignationProps | null>(null);

    // Persist current perPage
    const [currentPerPage, setCurrentPerPage] = useState(10);

    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    type ExportType = "csv" | "excel" | "pdf";
    type ExportScope = "all" | "current" | "selected";

    const userPermissions = user?.permissions || [];
    const canAdd = hasPermission(`create_designation`, userPermissions);
    // const canPrint = hasPermission(`print-domain`, userPermissions);
    const canExport = hasPermission(`export_designation`, userPermissions);
    const canImport = hasPermission(`import_designation`, userPermissions);
    const canActivateDeactivate = hasPermission(
        `active_deactive_designation`,
        userPermissions
    );
    const canEdit = hasPermission(`edit_designation`, userPermissions);
    const canDelete = hasPermission(`delete_designation`, userPermissions);
    const canView = hasPermission(`view_designation`, userPermissions);
    const canRestore = hasPermission(`restore_designation`, userPermissions);

    const defaultFormValues: DesignationFormValue = {
        department: "",
        en_name: "",
        ar_name: "",
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
    } = useForm<DesignationFormValue>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");
    const initialMount = useRef(true);

    const fetchDesignationData = useCallback(
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
                const response = await DesignationController.fetchDesignations({
                    search,
                    perPage,
                    page,
                });

                setDesignations(response);
                setDepartments(response.departments);
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
        fetchDesignationData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch on search change
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchDesignationData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchDesignationData]);

    // TRANSLATE MODEL FORM
    const translatedConfig = {
        ...DesignationModelFormConfig,
        moduleTitle: t("manageDesignations"),
        title: t("addNewDesignation"),
        description: t("designationDescription"),
        addButton: {
            ...DesignationModelFormConfig.addButton,
            label: t("addNewDesignation"),
            className: `${DesignationModelFormConfig.addButton.className} ${font}`,
        },
        fields: DesignationModelFormConfig.fields.map((field) => {
            // Add dynamic options if the field is "department"
            const baseField =
                field.name === "department"
                    ? { ...field, options: departments }
                    : { ...field };

            return {
                ...baseField,
                label: t(baseField.key), // translate label
                placeholder: t(baseField.key + "Placeholder"), // translate placeholder
                className: `${baseField.className ?? ""} ${font}`,
            };
        }),
        buttons: DesignationModelFormConfig.buttons.map((btn) => ({
            ...btn,
            label: t(btn.key === "cancel" ? "cancel" : "saveChanges"),
        })),
    };

    // TRANSLATE TABLES HEADERS
    const columns = DesignationTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    // TRANSLATE TOOLTIP FOR ACTION BUTTONS
    const actions = DesignationTableConfig.actions.map((action) => ({
        ...action,
        label: t(action.label),
        tooltip: t(action.tooltip),
    }));

    const onSubmit = async (data: DesignationFormValue) => {
        setFormSubmitting(true);
        try {
            if (mode === "edit" && selectedDesignation) {
                const response = await DesignationController.updateDesignation(
                    selectedDesignation.id!,
                    data as DesignationProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message ||
                        "Designation updated successfully !",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await DesignationController.addDesignation(
                    data as DesignationProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Designation added successfully !",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            // Always fetch with current perPage
            fetchDesignationData(searchValue, currentPerPage);
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedDesignation(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (
        mode: "create" | "view" | "edit",
        designation?: DesignationProps
    ) => {
        setMode(mode);
        if (designation) {
            reset({
                department: designation.department_id?.toString() ?? "",
                en_name: designation.en_name,
                ar_name: designation.ar_name,
            });
            setSelectedDesignation(designation);
        }
        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selection
        setValue("perPage", perPage);
        fetchDesignationData(searchValue, perPage); // immediately fetch
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleToggle = async (id: number, checked: boolean) => {
        try {
            await DesignationController.activeDeactivate(id, checked);
            fetchDesignationData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    const handleDelete = async (id: number) => {
        const designation = designations.designations.data.find(
            (d) => d.id === id
        );
        if (!designation) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete "${designation.en_name}" !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626", // red
            cancelButtonColor: "#6b7280", // gray
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            background: "#f9fafb",
        });

        if (result.isConfirmed) {
            try {
                await DesignationController.deleteDesignation(id);
                toast({
                    title: "Notification",
                    description: t("designationDeleteMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchDesignationData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    const handleRestore = async (id: number) => {
        const designation = designations.designations.data.find(
            (d) => d.id === id
        );
        if (!designation) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to restore "${designation.en_name}" !`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2E6F40", // dark green
            cancelButtonColor: "#dc2626", // red
            confirmButtonText: "Yes, restore it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            background: "#f9fafb",
        });

        if (result.isConfirmed) {
            try {
                await DesignationController.restoreDesignation(id);
                toast({
                    title: "Notification",
                    description: t("designationRestoreMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchDesignationData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    // EXPORT TO CSV, EXCEL AND PDF
    const exportData = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const data = designations.designations.data;

        let dataToExport = data;
        let fileName = "designations";

        if (scope === "current") {
            dataToExport = data; // if you want pagination, replace with current page slice
            fileName = `designations_page_${designations.designations.from}`;
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
            fileName = `designations_selected_${selectedRows.length}`;
        }

        generateAndDownloadFile({
            data: dataToExport,
            columns: DesignationTableConfig.columns,
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
            const worksheet = workbook.addWorksheet("Designations");

            // Define columns with headers
            worksheet.columns = [
                { header: "english name*", key: "en_name", width: 25 },
                { header: "arabic name*", key: "ar_name", width: 25 },
                { header: "Department*", key: "department", width: 25 },
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
                en_name: "Mobile Developer",
                ar_name: "مطور تطبيقات الجوال",
                department: "Information Technology Department",
            });

            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer();

            // Trigger download
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "designations.xlsx");

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

            const response = await DesignationController.importDesignations(
                formData
            );

            // Show success message with statistics
            let message = `Import completed! ${response.imported_count} designations imported successfully.`;
            if (response.skipped_count > 0) {
                message += ` ${response.skipped_count} designations were skipped.`;
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
            await fetchDesignationData(searchValue, currentPerPage);
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
                        {t("designationTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 mb-4 ${font}`}>
                        {t("designationSubtitle")}
                    </p>
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 mb-4 border-b">
                    <BulkAction
                        selectedRows={selectedRows}
                        onClearSelection={() => setSelectedRows([])}
                        data={designations.designations.data}
                        bulkActivateFn={(ids) =>
                            DesignationController.bulkActivate(ids)
                        }
                        bulkDeactivateFn={(ids) =>
                            DesignationController.bulkDeactivate(ids)
                        }
                        onSuccess={() =>
                            fetchDesignationData(searchValue, currentPerPage)
                        }
                        title={isRTL ? "المسمى الوظيفي" : "designation"}
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
                                        {t("importDesignations")}
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
                                        className={`border-green-300 text-green-700 hover:bg-green-50 hover:text-black ${font}`}
                                        disabled={isImporting}
                                    >
                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                {t("designationImportNote")}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Add Designation */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder={t("searchDesignation")}
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
                                ? t("viewDesignation")
                                : mode === "edit"
                                ? t("editDesignation")
                                : translatedConfig.title
                        }
                        description={
                            mode === "view"
                                ? ""
                                : mode === "edit"
                                ? t("editDesignationDesc")
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
                    data={designations.designations.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as DesignationProps)}
                    onEdit={(row) => openModel("edit", row as DesignationProps)}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    isModel={true}
                    from={designations.designations.from}
                    enableSelection={true}
                    selectedRows={selectedRows}
                    onSelectionChange={handleSelectionChange}
                    onStatusToggle={(id, checked) => handleToggle(id, checked)}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canRestore={canRestore}
                    canView={canView}
                    canActivateDeactivate={canActivateDeactivate}
                />

                {/* Pagination */}
                <div className="px-6 pb-4 border border-blue-200 bg-blue-50 rounded-b">
                    {designations.designations && (
                        <Pagination
                            paginateData={designations.designations}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchDesignationData(
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

export default Designations;
