// src/components/layouts/admin/sidebar/UserSidebar.tsx
"use client"

import * as React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Icon } from '@/components/icons';
import { UserMenu } from "@/components/layout/admin/common/UserMenu";
import type { User } from "@/constants/types";

interface UserSidebarProps {
    user: User;
    triggerVariant?: 'sidebar' | 'navbar';
    className?: string;
}

export function UserSidebar({ user, className }: UserSidebarProps) {
    if (!user) return null;

    const initials = React.useMemo(() => {
        const name = user.name?.trim() || 'Guest';
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0]?.toUpperCase() || '')
            .join('') || 'CN';
    }, [user.name]);

    return (
        <SidebarMenu className={className}>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="relative">
                                <Avatar className="h-8 w-8 rounded-full border-2 border-green-500 grayscale">
                                    <AvatarImage
                                        src={user.imageUrl}
                                        alt={user.name || initials}
                                    />
                                    <AvatarFallback className="rounded-full bg-gray-200">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 end-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white" />
                            </div>

                            <div className="grid flex-1 text-start text-sm leading-tight ms-2">
                                <span className="truncate font-medium">{user.name || 'Guest'}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>

                            <Icon name="CaretUpDownIcon" className="ms-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <UserMenu
                        user={user}
                        side="left"
                        align="end"
                        sideOffset={12}
                        alignOffset={2}
                        collisionPadding={{ top: 10, bottom: 10 }}
                    />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
