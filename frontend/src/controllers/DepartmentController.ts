import type { DepartmentProps } from "../../types/types";
import api from "../api/axios";

export const DepartmentController = {
    // FUNCTION TO FETCH DEPARTMENTS FROM DATABASE
    async fetchDepartments(params?: {
        search?: string;
        perPage?: number;
        page?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.perPage) query.append("perPage", params.perPage.toString());
        if (params?.page) query.append("page", params.page.toString());

        const url =
            "/api/departments/index" +
            (query.toString() ? "?" + query.toString() : "");

        const { data } = await api.get(url);
        return data;
    },

    // FUNCTION TO ADD NEW DEPARTMENT TO DATABASE
    async addDepartment(departmentData: DepartmentProps) {
        const { data } = await api.post(
            "/api/departments/store",
            departmentData
        );
        return data;
    },

    // FUNCTION TO UPDATE EXISTING DEPARTMENT IN DATABASE
    async updateDepartment(
        departmentId: number,
        departmentData: DepartmentProps
    ) {
        const { data } = await api.put(
            "/api/departments/update/" + departmentId,
            departmentData
        );
        return data;
    },

    // FUNCTION TO SOFT DELETE EXISTING DEPARTMENT
    async deleteDepartment(departmentId: number) {
        const { data } = await api.delete(
            "/api/departments/destroy/" + departmentId
        );
        return data;
    },

    // FUNCTION TO RESTORE DELETED DEPARTMENT
    async restoreDepartment(departmentId: number) {
        const { data } = await api.patch(
            "/api/departments/restore/" + departmentId
        );
        return data;
    },

    // ACTIVATE DEACTIVATE IN BULK OR PER SELECTED ITEM
    async bulkActivate(ids: number[]) {
        const { data } = await api.put("/api/departments/bulkActivate", {
            ids,
        });
        return data;
    },

    async bulkDeactivate(ids: number[]) {
        const { data } = await api.put("/api/departments/bulkDeactivate", {
            ids,
        });
        return data;
    },

    async activeDeactivate(id: number, checked: boolean) {
        const { data } = await api.put("/api/departments/activeDeactivate", {
            id,
            is_active: checked ? true : false,
        });
        return data;
    },

    // FUNCTION TO IMPORT DEPARTMENTS FROM EXCEL FILE
    async importDepartments(formData: FormData) {
        const { data } = await api.post("/api/departments/import", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    },
};
