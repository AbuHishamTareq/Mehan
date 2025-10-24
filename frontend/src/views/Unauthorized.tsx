import { ShieldAlert } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

const Unauthorized = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-unauthorized via-secondary to-background-unauthorized overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                {/* Status code with glass effect */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl" />
                    <h1
                        className={`relative text-9xl md:text-[12rem] font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-1000 ${font}`}
                    >
                        401
                    </h1>
                </div>

                {/* Icon with animation */}
                <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-top-6 duration-1000 delay-150">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                        <div className="relative bg-card/50 backdrop-blur-sm p-6 rounded-full border border-border">
                            <ShieldAlert className="w-16 h-16 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
                    <h2
                        className={`text-3xl md:text-4xl font-bold text-foreground ${font}`}
                    >
                        {t("unauthorized")}
                    </h2>
                    <p
                        className={`text-lg text-muted-foreground max-w-md mx-auto ${font}`}
                    >
                        {t("unauthorizedDesc")}
                    </p>
                </div>

                {/* Additional info */}
                <p className={`mt-12 text-sm text-muted-foreground animate-in fade-in duration-1000 delay-700 ${font}`}>
                    {t("unauthorizedStatus")}
                </p>
            </div>
        </div>
    );
};

export default Unauthorized;
