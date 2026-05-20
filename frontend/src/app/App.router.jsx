import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import { Navigate } from "react-router";
import Dashboard from "../features/services/chat/pages/Dashboard";
import Protected  from "../features/auth/components/protected.jsx"

export const router = createBrowserRouter([
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

        element:<Protected>
        <Dashboard/>
        </Protected>
    },
    
])