import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../views/Login";
import GuestLayout from "../components/GuestLayout";
import Dashboard from "../views/Dashboard";
import AuthLayout from "../components/AuthLayout";

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
