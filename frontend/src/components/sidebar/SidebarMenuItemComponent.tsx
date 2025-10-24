import { NavLink } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "../../lib/utils";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import type { MenuItem } from "../../../types/types";
import { useLanguage } from "../../hooks/useLanguage";
import { useState } from "react";

interface Props {
    item: MenuItem;
    isExpanded: boolean;
    setOpenMenu: (id: string | null) => void;
    can: (permission: string) => boolean;
}

export function SidebarMenuItemComponent({
    item,
    isExpanded,
    setOpenMenu,
    can,
}: Props) {
    const { state } = useSidebar();
    const { isRTL } = useLanguage();
    const font = isRTL ? "font-arabic" : "font-english";
    const Icon = item.icon;
    const hasChildren = !!item.children;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (hasChildren) {
            e.preventDefault();
            setOpenMenu(isExpanded ? null : item.id);
        }
    };

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                {state === "collapsed" ? (
                    // Tooltip for collapsed sidebar, including parents with children
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NavLink
                                to={item.url || "#"}
                                end={!hasChildren}
                                onClick={handleClick}
                                className={cn(
                                    "flex items-center justify-center w-full px-0 py-3 h-14 rounded transition-colors hover:bg-primary/10 text-gray-700 overflow-visible"
                                )}
                            >
                                {Icon && (
                                    <Icon
                                        className={cn(
                                            "transition-all duration-200 flex-shrink-0",
                                            "h-6 w-6"
                                        )}
                                        color={item.iconColor}
                                    />
                                )}
                                {hasChildren && (
                                    <span className="sr-only">
                                        {item.title}
                                    </span>
                                )}
                            </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side={isRTL ? "left" : "right"}>
                            <span className={font}>{item.title}</span>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <NavLink
                        to={item.url || "#"}
                        end={!hasChildren}
                        onClick={handleClick}
                        className={cn(
                            "flex items-center justify-between w-full px-2 py-2 rounded transition-colors hover:bg-primary/10 text-gray-700 hover:text-primary overflow-visible"
                        )}
                    >
                        <div className={cn("flex items-center gap-3", font)}>
                            {Icon && (
                                <Icon
                                    className={cn(
                                        "transition-all duration-200 flex-shrink-0 h-5 w-5"
                                    )}
                                    color={item.iconColor}
                                />
                            )}
                            <span className="text-sm font-medium text-sidebar-foreground">
                                {item.title}
                            </span>
                        </div>

                        {hasChildren && (
                            <span>
                                {isExpanded ? (
                                    <Minus className="w-5 h-5 text-white" />
                                ) : (
                                    <Plus className="w-5 h-5 text-white" />
                                )}
                            </span>
                        )}
                    </NavLink>
                )}
            </SidebarMenuButton>

            {/* Submenu */}
            {hasChildren && isExpanded && state !== "collapsed" && (
                <div className={`${isRTL ? "mr-6" : "ml-6"} mt-1 space-y-1`}>
                    {item
                        .children!.filter(
                            (child) =>
                                !child.permission || can(child.permission)
                        )
                        .map((child) => (
                            <NavLink
                                key={child.id}
                                to={child.url || "#"}
                                end
                                className="flex items-center gap-3 px-2 py-1 rounded-md text-sm hover:bg-primary/10 transition-colors text-gray-600 hover:text-primary"
                            >
                                {child.icon && (
                                    <child.icon
                                        className="h-4 w-4 text-primary/80"
                                        color={child.iconColor}
                                    />
                                )}
                                <span
                                    className={`text-sidebar-foreground ${font}`}
                                >
                                    {child.title}
                                </span>
                            </NavLink>
                        ))}
                </div>
            )}

            {/* Collapsed Popover Submenu */}
            {hasChildren && state === "collapsed" && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <div
                            className={cn(
                                "absolute inset-0 z-10 cursor-pointer flex items-center justify-center w-full h-full"
                            )}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        side={isRTL ? "left" : "right"}
                        align="start"
                        className="p-3 w-56 shadow-lg border-primary/20 bg-sidebar"
                    >
                        <p className="text-base font-semibold mb-2 text-primary">
                            <span className={`text-white ${font}`}>
                                {item.title}
                            </span>
                        </p>
                        <div className="space-y-1">
                            {item
                                .children!.filter(
                                    (child) =>
                                        !child.permission ||
                                        can(child.permission)
                                )
                                .map((child) => (
                                    <NavLink
                                        key={child.id}
                                        to={child.url || "#"}
                                        end
                                        onClick={() => setIsPopoverOpen(false)}
                                        className="flex items-center gap-3 px-2 py-1 rounded-md text-sm hover:bg-primary/10 transition-colors text-gray-600 hover:text-primary"
                                    >
                                        {child.icon && (
                                            <child.icon
                                                className="h-4 w-4"
                                                color={child.iconColor}
                                            />
                                        )}
                                        <span
                                            className={cn(
                                                font,
                                                "text-sm text-white"
                                            )}
                                        >
                                            {child.title}
                                        </span>
                                    </NavLink>
                                ))}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </SidebarMenuItem>
    );
}
