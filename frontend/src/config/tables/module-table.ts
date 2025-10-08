import * as LucidIcons from "lucide-react";
// CREATE PERMISSION TABLE CONFIGURATIONS LIKE HEADERS, AND BODY
export const ModuleTableConfig = {
    // DEFINE TABLE COLUMNS
    columns: [
        // KEYS MUST BE THE SAME NAME OF COLUMN IN POSTGRESQL DATABASE
        {
            label: "module",
            key: "label",
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
            tooltip: "View",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white",
        },
        {
            label: "Edit",
            icon: "Edit" as keyof typeof LucidIcons,
            tooltip: "Edit",
            className:
                "w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white",
        },
    ],
};
