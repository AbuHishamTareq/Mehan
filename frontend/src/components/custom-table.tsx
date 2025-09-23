import { Search } from "lucide-react";
import type { CustomTableProps } from "../../types/types";
import { Switch } from "./ui/switch";
import { TableActionButtons } from "./table-action-buttons";
import { useLanguage } from "../hooks/useLanguage";

export const CustomTable = ({ columns, actions, data }: CustomTableProps) => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    return (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="border p-4 text-center">#</th>
                        {columns.map((column) => (
                            <th className={column.className} key={column.key}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">
                                    {index + 1}
                                </td>
                                {columns.map((col) => (
                                    <td className="border px-4 py-2 text-center">
                                        {col.isToggle ? (
                                            <Switch
                                                checked={
                                                    row.status === "active" ||
                                                    row.required === "yes"
                                                }
                                                onCheckedChange={() => {}}
                                                className={`h-4 w-10 ${
                                                    row.status === "active" ||
                                                    row.required === "yes"
                                                        ? "bg-green-500 data-[state=checked]:bg-green-600"
                                                        : "bg-red-500 data-[state=unchecked]:bg-red-600"
                                                } border border-gray-300 transition-colors rounded-full shadow-inner`}
                                            />
                                        ) : col.isAction ? (
                                            <TableActionButtons
                                                row={row}
                                                actions={actions}
                                            />
                                        ) : (
                                            String(
                                                row[col.key] ? row[col.key] : ""
                                            )
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 1} // +1 for the "#" column
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
