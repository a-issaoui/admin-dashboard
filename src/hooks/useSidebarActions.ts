// hooks/useSidebarActions.ts
'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // or your preferred toast library

export type ActionType =
    | 'edit'
    | 'delete'
    | 'duplicate'
    | 'archive'
    | 'export'
    | 'import'
    | 'create'
    | 'refresh'
    | 'settings'
    | 'mark-read'
    | 'clear-all'
    | 'approve'
    | 'reject'
    | 'pause'
    | 'resume'

export interface ActionContext {
    itemType: string
    itemId?: string
    itemTitle: string
}

export const useSidebarActions = () => {
    const router = useRouter()

    const executeAction = useCallback((
        actionType: ActionType,
        context: ActionContext,
        customHandler?: () => void
    ) => {
        // If a custom handler is provided, use it
        if (customHandler) {
            customHandler()
            return
        }

        // Default action handlers
        switch (actionType) {
            case 'edit':
                handleEdit(context)
                break
            case 'delete':
                handleDelete(context)
                break
            case 'duplicate':
                handleDuplicate(context)
                break
            case 'archive':
                handleArchive(context)
                break
            case 'export':
                handleExport(context)
                break
            case 'import':
                handleImport(context)
                break
            case 'create':
                handleCreate(context)
                break
            case 'refresh':
                handleRefresh(context)
                break
            case 'settings':
                handleSettings(context)
                break
            case 'mark-read':
                handleMarkRead(context)
                break
            case 'clear-all':
                handleClearAll(context)
                break
            case 'approve':
                handleApprove(context)
                break
            case 'reject':
                handleReject(context)
                break
            case 'pause':
                handlePause(context)
                break
            case 'resume':
                handleResume(context)
                break
            default:
                console.warn(`Unknown action type: ${actionType}`)
        }
    }, [router])

    // Individual action handlers with group support
    const handleEdit = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Edit group: ${context.itemTitle}`)
            // Add group edit logic here
        } else {
            toast.info(`Edit ${context.itemTitle}`)
            // Add your edit logic here
            // router.push(`/admin/${context.itemType}/edit/${context.itemId}`)
        }
    }, [router])

    const handleDelete = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.error(`Delete all in ${context.itemTitle}?`)
            // Add group delete confirmation logic
        } else {
            toast.error(`Delete ${context.itemTitle}`)
            // Add confirmation dialog and delete logic here
            // if (confirm(`Are you sure you want to delete ${context.itemTitle}?`)) {
            //     // Delete logic
            // }
        }
    }, [])

    const handleDuplicate = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.success(`Duplicate all items in ${context.itemTitle}`)
            // Add group duplicate logic
        } else {
            toast.success(`Duplicate ${context.itemTitle}`)
            // Add duplicate logic here
        }
    }, [])

    const handleArchive = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Archive all in ${context.itemTitle}`)
            // Add group archive logic
        } else {
            toast.info(`Archive ${context.itemTitle}`)
            // Add archive logic here
        }
    }, [])

    const handleExport = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Export all data from ${context.itemTitle}`)
            // Add group export logic - could export all data from the group
            // Example: exportGroupData(context.itemTitle)
        } else {
            toast.info(`Export ${context.itemTitle}`)
            // Add export logic here
        }
    }, [])

    const handleImport = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Import data to ${context.itemTitle}`)
            // Add group import logic
        } else {
            toast.info(`Import to ${context.itemTitle}`)
            // Add import logic here
        }
    }, [])

    const handleCreate = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Create new item in ${context.itemTitle}`)
            // Navigate to create page for the group
            // router.push(`/admin/${context.itemTitle.toLowerCase()}/create`)
        } else {
            toast.info(`Create new ${context.itemTitle}`)
            // router.push(`/admin/${context.itemType}/create`)
        }
    }, [router])

    const handleRefresh = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Refresh all data in ${context.itemTitle}`)
            // Refresh all data in the group
            // Example: refreshGroupData(context.itemTitle)
        } else {
            toast.info(`Refresh ${context.itemTitle}`)
            // Add refresh logic here
            // router.refresh()
        }
    }, [router])

    const handleSettings = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`${context.itemTitle} Group Settings`)
            // Navigate to group settings
            // router.push(`/admin/settings/${context.itemTitle.toLowerCase()}`)
        } else {
            toast.info(`${context.itemTitle} Settings`)
            // router.push(`/admin/${context.itemType}/settings`)
        }
    }, [router])

    const handleMarkRead = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.success(`Mark all items in ${context.itemTitle} as read`)
            // Mark all items in group as read
        } else {
            toast.success(`Mark ${context.itemTitle} as read`)
            // Add mark as read logic here
        }
    }, [])

    const handleClearAll = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.warning(`Clear all data in ${context.itemTitle}`)
            // Clear all data in group with confirmation
        } else {
            toast.warning(`Clear all ${context.itemTitle}`)
            // Add clear all logic here
        }
    }, [])

    const handleApprove = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.success(`Approve all pending in ${context.itemTitle}`)
            // Approve all pending items in group
        } else {
            toast.success(`Approve ${context.itemTitle}`)
            // Add approval logic here
        }
    }, [])

    const handleReject = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.error(`Reject all pending in ${context.itemTitle}`)
            // Reject all pending items in group
        } else {
            toast.error(`Reject ${context.itemTitle}`)
            // Add rejection logic here
        }
    }, [])

    const handlePause = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.warning(`Pause all active in ${context.itemTitle}`)
            // Pause all active items in group
        } else {
            toast.warning(`Pause ${context.itemTitle}`)
            // Add pause logic here
        }
    }, [])

    const handleResume = useCallback((context: ActionContext) => {
        if (context.itemType === 'group') {
            toast.info(`Resume all paused in ${context.itemTitle}`)
            // Resume all paused items in group
        } else {
            toast.info(`Resume ${context.itemTitle}`)
            // Add resume logic here
        }
    }, [])

    return {
        executeAction,
        // Expose individual handlers if needed
        handleEdit,
        handleDelete,
        handleDuplicate,
        handleArchive,
        handleExport,
        handleImport,
        handleCreate,
        handleRefresh,
        handleSettings,
        handleMarkRead,
        handleClearAll,
        handleApprove,
        handleReject,
        handlePause,
        handleResume,
    }
}