import {
    Controller,
    type FieldError,
    type FieldValues,
    type Path,
    type PathValue,
} from "react-hook-form";
import type { CustomModelFormProps, PermissionProps } from "../../types/types";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { useLanguage } from "../hooks/useLanguage";

export function CustomModelForm<T extends FieldValues>({
    addButton,
    fields,
    title,
    description,
    buttons,
    register,
    onSubmit,
    isSubmitting,
    errors,
    control,
    open,
    onOpenChange,
    mode = "create",
    extraData,
}: CustomModelFormProps<T>) {
    const { isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    // Filter fields for visibility based on mode
    const visibleFields = fields.filter((field) => {
        // Hide password in edit mode
        if (field.type === "password" && mode === "edit") return false;

        // Optionally hide confirm_password in view/edit modes
        if (field.name === "confirm_password" && mode !== "create")
            return false;

        return true;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogTrigger asChild>
                {addButton && (
                    <Button
                        id={addButton.id}
                        type={addButton.type}
                        className={addButton.className}
                    >
                        {addButton.icon && (
                            <addButton.icon className="w-4 h-4 mr-2" />
                        )}
                        {addButton.label}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[1024px] max-h-[90vh] p-0">
                {/* Card Container */}
                <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden max-h-[90vh]">
                    {/* Card Header */}
                    <div className="p-6 border-b">
                        <DialogTitle className={`text-xl font-bold ${font}`}>
                            {title}
                        </DialogTitle>
                        {description && (
                            <DialogDescription
                                className={`text-sm text-gray-500 mt-1 ${font}`}
                            >
                                {description}
                            </DialogDescription>
                        )}
                    </div>

                    {/* Card Body + Footer */}
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col flex-1 overflow-y-auto"
                    >
                        <div className="p-6 grid gap-4 flex-1 overflow-y-auto">
                            {visibleFields.map((field) => (
                                <div key={field.key} className="grid gap-3">
                                    <Label
                                        htmlFor={field.id}
                                        className={`${field.className ?? ""}`}
                                    >
                                        {field.label}
                                    </Label>

                                    {/* TEXT FIELD */}
                                    {field.type === "text" ? (
                                        <>
                                            <Input
                                                id={field.id}
                                                {...register(
                                                    field.name as Path<T>
                                                )}
                                                type={field.type}
                                                tabIndex={field.tabIndex}
                                                autoFocus={field.autofocus}
                                                placeholder={field.placeholder}
                                                disabled={mode === "view"}
                                                className={`${
                                                    field.className ?? ""
                                                }`}
                                            />
                                            {errors[field.name as keyof T]
                                                ?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            field.name as keyof T
                                                        ]?.message as string
                                                    }
                                                </p>
                                            )}
                                        </>
                                    ) : field.type === "password" ? (
                                        /* PASSWORD FIELD (only shown in create/view modes) */
                                        <>
                                            <Input
                                                id={field.id}
                                                {...register(
                                                    field.name as Path<T>
                                                )}
                                                type={field.type}
                                                tabIndex={field.tabIndex}
                                                autoFocus={field.autofocus}
                                                placeholder={field.placeholder}
                                                disabled={mode === "view"}
                                                className={`${
                                                    field.className ?? ""
                                                }`}
                                            />
                                            {errors[field.name as keyof T]
                                                ?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            field.name as keyof T
                                                        ]?.message as string
                                                    }
                                                </p>
                                            )}
                                        </>
                                    ) : field.type === "tel" ? (
                                        /* MOBILE FIELD */
                                        <>
                                            <Input
                                                id={field.id}
                                                {...register(
                                                    field.name as Path<T>
                                                )}
                                                type={field.type}
                                                tabIndex={field.tabIndex}
                                                autoFocus={field.autofocus}
                                                placeholder={field.placeholder}
                                                disabled={mode === "view"}
                                                className={`${
                                                    field.className ?? ""
                                                } ${
                                                    isRTL
                                                        ? "text-right"
                                                        : "text-left"
                                                } ${font}`}
                                            />
                                            {errors[field.name as keyof T]
                                                ?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            field.name as keyof T
                                                        ]?.message as string
                                                    }
                                                </p>
                                            )}
                                        </>
                                    ) : field.type === "select" ? (
                                        /* SELECT FIELD */
                                        <Controller
                                            control={control}
                                            defaultValue={
                                                "" as PathValue<T, Path<T>>
                                            }
                                            name={field.name as Path<T>}
                                            render={({
                                                field: { onChange, value },
                                            }) => (
                                                <>
                                                    <Select
                                                        value={value}
                                                        onValueChange={onChange}
                                                        disabled={
                                                            mode === "view"
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={`${font} ${
                                                                isRTL
                                                                    ? "flex-row-reverse"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <SelectValue
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                                className={`${
                                                                    field.className ??
                                                                    ""
                                                                } ${font} ${
                                                                    isRTL
                                                                        ? "text-right"
                                                                        : "text-left"
                                                                }`}
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            className={`${
                                                                isRTL
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            } ${font}`}
                                                        >
                                                            {field.options?.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.key
                                                                        }
                                                                        value={option.value.toString()}
                                                                        className={`${
                                                                            field.className ??
                                                                            ""
                                                                        } ${font} ${
                                                                            isRTL
                                                                                ? "text-right"
                                                                                : "text-left"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>

                                                    {errors[
                                                        field.name as keyof T
                                                    ]?.message && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                errors[
                                                                    field.name as keyof T
                                                                ]
                                                                    ?.message as string
                                                            }
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    ) : field.type === "textarea" ? (
                                        /* TEXTAREA FIELD */
                                        <textarea
                                            id={field.id}
                                            placeholder={field.placeholder}
                                            rows={field.rows}
                                            tabIndex={field.tabIndex}
                                            {...register(field.name as Path<T>)}
                                            className={`rounded border ${
                                                field.className ?? ""
                                            }`}
                                            disabled={mode === "view"}
                                        />
                                    ) : field.type === "checkbox" ? (
                                        /* CHECKBOX GROUP FIELD */
                                        <Controller
                                            control={control}
                                            name={field.name as Path<T>}
                                            defaultValue={
                                                [] as unknown as PathValue<
                                                    T,
                                                    Path<T>
                                                >
                                            }
                                            render={({
                                                field: { value, onChange },
                                            }) => (
                                                <div className="space-y-2">
                                                    {Object.entries(
                                                        extraData?.permissions ??
                                                            {}
                                                    ).map(
                                                        ([
                                                            module,
                                                            permissions,
                                                        ]) => (
                                                            <div
                                                                key={module}
                                                                className="mb-4 border-b pb-5"
                                                            >
                                                                <h4 className="capitalize text-sm font-bold">
                                                                    {module}:
                                                                </h4>

                                                                <div className="ms-2 mt-2 grid grid-cols-3 gap-2">
                                                                    {Array.isArray(
                                                                        permissions
                                                                    ) &&
                                                                        permissions.map(
                                                                            (
                                                                                permission: PermissionProps
                                                                            ) => (
                                                                                <label
                                                                                    key={
                                                                                        permission.id
                                                                                    }
                                                                                    className={`flex items-center ${
                                                                                        isRTL
                                                                                            ? "space-x-reverse mr-4"
                                                                                            : "ml-4"
                                                                                    } space-x-2`}
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className={`${
                                                                                            field.className ??
                                                                                            ""
                                                                                        }`}
                                                                                        value={
                                                                                            permission.id
                                                                                        }
                                                                                        checked={value.includes(
                                                                                            permission.id
                                                                                        )}
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            if (
                                                                                                e
                                                                                                    .target
                                                                                                    .checked
                                                                                            ) {
                                                                                                onChange(
                                                                                                    [
                                                                                                        ...value,
                                                                                                        permission.id,
                                                                                                    ]
                                                                                                );
                                                                                            } else {
                                                                                                onChange(
                                                                                                    value.filter(
                                                                                                        (
                                                                                                            id: number
                                                                                                        ) =>
                                                                                                            id !==
                                                                                                            permission.id
                                                                                                    )
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                        disabled={
                                                                                            mode ===
                                                                                            "view"
                                                                                        }
                                                                                    />
                                                                                    <span className="text-sm">
                                                                                        {
                                                                                            permission.label
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            )
                                                                        )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}

                                                    {(
                                                        errors[
                                                            field.name as keyof T
                                                        ] as unknown as FieldError
                                                    )?.message && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {
                                                                (
                                                                    errors[
                                                                        field.name as keyof T
                                                                    ] as unknown as FieldError
                                                                ).message
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    ) : (
                                        /* OTHER INPUT TYPES */
                                        <>
                                            <Input
                                                id={field.id}
                                                {...register(
                                                    field.name as Path<T>
                                                )}
                                                type={field.type}
                                                tabIndex={field.tabIndex}
                                                autoFocus={field.autofocus}
                                                disabled={mode === "view"}
                                                className={`${
                                                    field.className ?? ""
                                                }`}
                                            />
                                            {errors[field.name as keyof T]
                                                ?.message && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            field.name as keyof T
                                                        ]?.message as string
                                                    }
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t flex justify-end gap-2">
                            {buttons.map((button) =>
                                button.key === "cancel" ? (
                                    <DialogClose asChild key={button.key}>
                                        <Button
                                            type="button"
                                            variant={button.variant}
                                            className={`${button.className} ${font}`}
                                        >
                                            {button.label}
                                        </Button>
                                    </DialogClose>
                                ) : (
                                    mode !== "view" && (
                                        <Button
                                            type="submit"
                                            key={button.key}
                                            variant={button.variant}
                                            className={`${button.className} ${font}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Saving..."
                                                : button.label}
                                        </Button>
                                    )
                                )
                            )}
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
