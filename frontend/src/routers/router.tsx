import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../views/Login";
import GuestLayout from "../components/GuestLayout";
import Dashboard from "../views/Dashboard";
import AuthLayout from "../components/AuthLayout";
import General from "../views/settings/General";
import Users from "../views/settings/Users";
import PermissionsAndRoles from "../views/settings/PermissionsAndRoles";
import Permissions from "../views/settings/Permissions";
import Departments from "../views/settings/Departments";
import Designations from "../views/settings/Designations";
import Modules from "../views/settings/Modules";
import { ProtectedRoute } from "../lib/ProtectedRoute";
import Unauthorized from "../views/Unauthorized";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Navigate to={"/"} />,
            },
            {
                path: "/",
                element: <Dashboard />,
            },
            // Unautorized Page
            {
                path: "/unauthorized",
                element: <Unauthorized />,
            },
            // Settings Routes:
            {
                path: "/settings/general",
                element: <General />,
            },
            {
                path: "/settings/departments",
                element: (
                    <ProtectedRoute permission="access_department_module">
                        <Departments />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings/designations",
                element: (
                    <ProtectedRoute permission="access_designation_module">
                        <Designations />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings/users",
                element: (
                    <ProtectedRoute permission="access_user_module">
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings/permissions_roles",
                element: (
                    <ProtectedRoute permission="access_role_module">
                        <PermissionsAndRoles />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings/permissions",
                element: (
                    <ProtectedRoute permission="access_permission_module">
                        <Permissions />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings/modules",
                element: (
                    <ProtectedRoute permission="access_module">
                        <Modules />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },
]);

export default router;
