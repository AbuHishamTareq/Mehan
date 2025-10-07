import type { ModuleProps } from "../../types/types";
import api from "../api/axios";

export const ModuleController = {
    // FUNCTION TO FETCH MODULES FROM DATABASE
    async fetchModules(params?: {
        search?: string;
        perPage?: number;
        page?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.perPage) query.append("perPage", params.perPage.toString());
        if (params?.page) query.append("page", params.page.toString());

        const url =
            "/api/modules/index" +
            (query.toString() ? "?" + query.toString() : "");

        const { data } = await api.get(url);
        return data;
    },

    // FUNCTION TO ADD NEW MODULE TO DATABASE
    async addModule(moduleData: ModuleProps) {
        const { data } = await api.post("/api/modules/store", moduleData);
        return data;
    },

    // FUNCTION TO UPDATE EXISTING MODULE IN DATABASE
    async updateModule(moduleId: number, moduleData: ModuleProps) {
        const { data } = await api.put(
            "/api/modules/update/" + moduleId,
            moduleData
        );
        return data;
    },
};
