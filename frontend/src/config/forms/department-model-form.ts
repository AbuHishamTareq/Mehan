import { CirclePlus } from "lucide-react";

export const DepartmentModelFormConfig = {
    moduleTitle: "",
    title: "",
    description: "",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-department",
        label: "",
        className:
            "bg-sidebar shadow-lg text-white rounded-sm px-4 py-2 hover:bg-sidebar hover:shadow-xl cursor-pointer",
        icon: CirclePlus,
        type: "button" as const,
        variant: "default" as const,
    },
    // FORM FIELDS
    fields: [
        {
            id: "en_name",
            key: "deptEnName",
            name: "en_name",
            label: "",
            type: "text" as const,
            placeholder: "",
            tabindex: 1,
            className: "",
        },
        {
            id: "ar_name",
            key: "deptArName",
            name: "ar_name",
            label: "",
            type: "text" as const,
            placeholder: "",
            tabindex: 2,
            className: "",
        },
    ],
    // FORM BUTTONS
    buttons: [
        {
            key: "cancel",
            type: "button" as const,
            label: "",
            variant: "destructive" as const,
            className: "cursor-pointer",
        },
        {
            key: "submit",
            type: "submit" as const,
            label: "",
            variant: "default" as const,
            className: "cursor-pointer",
        },
    ],
};
