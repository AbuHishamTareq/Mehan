import api from "../api/axios";

export const PermissionController = {
    // FUNCTION TO FETCH PERMISSIONS FROM DATABASE
    async fetchPermissions() {
        const { data } = await api.get("/api/permissions/index");
        console.log(data);
        return data;
    }
}