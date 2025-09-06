import { NavLink } from "react-router-dom";
import { Home, Calendar, Briefcase, UserCheck, Users } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "../components/ui/sidebar";
import { useLanguage } from "../hooks/useLanguage";

export function AppSidebar() {
    const { state } = useSidebar();
    const { t, isRTL } = useLanguage();

    const items = [
        { title: t("dashboard"), url: "/dashboard", icon: Home },
        { title: t("bookings"), url: "/bookings", icon: Calendar },
        { title: t("services"), url: "/services", icon: Briefcase },
        { title: t("staff"), url: "/staff", icon: UserCheck },
    ];

    const getNavCls = ({ isActive }: { isActive: boolean }) =>
        isActive ? "bg-accent text-primary font-medium" : "hover:bg-accent/50";

    return (
        <Sidebar
            side={isRTL ? "right" : "left"}
            className={state === "collapsed" ? "w-14" : "w-60"}
            collapsible="icon"
        >
            <SidebarContent>
                {/* Logo Section */}
                <div className="p-4 border-b border-sidebar-border">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        {state !== "collapsed" && (
                            <div>
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

                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            end
                                            className={({ isActive }) =>
                                                getNavCls({ isActive })
                                            }
                                        >
                                            <item.icon className="me-2 h-4 w-4" />
                                            {state !== "collapsed" && (
                                                <span>{item.title}</span>
                                            )}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
