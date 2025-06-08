// ============================================================================
// src/types/global.ts - Global shared types
// ============================================================================

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'editor' | 'user'
    avatar?: string
    status: 'active' | 'inactive'
}

export interface Organization {
    name: string
    academicYear: string
    logo?: string
}