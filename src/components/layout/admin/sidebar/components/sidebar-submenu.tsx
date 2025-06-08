// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-submenu.tsx
// ============================================================================

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar'
import { Icon } from '@/components/icons'
import { SidebarBadge } from './sidebar-badge'
import { SidebarActions } from './sidebar-actions'
import { cn } from '@/lib/utils'
import type { SidebarSubmenu } from '@/types/sidebar'

interface SidebarSubmenuProps {
  submenu: SidebarSubmenu[]
  className?: string
}

export function SidebarSubmenuComponent({ submenu, className }: SidebarSubmenuProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
      <SidebarMenuSub className={cn('group-data-[collapsible=icon]:hidden', className)}>
        {submenu.map((item) => {
          const isActive = item.url === pathname
          const hasActions = item.actions && item.actions.length > 0

          return (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton asChild isActive={isActive}>
                  <Link
                      href={item.url}
                      className="flex items-center gap-2 w-full"
                      {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {item.icon && (
                        <Icon {...item.icon} className="shrink-0" />
                    )}
                    <span className="flex-1 truncate">
                  {t(item.titleKey)}
                </span>
                    {item.badge && (
                        <SidebarBadge
                            badge={item.badge}
                            className={hasActions ? 'mr-6' : ''}
                        />
                    )}
                  </Link>
                </SidebarMenuSubButton>

                {hasActions && (
                    <SidebarActions
                        actions={item.actions}
                        itemTitle={t(item.titleKey)}
                    />
                )}
              </SidebarMenuSubItem>
          )
        })}
      </SidebarMenuSub>
  )
}