import type { SbMenu, SbSubMenu, SbGroup, MenuAction } from './SidebarData'

// Enhanced types for processed sidebar data with active states and computed properties

export interface ProcessedSubMenu extends SbSubMenu {
    isActive: boolean
    // Computed properties that could be added
    hasNotifications?: boolean
    isDisabled?: boolean
}

export interface ProcessedMenu extends SbMenu {
    isActive: boolean
    hasActiveChild: boolean
    submenu?: ProcessedSubMenu[]
    // Computed properties
    hasNotifications?: boolean
    notificationCount?: number
    isDisabled?: boolean
}

export interface ProcessedGroup extends SbGroup {
    menu: ProcessedMenu[]
    // Computed properties
    hasActiveItems?: boolean
    totalNotifications?: number
    isDisabled?: boolean
}

// Extended action types for better type safety
export type ActionType =
    | 'refresh'
    | 'export'
    | 'import'
    | 'create'
    | 'edit'
    | 'delete'
    | 'settings'
    | 'archive'
    | 'mark-read'
    | 'clear-all'
    | 'pause'
    | 'resume'
    | 'approve'
    | 'reject'
    | string // Allow custom action types

// Enhanced menu action with loading and error states
export interface ProcessedMenuAction extends MenuAction {
    isLoading?: boolean
    error?: string
    lastExecuted?: Date
}

// Context type for action execution
export interface ActionContext {
    itemType: string
    itemId?: string
    itemTitle: string
    customHandler?: string
    metadata?: Record<string, any>
}

// Hook return types
export interface SidebarDataHookReturn {
    processedData: ProcessedGroup[]
    isLoading: boolean
    error: string | null
    refresh: () => void
}

export interface SidebarPersistenceHookReturn {
    collapsedStates: Record<string, boolean>
    toggleCollapsed: (id: string) => void
    setCollapsed: (id: string, collapsed: boolean) => void
    resetAll: () => void
}

export interface SidebarActionsHookReturn {
    executeAction: (actionType: ActionType, context: ActionContext) => Promise<void>
    isLoading: boolean
    error: string | null
    clearError: () => void
}

// Configuration types
export interface SidebarConfig {
    persistState?: boolean
    enableKeyboardNavigation?: boolean
    enableAnimations?: boolean
    maxBadgeCount?: number
    autoCollapseDelay?: number
    theme?: 'light' | 'dark' | 'auto'
}

// Event types for sidebar interactions
export interface SidebarItemClickEvent {
    type: 'item-click'
    item: ProcessedMenu | ProcessedSubMenu
    event: React.MouseEvent
}

export interface SidebarActionEvent {
    type: 'action-execute'
    action: MenuAction
    context: ActionContext
    result: 'success' | 'error' | 'cancelled'
}

export interface SidebarStateChangeEvent {
    type: 'state-change'
    property: 'collapsed' | 'expanded' | 'active'
    itemId: string
    newValue: any
    oldValue: any
}

export type SidebarEvent =
    | SidebarItemClickEvent
    | SidebarActionEvent
    | SidebarStateChangeEvent