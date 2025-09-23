import { Link } from "react-router-dom";
import type { TableActionButtonsProps } from "../../types/types";
import * as LucidIcons from "lucide-react";

export const TableActionButtons = ({
    row,
    actions,
}: TableActionButtonsProps) => {
    return (
        <div className="flex space-x-2">
            {actions.map((action, index) => {
                const IconComponent = LucidIcons[
                    action.icon as keyof typeof LucidIcons
                ] as React.ElementType;
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
