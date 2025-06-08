// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-actions.tsx - FIXED
// ============================================================================

'use client'

import { MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { toast } from 'sonner'
import { Icon } from '@/components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/ui/sidebar'
import { useLocaleStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { MenuAction } from '@/types/sidebar'

interface SidebarActionsProps {
  actions: MenuAction[]
  itemTitle: string
  className?: string
}

export function SidebarActions({ actions, itemTitle, className }: SidebarActionsProps) {
  const t = useTranslations('actions')
  const tCommon = useTranslations('common')
  const tSidebar = useTranslations('sidebar')
  const { isRTL } = useLocaleStore()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleActionClick = React.useCallback(async (action: MenuAction) => {
    if (action.disabled || isLoading) return

    // Show confirmation for destructive actions
    if (action.variant === 'destructive') {
      const confirmed = window.confirm(`${t(action.type)} ${itemTitle}?`)
      if (!confirmed) return
    }

    setIsLoading(true)

    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success(`${t(action.type)} ${tCommon('success')}`)
      setIsOpen(false)
    } catch {
      toast.error(`${t(action.type)} ${tCommon('error')}`)
    } finally {
      setIsLoading(false)
    }
  }, [t, tCommon, itemTitle, isLoading])

  if (!actions.length) return null

  const regularActions = actions.filter(action => action.variant !== 'destructive')
  const destructiveActions = actions.filter(action => action.variant === 'destructive')

  return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
              aria-label={tSidebar('moreOptions')}
              className={cn(
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isLoading && 'opacity-50 cursor-not-allowed',
                  className
              )}
              disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            side={isRTL() ? 'left' : 'right'}
            align="start"
            className="min-w-48"
            sideOffset={8}
        >
          {/* Regular actions */}
          {regularActions.map((action) => (
              <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled || isLoading}
                  className={cn(
                      'cursor-pointer gap-2',
                      isRTL() && 'flex-row-reverse'
                  )}
              >
                {action.icon && (
                    <Icon {...action.icon} className="h-4 w-4" />
                )}
                <span className="flex-1">{action.label || t(action.type)}</span>
                {action.shortcut && (
                    <kbd className="text-xs opacity-60">{action.shortcut}</kbd>
                )}
              </DropdownMenuItem>
          ))}

          {/* Separator if both types exist */}
          {regularActions.length > 0 && destructiveActions.length > 0 && (
              <DropdownMenuSeparator />
          )}

          {/* Destructive actions */}
          {destructiveActions.map((action) => (
              <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled || isLoading}
                  className={cn(
                      'cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20',
                      isRTL() && 'flex-row-reverse'
                  )}
              >
                {action.icon && (
                    <Icon {...action.icon} className="h-4 w-4" />
                )}
                <span className="flex-1">{action.label || t(action.type)}</span>
                {action.shortcut && (
                    <kbd className="text-xs opacity-60">{action.shortcut}</kbd>
                )}
              </DropdownMenuItem>
          ))}

          {/* Loading state */}
          {isLoading && (
              <>
                <DropdownMenuSeparator />
                <div className={cn(
                    'px-2 py-1 text-xs text-muted-foreground flex items-center gap-2',
                    isRTL() && 'flex-row-reverse'
                )}>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {tSidebar('processing')}
                </div>
              </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  )
}