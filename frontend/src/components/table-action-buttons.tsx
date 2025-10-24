import { Link } from "react-router-dom";
import type { TableActionButtonsProps } from "../../types/types";
import * as LucidIcons from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const TableActionButtons = ({
    row,
    actions,
    isModel,
    onView,
    onEdit,
    onDelete,
    onRestore,
    onReset,
    canEdit,
    canDelete,
    canRestore,
    canView,
    canReset,
    isRTL,
}: TableActionButtonsProps) => {
    return (
        <div
            className={`flex ${
                isRTL ? "space-x-reverse space-x-2" : "space-x-2"
            }`}
        >
            {actions.map((action, index) => {
                const IconComponent = LucidIcons[
                    action.icon as keyof typeof LucidIcons
                ] as React.ElementType;

                const marginClass =
                    index !== actions.length - 1
                        ? isRTL
                            ? "mr-4"
                            : "ml-4"
                        : "";

                // DELETE

                if (action.label === "Delete") {
                    return (
                        canDelete && (
                            <Tooltip key={`delete-${row.id}-${index}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className={`${action.className} ${marginClass}`}
                                        onClick={() =>
                                            onDelete?.(Number(row.id))
                                        }
                                        disabled={!!row.removed_at}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        )
                    );
                }

                // RESTORE
                if (action.label === "Restore") {
                    return (
                        canRestore && (
                            <Tooltip key={`restore-${row.id}-${index}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className={`${action.className} ${marginClass}`}
                                        onClick={() =>
                                            onRestore?.(Number(row.id))
                                        }
                                        disabled={!row.removed_at}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        )
                    );
                }

                // RESET
                if (action.label === "Reset") {
                    return (
                        canReset && (
                            <Tooltip key={`reset-${row.id}-${index}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className={`${action.className} ${marginClass}`}
                                        onClick={() =>
                                            onReset?.(Number(row.id))
                                        }
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        )
                    );
                }

                // VIEW
                if (isModel && action.label === "View") {
                    return (
                        canView && (
                            <Tooltip key={`view-${row.id}-${index}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className={`${action.className} ${marginClass}`}
                                        onClick={() => onView?.(row)}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        )
                    );
                }

                // EDIT
                if (isModel && action.label === "Edit") {
                    return (
                        canEdit && (
                            <Tooltip key={`edit-${row.id}-${index}`}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className={`${action.className} ${marginClass}`}
                                        onClick={() => onEdit?.(row)}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        )
                    );
                }

                // LINK
                return (
                    <Link
                        key={`link-${row.id}-${index}`}
                        to={`/${row.id}`}
                        className={action.className}
                    >
                        <IconComponent size={18} />
                    </Link>
                );
            })}
        </div>
    );
};
