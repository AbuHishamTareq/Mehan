import { useEffect, useState, type ReactNode } from "react";
import { AuthController } from "../controllers/AuthController";
import { type User } from "../../types/types";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string, rememberMe: boolean, language: string) => {
        const data = await AuthController.login(email, password, rememberMe, language);
        setUser(data.user);
    }
    
    const initAuth = async () => {
        try {
            const user = await AuthController.fetchUser();
            setUser(user);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    const logout = async () => {
        await AuthController.logout();
        setUser(null);
    }

    const values = {
        user, login, logout
    }

    return (
        <AuthContext.Provider value={values} >
            {children}
        </AuthContext.Provider>
    );
}