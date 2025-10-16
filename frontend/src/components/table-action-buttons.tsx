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
}: TableActionButtonsProps) => {
    return (
        <div className="flex space-x-2">
            {actions.map((action, index) => {
                const IconComponent = LucidIcons[
                    action.icon as keyof typeof LucidIcons
                ] as React.ElementType;

                // DELETE
                if (action.label === "Delete") {
                    return (
                        <Tooltip key={`delete-${row.id}-${index}`}>
                            <TooltipTrigger asChild>
                                <Button
                                    className={action.className}
                                    onClick={() => onDelete?.(Number(row.id))}
                                    disabled={!!row.removed_at}
                                >
                                    <IconComponent size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{action.tooltip}</TooltipContent>
                        </Tooltip>
                    );
                }

                // RESTORE
                if (action.label === "Restore") {
                    return (
                        <Tooltip key={`restore-${row.id}-${index}`}>
                            <TooltipTrigger asChild>
                                <Button
                                    className={action.className}
                                    onClick={() => onRestore?.(Number(row.id))}
                                    disabled={!row.removed_at}
                                >
                                    <IconComponent size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{action.tooltip}</TooltipContent>
                        </Tooltip>
                    );
                }

                // VIEW
                if (isModel && action.label === "View") {
                    return (
                        <Tooltip key={`view-${row.id}-${index}`}>
                            <TooltipTrigger asChild>
                                <Button
                                    className={action.className}
                                    onClick={() => onView?.(row)}
                                >
                                    <IconComponent size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{action.tooltip}</TooltipContent>
                        </Tooltip>
                    );
                }

                // EDIT
                if (isModel && action.label === "Edit") {
                    return (
                        <Tooltip key={`edit-${row.id}-${index}`}>
                            <TooltipTrigger asChild>
                                <Button
                                    className={action.className}
                                    onClick={() => onEdit?.(row)}
                                >
                                    <IconComponent size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{action.tooltip}</TooltipContent>
                        </Tooltip>
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
