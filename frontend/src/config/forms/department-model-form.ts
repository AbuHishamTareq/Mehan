import { CirclePlus } from "lucide-react";

export const DepartmentModelFormConfig = {
    moduleTitle: "Manage Departments",
    title: "Add New Department",
    description: "Fill in the details below to add a new department",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-department",
        label: "Add New Department",
        className:
            "bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer",
        icon: CirclePlus,
        type: "button" as const,
        variant: "default" as const,
    },
    // FORM FIELDS
    fields: [
        {
            id: "en_name",
            key: "en_name",
            name: "en_name",
            label: "English Department Name (ex. IT Department):",
            type: "text" as const,
            placeholder: "Enter English Department Name",
            tabindex: 1,
        },
        {
            id: "ar_name",
            key: "ar_name",
            name: "ar_name",
            label: "Arabic Department Name (ex. قسم تكنولوجيا المعلومات):",
            type: "text" as const,
            placeholder: "Arabic English Department Name",
            tabindex: 2,
        },
    ],
    // FORM BUTTONS
    buttons: [
        {
            key: "cancel",
            type: "button" as const,
            label: "Cancel",
            variant: "ghost" as const,
            className: "cursor-pointer",
        },
        {
            key: "submit",
            type: "submit" as const,
            label: "Save Changes",
            variant: "default" as const,
            className: "cursor-pointer",
        },
    ],
};
