import { CirclePlus } from "lucide-react";

export const DesignationModelFormConfig = {
    moduleTitle: "Manage Designations",
    title: "Add New Designation",
    description: "Fill in the details below to add a new designation",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-designation",
        label: "Add New Designation",
        className:
            "bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer",
        icon: CirclePlus,
        type: "button" as const,
        variant: "default" as const,
    },
    // FORM FIELDS
    fields: [
        {
            id: "department",
            key: "department",
            name: "department",
            label: "Department Name:",
            type: "select" as const,
            placeholder: "Choose Department",
            tabindex: 1,
            autoFocus: true,
        },
        {
            id: "en_name",
            key: "en_name",
            name: "en_name",
            label: "Designation (EN) (ex. IT Support):",
            type: "text" as const,
            placeholder: "Enter designation",
            tabindex: 2,
        },
        {
            id: "ar_name",
            key: "ar_name",
            name: "ar_name",
            label: "Designation (AR) (ex. دعم تكنولوجيا المعلومات):",
            type: "text" as const,
            placeholder: "ادخل المسمى الوظيفي",
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
