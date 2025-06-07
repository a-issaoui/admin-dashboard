import * as React from 'react'
import type { SidebarData } from '@/types/SidebarData'
import type { ProcessedGroup, ProcessedMenu, ProcessedSubMenu } from '@/types/ProcessedSidebarData'

/**
 * Custom hook to process sidebar data with active states
 * Optimized to reduce unnecessary recalculations
 */
export const useSidebarData = (
    data: SidebarData,
    pathname: string
): ProcessedGroup[] => {
    // Memoize the processed data structure
    const processedData = React.useMemo((): ProcessedGroup[] => {
        return data.map(group => {
            const processedMenu = group.menu.map(menu => {
                // Process submenu items first
                const processedSubmenu: ProcessedSubMenu[] | undefined = menu.submenu?.map(sub => ({
                    ...sub,
                    isActive: sub.url === pathname
                }))

                // Check if any submenu item is active
                const hasActiveChild = processedSubmenu?.some(sub => sub.isActive) ?? false

                // Determine if main menu item is active
                // FIXED: Menu item should only be active if directly visited, not when children are active
                // This prevents the parent from being highlighted when a child is selected
                const isActive = menu.url === pathname

                return {
                    ...menu,
                    isActive,
                    hasActiveChild,
                    submenu: processedSubmenu
                } as ProcessedMenu
            })

            return {
                ...group,
                menu: processedMenu
            } as ProcessedGroup
        })
    }, [data, pathname])

    return processedData
}



/**
 * Enhanced sidebar actions hook with loading states and error handling
 */
export const useSidebarActions = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const executeAction = React.useCallback(async (
        actionType: string,
        context: {
            itemType: string
            itemId?: string
            itemTitle: string
            customHandler?: string
        }
    ) => {
        setIsLoading(true)
        setError(null)

        try {
            // Clear any previous errors
            await new Promise(resolve => setTimeout(resolve, 100)) // Simulate async operation

            switch (actionType) {
                case 'refresh':
                    await handleRefresh(context)
                    break
                case 'export':
                    await handleExport(context)
                    break
                case 'import':
                    await handleImport(context)
                    break
                case 'create':
                    await handleCreate(context)
                    break
                case 'edit':
                    await handleEdit(context)
                    break
                case 'delete':
                    await handleDelete(context)
                    break
                case 'settings':
                    await handleSettings(context)
                    break
                case 'archive':
                    await handleArchive(context)
                    break
                case 'mark-read':
                    await handleMarkRead(context)
                    break
                case 'clear-all':
                    await handleClearAll(context)
                    break
                default:
                    if (context.customHandler) {
                        await handleCustomAction(context.customHandler, context)
                    } else {
                        throw new Error(`Unknown action type: ${actionType}`)
                    }
            }

            // Show success feedback
            console.log(`Action ${actionType} completed successfully for ${context.itemTitle}`)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
            setError(errorMessage)
            console.error(`Action ${actionType} failed:`, err)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        executeAction,
        isLoading,
        error,
        clearError: () => setError(null)
    }
}

// Action handlers
async function handleRefresh(context: any) {
    console.log('Refreshing:', context.itemTitle)
    // Implement refresh logic
}

async function handleExport(context: any) {
    console.log('Exporting:', context.itemTitle)
    // Implement export logic
}

async function handleImport(context: any) {
    console.log('Importing:', context.itemTitle)
    // Implement import logic
}

async function handleCreate(context: any) {
    console.log('Creating:', context.itemTitle)
    // Implement create logic
}

async function handleEdit(context: any) {
    console.log('Editing:', context.itemTitle)
    // Implement edit logic
}

async function handleDelete(context: any) {
    console.log('Deleting:', context.itemTitle)
    // Implement delete logic with confirmation
    const confirmed = window.confirm(`Are you sure you want to delete ${context.itemTitle}?`)
    if (!confirmed) {
        throw new Error('Delete action was cancelled')
    }
}

async function handleSettings(context: any) {
    console.log('Opening settings for:', context.itemTitle)
    // Implement settings logic
}

async function handleArchive(context: any) {
    console.log('Archiving:', context.itemTitle)
    // Implement archive logic
}

async function handleMarkRead(context: any) {
    console.log('Marking as read:', context.itemTitle)
    // Implement mark as read logic
}

async function handleClearAll(context: any) {
    console.log('Clearing all for:', context.itemTitle)
    // Implement clear all logic with confirmation
    const confirmed = window.confirm(`Are you sure you want to clear all items for ${context.itemTitle}?`)
    if (!confirmed) {
        throw new Error('Clear all action was cancelled')
    }
}

async function handleCustomAction(handlerName: string, context: any) {
    console.log(`Executing custom action ${handlerName} for:`, context.itemTitle)
    // Implement custom action logic
    // This could dispatch to a plugin system or external handlers
}