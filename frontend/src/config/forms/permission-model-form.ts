import { CirclePlus } from "lucide-react";

export const PermissionModelFormConfig = {
    moduleTitle: "Manage Permissions",
    title: "Add New Permission",
    description: "Fill in the details below to add a new permission",

    // THIS FOR BUTTON IN THE TOP OF TABLE
    addButton: {
        id: "add-permission",
        label: "Add New Permission",
        className:
            "bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer",
        icon: CirclePlus,
        type: "button" as const,
        variant: "default" as const,
    },
    // FORM FIELDS
    fields: [
        {
            id: "module",
            key: "modulePermissionFrm",
            name: "module",
            label: "",
            type: "select" as const,
            placeholder: "",
            tabindex: 1,
            autoFocus: true,
        },
        {
            id: "permission",
            key: "permissionNameFrm",
            name: "label",
            label: "",
            type: "text" as const,
            placeholder: "",
            tabindex: 2,
        },
        {
            id: "description",
            key: "permissionDescriptionFrm",
            name: "description",
            label: "",
            type: "textarea" as const,
            placeholder: "",
            tabIndex: 3,
            rows: 3,
            className: "p-2 w-full",
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
