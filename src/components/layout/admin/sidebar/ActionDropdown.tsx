import * as React from 'react'
import { MoreHorizontal } from 'lucide-react'
import {
    SidebarMenuAction,
} from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Icon } from '@/components/icons'
import { useSidebarActions } from '@/hooks/useSidebarActions'
import type { MenuAction } from '@/types/SidebarData'

// Enhanced action dropdown with better UX and accessibility
export const ActionDropdown = React.memo<{
    actions: MenuAction[]
    itemType: string
    itemId?: string
    itemTitle: string
    ariaLabelledby?: string
}>(({ actions, itemType, itemId, itemTitle, ariaLabelledby }) => {
    const { executeAction, isLoading, error } = useSidebarActions()
    const [isOpen, setIsOpen] = React.useState(false)

    if (!actions || actions.length === 0) return null

    const handleActionClick = React.useCallback(async (action: MenuAction) => {
        try {
            executeAction(action.actionType, {
                itemType,
                itemId,
                itemTitle,
                customHandler: action.customHandler
            })
            setIsOpen(false) // Close dropdown after successful action
        } catch (err) {
            console.error('Action failed:', err)
            // Keep dropdown open on error so user can retry
        }
    }, [executeAction, itemType, itemId, itemTitle])

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent, action: MenuAction) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleActionClick(action)
        }
    }, [handleActionClick])

    // Group actions by variant
    const { regularActions, destructiveActions } = React.useMemo(() => {
        const regular: MenuAction[] = []
        const destructive: MenuAction[] = []

        actions.forEach(action => {
            if (action.variant === 'destructive') {
                destructive.push(action)
            } else {
                regular.push(action)
            }
        })

        return { regularActions: regular, destructiveActions: destructive }
    }, [actions])

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                    aria-label={`More options for ${itemTitle}`}
                    aria-describedby={ariaLabelledby}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    className={cn(
                        "focus-visible:ring-2 focus-visible:ring-offset-2",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "transition-colors duration-150",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading}
                >
                    <MoreHorizontal
                        className={cn(
                            "h-4 w-4 transition-transform duration-150",
                            isOpen && "rotate-90"
                        )}
                        aria-hidden="true"
                    />
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="right"
                align="start"
                className="min-w-48 max-w-64"
                sideOffset={8}
                role="menu"
                aria-label={`${itemTitle} actions`}
            >
                {/* Regular actions */}
                {regularActions.map((action) => (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleActionClick(action)}
                        onKeyDown={(e) => handleKeyDown(e, action)}
                        className={cn(
                            "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                            "transition-colors duration-150",
                            isLoading && "opacity-50 cursor-not-allowed"
                        )}
                        role="menuitem"
                        disabled={isLoading}
                        aria-describedby={action.shortcut ? `${action.id}-shortcut` : undefined}
                    >
                        {action.icon && (
                            <Icon
                                {...action.icon}
                                className="mr-2 h-4 w-4 shrink-0"
                                aria-hidden="true"
                            />
                        )}
                        <span className="flex-1 truncate">{action.label}</span>
                        {action.shortcut && (
                            <kbd
                                className="ml-auto text-xs tracking-widest opacity-60 shrink-0"
                                id={`${action.id}-shortcut`}
                                aria-label={`Keyboard shortcut: ${action.shortcut}`}
                            >
                                {action.shortcut}
                            </kbd>
                        )}
                    </DropdownMenuItem>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1 text-xs text-muted-foreground flex items-center gap-2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Processing...
                        </div>
                    </>
                )}

                {/* Error display */}
                {error && !isLoading && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                            <Icon
                                name="ExclamationTriangleIcon"
                                size={12}
                                weight="regular"
                                aria-hidden="true"
                            />
                            Action failed. Please try again.
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ActionDropdown.displayName = 'ActionDropdown'