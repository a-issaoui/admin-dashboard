// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-group.tsx - FIXED
// ============================================================================

'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar
} from '@/components/ui/sidebar'
import { useSidebarStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { SidebarGroup as SidebarGroupType } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarItem } from './sidebar-item'

interface SidebarGroupProps {
  group: SidebarGroupType
  className?: string
}

export function SidebarGroupComponent({ group, className }: SidebarGroupProps) {
  const t = useTranslations('nav')
  const { state } = useSidebar()
  const { collapsedStates, toggleCollapsed } = useSidebarStore()

  const isCollapsed = state === 'collapsed'
  const hasActions = group.actions && group.actions.length > 0
  const isGroupCollapsed = collapsedStates[`group-${group.id}`] ?? !group.defaultOpen

  // Don't show group title when sidebar is collapsed
  const showTitle = group.titleKey && !isCollapsed

  // Collapsible group
  if (group.collapsible && showTitle) {
    return (
        <Collapsible
            open={!isGroupCollapsed}
            onOpenChange={() => toggleCollapsed(`group-${group.id}`)}
            className="group/collapsible-group"
        >
          <SidebarGroup className={className}>

            <SidebarGroupLabel asChild className="flex-1">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2">
                <span className="truncate">{t(group.titleKey!)}</span>
                <ChevronRight
                    className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-200',
                        'group-data-[state=open]/collapsible-group:rotate-90',
                        hasActions && 'mr-6'
                    )}
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {hasActions && group.actions && (
                <SidebarActions
                    actions={group.actions}
                    itemTitle={t(group.titleKey!)}
                />
            )}

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.menu.map((item) => (
                      <SidebarItem key={item.id} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
    )
  }

  // Standard group
  return (
      <SidebarGroup className={className}>
        {showTitle && (
            <div className="flex items-center">
              <SidebarGroupLabel className="flex-1">
                {t(group.titleKey!)}
              </SidebarGroupLabel>
              {hasActions && group.actions && (
                  <SidebarActions
                      actions={group.actions}
                      itemTitle={t(group.titleKey!)}
                  />
              )}
            </div>
        )}
        <SidebarGroupContent>
          <SidebarMenu>
            {group.menu.map((item) => (
                <SidebarItem key={item.id} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
}