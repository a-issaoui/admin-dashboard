// ============================================================================
// src/types/sidebar.ts - Clean sidebar types
// ============================================================================

import type { IconProps } from '@/components/icons'

export type BadgeColor = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'gray'
export type BadgeVariant = 'default' | 'outline' | 'ghost'

export interface Badge {
    count?: string | number
    color?: BadgeColor
    variant?: BadgeVariant
}

export type ActionType =
    | 'refresh'
    | 'export'
    | 'import'
    | 'create'
    | 'edit'
    | 'delete'
    | 'settings'
    | 'archive'

export interface MenuAction {
    id: string
    type: ActionType
    label?: string // Will use i18n key if not provided
    icon?: IconProps
    variant?: 'default' | 'destructive'
    shortcut?: string
    disabled?: boolean
}

export interface SidebarSubmenu {
    id: string
    titleKey: string // i18n key
    url: string
    icon?: IconProps
    badge?: Badge
    actions?: MenuAction[]
    disabled?: boolean
    external?: boolean
}

export interface SidebarMenuItem {
    id: string
    titleKey: string // i18n key
    icon?: IconProps
    url?: string
    badge?: Badge
    submenu?: SidebarSubmenu[]
    actions?: MenuAction[]
    disabled?: boolean
    external?: boolean
    defaultExpanded?: boolean
}

export interface SidebarGroup {
    id: string
    titleKey?: string // i18n key
    collapsible?: boolean
    defaultOpen?: boolean
    menu: SidebarMenuItem[]
    actions?: MenuAction[]
    disabled?: boolean
    order?: number
}

export type SidebarData = SidebarGroup[]

// Processed types with computed state
export interface ProcessedSubmenu extends SidebarSubmenu {
    title: string // Translated title
    isActive: boolean
    hasNotifications: boolean
}

export interface ProcessedMenuItem extends SidebarMenuItem {
    title: string // Translated title
    submenu?: ProcessedSubmenu[]
    isActive: boolean
    hasActiveChild: boolean
    hasNotifications: boolean
    notificationCount: number
}

export interface ProcessedGroup extends SidebarGroup {
    title?: string // Translated title
    menu: ProcessedMenuItem[]
    hasActiveItems: boolean
    totalNotifications: number
}

// Store types
export interface SidebarState {
    data: SidebarData
    collapsedStates: Record<string, boolean>
    isLoading: boolean
    error: string | null
}

export interface SidebarActions {
    setData: (data: SidebarData) => void
    toggleCollapsed: (id: string) => void
    setCollapsed: (id: string, collapsed: boolean) => void
    resetCollapsed: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export type SidebarStore = SidebarState & SidebarActions