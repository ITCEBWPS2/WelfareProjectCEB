import { createContext, useContext, useEffect, useState } from "react";
import { API } from "./axiosInstance";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state

    const login = async (identifier, password, navigate) => {
        try {
            let response;

            // 1. Try logging in as admin
            try {
                response = await API.post("/admins/auth", {
                    identifier,
                    password,
                });
            } catch (adminErr) {
                // 2. If admin login fails, try member login
                response = await API.post("/members/auth", {
                    identifier,
                    password,
                });
            }

            const data = response.data;
            setUser(data);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const logout = async () => {
        await api.post("/members/logout");
        setUser(null);
        localStorage.removeItem("token");
    };

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const { data } = await api.get("/admins/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user:", error.message);
                localStorage.removeItem("token");
            }
        }
        setLoading(false); // Mark loading as complete
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Render children only when loading is complete
    if (loading) {
        return <div>Loading...</div>; // Optional: Replace with a loader
    }

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
