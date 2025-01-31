"use client"

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("kitchenData");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    })

    const [kitchenData, setKitchenData] = useState(null);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("kitchenData", JSON.stringify(userData));
        localStorage.setItem("kitchenToken", token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("kitchenData");
        localStorage.removeItem("KitchenToken");
        localStorage.removeItem("kitchenId");
        router.push("/auth/signin")
    }

    return (
        <AppContext.Provider value={{ kitchenData, setKitchenData, user, login, logout }} >
            {children}
        </AppContext.Provider>
    )
};

export const useUser = () => useContext(AppContext);