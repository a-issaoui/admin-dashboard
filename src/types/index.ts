// ============================================================================
// src/types/index.ts - Consolidated and optimized type definitions
// ============================================================================

// Re-export all types from a single entry point
export type { LocaleCode, LocaleConfig } from './locale'
export type { User, Organization } from './global'
export type {
    SidebarData,
    SidebarGroup,
    SidebarMenuItem,
    SidebarSubmenu,
    Badge,
    MenuAction,
    ActionType,
    BadgeColor,
    BadgeVariant
} from './sidebar'

// Simplified common types
export interface ApiResponse<T = unknown> {
    data: T
    status: 'success' | 'error'
    message?: string
}

export interface AsyncState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

// Simple error type
export interface AppError {
    message: string
    code: string
    statusCode?: number
    context?: Record<string, unknown>
}

// Icon types - properly constrained
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

export interface IconProps {
    name: string // Will be constrained by the icon component
    size?: number
    weight?: IconWeight
    className?: string
    color?: string
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Component props helpers
export type ComponentProps<T = Record<string, unknown>> = T & {
    className?: string
    children?: React.ReactNode
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>