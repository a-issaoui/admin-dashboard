'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icon } from '@/components/icons'
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
import { useSidebarStore, useIsRTL } from '@/lib/stores'
import { a11y } from '@/lib/accessibility'
import { cn } from '@/lib/utils'
import type { SidebarMenuItem as SidebarMenuItemType, SidebarSubmenu } from '@/types/sidebar'
import { SidebarActions } from './sidebar-actions'
import { SidebarBadge } from './sidebar-badge'

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

// Memoized icon component to prevent unnecessary re-renders
const ItemIcon = React.memo(function ItemIcon({
                                                  icon,
                                                  className
                                              }: {
    icon?: any
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
    badge?: any
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

// Memoized actions component with accessibility enhancements
const ItemActions = React.memo(function ItemActions({
                                                        actions,
                                                        title,
                                                        itemId,
                                                        className
                                                    }: {
    actions?: any[]
    title: string
    itemId: string
    className?: string
}) {
    if (!actions?.length) return null

    return (
        <SidebarActions
            actions={actions}
            itemTitle={title}
            className={className}
            aria-label={`Actions for ${title}`}
        />
    )
})

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
        >
            {submenu.map((subItem) => {
                const isSubActive = subItem.url === pathname
                const subTitle = t(subItem.titleKey)

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
                                    hasActions={Boolean(subItem.actions?.length)}
                                />
                            </Link>
                        </SidebarMenuSubButton>

                        <ItemActions
                            actions={subItem.actions}
                            title={subTitle}
                            itemId={subItem.id}
                        />
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

    // Generate stable IDs for accessibility
    const [submenuId] = React.useState(() => a11y.generateId(`submenu-${item.id}`))
    const [triggerId] = React.useState(() => a11y.generateId(`trigger-${item.id}`))

    // Memoize all computed state to prevent unnecessary recalculations
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

    // Memoized toggle handler with performance optimization
    const handleToggle = React.useCallback(() => {
        toggleCollapsed(item.id)

        // Announce state change to screen readers
        const message = computedState.isCollapsed
            ? `${computedState.title} menu expanded`
            : `${computedState.title} menu collapsed`
        a11y.announceToScreenReader(message, 'polite')
    }, [toggleCollapsed, item.id, computedState.title, computedState.isCollapsed])

    // Memoized keyboard event handler for accessibility
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        a11y.handleKeyboardNavigation(event, {
            onEnter: () => {
                if (computedState.hasSubmenu) {
                    handleToggle()
                } else if (item.url) {
                    window.location.href = item.url
                }
            },
            onSpace: () => {
                if (computedState.hasSubmenu) {
                    handleToggle()
                }
            },
            onArrowRight: () => {
                if (computedState.hasSubmenu && computedState.isCollapsed && !isRTL) {
                    handleToggle()
                }
            },
            onArrowLeft: () => {
                if (computedState.hasSubmenu && !computedState.isCollapsed && !isRTL) {
                    handleToggle()
                }
            }
        })
    }, [computedState, handleToggle, item.url, isRTL])

    // Memoized link content for regular menu items
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

    // Memoized collapsible trigger content
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

    // Handle items with submenus using collapsible pattern
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

                    <ItemActions
                        actions={item.actions}
                        title={computedState.title}
                        itemId={item.id}
                    />

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

    // Handle regular menu items with optional links
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

            <ItemActions
                actions={item.actions}
                title={computedState.title}
                itemId={item.id}
            />
        </SidebarMenuItem>
    )
})

// Display name for debugging purposes
SidebarItem.displayName = 'SidebarItem'