export interface ApiResponse<T = unknown> {
    data: T
    status: 'success' | 'error'
    message?: string
    timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type AsyncState<T> = {
    data: T | null
    loading: boolean
    error: string | null
}

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}