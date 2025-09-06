import api from "../api/axios";

export const AuthController = {
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

    async fetchUser() {
        const { data } = await api.get("/api/user");
        return data;
    },

    async logout() {
        await api.get("/api/logout");
        return true;
    },
};
