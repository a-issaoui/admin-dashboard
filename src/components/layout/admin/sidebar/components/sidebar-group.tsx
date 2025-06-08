// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-group.tsx - OPTIMIZED
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
import { useExpensiveMemo, useRenderPerformance } from '@/hooks/use-performance'
import { useSidebarStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { SidebarGroup as SidebarGroupType } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarItem } from './sidebar-item'

interface SidebarGroupProps {
  group: SidebarGroupType
  className?: string
}

export const SidebarGroupComponent = React.memo(function SidebarGroupComponent({
                                                                                 group,
                                                                                 className
                                                                               }: SidebarGroupProps) {
  // OPTIMIZED: Monitor render performance
  useRenderPerformance(`SidebarGroup-${group.id}`)

  const t = useTranslations('nav')
  const { state } = useSidebar()
  const { collapsedStates, toggleCollapsed } = useSidebarStore()

  // OPTIMIZED: Memoize expensive computations
  const computedState = useExpensiveMemo(() => {
        const isCollapsed = state === 'collapsed'
        const hasActions = group.actions && group.actions.length > 0
        const isGroupCollapsed = collapsedStates[`group-${group.id}`] ?? !group.defaultOpen
        const showTitle = group.titleKey && !isCollapsed
        const title = group.titleKey ? t(group.titleKey) : ''

        return {
          isCollapsed,
          hasActions,
          isGroupCollapsed,
          showTitle,
          title
        }
      }, [state, group.actions, group.defaultOpen, group.titleKey, collapsedStates, group.id, t],
      `sidebarGroup-${group.id}-state`)

  // OPTIMIZED: Memoize toggle handler
  const handleToggle = React.useCallback(() => {
    toggleCollapsed(`group-${group.id}`)
  }, [toggleCollapsed, group.id])

  // OPTIMIZED: Memoize menu items to prevent unnecessary re-renders
  const menuItems = useExpensiveMemo(() =>
          group.menu.map((item) => (
              <SidebarItem key={item.id} item={item} />
          )),
      [group.menu],
      `menuItems-${group.id}`
  )

  // OPTIMIZED: Memoize collapsible trigger content
  const triggerContent = useExpensiveMemo(() => (
      <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2">
        <span className="truncate">{computedState.title}</span>
        <ChevronRight
            className={cn(
                'h-4 w-4 shrink-0 transition-transform duration-200',
                'group-data-[state=open]/collapsible-group:rotate-90',
                computedState.hasActions && 'mr-6'
            )}
        />
      </CollapsibleTrigger>
  ), [computedState.title, computedState.hasActions])

  // OPTIMIZED: Memoize group label content
  const groupLabelContent = useExpensiveMemo(() => (
      <div className="flex items-center">
        <SidebarGroupLabel className="flex-1">
          {computedState.title}
        </SidebarGroupLabel>
        {computedState.hasActions && group.actions && (
            <SidebarActions
                actions={group.actions}
                itemTitle={computedState.title}
            />
        )}
      </div>
  ), [computedState.title, computedState.hasActions, group.actions])

  // Collapsible group
  if (group.collapsible && computedState.showTitle) {
    return (
        <Collapsible
            open={!computedState.isGroupCollapsed}
            onOpenChange={handleToggle}
            className="group/collapsible-group"
        >
          <SidebarGroup className={className}>
            <SidebarGroupLabel asChild className="flex-1">
              {triggerContent}
            </SidebarGroupLabel>
            {computedState.hasActions && group.actions && (
                <SidebarActions
                    actions={group.actions}
                    itemTitle={computedState.title}
                />
            )}

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems}
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
        {computedState.showTitle && groupLabelContent}
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
  )
})