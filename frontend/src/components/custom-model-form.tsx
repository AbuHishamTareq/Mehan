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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogTrigger asChild>
                <Button
                    id={addButton.id}
                    variant={addButton.variant}
                    className={addButton.className}
                    type={addButton.type}
                >
                    {addButton.icon && <addButton.icon />} {addButton.label}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[850px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        {fields.map((field) => (
                            <div key={field.key} className="grid gap-3">
                                <Label htmlFor={field.id}>{field.label}</Label>
                                {field.type === "text" ? (
                                    <>
                                        <Input
                                            id={field.id}
                                            {...register(field.name as Path<T>)}
                                            type={field.type}
                                            tabIndex={field.tabIndex}
                                            autoFocus={field.autofocus}
                                            placeholder={field.placeholder}
                                            disabled={mode === "view"}
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
                                                    disabled={mode === "view"}
                                                >
                                                    {/* WORKING AS A PLACEHOLDER FOR SELECT */}
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                field.placeholder
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    {/* OPTIONS TO FILL THE LIST */}
                                                    <SelectContent>
                                                        {field.options &&
                                                            field.options?.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.key
                                                                        }
                                                                        value={option.value.toString()}
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                    </SelectContent>
                                                </Select>

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
                                    />
                                ) : field.type === "textarea" ? (
                                    <textarea
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        rows={field.rows}
                                        tabIndex={field.tabIndex}
                                        {...register(field.name as Path<T>)}
                                        className={field.className}
                                        disabled={mode === "view"}
                                    />
                                ) : field.type === "checkbox" ? (
                                    <>
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
                                                                                    className="flex items-center space-x-2"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
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
                                                    {/* Error message */}
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
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            id={field.id}
                                            {...register(field.name as Path<T>)}
                                            type={field.type}
                                            tabIndex={field.tabIndex}
                                            autoFocus={field.autofocus}
                                            disabled={mode === "view"}
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

                    <DialogFooter className="mt-4">
                        {buttons.map((button) =>
                            button.key === "cancel" ? (
                                <DialogClose asChild key={button.key}>
                                    <Button
                                        type="button"
                                        variant={button.variant}
                                        className={button.className}
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
                                        className={button.className}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Saving..."
                                            : button.label}
                                    </Button>
                                )
                            )
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
