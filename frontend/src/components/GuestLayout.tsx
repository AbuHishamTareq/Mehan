import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

function GuestLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default GuestLayout;
