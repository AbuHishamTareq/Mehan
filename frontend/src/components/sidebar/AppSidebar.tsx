import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, SidebarContent } from "../ui/sidebar";
import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import type { MenuItem } from "../../../types/types";
import {
    Briefcase,
    Building2,
    Calendar,
    Code2,
    CreditCard,
    Home,
    IdCardLanyard,
    LockKeyholeOpen,
    Settings,
    Settings2,
    ShieldUser,
    UserCheck,
    Users,
} from "lucide-react";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarMenuList } from "./SidebarMenuList";

export function AppSidebar() {
    const { t, isRTL } = useLanguage();
    const location = useLocation();
    const { can } = useAuth();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const items: MenuItem[] = [
        {
            id: "dashboard",
            title: t("dashboard"),
            url: "/dashboard",
            icon: Home,
            iconColor: "hsl(var(--icon-primary))",
        },
        {
            id: "bookings",
            title: t("bookings"),
            url: "/bookings",
            icon: Calendar,
            iconColor: "hsl(var(--icon-success))",
        },
        {
            id: "services",
            title: t("services"),
            url: "/services",
            icon: Briefcase,
            iconColor: "hsl(var(--icon-warning))",
        },
        {
            id: "staff",
            title: t("staff"),
            url: "/staff",
            icon: UserCheck,
            iconColor: "hsl(var(--icon-info))",
        },
        {
            id: "payments",
            title: t("payments"),
            url: "/payments",
            icon: CreditCard,
            iconColor: "hsl(var(--icon-danger))",
        },
        {
            id: "settings",
            title: t("settings"),
            url: "/settings",
            icon: Settings,
            iconColor: "hsl(var(--muted-foreground))",
            children: [
                {
                    id: "general",
                    title: t("generalTitle"),
                    url: "/settings/general",
                    icon: Settings2,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "modules",
                    title: t("modulesTitle"),
                    url: "/settings/modules",
                    permission: "access_module",
                    icon: Code2,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "department",
                    title: t("departmentTitle"),
                    url: "/settings/department",
                    permission: "access_department_module",
                    icon: Building2,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "designation",
                    title: t("designationTitle"),
                    url: "/settings/designation",
                    permission: "access_designation_module",
                    icon: IdCardLanyard,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "permissionsAndRoles",
                    title: t("permissionsAndRolesTitle"),
                    url: "/settings/permissions_roles",
                    permission: "access_role_module",
                    icon: ShieldUser,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "users",
                    title: t("usersTitle"),
                    url: "/settings/users",
                    permission: "access_user_module",
                    icon: Users,
                    iconColor: "hsl(var(--muted-foreground))",
                },
                {
                    id: "permissions",
                    title: t("permissionsTitle"),
                    url: "/settings/permissions",
                    permission: "access_permission_module",
                    icon: LockKeyholeOpen,
                    iconColor: "hsl(var(--muted-foreground))",
                },
            ],
        },
    ];

    // Auto-expand parent if a child route is active
    useEffect(() => {
        const activeParent = items.find((item) =>
            item.children?.some((child) => location.pathname === child.url)
        );
        setOpenMenu(activeParent ? activeParent.id : null);
    }, [location.pathname]);

    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            className="max-w"
            collapsible="icon"
        >
            <SidebarContent>
                <SidebarLogo />
                <SidebarMenuList
                    items={items}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    can={can}
                />
            </SidebarContent>
        </Sidebar>
    );
}
