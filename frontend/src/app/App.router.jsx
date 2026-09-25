import { createBrowserRouter, Outlet } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/services/chat/pages/Dashboard";
import Protected  from "../features/auth/components/protected.jsx"
import { useAuth } from "../features/hook/useAuth";
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