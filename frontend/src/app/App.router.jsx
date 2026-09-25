import { createBrowserRouter, Outlet } from "react-router";
import Login from "../features/auth/Pages/Login";
import Register from "../features/auth/Pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected  from "../features/auth/components/protected.jsx"
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";

function RootLayout() {
    const { handleGetMe } = useAuth();

    useEffect(() => {
        handleGetMe();
    }, []);

    return <Outlet />;
}

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/",
                element: <Protected>
                    <Dashboard />
                </Protected>
            },
        ]
    }
])