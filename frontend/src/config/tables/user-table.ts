import * as LucidIcons from "lucide-react";
// CREATE PERMISSION TABLE CONFIGURATIONS LIKE HEADERS, AND BODY
export const UserTableConfig = {
    // DEFINE TABLE COLUMNS
    columns: [
        // KEYS MUST BE THE SAME NAME OF COLUMN IN POSTGRESQL DATABASE
        {
            label: "username",
            key: "name",
            className: "border p-4 text-center",
        },
        {
            label: "email",
            key: "email",
            className: "border p-4 text-center",
        },
        {
            label: "mobile",
            key: "mobile_number",
            className: "capitalize border p-4 text-center",
        },
        {
            label: "en_designation",
            key: "designation",
            className: "capitalize border p-4 text-center",
        },
        {
            label: "status",
            key: "is_active",
            isToggle: true,
            className: "border p-4 text-center",
        },
        {
            label: "removed",
            key: "removed",
            className: "border p-4 text-center",
        },
        {
            label: "actions",
            key: "actions",
            isAction: true,
            className: "border p-4 text-center",
        },
    ],
    actions: [
        {
            label: "View",
            icon: "Eye" as keyof typeof LucidIcons,
            tooltip: "view",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white",
        },
        {
            label: "Edit",
            icon: "Edit" as keyof typeof LucidIcons,
            tooltip: "edit",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white",
        },
        {
            label: "Delete",
            icon: "Trash2" as keyof typeof LucidIcons,
            tooltip: "delete",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white",
        },
        {
            label: "Restore",
            icon: "RotateCcw" as keyof typeof LucidIcons,
            tooltip: "restore",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600 text-white",
        },
        {
            label: "Reset",
            icon: "RefreshCcw" as keyof typeof LucidIcons,
            tooltip: "reset",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500 hover:bg-purple-600 text-white",
        },
    ],
};
