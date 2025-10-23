import { Users } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useSidebar } from "../ui/sidebar";

export function SidebarLogo() {
    const { state } = useSidebar();
    const { t, isRTL } = useLanguage();

    return (
        <div
            className={`py-4 border-sidebar-border ${
                state === "collapsed" ? "px-0" : "px-4"
            }`}
        >
            <div className="flex items-center space-x-3 rtl:space-x-reverse h-10">
                <div
                    className={`w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 ${
                        state === "collapsed" ? "mx-auto" : ""
                    }`}
                >
                    <Users
                        className={
                            state === "collapsed"
                                ? "w-7 h-7 text-white"
                                : "w-5 h-5 text-white"
                        }
                    />
                </div>
                {state !== "collapsed" && (
                    <div className={isRTL ? "font-arabic" : "font-english"}>
                        <h1 className="text-lg font-bold text-sidebar-foreground">
                            {t("appName")}
                        </h1>
                        <p className="text-xs text-sidebar-foreground/70">
                            {t("appSubtitle")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
