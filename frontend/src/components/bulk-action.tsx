import {
    ChevronDown,
    Download,
    File,
    FileSpreadsheet,
    FileText,
    Layers,
    ListChecks,
    Lock,
    Target,
    UserCheck,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/use-toast";

interface BulkStatusOptions {
    filterFn: (item: { id?: number; is_active?: boolean }) => boolean;
    actionFn: (ids: number[]) => Promise<unknown>;
    successMessage?: (updated: number, total: number) => string;
    emptyMessage?: string;
}

interface BulkActionProps<T extends { id?: number; is_active?: boolean }> {
    data: T[];
    selectedRows: number[];
    onClearSelection: () => void;
    bulkActivateFn: (ids: number[]) => Promise<unknown>;
    bulkDeactivateFn: (ids: number[]) => Promise<unknown>;
    onSuccess?: () => void;
    title: string;
    exportAllCsvFn?: () => void;
    exportCurrentPageCsv?: () => void;
    exportSelectedRowsCsv?: () => void;
    exportAllExcelFn?: () => void;
    exportCurrentPageExcel?: () => void;
    exportSelectedRowsExcel?: () => void;
    exportAllPdfFn?: () => void;
    exportCurrentPagePdf?: () => void;
    exportSelectedRowsPdf?: () => void;
}

export const BulkAction = <T extends { id?: number; is_active?: boolean }>({
    data,
    selectedRows,
    onClearSelection,
    bulkActivateFn,
    bulkDeactivateFn,
    onSuccess,
    title,
    exportAllCsvFn,
    exportCurrentPageCsv,
    exportSelectedRowsCsv,
    exportAllExcelFn,
    exportCurrentPageExcel,
    exportSelectedRowsExcel,
    exportAllPdfFn,
    exportCurrentPagePdf,
    exportSelectedRowsPdf,
}: BulkActionProps<T>) => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();

    const handleBulkStatusChange = async ({
        filterFn,
        actionFn,
        successMessage,
        emptyMessage,
    }: BulkStatusOptions) => {
        if (selectedRows.length === 0) {
            toast({
                title: "Notification",
                description: t("bulkErrorMessage"),
                variant: "destructive",
                className: font,
            });
            return;
        }

        const selectedData = data.filter((item) =>
            selectedRows.includes(Number(item.id))
        );

        const idsToUpdate = selectedData
            .filter(filterFn)
            .map((item) => item.id)
            .filter((id): id is number => typeof id === "number");

        if (idsToUpdate.length === 0) {
            toast({
                title: "Notification",
                description: emptyMessage || t("InactiveIdsErrorMessage"),
                variant: "destructive",
                className: font,
            });
            return;
        }

        try {
            await actionFn(idsToUpdate);

            const total = selectedRows.length;
            const updated = idsToUpdate.length;

            toast({
                title: "Notification",
                description: successMessage
                    ? successMessage(updated, total)
                    : `${updated} of ${total} selected ${title}${
                          total > 1 ? "s" : ""
                      } updated successfully.`,
                variant: "success",
                className: font,
            });

            if (onSuccess) onSuccess();
            onClearSelection();
        } catch (error) {
            console.error("Something went wrong: ", error);
        }
    };

    const handleBulkActivate = () =>
        handleBulkStatusChange({
            filterFn: (item) => !item.is_active, // only inactive items
            actionFn: bulkActivateFn,
            emptyMessage: t("InactiveIdsErrorMessage"),
            successMessage: (updated, total) =>
                updated === total
                    ? `${updated} ${title}${
                          updated > 1 ? "s" : ""
                      } activated successfully.`
                    : `${updated} of ${total} selected ${title}${
                          total > 1 ? "s" : ""
                      } activated successfully.`,
        });

    const handleBulkDeactivate = () =>
        handleBulkStatusChange({
            filterFn: (item) => !!item.is_active, // only active items
            actionFn: bulkDeactivateFn,
            emptyMessage: t("ActiveIdsErrorMessage"),
            successMessage: (updated, total) =>
                updated === total
                    ? `${updated} ${title}${
                          updated > 1 ? "s" : ""
                      } deactivated successfully.`
                    : `${updated} of ${total} selected ${title}${
                          total > 1 ? "s" : ""
                      } deactivated successfully.`,
        });

    return (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800 capitalize">
                        {selectedRows.length} {title}
                        {selectedRows.length !== 1 ? "s" : ""} selected
                    </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Bulk Activate/Deactivate */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                            >
                                <UserCheck className="w-4 h-4" />
                                Status Actions
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48 sm:w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50"
                            sideOffset={8}
                            align="end"
                        >
                            <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                                onClick={handleBulkActivate}
                            >
                                <UserCheck className="w-4 h-4 text-green-600" />
                                <span>Activate Selected</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base cursor-pointer 
               hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                onClick={handleBulkDeactivate}
                            >
                                <Lock className="w-4 h-4 text-red-600" />
                                <span>Deactivate Selected</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Export Options */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Actions</span>
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer
                                                bg-white text-gray-800 rounded-md
                                                data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-800
                                                data-[state=open]:bg-indigo-100 data-[state=open]:text-indigo-800
                                                hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-150"
                                >
                                    <FileText className="w-4 h-4 text-sky-600" />
                                    <span>Export to CSV</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150"
                                        onClick={exportAllCsvFn}
                                    >
                                        <Layers className="w-4 h-4 text-blue-500" />
                                        All Pages
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150"
                                        onClick={exportCurrentPageCsv}
                                    >
                                        <Target className="w-4 h-4 text-amber-500" />
                                        Current Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-sky-50 hover:text-sky-700 transition-colors duration-150"
                                        onClick={exportSelectedRowsCsv}
                                    >
                                        <ListChecks className="w-4 h-4 text-purple-500" />
                                        Selected{" "}
                                        <span className="capitalize">
                                            {title}
                                            {selectedRows.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer
                                                bg-white text-gray-800 rounded-md
                                                data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-800
                                                data-[state=open]:bg-indigo-100 data-[state=open]:text-indigo-800
                                                hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-150"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                    Export to Excel
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                                        onClick={exportAllExcelFn}
                                    >
                                        <Layers className="w-4 h-4 text-blue-500" />
                                        All Pages
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                                        onClick={exportCurrentPageExcel}
                                    >
                                        <Target className="w-4 h-4 text-amber-500" />
                                        Current Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-green-50 hover:text-green-700 transition-colors duration-150"
                                        onClick={exportSelectedRowsExcel}
                                    >
                                        <ListChecks className="w-4 h-4 text-purple-500" />
                                        Selected{" "}
                                        <span className="capitalize">
                                            {title}
                                            {selectedRows.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer
                                                bg-white text-gray-800 rounded-md
                                                data-[highlighted]:bg-indigo-100 data-[highlighted]:text-indigo-800
                                                data-[state=open]:bg-indigo-100 data-[state=open]:text-indigo-800
                                                hover:bg-indigo-100 hover:text-indigo-800 transition-colors duration-150"
                                >
                                    <File className="w-4 h-4 text-red-600" />
                                    Export to PDF
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                        onClick={exportAllPdfFn}
                                    >
                                        <Layers className="w-4 h-4 text-blue-500" />
                                        All Pages
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                        onClick={exportCurrentPagePdf}
                                    >
                                        <Target className="w-4 h-4 text-amber-500" />
                                        Current Page
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer 
               hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                        onClick={exportSelectedRowsPdf}
                                    >
                                        <ListChecks className="w-4 h-4 text-purple-500" />
                                        Selected{" "}
                                        <span className="capitalize">
                                            {title}
                                            {selectedRows.length !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClearSelection()}
                        className="text-gray-600 hover:text-white"
                    >
                        Clear Selection
                    </Button>
                </div>
            </div>
        </div>
    );
};
