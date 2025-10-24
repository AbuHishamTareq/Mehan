import type { UserProps } from "../../types/types";
import api from "../api/axios";

export const UserController = {
    // FUNCTION TO FETCH USERS FROM DATABASE
    async fetchUsers(params?: {
        search?: string;
        perPage?: number;
        page?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.perPage) query.append("perPage", params.perPage.toString());
        if (params?.page) query.append("page", params.page.toString());

        const url =
            "/api/users/index" +
            (query.toString() ? "?" + query.toString() : "");

        const { data } = await api.get(url);
        return data;
    },

    // FUNCTION TO ADD NEW USER TO DATABASE
    async addUser(userData: UserProps) {
        const { data } = await api.post(
            "/api/users/store",
            userData
        );
        return data;
    },

    // FUNCTION TO UPDATE EXISTING USER IN DATABASE
    async updateUser(
        userId: number,
        userData: UserProps
    ) {
        const { data } = await api.put(
            "/api/users/update/" + userId,
            userData
        );
        return data;
    },

    // FUNCTION TO SOFT DELETE EXISTING USER
    async deleteUser(userId: number) {
        const { data } = await api.delete(
            "/api/users/destroy/" + userId
        );
        return data;
    },

    // FUNCTION TO RESTORE DELETED USER
    async restoreUser(userId: number) {
        const { data } = await api.patch(
            "/api/users/restore/" + userId
        );
        return data;
    },

    // FUNCTION TO RESET USER PASSWORD
    async resetUser(userId: number) {
        const { data } = await api.patch(
            "/api/users/reset/" + userId
        );
        return data;
    },

    // ACTIVATE DEACTIVATE IN BULK OR PER SELECTED ITEM
    async bulkActivate(ids: number[]) {
        const { data } = await api.put("/api/users/bulkActivate", {
            ids,
        });
        return data;
    },

    async bulkDeactivate(ids: number[]) {
        const { data } = await api.put("/api/users/bulkDeactivate", {
            ids,
        });
        return data;
    },

    async activeDeactivate(id: number, checked: boolean) {
        const { data } = await api.put("/api/users/activeDeactivate", {
            id,
            is_active: checked ? true : false,
        });
        return data;
    },

    // FUNCTION TO IMPORT USERS FROM EXCEL FILE
    async importUsers(formData: FormData) {
        const { data } = await api.post("/api/users/import", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
};
