import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { AuthController } from "../controllers/AuthController";
import { type User } from "../../types/types";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback(
        async (
            email: string,
            password: string,
            rememberMe: boolean,
            language: string
        ) => {
            try {
                const data = await AuthController.login(
                    email,
                    password,
                    rememberMe,
                    language
                );
                setUser(data.user);
                return data.user;
            } catch (error) {
                console.error("Login failed:", error);
                throw error;
            }
        },
        []
    );

    const initAuth = useCallback(async () => {
        setLoading(true);
        try {
            const user = await AuthController.fetchUser();
            setUser(user);
        } catch (error) {
            console.error("Auth initialization failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    const logout = useCallback(async () => {
        try {
            await AuthController.logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, []);

    // Memoize permission and role checks
    const userPermissions = useMemo(
        () => new Set(user?.permissions),
        [user?.permissions]
    );
    const userRoles = useMemo(() => new Set(user?.roles), [user?.roles]);

    const can = useCallback(
        (permission: string | string[]) => {
            if (Array.isArray(permission)) {
                return permission.some((p) => userPermissions.has(p));
            }
            return userPermissions.has(permission);
        },
        [userPermissions]
    );

    const hasRole = useCallback(
        (role: string | string[]) => {
            if (Array.isArray(role)) {
                return role.some((r) => userRoles.has(r));
            }
            return userRoles.has(role);
        },
        [userRoles]
    );

    const values = useMemo(
        () => ({
            user,
            initAuth,
            setUser,
            can,
            hasRole,
            login,
            logout,
            loading,
        }),
        [user, initAuth, can, hasRole, login, logout, loading]
    );

    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    );
};
