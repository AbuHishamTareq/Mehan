import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Eye, EyeOff, Lock, Mail, Users } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import serviceWorkersBackground from "../assets/service-workers-bg.jpg";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t, language } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email && !password) {
            toast({
                title: t("failedLoginTitle"),
                description: t("emptyEmailPassword"),
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Get CSRF cookie from sanctum
        await api.get("/sanctum/csrf-cookie");

        // Simulate API call
        try {
            await login(email, password, rememberMe, language);
            toast({
                title: t("successLoginTitle"),
                description: t("succesLogin"),
            });
            navigate("/dashboard");
        } catch {
            toast({
                title: t("failedLoginTitle"),
                description: t("failedLogin"),
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: `url(${serviceWorkersBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-scale-in">
                    <div className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm animate-float">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {t("appName")}
                            </h1>
                            <p className="text-white/80 text-sm">
                                {t("appSubtitle")}
                            </p>
                        </div>
                    </div>
                    <p className="text-white/90 text-lg font-medium">
                        Service Management Platform
                    </p>
                </div>

                {/* Login Card */}
                <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-elevated animate-slide-in-right">
                    <CardHeader>
                        <CardTitle className="text-foreground text-2xl text-center">
                            {t("welcomeBack")}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-center">
                            {t("loginSubtitle")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-foreground"
                                >
                                    {t("email")}
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("emailPlaceholder")}
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-foreground"
                                >
                                    {t("password")}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder={t("passwordPlaceholder")}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me and Forgot password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Checkbox
                                        id="remember-me"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) =>
                                            setRememberMe(checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="remember-me"
                                        className="text-sm text-foreground cursor-pointer"
                                    >
                                        {t("rememberMe")}
                                    </Label>
                                </div>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm text-primary hover:text-primary-dark p-0 h-auto"
                                >
                                    {t("forgotPassword")}
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-primary"
                            >
                                {isLoading ? "Signing In..." : t("signIn")}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 text-white/80 text-sm animate-fade-in">
                    <p>© 2025 SAAT CRM. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
