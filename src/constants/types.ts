import type { IconProps } from '@/components/icons'
import type { ActionType } from '@/hooks/useSidebarActions'

// ====================
// ORGANIZATION
// ====================

export interface Organization {
    name: string
    academicYear?: string
    imageUrl?: string
}

// ====================
// USER
// ====================

export type UserRole = 'Admin' | 'Editor' | 'User' | 'Viewer'
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    subrole?: string
    status: UserStatus
    imageUrl?: string
    avatar?: string
    joinDate?: string
    lastLogin?: string
    permissions?: string[]
}


