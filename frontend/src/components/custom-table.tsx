import { Search } from "lucide-react";
import type { CustomTableProps } from "../../types/types";
import { Switch } from "./ui/switch";
import { TableActionButtons } from "./table-action-buttons";
import { useLanguage } from "../hooks/useLanguage";
import { Checkbox } from "./ui/checkbox";

export const CustomTable = ({
    columns,
    actions,
    data,
    onView,
    onEdit,
    onDelete,
    onRestore,
    isModel,
    from = 0,
    isLoading = false,
    enableSelection = false,
    selectedRows = [],
    onSelectionChange = () => {},
    onStatusToggle,
    canEdit,
    canDelete,
    canRestore,
    canView,
    canActivateDeactivate,
}: CustomTableProps & { isLoading?: boolean }) => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";

    // Handle individual row selection
    const handleRowSelect = (rowId: number, checked: boolean) => {
        let newSelection = [...selectedRows];
        if (checked) {
            if (!newSelection.includes(rowId)) newSelection.push(rowId);
        } else {
            newSelection = newSelection.filter((id) => id !== rowId);
        }
        onSelectionChange(newSelection);
    };

    // Handle select all/none
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = data.map((row) => Number(row.id));
            onSelectionChange(allIds);
        } else {
            onSelectionChange([]);
        }
    };

    // Check if all rows are selected
    const isAllSelected =
        data.length > 0 &&
        data.every((row) => selectedRows.includes(Number(row.id)));
    const isIndeterminate = selectedRows.length > 0 && !isAllSelected;

    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gradient-to-br from-[#6366f1] to-[#312e81] text-white">
                        {/* Checkbox column header */}
                        {enableSelection ? (
                            <th className="px-4 py-3 text-sm font-medium text-white">
                                <div className="flex items-center justify-center">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600"
                                        ref={(el) => {
                                            if (el) {
                                                (
                                                    el as HTMLInputElement
                                                ).indeterminate =
                                                    isIndeterminate;
                                            }
                                        }}
                                    />
                                </div>
                            </th>
                        ) : (
                            <th className="border p-4 text-center">#</th>
                        )}

                        {columns.map((column) => (
                            <th className={column.className} key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        // Skeleton rows
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td className="border px-4 py-2 text-center">
                                    <div className="h-4 w-6 bg-gray-300 rounded mx-auto"></div>
                                </td>
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className="border px-4 py-2 text-center"
                                    >
                                        <div className="h-4 w-full bg-gray-300 rounded"></div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={index}>
                                {/* Checkbox column */}
                                {enableSelection ? (
                                    <td className="border px-4 py-2 text-center">
                                        <Checkbox
                                            checked={selectedRows.includes(
                                                Number(row.id)
                                            )}
                                            onCheckedChange={(checked) =>
                                                handleRowSelect(
                                                    Number(row.id),
                                                    checked as boolean
                                                )
                                            }
                                            className="bg-white border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                    </td>
                                ) : (
                                    <td className="border px-4 py-2 text-center">
                                        {from + index}
                                    </td>
                                )}

                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`border px-4 py-2 text-center ${col.className}`}
                                    >
                                        {col.isToggle ? (
                                            canActivateDeactivate ? (
                                                <Switch
                                                    checked={!!row.is_active}
                                                    disabled={!!row.removed_at}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        onStatusToggle?.(
                                                            Number(row.id),
                                                            checked
                                                        )
                                                    }
                                                    className={`relative h-4 w-10 border border-gray-300 rounded-full shadow-inner transition-colors
                                                        ${
                                                            row.is_active
                                                                ? "bg-green-500 data-[state=checked]:bg-green-600"
                                                                : "bg-red-500 data-[state=unchecked]:bg-red-600"
                                                        }
                                                        [&>span]:bg-white [&>span]:border [&>span]:border-gray-300
                                                        [&>span]:transition-transform [&>span]:duration-200
                                                        
                                                        rtl:[&>span]:left-auto rtl:[&>span]:right-0 rtl:[&>span[data-state=checked]]:translate-x-[-1.5rem]
                                                        ltr:[&>span[data-state=checked]]:translate-x-[1.5rem]
                                                    `}
                                                />
                                            ) : (
                                                <span
                                                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                        row.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {row.is_active
                                                        ? t("Active")
                                                        : t("Inactive")}
                                                </span>
                                            )
                                        ) : col.isAction ? (
                                            <div className="flex justify-center">
                                                <TableActionButtons
                                                    row={row}
                                                    actions={actions}
                                                    isModel={isModel}
                                                    onView={onView}
                                                    onEdit={onEdit}
                                                    onDelete={onDelete}
                                                    onRestore={onRestore}
                                                    canEdit={canEdit}
                                                    canDelete={canDelete}
                                                    canRestore={canRestore}
                                                    canView={canView}
                                                    isRTL={isRTL}
                                                />
                                            </div>
                                        ) : col.key === "removed" ? (
                                            <span
                                                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                                    row[col.key] === "No"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {row[col.key] === "No"
                                                    ? t("No")
                                                    : t("Yes")}
                                            </span>
                                        ) : (
                                            String(row[col.key] ?? "")
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="text-center py-12 text-gray-500 print:hidden"
                            >
                                <div className="text-blue-400 mb-2">
                                    <Search className="w-12 h-12 mx-auto opacity-50" />
                                </div>
                                <p className="text-lg font-medium">
                                    <span className={`${font}`}>
                                        {t("notFound")}
                                    </span>
                                </p>
                                <p className="text-sm">
                                    <span className={`${font}`}>
                                        {t("noRecords")}
                                    </span>
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
