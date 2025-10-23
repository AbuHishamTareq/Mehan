import { CirclePlus } from "lucide-react";

export const RoleModelFormConfig = {
    moduleTitle: "",
    title: "",
    description: "",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-role",
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
            id: "role",
            key: "roleName",
            name: "label",
            label: "",
            type: "text" as const,
            placeholder: "",
            tabindex: 1,
        },
        {
            id: "description",
            key: "roleDescription",
            name: "description",
            label: "",
            type: "textarea" as const,
            placeholder: "Enter role description",
            tabIndex: 2,
            rows: 3,
            className: "p-2 w-full",
        },
        {
            id: "permissions",
            key: "permissions",
            name: "permissions[]",
            label: "Permissions:",
            type: "checkbox" as const,
            tabIndex: 3,
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
