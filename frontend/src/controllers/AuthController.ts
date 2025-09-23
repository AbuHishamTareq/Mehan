import api from "../api/axios";

export const AuthController = {
    // FUNCTION TO LOGIN
    async login(
        email: string,
        password: string,
        rememberMe: boolean,
        language: string
    ) {
        const { data } = await api.post("/api/login", {
            email,
            password,
            rememberMe,
            language,
        });

        return data;
    },

    // FUNCTION TO FETCH USER INFORMATION
    async fetchUser() {
        const { data } = await api.get("/api/user");
        return data;
    },

    // FUNCTION TO LOGOUT THE SYSTEM
    async logout() {
        await api.get("/api/logout");
        return true;
    },
};
