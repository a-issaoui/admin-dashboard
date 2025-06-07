import type { IconProps } from "@/components/icons"
import type { Badge } from "@/types/Badge"

// ====================
// ENHANCED ACTION TYPES
// ====================

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

export interface MenuAction {
    id: string
    label: string
    icon?: IconProps
    actionType: ActionType
    variant?: 'default' | 'destructive'
    shortcut?: string
    // Enhanced properties
    customHandler?: string
    disabled?: boolean
    loading?: boolean
    tooltip?: string
    confirmationMessage?: string
    // Conditional visibility
    showWhen?: (context: any) => boolean
    // Group actions by category
    category?: 'primary' | 'secondary' | 'destructive'
}

// ====================
// ENHANCED SIDEBAR MENU TYPES
// ====================

export interface SbSubMenu {
    id?: string
    title: string
    url: string
    icon?: IconProps
    color?: string
    badge?: Badge
    actions?: MenuAction[]
    // Enhanced properties
    tooltip?: string
    disabled?: boolean
    hidden?: boolean
    shortcut?: string
    // External link handling
    external?: boolean
    target?: '_blank' | '_self' | '_parent' | '_top'
    // Conditional rendering
    showWhen?: (context: any) => boolean
}

export interface SbMenu {
    id?: string
    title: string
    icon?: IconProps
    color?: string
    dotColor?: string
    url?: string
    badge?: Badge
    submenu?: SbSubMenu[]
    actions?: MenuAction[]
    // Enhanced properties
    tooltip?: string
    disabled?: boolean
    hidden?: boolean
    shortcut?: string
    // External link handling
    external?: boolean
    target?: '_blank' | '_self' | '_parent' | '_top'
    // Collapsible state
    defaultExpanded?: boolean
    // Conditional rendering
    showWhen?: (context: any) => boolean
    // Loading state
    loading?: boolean
    // Error state
    error?: string
}

export interface SbGroup {
    id?: string
    title?: string
    color?: string
    collapsible?: boolean
    defaultOpen?: boolean
    menu: SbMenu[]
    // Enhanced properties
    actions?: MenuAction[]
    disabled?: boolean
    hidden?: boolean
    // Conditional rendering
    showWhen?: (context: any) => boolean
    // Display order
    order?: number
    // Group description
    description?: string
}

export type SidebarData = SbGroup[]

// ====================
// CONFIGURATION TYPES
// ====================

export interface SidebarConfiguration {
    // Persistence settings
    persistState?: boolean
    stateKey?: string

    // Accessibility settings
    enableKeyboardNavigation?: boolean
    announceStateChanges?: boolean
    reducedMotion?: boolean

    // Behavior settings
    autoCollapse?: boolean
    autoCollapseDelay?: number
    closeOnItemClick?: boolean

    // Theming
    theme?: 'light' | 'dark' | 'auto'
    customColors?: Record<string, string>

    // Performance
    virtualization?: boolean
    lazyLoadIcons?: boolean
    debounceSearchMs?: number

    // Features
    enableSearch?: boolean
    enableDragDrop?: boolean
    enableContextMenu?: boolean

    // Analytics
    trackInteractions?: boolean
    onItemClick?: (item: SbMenu | SbSubMenu) => void
    onActionExecute?: (action: MenuAction, context: any) => void
}

// ====================
// CONTEXT TYPES
// ====================

export interface SidebarContext {
    user?: {
        id: string
        role: string
        permissions: string[]
    }
    organization?: {
        id: string
        plan: string
        features: string[]
    }
    environment?: 'development' | 'staging' | 'production'
    locale?: string
    timezone?: string
    [key: string]: any
}

// ====================
// EVENT TYPES
// ====================

export interface SidebarItemEvent {
    type: 'click' | 'hover' | 'focus' | 'blur'
    item: SbMenu | SbSubMenu
    event: Event
    context: SidebarContext
}

export interface SidebarActionEvent {
    type: 'execute' | 'loading' | 'success' | 'error'
    action: MenuAction
    context: SidebarContext
    result?: any
    error?: Error
}

export interface SidebarStateEvent {
    type: 'expand' | 'collapse' | 'toggle'
    itemId: string
    newState: boolean
    context: SidebarContext
}

// ====================
// PLUGIN TYPES
// ====================

export interface SidebarPlugin {
    name: string
    version: string
    init: (sidebar: any) => void
    destroy?: () => void
    hooks?: {
        beforeRender?: (data: SidebarData) => SidebarData
        afterRender?: (element: HTMLElement) => void
        onItemClick?: (event: SidebarItemEvent) => boolean | void
        onActionExecute?: (event: SidebarActionEvent) => boolean | void
    }
}

// ====================
// VALIDATION TYPES
// ====================

export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
}

export interface ValidationError {
    path: string
    message: string
    code: string
    severity: 'error' | 'warning'
}

export interface ValidationWarning {
    path: string
    message: string
    suggestion?: string
}