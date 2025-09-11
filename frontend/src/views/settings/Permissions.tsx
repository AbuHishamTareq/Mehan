import { useLanguage } from "../../hooks/useLanguage";

const Permissions = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";

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
            </div>
        </div>
    );
};

export default Permissions;
