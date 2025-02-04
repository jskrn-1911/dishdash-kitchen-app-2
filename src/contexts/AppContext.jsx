"use client"

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [kitchenData, setKitchenData] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("kitchenData");
            const storedToken = localStorage.getItem("kitchenToken");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setKitchenData(JSON.parse(storedUser)); 
            }
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, []);
    const login = (userData, token) => {
        setToken(token);
        setUser(userData);
        setKitchenData(userData);
        localStorage.setItem("kitchenData", JSON.stringify(userData));
        localStorage.setItem("kitchenId", JSON.stringify(userData?._id));
        localStorage.setItem("kitchenToken", token);

    }

    const logout = () => {
        setToken(null);
        setUser(null);
        setKitchenData(null);
        localStorage.removeItem("kitchenData");
        localStorage.removeItem("KitchenToken");
        localStorage.removeItem("kitchenId");
        router.push("/auth/signin")
    }

    return (
        <AppContext.Provider value={{ kitchenData, setKitchenData, user, login, logout, token }} >
            {children}
        </AppContext.Provider>
    )
};

export const useUser = () => useContext(AppContext);