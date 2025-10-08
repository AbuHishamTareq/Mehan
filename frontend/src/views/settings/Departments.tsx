import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { DepartmentTableConfig } from "../../config/tables/department-table";
import { useCallback, useEffect, useState, useRef } from "react";
import { CustomModelForm } from "../../components/custom-model-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import type { DepartmentProps, LinkProps } from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { Input } from "../../components/ui/input";
import { FileText, Search, Upload } from "lucide-react";
import { DepartmentController } from "../../controllers/DepartmentController";
import { DepartmentModelFormConfig } from "../../config/forms/department-model-form";
import { BulkAction } from "../../components/bulk-action";
import Swal from "sweetalert2";
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";
import { Button } from "../../components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface DepartmentFormValue {
    en_name: string;
    ar_name: string;
    search?: string;
    perPage?: number;
}

interface DepartmentPaginationProps {
    data: DepartmentProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface DepartmentIndexProps {
    departments: DepartmentPaginationProps;
}

const schema = yup.object({
    en_name: yup.string().required("Department English name is required"),
    ar_name: yup.string().required("Department Arbic name is required"),
});

const Departments = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();

    const [modelOpen, setModelOpen] = useState(false);
    const [departments, setDepartments] = useState<DepartmentIndexProps>({
        departments: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedDepartment, setSelectedDepartment] =
        useState<DepartmentProps | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    type ExportType = "csv" | "excel" | "pdf";
    type ExportScope = "all" | "current" | "selected";

    // Persist current perPage in state
    const [currentPerPage, setCurrentPerPage] = useState(10);

    const defaultFormValues: DepartmentFormValue = {
        en_name: "",
        ar_name: "",
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
    } = useForm<DepartmentFormValue>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");

    const initialMount = useRef(true);

    const fetchDepartmentData = useCallback(
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
                const response = await DepartmentController.fetchDepartments({
                    search,
                    perPage,
                    page,
                });
                setDepartments(response);
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
        fetchDepartmentData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch data when search changes
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchDepartmentData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchDepartmentData]);

    const columns = DepartmentTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    const onSubmit = async (data: DepartmentFormValue) => {
        setFormSubmitting(true);
        try {
            if (mode === "edit" && selectedDepartment) {
                const response = await DepartmentController.updateDepartment(
                    selectedDepartment.id!,
                    data as DepartmentProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Department updated successfully !",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await DepartmentController.addDepartment(
                    data as DepartmentProps
                );
                toast({
                    title: "Notification",
                    description:
                        response.message || "Department added successfully !",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            // Always fetch with current perPage
            fetchDepartmentData(searchValue, currentPerPage);
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedDepartment(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (
        mode: "create" | "view" | "edit",
        department?: DepartmentProps
    ) => {
        setMode(mode);
        if (department) {
            reset({ ...department });
            setSelectedDepartment(department);
        }
        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selected perPage
        setValue("perPage", perPage);
        fetchDepartmentData(searchValue, perPage); // immediately fetch
    };

    const handleSelectionChange = (selectedIds: number[]) => {
        setSelectedRows(selectedIds);
    };

    const handleToggle = async (id: number, checked: boolean) => {
        try {
            await DepartmentController.activeDeactivate(id, checked);
            fetchDepartmentData(searchValue, currentPerPage);
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    const handleDelete = async (id: number) => {
        const department = departments.departments.data.find(
            (d) => d.id === id
        );
        if (!department) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete "${department.en_name}" !`,
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
                await DepartmentController.deleteDepartment(id);
                toast({
                    title: "Notification",
                    description: t("departmentDeleteMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchDepartmentData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    const handleRestore = async (id: number) => {
        const department = departments.departments.data.find(
            (d) => d.id === id
        );
        if (!department) return;

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to restore "${department.en_name}" !`,
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
                await DepartmentController.restoreDepartment(id);
                toast({
                    title: "Notification",
                    description: t("departmentRestoreMessage"),
                    variant: "success",
                    className: isRTL ? "font-arabic" : "font-english",
                });
                fetchDepartmentData(searchValue, currentPerPage);
            } catch (error) {
                console.error("Somthing went wrong: ", error);
            }
        }
    };

    // EXPORT TO CSV, EXCEL AND PDF
    const exportData = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const data = departments.departments.data;

        let dataToExport = data;
        let fileName = "departments";

        if (scope === "current") {
            dataToExport = data; // if you want pagination, replace with current page slice
            fileName = `departments_page_${departments.departments.from}`;
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
            columns: DepartmentTableConfig.columns,
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
            const worksheet = workbook.addWorksheet("Departments");

            // Define columns with headers
            worksheet.columns = [
                { header: "english name*", key: "en_name", width: 25 },
                { header: "arabic name*", key: "ar_name", width: 25 },
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
                en_name: "Human Resources",
                ar_name: "الموارد البشرية",
            });

            // Generate Excel buffer
            const buffer = await workbook.xlsx.writeBuffer();

            // Trigger download
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "departments_import_template.xlsx");

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

            const response = await DepartmentController.importDepartments(
                formData
            );

            console.log(response);

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
            await fetchDepartmentData(searchValue, currentPerPage);
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
                        {t("departmentTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 mb-4 ${font}`}>
                        {t("departmentSubtitle")}
                    </p>
                </div>

                {/* Bulk Actions */}
                <div className="mt-4 mb-4 border-b">
                    <BulkAction
                        selectedRows={selectedRows}
                        onClearSelection={() => setSelectedRows([])}
                        data={departments.departments.data}
                        bulkActivateFn={(ids) =>
                            DepartmentController.bulkActivate(ids)
                        }
                        bulkDeactivateFn={(ids) =>
                            DepartmentController.bulkDeactivate(ids)
                        }
                        onSuccess={() =>
                            fetchDepartmentData(searchValue, currentPerPage)
                        }
                        title="department"
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
                        isImportOpen={isImportOpen}
                        showImportButton={true}
                    />
                </div>
                {/* Import Section - Show above search and add button */}
                {isImportOpen && (
                    <div className="mb-4 border-b">
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-green-800">
                                        Import Departments
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {/* Download Template */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadTemplate}
                                        className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:text-black"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Download Template
                                    </Button>

                                    {/* Import File */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="border-green-300 text-green-700 hover:bg-green-50 hover:text-black"
                                        disabled={isImporting}
                                    >
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Upload className="w-4 h-4" />
                                            {isImporting
                                                ? "Importing..."
                                                : "Import File"}
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
                            <div className="mt-2 text-sm text-green-600">
                                Upload Excel file with columns: english name,
                                arabic name
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Add Module */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder="Search Departments..."
                            className="h-10 w-full pr-10 border border-blue-200"
                            {...register("search")}
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    </div>
                    <CustomModelForm
                        title={
                            mode === "view"
                                ? "View Department"
                                : mode === "edit"
                                ? "Edit Department"
                                : DepartmentModelFormConfig.title
                        }
                        description={DepartmentModelFormConfig.description}
                        addButton={DepartmentModelFormConfig.addButton}
                        fields={DepartmentModelFormConfig.fields}
                        buttons={DepartmentModelFormConfig.buttons}
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
                    actions={DepartmentTableConfig.actions}
                    data={departments.departments.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as DepartmentProps)}
                    onEdit={(row) => openModel("edit", row as DepartmentProps)}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    isModel={true}
                    from={departments.departments.from}
                    enableSelection={true}
                    selectedRows={selectedRows}
                    onSelectionChange={handleSelectionChange}
                    onStatusToggle={(id, checked) => handleToggle(id, checked)}
                />

                {/* Pagination */}
                <div className="px-6 pb-4 border border-blue-200 bg-blue-50 rounded-b">
                    {departments.departments && (
                        <Pagination
                            paginateData={departments.departments}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchDepartmentData(
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

export default Departments;
