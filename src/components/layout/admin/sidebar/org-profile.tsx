// ============================================================================
// src/components/layout/admin/sidebar/org-profile.tsx - FIXED
// ============================================================================

'use client'

import * as React from 'react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Organization } from '@/types/global'

interface OrgProfileProps {
  org: Organization
}

export function OrgProfile({ org }: OrgProfileProps) {
  const initials = React.useMemo(() => {
    return org.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word: string) => word[0]?.toUpperCase() || '')
        .join('')
  }, [org.name])

  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="gap-2">
            <Avatar className="h-8 w-8 rounded-md">
              {org.logo && (
                  <AvatarImage src={org.logo} alt={org.name} />
              )}
              <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none">
            <span className="font-semibold text-sm truncate" title={org.name}>
              {org.name}
            </span>
              <span className="text-xs text-muted-foreground truncate" title={org.academicYear}>
              {org.academicYear}
            </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}