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

                // DELETE FUNCTIONALITY
                if (action.label === "Delete") {
                    return (
                        <Tooltip>
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

                // RESTORE FUNCTIONALITY
                if (action.label === "Restore") {
                    return (
                        <Tooltip>
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

                if (isModel) {
                    if (action.label === "View") {
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        key={index}
                                        className={action.className}
                                        onClick={() => onView?.(row)}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        );
                    }

                    if (action.label === "Edit") {
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        key={index}
                                        className={action.className}
                                        onClick={() => onEdit?.(row)}
                                    >
                                        <IconComponent size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {action.tooltip}
                                </TooltipContent>
                            </Tooltip>
                        );
                    }
                }

                return (
                    <Link
                        key={index}
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
