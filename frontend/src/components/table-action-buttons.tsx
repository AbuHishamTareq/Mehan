import { Link } from "react-router-dom";
import type { TableActionButtonsProps } from "../../types/types";
import * as LucidIcons from "lucide-react";
import { Button } from "./ui/button";

export const TableActionButtons = ({
    row,
    actions,
    isModel,
    onView,
    onEdit,
    onDelete,
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
                        <Button className={action.className} onClick={() => onDelete?.(Number(row.id))}>
                            <IconComponent size={18} />
                        </Button>
                    );
                }

                if (isModel) {
                    if (action.label === "View") {
                        return (
                            <Button
                                key={index}
                                className={action.className}
                                onClick={() => onView?.(row)}
                            >
                                <IconComponent size={18} />
                            </Button>
                        );
                    }

                    if (action.label === "Edit") {
                        return (
                            <Button
                                key={index}
                                className={action.className}
                                onClick={() => onEdit?.(row)}
                            >
                                <IconComponent size={18} />
                            </Button>
                        );
                    }
                }

                return (
                    <Link
                        key={index}
                        to={`${action.route}/${row.id}`}
                        className={action.className}
                    >
                        <IconComponent size={18} />
                    </Link>
                );
            })}
        </div>
    );
};
