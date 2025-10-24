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
            "bg-sidebar shadow-lg text-white rounded-sm px-4 py-2 hover:bg-sidebar hover:shadow-xl cursor-pointer",
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
            className: "",
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
            label: "",
            type: "checkbox" as const,
            tabIndex: 3,
            className: "text-md",
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
            variant: "success" as const,
            className: "cursor-pointer",
        },
    ],
};
