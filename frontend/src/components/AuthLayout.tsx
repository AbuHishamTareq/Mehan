import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "./sidebar/AppSidebar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { Bell, LogOut, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { toast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";

function AuthLayout() {
    const { user, logout, loading } = useAuth();
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: t("successLogoutTitle"),
                description: t("succesLogout"),
            });

            navigate("/login", { replace: true });
        } catch {
            toast({
                title: t("failedLogoutTitle"),
                description: t("failedLogout"),
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to={"/login"} replace />;
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />

                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0">
                        <div
                            className={`flex justify-between items-center h-full px-4 ${
                                isRTL ? "font-arabic" : "font-english"
                            }`}
                        >
                            <SidebarTrigger className="ms-1" />

                            {/* Right Side Actions */}
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                {/* Language Switcher */}
                                <LanguageSwitcher />

                                {/* Notifications */}
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="relative hover:bg-gray-100"
                                    >
                                        <Bell className="w-5 h-5" />
                                        <Badge className="absolute -top-2 -right-2 rtl:-left-2 rtl:right-auto w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                                            3
                                        </Badge>
                                    </Button>
                                </div>

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-gray-100"
                                        >
                                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium">
                                                    A
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 font-english">
                                                {user?.name}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56"
                                    >
                                        <DropdownMenuLabel>
                                            <div className="font-english">
                                                {user?.email}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4 me-2" />
                                            <div
                                                className={
                                                    isRTL
                                                        ? "font-arabic"
                                                        : "font-english"
                                                }
                                            >
                                                {t("logout")}
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default AuthLayout;
