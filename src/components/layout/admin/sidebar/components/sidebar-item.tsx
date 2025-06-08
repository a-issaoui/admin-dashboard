// ============================================================================
// ISSUE: Translation keys are being doubled (nav.nav.home)
// SOLUTION: Fix useTranslations namespace and titleKey format
// ============================================================================

// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-item.tsx (FIXED)
// ============================================================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import { Icon } from '@/components/icons'
import { SidebarBadge } from './sidebar-badge'
import { SidebarActions } from './sidebar-actions'
import { SidebarSubmenuComponent } from './sidebar-submenu'
import { useSidebarStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemType } from '@/types/sidebar'

interface SidebarItemProps {
  item: SidebarMenuItemType
  className?: string
}

export function SidebarItem({ item, className }: SidebarItemProps) {
  // FIX: Use 'nav' namespace correctly - don't add it to titleKey
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { collapsedStates, toggleCollapsed } = useSidebarStore()

  const hasSubmenu = item.submenu && item.submenu.length > 0
  const hasActions = item.actions && item.actions.length > 0
  const isActive = item.url === pathname
  const hasActiveChild = hasSubmenu && item.submenu!.some(sub => sub.url === pathname)
  const isCollapsed = collapsedStates[item.id] ?? !item.defaultExpanded

  // Calculate if item has notifications
  const hasNotifications = React.useMemo(() => {
    if (!hasSubmenu || !item.submenu) return false
    return item.submenu.some(sub => {
      if (!sub.badge?.count) return false
      const count = typeof sub.badge.count === 'string'
          ? parseInt(sub.badge.count, 10)
          : sub.badge.count
      return !isNaN(count) && count > 0
    })
  }, [hasSubmenu, item.submenu])

  // Collapsible item with submenu
  if (hasSubmenu) {
    return (
        <Collapsible
            open={!isCollapsed}
            onOpenChange={() => toggleCollapsed(item.id)}
            className="group/collapsible"
        >
          <SidebarMenuItem className={className}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                  isActive={isActive || hasActiveChild}
                  disabled={item.disabled}
                  className={cn(
                      'group focus-visible:ring-2 focus-visible:ring-offset-2',
                      !hasActions && 'group-has-data-[sidebar=menu-action]/menu-item:pr-2'
                  )}
              >
                {item.icon && (
                    <Icon {...item.icon} className="shrink-0" />
                )}
                <span className="flex-1 truncate">
                {/* FIX: titleKey should NOT include 'nav.' prefix */}
                  {t(item.titleKey)}
              </span>
                {hasNotifications && (
                    <div className="h-2 w-2 bg-red-500 rounded-full shrink-0" />
                )}
                <ChevronRight
                    className={cn(
                        'ml-auto h-4 w-4 shrink-0 transition-transform duration-200',
                        'group-data-[state=open]/collapsible:rotate-90'
                    )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            {hasActions && (
                <SidebarActions
                    actions={item.actions}
                    itemTitle={t(item.titleKey)}
                />
            )}

            <CollapsibleContent>
              <SidebarSubmenuComponent
                  submenu={item.submenu!}
                  parentTitle={t(item.titleKey)}
              />
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
    )
  }

  // Simple item without submenu
  return (
      <SidebarMenuItem className={className}>
        <SidebarMenuButton
            asChild={!!item.url}
            isActive={isActive}
            disabled={item.disabled}
            className={cn(
                'group focus-visible:ring-2 focus-visible:ring-offset-2',
                !hasActions && 'group-has-data-[sidebar=menu-action]/menu-item:pr-2'
            )}
        >
          {item.url ? (
              <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                  {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <ItemContent item={item} hasActions={hasActions} />
              </Link>
          ) : (
              <ItemContent item={item} hasActions={hasActions} />
          )}
        </SidebarMenuButton>

        {hasActions && (
            <SidebarActions
                actions={item.actions}
                itemTitle={t(item.titleKey)}
            />
        )}
      </SidebarMenuItem>
  )
}

// Helper component to avoid duplication
function ItemContent({
                       item,
                       hasActions
                     }: {
  item: SidebarMenuItemType
  hasActions: boolean
}) {
  const t = useTranslations('nav')

  return (
      <>
        {item.icon && (
            <Icon {...item.icon} className="shrink-0" />
        )}
        <span className="flex-1 truncate">
        {/* FIX: titleKey should NOT include 'nav.' prefix */}
          {t(item.titleKey)}
      </span>
        {item.badge && (
            <SidebarBadge
                badge={item.badge}
                className={hasActions ? 'mr-6' : ''}
            />
        )}
      </>
  )
}