import { useDispatch } from "react-redux";
import { register, login, getme, logout } from "../services/auth.api";
import { setUser, setError, setLoading } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();
    
    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({ email, username, password });
            dispatch(setUser(data.user));
            return { success: true, data };
        } catch(error) {
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Registration failed";
            dispatch(setError(message));
            return { success: false, message };
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await login({ email, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            dispatch(setUser(data.user));
            return { success: true, data };
        } catch(error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Login failed";
            dispatch(setError(message));
            return { success: false, message };
        } finally {
            dispatch(setLoading(false));
        }  
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getme();
            dispatch(setUser(data.user));
            dispatch(setError(null));
        } catch(err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
            }
            dispatch(setUser(null));
            dispatch(setError(null));
        } finally {
            dispatch(setLoading(false));
        }
    } 

    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            localStorage.removeItem("token");
            await logout();
            dispatch(setUser(null));
            dispatch(setError(null));
            return { success: true };
        } catch(err) {
            localStorage.removeItem("token");
            dispatch(setUser(null));
            dispatch(setError(null));
            return { success: true };
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    };
}
