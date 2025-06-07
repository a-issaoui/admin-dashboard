'use client';

import * as React from 'react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Organization } from '@/constants/types';

export function OrgProfile({ dataOrg }: { dataOrg: Organization }) {
    const initials = React.useMemo(() => {
        if (!dataOrg?.name) return 'CN';
        return dataOrg.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    }, [dataOrg.name]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-md bg-primary text-primary-foreground text-md">
                        {dataOrg.imageUrl && (
                            <AvatarImage
                                src={dataOrg.imageUrl}
                                alt={dataOrg.name}
                                className="object-cover"
                            />
                        )}
                        <AvatarFallback className="font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="ml-2 flex flex-col leading-none">
                        <span className="text-base font-semibold" title={dataOrg.name}>
                            {dataOrg.name}
                        </span>
                        {dataOrg.academicYear && (
                            <span className="text-sm text-muted-foreground" title={dataOrg.academicYear}>
                                {dataOrg.academicYear}
                            </span>
                        )}
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
