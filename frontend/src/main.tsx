import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routers/router.tsx";
import { RouterProvider } from "react-router-dom";
import { LanguageProvider } from "./providers/LanguageProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./providers/AuthProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
        <LanguageProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <RouterProvider router={router} />
                </TooltipProvider>
            </QueryClientProvider>
        </LanguageProvider>
    </AuthProvider>
);
