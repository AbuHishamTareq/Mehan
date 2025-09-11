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

            // Settings Routes:
            {
                path: "/settings/general",
                element: <General />,
            },
            {
                path: "/settings/department",
                element: <Departments />,
            },
            {
                path: "/settings/designation",
                element: <Designations />,
            },
            {
                path: "/settings/users",
                element: <Users />,
            },
            {
                path: "/settings/permissions_roles",
                element: <PermissionsAndRoles />,
            },
            {
                path: "/settings/permissions",
                element: <Permissions />,
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
