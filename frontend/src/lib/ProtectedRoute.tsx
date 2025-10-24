import { Navigate } from 'react-router-dom';
import type React from "react";
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    permission?: string;
    children: React.ReactNode;
}
export function ProtectedRoute({permission, children}: ProtectedRouteProps) {
    const { can } = useAuth();
    
    if (permission && !can(permission)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}