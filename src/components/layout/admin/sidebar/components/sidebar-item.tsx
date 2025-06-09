// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-item.tsx
// ============================================================================

'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icon, IconProps } from '@/components/icons'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@/components/ui/collapsible'
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from '@/components/ui/sidebar'
import { accessibilityCore } from '@/lib/accessibility/core'
import { useSidebarStore } from '@/lib/stores/sidebar-store'
import { useIsRTL } from '@/lib/stores/locale-store'
import { cn } from '@/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemType, SidebarSubmenu, MenuAction, Badge } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarBadge } from './sidebar-badge'

// Placeholder for missing accessibility helper
const a11y = {
    generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`,
    handleKeyboardNavigation: (event: React.KeyboardEvent, handlers: Record<string, () => void>) => {
        if (handlers[event.key]) {
            handlers[event.key]();
        }
    },
    announceToScreenReader: (message: string, priority: 'polite' | 'assertive') => {
        accessibilityCore.updateAriaLiveRegion(message, priority);
    }
};

interface SidebarItemProps {
    item: SidebarMenuItemType
    className?: string
    level?: number
}

interface ComputedItemState {
    hasSubmenu: boolean
    hasActions: boolean
    isActive: boolean
    hasActiveChild: boolean
    title: string
    isCollapsed: boolean
    ariaExpanded: boolean | undefined
    ariaControls: string | undefined
}

interface ItemActionsProps {
    actions: MenuAction[];
    title: string;
    itemId: string;
    className?: string;
}

// Memoized icon component to prevent unnecessary re-renders
const ItemIcon = React.memo(function ItemIcon({
                                                  icon,
                                                  className
                                              }: {
    icon?: IconProps
    className?: string
}) {
    if (!icon) return null
    return <Icon {...icon} className={cn("shrink-0", className)} />
})

// Memoized badge component with proper display logic
const ItemBadge = React.memo(function ItemBadge({
                                                    badge,
                                                    hasActions,
                                                    className
                                                }: {
    badge?: Badge
    hasActions?: boolean
    className?: string
}) {
    if (!badge) return null

    return (
        <SidebarBadge
            badge={badge}
            className={cn(
                hasActions && "mr-6", // Provide space for actions menu
                className
            )}
        />
    )
})

const ItemActions = React.memo(function ItemActions({
                                                        actions,
                                                        title,
                                                        itemId,
                                                        className
                                                    }:ItemActionsProps) {
    return (
        <SidebarActions
            actions={actions}
            itemTitle={title}
            className={className}
            aria-label={`Actions for ${title}`}
        />
    )
});

// Memoized submenu component with performance optimizations
const SubmenuItems = React.memo(function SubmenuItems({
                                                          submenu,
                                                          level = 1
                                                      }: {
    submenu: SidebarSubmenu[]
    level?: number
}) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const isRTL = useIsRTL()

    return (
        <SidebarMenuSub
            className={cn(
                "group-data-[collapsible=icon]:hidden",
                isRTL && "border-r border-l-0 mr-3.5 ml-0 pr-2.5 pl-0"
            )}
            style={{ '--level': level } as React.CSSProperties}
        >
            {submenu.map((subItem) => {
                const isSubActive = subItem.url === pathname
                const subTitle = t(subItem.titleKey)
                const hasSubActions = Boolean(subItem.actions?.length)

                return (
                    <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn(
                                "focus-visible:ring-2 focus-visible:ring-offset-2",
                                isRTL && "flex-row-reverse"
                            )}
                        >
                            <Link
                                href={subItem.url}
                                className="flex items-center gap-2 w-full"
                                {...(subItem.external && {
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                    'aria-label': `${subTitle} (opens in new tab)`
                                })}
                                aria-current={isSubActive ? 'page' : undefined}
                            >
                                <ItemIcon icon={subItem.icon} />
                                <span className="flex-1 truncate">{subTitle}</span>
                                <ItemBadge
                                    badge={subItem.badge}
                                    hasActions={hasSubActions}
                                />
                            </Link>
                        </SidebarMenuSubButton>

                        {hasSubActions && subItem.actions && (
                            <ItemActions
                                actions={subItem.actions}
                                title={subTitle}
                                itemId={subItem.id}
                            />
                        )}
                    </SidebarMenuSubItem>
                )
            })}
        </SidebarMenuSub>
    )
})

// Main sidebar item component with comprehensive optimization
export const SidebarItem = React.memo(function SidebarItem({
                                                               item,
                                                               className,
                                                               level = 0
                                                           }: SidebarItemProps) {
    const t = useTranslations('nav')
    const pathname = usePathname()
    const isRTL = useIsRTL()
    const toggleCollapsed = useSidebarStore(state => state.toggleCollapsed)
    const isCollapsed = useSidebarStore(state =>
        state.collapsedStates[item.id] ?? !item.defaultExpanded
    )

    const [submenuId] = React.useState(() => a11y.generateId(`submenu-${item.id}`))
    const [triggerId] = React.useState(() => a11y.generateId(`trigger-${item.id}`))

    const computedState = React.useMemo((): ComputedItemState => {
        const hasSubmenu = Boolean(item.submenu?.length)
        const hasActions = Boolean(item.actions?.length)
        const isActive = item.url === pathname
        const hasActiveChild = hasSubmenu &&
            item.submenu!.some(sub => sub.url === pathname)
        const title = t(item.titleKey)

        return {
            hasSubmenu,
            hasActions,
            isActive,
            hasActiveChild,
            title,
            isCollapsed,
            ariaExpanded: hasSubmenu ? !isCollapsed : undefined,
            ariaControls: hasSubmenu ? submenuId : undefined
        }
    }, [item, pathname, t, isCollapsed, submenuId])

    const handleToggle = React.useCallback(() => {
        toggleCollapsed(item.id)
        const message = computedState.isCollapsed
            ? `${computedState.title} menu expanded`
            : `${computedState.title} menu collapsed`
        a11y.announceToScreenReader(message, 'polite')
    }, [toggleCollapsed, item.id, computedState.title, computedState.isCollapsed])

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        a11y.handleKeyboardNavigation(event, {
            Enter: () => {
                if (computedState.hasSubmenu) {
                    handleToggle()
                } else if (item.url) {
                    window.location.href = item.url
                }
            },
            ' ': () => {
                if (computedState.hasSubmenu) {
                    handleToggle()
                }
            },
            ArrowRight: () => {
                if (computedState.hasSubmenu && computedState.isCollapsed && !isRTL) {
                    handleToggle()
                }
            },
            ArrowLeft: () => {
                if (computedState.hasSubmenu && !computedState.isCollapsed && !isRTL) {
                    handleToggle()
                }
            }
        })
    }, [computedState, handleToggle, item.url, isRTL])

    const linkContent = React.useMemo(() => (
        <div className={cn(
            "flex items-center gap-2 w-full",
            isRTL && "flex-row-reverse"
        )}>
            <ItemIcon icon={item.icon} />
            <span className="flex-1 truncate">{computedState.title}</span>
            <ItemBadge
                badge={item.badge}
                hasActions={computedState.hasActions}
            />
        </div>
    ), [item.icon, item.badge, computedState.title, computedState.hasActions, isRTL])

    const triggerContent = React.useMemo(() => (
        <div className={cn(
            "flex items-center gap-2 w-full",
            isRTL && "flex-row-reverse"
        )}>
            <ItemIcon icon={item.icon} />
            <span className="flex-1 truncate">{computedState.title}</span>
            <ChevronRight
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-200',
                    'group-data-[state=open]/collapsible:rotate-90',
                    isRTL && 'group-data-[state=open]/collapsible:-rotate-90',
                    computedState.hasActions && 'mr-6'
                )}
                aria-hidden="true"
            />
        </div>
    ), [item.icon, computedState.title, computedState.hasActions, isRTL])

    if (computedState.hasSubmenu) {
        return (
            <Collapsible
                open={!computedState.isCollapsed}
                onOpenChange={handleToggle}
                className="group/collapsible"
            >
                <SidebarMenuItem className={className}>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            id={triggerId}
                            isActive={computedState.isActive || computedState.hasActiveChild}
                            disabled={item.disabled}
                            className={cn(
                                "group focus-visible:ring-2 focus-visible:ring-offset-2 w-full",
                                item.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            onKeyDown={handleKeyDown}
                            aria-expanded={computedState.ariaExpanded}
                            aria-controls={computedState.ariaControls}
                            aria-label={`${computedState.title} menu, ${
                                computedState.isCollapsed ? 'collapsed' : 'expanded'
                            }`}
                        >
                            {triggerContent}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {computedState.hasActions && item.actions && (
                        <ItemActions
                            actions={item.actions}
                            title={computedState.title}
                            itemId={item.id}
                        />
                    )}

                    <CollapsibleContent>
                        <div id={submenuId} role="group" aria-label={`${computedState.title} submenu`}>
                            <SubmenuItems
                                submenu={item.submenu!}
                                level={level + 1}
                            />
                        </div>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem className={className}>
            <SidebarMenuButton
                asChild={!!item.url}
                isActive={computedState.isActive}
                disabled={item.disabled}
                className={cn(
                    "group focus-visible:ring-2 focus-visible:ring-offset-2",
                    item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onKeyDown={handleKeyDown}
                aria-current={computedState.isActive ? 'page' : undefined}
                aria-label={computedState.title}
            >
                {item.url ? (
                    <Link
                        href={item.url}
                        className={cn(
                            "flex items-center gap-2 w-full",
                            isRTL && "flex-row-reverse"
                        )}
                        {...(item.external && {
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            'aria-label': `${computedState.title} (opens in new tab)`
                        })}
                        tabIndex={item.disabled ? -1 : undefined}
                    >
                        {linkContent}
                    </Link>
                ) : (
                    <div className={cn(
                        "flex items-center gap-2 w-full",
                        isRTL && "flex-row-reverse"
                    )}>
                        {linkContent}
                    </div>
                )}
            </SidebarMenuButton>

            {computedState.hasActions && item.actions && (
                <ItemActions
                    actions={item.actions}
                    title={computedState.title}
                    itemId={item.id}
                />
            )}
        </SidebarMenuItem>
    )
})

SidebarItem.displayName = 'SidebarItem'