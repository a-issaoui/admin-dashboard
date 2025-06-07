'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarGroupAction,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar
} from '@/components/ui/sidebar'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@/components/ui/collapsible'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/icons'
import type { SidebarData } from '@/types/SidebarData'
import { useSidebarActions } from '@/hooks/useSidebarActions'
import { useSidebarData } from '@/hooks/useSidebarData'
import { useSidebarPersistence } from '@/hooks/useSidebarPersistence'
import { validateColor } from '@/lib/colorUtils'
import { BadgeComponent } from '@/components/layout/admin/sidebar/BadgeComponent'
import { NotificationDot } from '@/components/layout/admin/sidebar/NotificationDot'
import { ActionDropdown } from '@/components/layout/admin/sidebar/ActionDropdown'
import { SidebarErrorBoundary } from '@/components/layout/admin/sidebar/SidebarErrorBoundary'
import type { ProcessedMenu, ProcessedSubMenu, ProcessedGroup } from '@/types/ProcessedSidebarData'

// Enhanced submenu item component with better accessibility
const SubMenuItem = React.memo<{
    item: ProcessedSubMenu
    parentTitle: string
    index: number
    totalItems: number
}>(({ item, index, totalItems }) => {
    const hasActions = item.actions && item.actions.length > 0
    const itemColor = validateColor(item.color)

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton
                asChild
                isActive={item.isActive}
                className="group focus-visible:ring-2 focus-visible:ring-offset-2"
            >
                <Link
                    href={item.url}
                    aria-label={`${item.title}${item.badge?.count ? ` (${item.badge.count} items)` : ''}`}
                    aria-describedby={hasActions ? `${item.id}-actions` : undefined}
                    aria-setsize={totalItems}
                    aria-posinset={index + 1}
                >
                    {item.icon && (
                        <Icon
                            {...item.icon}
                            aria-hidden="true"
                            className="shrink-0"
                        />
                    )}
                    <span
                        style={{ color: itemColor }}
                        className="truncate"
                    >
                        {item.title}
                    </span>
                    {item.badge && (
                        <BadgeComponent
                            badge={item.badge}
                            className={hasActions ? "ml-auto mr-6" : "ml-auto"}
                            aria-label={`${item.badge.count} notifications`}
                        />
                    )}
                </Link>
            </SidebarMenuSubButton>

            {hasActions && (
                <ActionDropdown
                    actions={item.actions}
                    itemType="submenu"
                    itemId={item.id}
                    itemTitle={item.title}
                    ariaLabelledby={`${item.id}-actions`}
                />
            )}
        </SidebarMenuSubItem>
    )
})

SubMenuItem.displayName = 'SubMenuItem'

// Enhanced main menu item component
const MenuItem = React.memo<{
    menu: ProcessedMenu
    groupTitle?: string
    index: number
    totalItems: number
}>(({ menu, groupTitle, index, totalItems }) => {
    const { collapsedStates, toggleCollapsed } = useSidebarPersistence()
    const hasSubmenu = menu.submenu && menu.submenu.length > 0
    const hasActions = menu.actions && menu.actions.length > 0
    const itemType = groupTitle?.toLowerCase().replace(/\s+/g, '-') || 'menu'
    const menuColor = validateColor(menu.color)
    const dotColor = validateColor(menu.dotColor)

    // Memoized notification calculation
    const hasNotifications = React.useMemo(() => {
        if (!hasSubmenu || !menu.submenu) return false
        return menu.submenu.some(sub => {
            if (!sub.badge?.count) return false
            const count = typeof sub.badge.count === 'string'
                ? parseInt(sub.badge.count, 10)
                : sub.badge.count
            return !isNaN(count) && count > 0
        })
    }, [hasSubmenu, menu.submenu])

    // Keyboard navigation handler
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            if (hasSubmenu) {
                event.preventDefault()
                toggleCollapsed(menu.id || menu.title)
            }
        }
    }, [hasSubmenu, toggleCollapsed, menu.id, menu.title])

    const isCollapsed = collapsedStates[menu.id || menu.title] ?? !menu.hasActiveChild

    // Collapsible menu with submenu
    if (hasSubmenu) {
        return (
            <Collapsible
                open={!isCollapsed}
                onOpenChange={() => toggleCollapsed(menu.id || menu.title)}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            tooltip={menu.tooltip || menu.title}
                            isActive={menu.isActive}
                            disabled={menu.disabled}
                            className={cn(
                                "focus-visible:ring-2 focus-visible:ring-offset-2",
                                "group hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                !hasActions && "group-has-data-[sidebar=menu-action]/menu-item:pr-2"
                            )}
                            onKeyDown={handleKeyDown}
                            aria-expanded={!isCollapsed}
                            aria-controls={`submenu-${menu.id || menu.title}`}
                            aria-label={`${menu.title}${hasNotifications ? ' (has notifications)' : ''}`}
                        >
                            {menu.icon && (
                                <Icon
                                    {...menu.icon}
                                    aria-hidden="true"
                                    className="shrink-0"
                                />
                            )}
                            <span
                                style={{ color: menuColor }}
                                className="truncate flex-1"
                            >
                                {menu.title}
                            </span>
                            {hasNotifications && dotColor && (
                                <NotificationDot
                                    color={dotColor}
                                    hasNotifications={hasNotifications}
                                    aria-label="Has notifications"
                                />
                            )}
                            <ChevronRight
                                className={cn(
                                    "ml-auto shrink-0 transition-transform duration-200",
                                    "group-data-[state=open]/collapsible:rotate-90"
                                )}
                                aria-hidden="true"
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {hasActions && (
                        <ActionDropdown
                            actions={menu.actions}
                            itemType={itemType}
                            itemId={menu.id}
                            itemTitle={menu.title}
                        />
                    )}

                    <CollapsibleContent>
                        <SidebarMenuSub
                            id={`submenu-${menu.id || menu.title}`}
                            role="group"
                            aria-label={`${menu.title} submenu`}
                        >
                            {menu.submenu.map((subItem, subIndex) => (
                                <SubMenuItem
                                    key={subItem.id || subItem.title}
                                    item={subItem}
                                    parentTitle={menu.title}
                                    index={subIndex}
                                    totalItems={menu.submenu!.length}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    // Simple menu item without submenu
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!!menu.url}
                tooltip={menu.tooltip || menu.title}
                isActive={menu.isActive}
                disabled={menu.disabled}
                className={cn(
                    "focus-visible:ring-2 focus-visible:ring-offset-2",
                    "group hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !hasActions && "group-has-data-[sidebar=menu-action]/menu-item:pr-2"
                )}
                aria-setsize={totalItems}
                aria-posinset={index + 1}
            >
                {menu.url ? (
                    <Link
                        href={menu.url}
                        aria-label={`${menu.title}${menu.badge?.count ? ` (${menu.badge.count} items)` : ''}`}
                        className="flex items-center gap-2 w-full"
                    >
                        {menu.icon && (
                            <Icon
                                {...menu.icon}
                                aria-hidden="true"
                                className="shrink-0"
                            />
                        )}
                        <span
                            style={{ color: menuColor }}
                            className="truncate flex-1"
                        >
                            {menu.title}
                        </span>
                        {menu.badge && (
                            <BadgeComponent
                                badge={menu.badge}
                                className={hasActions ? "mr-6" : ""}
                                aria-label={`${menu.badge.count} items`}
                            />
                        )}
                    </Link>
                ) : (
                    <>
                        {menu.icon && (
                            <Icon
                                {...menu.icon}
                                aria-hidden="true"
                                className="shrink-0"
                            />
                        )}
                        <span
                            style={{ color: menuColor }}
                            className="truncate flex-1"
                        >
                            {menu.title}
                        </span>
                        {menu.badge && (
                            <BadgeComponent
                                badge={menu.badge}
                                className={hasActions ? "mr-6" : ""}
                                aria-label={`${menu.badge.count} items`}
                            />
                        )}
                    </>
                )}
            </SidebarMenuButton>

            {hasActions && (
                <ActionDropdown
                    actions={menu.actions}
                    itemType={itemType}
                    itemId={menu.id}
                    itemTitle={menu.title}
                />
            )}
        </SidebarMenuItem>
    )
})

MenuItem.displayName = 'MenuItem'

// Group action dropdown for groups
const GroupActionDropdown = React.memo<{ group: ProcessedGroup }>(({ group }) => {
    const { executeAction } = useSidebarActions()
    const { state } = useSidebar()
    const isCollapsed = state === 'collapsed'

    if (!group.actions || group.actions.length === 0 || isCollapsed) return null

    const handleActionClick = React.useCallback((actionType: any, actionId: string) => {
        executeAction(actionType, {
            itemType: 'group',
            itemId: group.id || actionId,
            itemTitle: group.title || 'Group'
        })
    }, [executeAction, group.id, group.title])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarGroupAction
                    aria-label={`More options for ${group.title}`}
                    className="focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                    <MoreHorizontal aria-hidden="true" />
                </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="min-w-48"
                role="menu"
                aria-label={`${group.title} actions`}
            >
                {group.actions.map((action) => (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleActionClick(action.actionType, action.id)}
                        className={cn(
                            action.variant === 'destructive' &&
                            'text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20'
                        )}
                        role="menuitem"
                    >
                        {action.icon && (
                            <Icon {...action.icon} className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="flex-1">{action.label}</span>
                        {action.shortcut && (
                            <kbd className="ml-auto text-xs tracking-widest opacity-60">
                                {action.shortcut}
                            </kbd>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

GroupActionDropdown.displayName = 'GroupActionDropdown'

// Enhanced sidebar group component
const SidebarGroupComponent = React.memo<{
    group: ProcessedGroup
    index: number
    totalGroups: number
}>(({ group, index, totalGroups }) => {
    const { state } = useSidebar()
    const { collapsedStates, toggleCollapsed } = useSidebarPersistence()
    const isCollapsed = state === 'collapsed'
    const hasActions = group.actions && group.actions.length > 0
    const groupColor = validateColor(group.color)

    const isGroupCollapsed = collapsedStates[`group-${group.id || group.title}`] ??
        (group.defaultOpen === false)

    const menuItems = React.useMemo(
        () => group.menu.map((menuItem, menuIndex) => (
            <MenuItem
                key={menuItem.id || menuItem.title}
                menu={menuItem}
                groupTitle={group.title}
                index={menuIndex}
                totalItems={group.menu.length}
            />
        )),
        [group.menu, group.title]
    )

    const content = (
        <SidebarGroupContent>
            <SidebarMenu
                role="group"
                aria-label={group.title ? `${group.title} navigation` : 'Navigation'}
            >
                {menuItems}
            </SidebarMenu>
        </SidebarGroupContent>
    )

    // Collapsible group with title
    if (group.collapsible && group.title && !isCollapsed) {
        return (
            <Collapsible
                open={!isGroupCollapsed}
                onOpenChange={() => toggleCollapsed(`group-${group.id || group.title}`)}
                className="group/collapsible-group"
            >
                <SidebarGroup
                    role="group"
                    aria-labelledby={`group-label-${group.id || index}`}
                >
                    <div className="flex items-center w-full">
                        <SidebarGroupLabel
                            asChild
                            className="flex-1"
                        >
                            <CollapsibleTrigger
                                className="group flex items-center justify-between w-full px-2 py-2 focus-visible:ring-2 focus-visible:ring-offset-2"
                                aria-expanded={!isGroupCollapsed}
                                aria-controls={`group-content-${group.id || index}`}
                            >
                                <span
                                    style={{ color: groupColor }}
                                    id={`group-label-${group.id || index}`}
                                    className="truncate"
                                >
                                    {group.title}
                                </span>
                                <Icon
                                    name="CaretCircleRightIcon"
                                    size={16}
                                    weight="duotone"
                                    color={groupColor || 'currentColor'}
                                    className={cn(
                                        "shrink-0 transition-transform duration-200",
                                        "group-data-[state=open]/collapsible-group:rotate-90",
                                        hasActions ? "mr-6" : ""
                                    )}
                                    aria-hidden="true"
                                />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        {hasActions && <GroupActionDropdown group={group} />}
                    </div>
                    <CollapsibleContent id={`group-content-${group.id || index}`}>
                        {content}
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        )
    }

    // Standard group
    return (
        <SidebarGroup
            role="group"
            aria-labelledby={group.title ? `group-label-${group.id || index}` : undefined}
        >
            {group.title && !isCollapsed && (
                <div className="flex items-center w-full">
                    <SidebarGroupLabel
                        className="flex-1 truncate"
                        style={{ color: groupColor }}
                        id={`group-label-${group.id || index}`}
                    >
                        {group.title}
                    </SidebarGroupLabel>
                    {hasActions && <GroupActionDropdown group={group} />}
                </div>
            )}
            {content}
        </SidebarGroup>
    )
})

SidebarGroupComponent.displayName = 'SidebarGroupComponent'

// Main component with error boundary
interface AppSidebarMenuProps {
    data: SidebarData
    className?: string
}

const AppSidebarMenu = React.memo<AppSidebarMenuProps>(({ data, className }) => {
    const pathname = usePathname()
    const processedData = useSidebarData(data, pathname)

    const groupComponents = React.useMemo(
        () => processedData.map((group, index) => (
            <SidebarGroupComponent
                key={group.id || group.title || `group-${index}`}
                group={group}
                index={index}
                totalGroups={processedData.length}
            />
        )),
        [processedData]
    )

    return (
        <SidebarErrorBoundary>
            <SidebarContent
                className={className}
                role="navigation"
                aria-label="Main navigation"
            >
                {groupComponents}
            </SidebarContent>
        </SidebarErrorBoundary>
    )
})

AppSidebarMenu.displayName = 'AppSidebarMenu'

export default AppSidebarMenu