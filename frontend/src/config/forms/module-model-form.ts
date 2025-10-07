import { CirclePlus } from "lucide-react";

export const ModuleModelFormConfig = {
    moduleTitle: "Manage Modules",
    title: "Add New Module",
    description: "Fill in the details below to add a new module",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-module",
        label: "Add New Module",
        className:
            "bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer",
        icon: CirclePlus,
        type: "button" as const,
        variant: "default" as const,
    },
    // FORM FIELDS
    fields: [
        {
            id: "label",
            key: "label",
            name: "label",
            label: "Module Name (ex. User):",
            type: "text" as const,
            placeholder: "Enter Module Name",
            tabindex: 1,
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
