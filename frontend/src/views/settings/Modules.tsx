import { CustomTable } from "../../components/custom-table";
import { useLanguage } from "../../hooks/useLanguage";
import { ModuleTableConfig } from "../../config/tables/module-table";
import { useCallback, useEffect, useState, useRef } from "react";
import { CustomModelForm } from "../../components/custom-model-form";
import { ModuleModelFormConfig } from "../../config/forms/module-model-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useToast } from "../../hooks/use-toast";
import type { LinkProps, ModuleProps } from "../../../types/types";
import { Pagination } from "../../components/ui/pagination";
import { ModuleController } from "../../controllers/ModuleController";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { hasPermission } from "../../lib/authorization";

interface ModuleFormValue {
    label: string;
    search?: string;
    perPage?: number;
}

interface ModulePaginationProps {
    data: ModuleProps[];
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface ModuleIndexProps {
    modules: ModulePaginationProps;
}

const schema = yup.object({
    label: yup.string().required("Module is required"),
});

const Modules = () => {
    const { t, isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const { toast } = useToast();

    const [modelOpen, setModelOpen] = useState(false);
    const [modules, setModules] = useState<ModuleIndexProps>({
        modules: { data: [], links: [], from: 0, to: 0, total: 0 },
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [mode, setMode] = useState<"create" | "view" | "edit">("create");
    const [selectedModule, setSelectedModule] = useState<ModuleProps | null>(
        null
    );

    // Persist current perPage in state
    const [currentPerPage, setCurrentPerPage] = useState(10);
    const { user } = useAuth();

    const defaultFormValues: ModuleFormValue = {
        label: "",
        search: "",
        perPage: currentPerPage,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
        setValue,
    } = useForm<ModuleFormValue>({
        resolver: yupResolver(schema),
        mode: "onSubmit",
        defaultValues: defaultFormValues,
    });

    const searchValue = watch("search");

    const initialMount = useRef(true);

    const userPermissions = user?.permissions || [];
    const canAdd = hasPermission(`create_module`, userPermissions);
    const canEdit = hasPermission(`edit_role`, userPermissions);
    const canView = hasPermission(`view_role`, userPermissions);

    const fetchModuleData = useCallback(
        async (
            search?: string,
            perPage: number = currentPerPage,
            page?: number,
            triggerPageLoading: boolean = false
        ) => {
            try {
                if (triggerPageLoading) {
                    setPageLoading(true);
                }
                const response = await ModuleController.fetchModules({
                    search,
                    perPage,
                    page,
                });
                setModules(response);
            } catch (error) {
                console.error(error);
            } finally {
                if (triggerPageLoading) {
                    setPageLoading(false);
                }
            }
        },
        [currentPerPage]
    );

    // Initial fetch
    useEffect(() => {
        fetchModuleData(searchValue, currentPerPage, undefined, true);
        initialMount.current = false;
    }, []);

    // Fetch data when search changes
    useEffect(() => {
        if (initialMount.current) return;

        const timer = setTimeout(
            () => fetchModuleData(searchValue, currentPerPage),
            300
        );
        return () => clearTimeout(timer);
    }, [searchValue, currentPerPage, fetchModuleData]);

    // TRANSLATE MODEL FORM
    const translatedConfig = {
        ...ModuleModelFormConfig,
        moduleTitle: t("manageModules"),
        title: t("addNewModule"),
        description: t("moduleDescription"),
        addButton: {
            ...ModuleModelFormConfig.addButton,
            label: t("addNewModule"),
            className: `${ModuleModelFormConfig.addButton.className} ${font}`,
        },
        fields: ModuleModelFormConfig.fields.map((field) => ({
            ...field,
            label: t("moduleName"),
            placeholder: t("modulePlaceholder"),
            className: `${field.className ?? ""} ${font}`,
        })),
        buttons: ModuleModelFormConfig.buttons.map((btn) => ({
            ...btn,
            label: t(btn.key === "cancel" ? "cancel" : "saveChanges"),
        })),
    };

    // TRANSLATE TABLES HEADERS
    const columns = ModuleTableConfig.columns.map((col) => ({
        ...col,
        label: t(col.label),
        className: `${col.className} ${font}`,
    }));

    // TRANSLATE TOOLTIP FOR ACTION BUTTONS
    const actions = ModuleTableConfig.actions.map((action) => ({
        ...action,
        label: t(action.label),
        tooltip: t(action.tooltip),
    }));

    const onSubmit = async (data: ModuleFormValue) => {
        setFormSubmitting(true);
        try {
            if (mode === "edit" && selectedModule) {
                const response = await ModuleController.updateModule(
                    selectedModule.id!,
                    data as ModuleProps
                );
                toast({
                    title: "Notification",
                    description: response.message || "Module updated",
                    variant: "success",
                    className: font,
                });
            } else {
                const response = await ModuleController.addModule(
                    data as ModuleProps
                );
                toast({
                    title: "Notification",
                    description: response.message || "Module added",
                    variant: "success",
                    className: font,
                });
            }
            reset(defaultFormValues);
            closeModel();
            // Always fetch with current perPage
            fetchModuleData(searchValue, currentPerPage);
        } catch (error) {
            console.error(error);
        } finally {
            setFormSubmitting(false);
        }
    };

    const closeModel = () => {
        setMode("create");
        setSelectedModule(null);
        reset(defaultFormValues);
        setModelOpen(false);
    };

    const handleModelToggle = (open: boolean) => {
        setModelOpen(open);
        if (!open) closeModel();
    };

    const openModel = (
        mode: "create" | "view" | "edit",
        module?: ModuleProps
    ) => {
        setMode(mode);
        if (module) {
            reset({ ...module });
            setSelectedModule(module);
        }
        setModelOpen(true);
    };

    const handlePerPageChange = (value: string | number) => {
        const perPage = Number(value);
        setCurrentPerPage(perPage); // persist selected perPage
        setValue("perPage", perPage);
        fetchModuleData(searchValue, perPage); // immediately fetch
    };

    return (
        <div className="bg-gradient-card min-h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className={`text-3xl font-bold text-gray-900 ${font}`}>
                        {t("modulesTitle")}
                    </h1>
                    <p className={`text-gray-600 mt-2 ${font}`}>
                        {t("modulesSubtitle")}
                    </p>
                </div>

                {/* Search & Add Module */}
                <div className="flex items-center justify-between mb-2">
                    <div className="relative w-1/2">
                        <Input
                            placeholder={t("searchModule")}
                            className={`h-10 w-full border border-blue-200 ${font} ${
                                isRTL ? "pl-10 pr-4" : "pr-10 pl-4"
                            }`}
                            {...register("search")}
                        />
                        <Search
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 ${
                                isRTL ? "left-4 scale-x-[-1]" : "right-4"
                            }`}
                        />
                    </div>
                    <CustomModelForm
                        title={
                            mode === "view"
                                ? t("viewModule")
                                : mode === "edit"
                                ? t("editModule")
                                : translatedConfig.title
                        }
                        description={
                            mode === "view"
                                ? t("veiwModuleDesc")
                                : mode === "edit"
                                ? t("editModuleDesc")
                                : translatedConfig.description
                        }
                        addButton={
                            canAdd ? translatedConfig.addButton : undefined
                        }
                        fields={translatedConfig.fields}
                        buttons={translatedConfig.buttons}
                        register={register}
                        errors={errors}
                        isSubmitting={formSubmitting}
                        control={control}
                        onSubmit={handleSubmit(onSubmit)}
                        open={modelOpen}
                        onOpenChange={handleModelToggle}
                        mode={mode}
                    />
                </div>

                {/* Table */}
                <CustomTable
                    columns={columns}
                    actions={actions}
                    data={modules.modules.data}
                    isLoading={pageLoading}
                    onView={(row) => openModel("view", row as ModuleProps)}
                    onEdit={(row) => openModel("edit", row as ModuleProps)}
                    isModel={true}
                    from={modules.modules.from}
                    canEdit={canEdit}
                    canView={canView}
                />

                {/* Pagination */}
                <div className="px-6 pb-4 border border-blue-200 bg-blue-50 rounded-b">
                    {modules.modules && (
                        <Pagination
                            paginateData={modules.modules}
                            perPage={currentPerPage}
                            onPerPageChange={handlePerPageChange}
                            onPageChange={(page) =>
                                fetchModuleData(
                                    searchValue,
                                    currentPerPage,
                                    page
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modules;
