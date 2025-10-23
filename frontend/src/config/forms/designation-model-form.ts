import { CirclePlus } from "lucide-react";

export const DesignationModelFormConfig = {
    moduleTitle: "",
    title: "",
    description: "",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-designation",
        label: "",
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
            key: "deptName",
            name: "department",
            label: "",
            type: "select" as const,
            placeholder: "Choose Department",
            tabindex: 1,
            autoFocus: true,
            className: "",
        },
        {
            id: "en_name",
            key: "designationEnName",
            name: "en_name",
            label: "",
            type: "text" as const,
            placeholder: "",
            tabindex: 2,
            className: "",
        },
        {
            id: "ar_name",
            key: "designationArName",
            name: "ar_name",
            label: "Designation (AR) (ex. دعم تكنولوجيا المعلومات):",
            type: "text" as const,
            placeholder: "ادخل المسمى الوظيفي",
            tabindex: 2,
            className: "",
        },
    ],
    // FORM BUTTONS
    buttons: [
        {
            key: "cancel",
            type: "button" as const,
            label: "Cancel",
            variant: "destructive" as const,
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
