import * as LucidIcons from "lucide-react";
// CREATE PERMISSION TABLE CONFIGURATIONS LIKE HEADERS, AND BODY
export const PermissionTableConfig = {
    // DEFINE TABLE COLUMNS
    columns: [
        // KEYS MUST BE THE SAME NAME OF COLUMN IN POSTGRESQL DATABASE
        {
            label: "permission",
            key: "label",
            className: "border p-4 text-center",
        },
        { label: "module", key: "module", className: "border p-4 text-center" },
        {
            label: "description",
            key: "description",
            className: "w-90 border p-4 text-center",
        },
        {
            label: "status",
            key: "is_active",
            isToggle: true,
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
                "w-8 rounded-lg h-8 p-2 bg-blue-500 hover: bg-blue-600 text-white",
        },
        {
            label: "Edit",
            icon: "Edit" as keyof typeof LucidIcons,
            route: "",
            className:
                "w-8 rounded-lg h-8 p-2 bg-amber-500 hover:bg-amber-600 text-white",
        },
    ],
};
