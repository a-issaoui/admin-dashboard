// ============================================================================
// src/components/layout/admin/sidebar/app-sidebar.tsx - Main sidebar component
// ============================================================================

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar'
import { SidebarGroupComponent } from './components/sidebar-group'
import { OrgProfile } from './org-profile'
import { UserMenu } from './user-menu'
import { LocaleSelector } from './components/locale-selector'
import { useSidebarStore, useLocaleStore } from '@/lib/stores'
import { sidebarData } from '@/data/sidebar-data'
import { userData } from '@/data/user-data'
import { orgData } from '@/data/org-data'
import { cn } from '@/lib/utils'

interface AppSidebarProps {
  variant?: 'sidebar' | 'floating' | 'inset'
  side?: 'left' | 'right'
  collapsible?: 'offcanvas' | 'icon' | 'none'
  className?: string
}

export function AppSidebar({
                             variant = 'sidebar',
                             side = 'left',
                             collapsible = 'icon',
                             className
                           }: AppSidebarProps) {
  const t = useTranslations('common')
  const { setData, data } = useSidebarStore()
  const { isRTL } = useLocaleStore()

  // Initialize sidebar data
  React.useEffect(() => {
    setData(sidebarData)
  }, [setData])

  // Adjust sidebar side for RTL
  const sidebarSide = React.useMemo(() => {
    if (side === 'left') return isRTL ? 'right' : 'left'
    if (side === 'right') return isRTL ? 'left' : 'right'
    return side
  }, [side, isRTL])

  // Sort groups by order
  const sortedGroups = React.useMemo(() => {
    return [...data].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [data])

  return (
      <Sidebar
          variant={variant}
          side={sidebarSide}
          collapsible={collapsible}
          className={cn(className)}
          data-locale={useLocaleStore.getState().current}
          data-direction={isRTL ? 'rtl' : 'ltr'}
      >
        <SidebarHeader className={cn('p-2', isRTL && 'flex-row-reverse')}>
          <div className="flex items-center gap-2 flex-1">
            <OrgProfile org={orgData} />
          </div>
          <LocaleSelector />
        </SidebarHeader>

        <SidebarContent>
          {sortedGroups.map((group) => (
              <SidebarGroupComponent
                  key={group.id}
                  group={group}
              />
          ))}
        </SidebarContent>

        <SidebarFooter className="p-2">
          <UserMenu user={userData} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
  )
}
