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
            key: "module",
            name: "module",
            label: "Module Name:",
            type: "select" as const,
            placeholder: "Choose Module",
            tabindex: 1,
            autoFocus: true,
        },
        {
            id: "permission",
            key: "name",
            name: "label",
            label: "Permission (ex. Create User):",
            type: "text" as const,
            placeholder: "Enter permission",
            tabindex: 2,
        },
        {
            id: "description",
            key: "description",
            name: "description",
            label: "Description:",
            type: "textarea" as const,
            placeholder: "Enter permission description",
            tabIndex: 3,
            rows: 3,
            className: "rounded border p-2 w-full",
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
