import * as LucidIcons from "lucide-react";

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

interface TableRow {
    [key: string]: string | number | boolean | null | undefined | unknown;
}

interface TableAction {
    label: string;
    icon: keyof typeof LucidIcons;
    route: string;
    className?: string;
}

export interface TableActionButtonsProps {
    row: TableRow;
    actions: TableAction[];
}

export interface CustomTableProps {
    columns: TableColumn[];
    actions: TableAction[];
    data: TableRow[];
}

// PERMISSIONS INTERFACE
export type PermissionProps = {
    label: string;
    module: string;
    description: string;
    is_active: boolean;
};
