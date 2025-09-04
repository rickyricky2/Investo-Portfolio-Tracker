"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ApiResponse = {
    success: boolean;
    loggedIn: boolean;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
};

type AuthContextType = {
    data: ApiResponse | null;
    isLoadingAuth: boolean;
    setData: (data: ApiResponse | null) => void;
};

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [isLoadingAuth, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${baseURL}/api/auth/me`);
                if (!res.ok) {
                    throw new Error("Could not authorize user");
                }

                const data = await res.json();
                setData(data);
            } catch{
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{ data, isLoadingAuth, setData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}