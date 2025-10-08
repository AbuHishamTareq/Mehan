import * as LucidIcons from "lucide-react";
import type {
    Control,
    FieldErrors,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";

// Language Context Types
export type Language = "en" | "ar";

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

// Auth Context Types
export type User = {
    id: number;
    name: string;
    email: string;
};

export type AuthContextType = {
    user: User | null;
    login: (
        email: string,
        password: string,
        rememberMe: boolean,
        language: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

// CUSTOM TABLE
interface TableColumn {
    label: string;
    key: string;
    isAction?: boolean;
    className?: string;
    isToggle?: boolean;
}

export interface TableRow {
    [key: string]:
        | string
        | number
        | boolean
        | Date
        | null
        | undefined
        | unknown;
}

interface TableAction {
    label: string;
    icon: keyof typeof LucidIcons;
    tooltip: string;
    className?: string;
}

export interface TableActionButtonsProps {
    row: TableRow;
    actions: TableAction[];
    isModel?: boolean;
    onView?: (row: TableRow) => void;
    onEdit?: (row: TableRow) => void;
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
}

export interface CustomTableProps {
    columns: TableColumn[];
    actions: TableAction[];
    data: TableRow[];
    isModel?: boolean;
    onView?: (row: TableRow) => void;
    onEdit?: (row: TableRow) => void;
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
    from: number;
    enableSelection?: boolean;
    selectedRows?: number[];
    onSelectionChange?: (selectedIds: number[]) => void;
    onStatusToggle?: (id: number, is_active: boolean) => void;
}

// CUSTOM FORM
interface AddButtonProps {
    id?: string;
    key?: string;
    label: string;
    className?: string;
    icon?: LucidIcons.LucideIcon;
    type: "button" | "submit" | "reset" | undefined;
    variant?:
        | "default"
        | "ghost"
        | "outline"
        | "link"
        | "destructive"
        | undefined;
}

interface ButtonProps {
    key: string;
    label: string;
    className?: string;
    type: "button" | "submit" | "reset" | undefined;
    variant?:
        | "default"
        | "ghost"
        | "outline"
        | "link"
        | "destructive"
        | undefined;
}

export interface SelectOptions {
    label: string;
    value: string | number;
    key: string | number;
}

interface FormFields {
    id: string;
    key: string;
    name: string;
    label: string;
    type: "text" | "select" | "radio" | "textarea" | "checkbox" | undefined;
    tabIndex?: number;
    autofocus?: boolean;
    placeholder?: string;
    rows?: number;
    className?: string;
    options?: SelectOptions[];
}

interface ExtraData {
    [module: string]: PermissionProps[];
}

export interface CustomModelFormProps<T extends FieldValues> {
    title: string;
    description: string;
    addButton: AddButtonProps;
    fields: FormFields[];
    buttons: ButtonProps[];
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    control: Control<T>;
    isSubmitting: boolean;
    onSubmit: (e?: React.BaseSyntheticEvent) => void | Promise<void>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "view" | "edit";
    extraData?: ExtraData;
}

// PERMISSIONS INTERFACE
export interface PermissionProps extends TableRow {
    id?: number;
    label: string;
    module: string;
    description?: string;
    is_active?: boolean;
    removed_at: Date | null;
}

// MODULE INTERFACE
export interface ModuleProps extends TableRow {
    id?: number;
    label: string;
}

// PAGINATION LINKS INTERFACE
export interface LinkProps {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
}

//ROLES INTERFACE
export interface RoleProps extends TableRow {
    id?: number;
    label: string;
    description?: string;
    is_active?: boolean;
    removed_at: Date | null;
}

// DEPARTMENT INTERFACE
export interface DepartmentProps extends TableRow {
    id?: number;
    en_name: string;
    ar_name: string;
    is_active?: boolean;
    removed_at: Date | null;
    removed: string;
}
