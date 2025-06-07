// src/components/layouts/admin/UserMenu.tsx
"use client"

import * as React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/icons";
import type { User } from "@/constants/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserInfoProps {
    user: User;
    initials: string;
}

const UserInfo = React.memo<UserInfoProps>(({ user, initials }) => (
    <div className="flex items-center gap-2 rtl:flex-row-reverse px-1 py-1.5 text-sm text-left rtl:text-right">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarImage src={user.imageUrl} alt={user.name || initials} />
            <AvatarFallback className="rounded-lg bg-gray-200">
                {initials}
            </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 min-w-0 text-left rtl:text-right leading-tight">
            <span className="truncate font-medium" title={user.name || 'Guest'}>
                {user.name || 'Guest'}
            </span>
            <span className="truncate text-xs text-muted-foreground" title={user.email || 'Email'}>
                {user.email || 'Email'}
            </span>
        </div>
    </div>
));

UserInfo.displayName = "UserInfo";

const MenuItems = React.memo(() => (
    <>
        <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center gap-2 rtl:flex-row-reverse">
                <Icon name="UserIcon" className="h-4 w-4 shrink-0" />
                <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 rtl:flex-row-reverse">
                <Icon name="UserIcon" className="h-4 w-4 shrink-0" />
                <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 rtl:flex-row-reverse">
                <Icon name="UserIcon" className="h-4 w-4 shrink-0" />
                <span>Notifications</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 rtl:flex-row-reverse text-destructive focus:text-destructive">
            <Icon name="UserIcon" className="h-4 w-4 shrink-0" />
            <span>Logout</span>
        </DropdownMenuItem>
    </>
));

MenuItems.displayName = "MenuItems";

export interface UserMenuProps {
    user: User;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}

export function UserMenu({
                             user,
                             side,
                             align,
                             sideOffset = 4,
                             alignOffset,
                             collisionPadding,
                         }: UserMenuProps) {
    const isMobile = useIsMobile();

    const initials = React.useMemo(() => {
        const name = user?.name?.trim() || 'Guest';
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase() || '')
            .join('') || 'CN';
    }, [user?.name]);

    if (!user) return null;

    return (
        <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={side ?? (isMobile ? "bottom" : "right")}
            align={align ?? "end"}
            sideOffset={sideOffset}
            {...(alignOffset !== undefined && { alignOffset })}
            {...(collisionPadding && { collisionPadding })}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <UserInfo user={user} initials={initials} />
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <MenuItems />
        </DropdownMenuContent>
    );
}
