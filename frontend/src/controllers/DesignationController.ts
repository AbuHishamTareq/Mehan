import type { DesignationProps } from "../../types/types";
import api from "../api/axios";

export const DesignationController = {
    // FUNCTION TO FETCH DESIGNATIONS FROM DATABASE
    async fetchDesignations(params?: {
        search?: string;
        perPage?: number;
        page?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.perPage) query.append("perPage", params.perPage.toString());
        if (params?.page) query.append("page", params.page.toString());

        const url =
            "/api/designations/index" +
            (query.toString() ? "?" + query.toString() : "");

        const { data } = await api.get(url);
        return data;
    },

    // FUNCTION TO ADD NEW DESIGNATION TO DATABASE
    async addDesignation(designationData: DesignationProps) {
        const { data } = await api.post(
            "/api/designations/store",
            designationData
        );
        return data;
    },

    // FUNCTION TO UPDATE EXISTING DESIGNATION IN DATABASE
    async updateDesignation(
        designationId: number,
        designationData: DesignationProps
    ) {
        const { data } = await api.put(
            "/api/designations/update/" + designationId,
            designationData
        );
        return data;
    },

    // FUNCTION TO SOFT DELETE EXISTING DESIGNATION
    async deleteDesignation(designationId: number) {
        const { data } = await api.delete(
            "/api/designations/destroy/" + designationId
        );
        return data;
    },

    // FUNCTION TO RESTORE DELETED DESIGNATION
    async restoreDesignation(designationId: number) {
        const { data } = await api.patch(
            "/api/designations/restore/" + designationId
        );
        return data;
    },

    // ACTIVATE DEACTIVATE IN BULK OR PER SELECTED ITEM
    async bulkActivate(ids: number[]) {
        const { data } = await api.put("/api/designations/bulkActivate", {
            ids,
        });
        return data;
    },

    async bulkDeactivate(ids: number[]) {
        const { data } = await api.put("/api/designations/bulkDeactivate", {
            ids,
        });
        return data;
    },

    async activeDeactivate(id: number, checked: boolean) {
        const { data } = await api.put("/api/designations/activeDeactivate", {
            id,
            is_active: checked ? true : false,
        });
        return data;
    },

    // FUNCTION TO IMPORT DESIGNATIONS FROM EXCEL FILE
    async importDesignations(formData: FormData) {
        const { data } = await api.post("/api/designations/import", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
};
