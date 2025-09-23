import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { PermissionTableConfig } from "../../config/tables/permission-table";
import { PermissionController } from "../../controllers/PermissionController";
import { useEffect, useState } from "react";
import { type PermissionProps } from "../../../types/types";

const Permissions = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const [permissions, setPermissions] = useState<PermissionProps[]>([]);

    const fetchPermissionsData = async () => {
        try {
            const response = await PermissionController.fetchPermissions();
            setPermissions(response);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    useEffect(() => {
        fetchPermissionsData();
    }, []);

    const columns = PermissionTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    return (
        <div className="bg-gradient-card min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className={`text-3xl font-bold text-gray-900 ${font}`}>
                        {t("permissionsTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 ${font}`}>
                        {t("permissionsSubtitle")}
                    </p>
                </div>
                {/* 
                    THESE DATA IS COMING FROM PERMISSIONTABLECONFIG TO SET THE COLUMNS HEADERS AND ACTIONS BUTTON
                    ALSO DATA FROM DATABASE
                 */}
                <CustomTable
                    columns={columns}
                    actions={PermissionTableConfig.actions}
                    data={permissions}
                />
            </div>
        </div>
    );
};

export default Permissions;
