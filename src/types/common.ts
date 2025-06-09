export interface ApiResponse<T = unknown> {
    data: T
    status: 'success' | 'error' | 'loading'
    message?: string
    timestamp: string
    requestId: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

export type AsyncState<T> = {
    data: T | null
    loading: boolean
    error: string | null
    lastUpdated: number | null
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// src/types/common.ts
// Update ErrorContext interface to:
export interface ErrorContext {
    component: string
    action: string
    timestamp: number
    userId?: string
    sessionId: string
    userAgent: string
    url: string
    additionalInfo?: Record<string, unknown>
    [key: string]: unknown  // Allow additional properties
}

export class TypedError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public context?: ErrorContext,
        public isOperational: boolean = true
    ) {
        super(message)
        this.name = 'TypedError'
        Error.captureStackTrace(this, this.constructor)
    }
}