import * as LucidIcons from "lucide-react";
// CREATE PERMISSION TABLE CONFIGURATIONS LIKE HEADERS, AND BODY
export const DepartmentTableConfig = {
    // DEFINE TABLE COLUMNS
    columns: [
        // KEYS MUST BE THE SAME NAME OF COLUMN IN POSTGRESQL DATABASE
        {
            label: "engName",
            key: "en_name",
            className: "border p-4 text-center",
        },
        {
            label: "arName",
            key: "ar_name",
            className: "border p-4 text-center",
        },
        {
            label: "status",
            key: "is_active",
            isToggle: true,
            className: "border p-4 text-center",
        },
        {
            label: "deleted",
            key: "deleted",
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
            route: "",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white",
        },
        {
            label: "Edit",
            icon: "Edit" as keyof typeof LucidIcons,
            route: "",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white",
        },
        {
            label: "Delete",
            icon: "Trash2" as keyof typeof LucidIcons,
            route: "",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white",
        },
    ],
};
