import { SidebarMenu } from "../ui/sidebar";
import type { MenuItem } from "../../../types/types";
import { SidebarMenuItemComponent } from "./SidebarMenuItemComponent";

interface SidebarMenuListProps {
    items: MenuItem[];
    openMenu: string | null;
    setOpenMenu: (id: string | null) => void;
    can: (permission: string) => boolean;
}

export function SidebarMenuList({
    items,
    openMenu,
    setOpenMenu,
    can,
}: SidebarMenuListProps) {
    return (
        <SidebarMenu>
            {items
                .filter((item) => !item.permission || can(item.permission))
                .map((item) => (
                    <SidebarMenuItemComponent
                        key={item.id}
                        item={item}
                        isExpanded={openMenu === item.id}
                        setOpenMenu={setOpenMenu}
                        can={can}
                    />
                ))}
        </SidebarMenu>
    );
}
