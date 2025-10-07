/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Home,
    Calendar,
    Briefcase,
    UserCheck,
    Users,
    Settings,
    LockKeyholeOpen,
    Plus,
    Minus,
    Settings2,
    Building2,
    IdCardLanyard,
    Code2,
    ShieldUser,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../components/ui/sidebar";
import { useLanguage } from "../hooks/useLanguage";

export function AppSidebar() {
    const { state } = useSidebar();
    const { t, isRTL } = useLanguage();
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const items = [
        {
            id: "dashboard",
            title: t("dashboard"),
            url: "/dashboard",
            icon: Home,
        },
        {
            id: "bookings",
            title: t("bookings"),
            url: "/bookings",
            icon: Calendar,
        },
        {
            id: "services",
            title: t("services"),
            url: "/services",
            icon: Briefcase,
        },
        { id: "staff", title: t("staff"), url: "/staff", icon: UserCheck },
        {
            id: "settings",
            title: t("settings"),
            url: "/settings",
            icon: Settings,
            children: [
                {
                    id: "general",
                    title: t("generalTitle"),
                    url: "/settings/general",
                    icon: Settings2,
                },
                {
                    id: "modules",
                    title: t("modulesTitle"),
                    url: "/settings/modules",
                    icon: Code2,
                },
                {
                    id: "department",
                    title: t("departmentTitle"),
                    url: "/settings/department",
                    icon: Building2,
                },
                {
                    id: "designation",
                    title: t("designationTitle"),
                    url: "/settings/designation",
                    icon: IdCardLanyard,
                },
                {
                    id: "permissionsAndRoles",
                    title: t("permissionsAndRolesTitle"),
                    url: "/settings/permissions_roles",
                    icon: ShieldUser,
                },
                {
                    id: "users",
                    title: t("usersTitle"),
                    url: "/settings/users",
                    icon: Users,
                },
                {
                    id: "permissions",
                    title: t("permissionsTitle"),
                    url: "/settings/permissions",
                    icon: LockKeyholeOpen,
                },
            ],
        },
    ];

    // Auto-expand parent if a child route is active
    useEffect(() => {
        const activeParent = items.find(
            (item) =>
                item.children &&
                item.children.some((child) => location.pathname === child.url)
        );
        if (activeParent) setOpenMenu(activeParent.id);
        else setOpenMenu(null);
    }, [location.pathname]);

    const handleMainClick = (item: any, e: React.MouseEvent) => {
        if (item.children) {
            e.preventDefault();
            setOpenMenu((prev) => (prev === item.id ? null : item.id));
        }
    };

    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            className="max-w"
            collapsible="icon"
        >
            <SidebarContent>
                {/* Logo Section */}
                <div
                    className={`py-4 border-sidebar-border ${
                        state === "collapsed" ? "px-0" : "px-4"
                    }`}
                >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div
                            className={`w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 ${
                                state === "collapsed" ? "mx-auto" : ""
                            }`}
                        >
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        {state !== "collapsed" && (
                            <div
                                className={
                                    isRTL ? "font-arabic" : "font-english"
                                }
                            >
                                <h1 className="text-xl font-bold text-sidebar-foreground">
                                    {t("appName")}
                                </h1>
                                <p className="text-xs text-sidebar-foreground/60">
                                    {t("appSubtitle")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isExpanded = openMenu === item.id;
                                const hasChildren = !!item.children;

                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton asChild>
                                            <NavLink
                                                to={item.url || "#"}
                                                end={!hasChildren}
                                                onClick={(e) =>
                                                    handleMainClick(item, e)
                                                }
                                                className="flex items-center justify-between w-full px-2 py-2 rounded transition-colors hover:bg-accent/10"
                                            >
                                                <div
                                                    className={`flex items-center gap-2 ${
                                                        isRTL
                                                            ? "font-arabic"
                                                            : "font-english"
                                                    } ${
                                                        state === "collapsed"
                                                            ? "w-full justify-center"
                                                            : ""
                                                    }`}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    {state !== "collapsed" && (
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    )}
                                                </div>
                                                {hasChildren &&
                                                    state !== "collapsed" && (
                                                        <span>
                                                            {isExpanded ? (
                                                                <Minus className="w-5 h-5" />
                                                            ) : (
                                                                <Plus className="w-5 h-5" />
                                                            )}
                                                        </span>
                                                    )}
                                            </NavLink>
                                        </SidebarMenuButton>

                                        {/* Submenu */}
                                        {hasChildren &&
                                            isExpanded &&
                                            state !== "collapsed" && (
                                                <div className="ml-6 mt-1 space-y-1">
                                                    {item.children!.map(
                                                        (child) => (
                                                            <NavLink
                                                                key={
                                                                    child.title
                                                                }
                                                                to={child.url}
                                                                end
                                                                className="flex items-center gap-2 px-2 py-1 rounded-md text-sm hover:bg-accent/10 transition-colors"
                                                            >
                                                                <child.icon className="h-5 w-5" />
                                                                <span>
                                                                    {
                                                                        child.title
                                                                    }
                                                                </span>
                                                            </NavLink>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
