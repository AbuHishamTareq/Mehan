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
import { Search } from "lucide-react";
import { DepartmentController } from "../../controllers/DepartmentController";
import { DepartmentModelFormConfig } from "../../config/forms/department-model-form";
import { BulkAction } from "../../components/bulk-action";
import Swal from "sweetalert2";
import { generateAndDownloadFile } from "../../lib/generateAndDownloadFile";

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
            text: `You are about to delete "${department.en_name}". This action cannot be undone!`,
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

    const exportDepartments = (type: ExportType, scope: ExportScope) => {
        const font = isRTL ? "font-arabic" : "font-english";
        const allDepartments = departments.departments.data;

        let dataToExport = allDepartments;
        let fileName = "departments";

        if (scope === "current") {
            dataToExport = allDepartments; // if you want pagination, replace with current page slice
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
            dataToExport = allDepartments.filter((d) =>
                selectedRows.includes(d.id!)
            );
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
        exportDepartments("csv", "all");
    };

    // EXPORT CURRENT PAGE TO CSV
    const handleCurrentPageExportCSV = () => {
        exportDepartments("csv", "current");
    };

    // EXPORT SELECTED ROWS TO CSV
    const handleExportSelectedCSV = () => {
        exportDepartments("csv", "selected");
    };

    // EXPORT EXCEL
    // EXPORT ALL PAGES TO EXCEL
    const handleExportAllExcel = async () => {
        exportDepartments("excel", "all");
    };

    // EXPORT CURRENT PAGE TO EXCEL
    const handleCurrentPageExportExcel = () => {
        exportDepartments("excel", "current");
    };

    // EXPORT SELECTED ROWS TO EXCEL
    const handleExportSelectedExcel = () => {
        exportDepartments("excel", "selected");
    };

    // EXPORT PDF
    // EXPORT ALL PAGES TO PDF
    const handleExportAllPdf = async () => {
        exportDepartments("pdf", "all");
    };

    // EXPORT CURRENT PAGE TO PDF
    const handleCurrentPageExportPdf = () => {
        exportDepartments("pdf", "current");
    };

    // EXPORT SELECTED ROWS TO PDF
    const handleExportSelectedPdf = () => {
        exportDepartments("pdf", "selected");
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
                    />
                </div>

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
