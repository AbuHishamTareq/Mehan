import type { RoleProps } from "../../types/types";
import api from "../api/axios";

export const RoleController = {
    // FUNCTION TO FETCH ROLES FROM DATABASE
    async fetchRoles(params?: {
        search?: string;
        perPage?: number;
        page?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.perPage) query.append("perPage", params.perPage.toString());
        if (params?.page) query.append("page", params.page.toString());

        const url =
            "/api/roles/index" +
            (query.toString() ? "?" + query.toString() : "");

        const { data } = await api.get(url);
        return data;
    },

    // FUNCTION TO ADD NEW PERMISSION TO DATABASE
    async addRole(roleData: RoleProps) {
        const { data } = await api.post("/api/roles/store", roleData);
        return data;
    },

    async updateRole(roleId: number, RoleData: RoleProps) {
        const { data } = await api.put("/api/roles/update/" + roleId, RoleData);
        return data;
    },

    async bulkActivate(ids: number[]) {
        const { data } = await api.put("/api/roles/bulkActivate", {
            ids,
        });
        return data;
    },

    async bulkDeactivate(ids: number[]) {
        const { data } = await api.put("/api/roles/bulkDeactivate", {
            ids,
        });
        return data;
    },

    async activeDeactivate(id: number, checked: boolean) {
        const { data } = await api.put("/api/roles/activeDeactivate", {
            id,
            is_active: checked ? true : false
        });
        return data;
    },
};
