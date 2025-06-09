// ============================================================================
// src/lib/error-handler.ts - Error handling utilities
// ============================================================================

import type { ErrorContext } from '@/types/common'

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public context?: ErrorContext;
    public readonly isOperational: boolean;

// src/lib/error-handler.ts
// Update the constructor (around line 24):
    constructor(
        message: string,
        code: string = 'UNKNOWN_ERROR',
        statusCode: number = 500,
        context?: ErrorContext,
        isOperational: boolean = true
    ) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.statusCode = statusCode
        if (context) {
            this.context = context
        }
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor)
    }

    public toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            context: this.context,
            stack: this.stack,
            isOperational: this.isOperational
        }
    }
}

export class ValidationError extends AppError {
    constructor(message: string, field?: string, context?: Omit<ErrorContext, 'component' | 'action' | 'timestamp' | 'sessionId' | 'userAgent' | 'url'>) {
        super(
            message,
            'VALIDATION_ERROR',
            400,
            { ...context, component: 'Validation', action: 'validate', timestamp: Date.now(), sessionId: '', userAgent: '', url: '', field },
            true
        )
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, context?: Omit<ErrorContext, 'component' | 'action' | 'timestamp' | 'sessionId' | 'userAgent' | 'url'>) {
        super(
            `${resource} not found`,
            'NOT_FOUND',
            404,
            { ...context, component: 'API', action: 'fetch', timestamp: Date.now(), sessionId: '', userAgent: '', url: '', resource },
            true
        )
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access', context?: ErrorContext) {
        super(
            message,
            'UNAUTHORIZED',
            401,
            context,
            true
        )
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access forbidden', context?: ErrorContext) {
        super(
            message,
            'FORBIDDEN',
            403,
            context,
            true
        )
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network error occurred', context?: ErrorContext) {
        super(
            message,
            'NETWORK_ERROR',
            500,
            context,
            true
        )
    }
}

export class TimeoutError extends AppError {
    constructor(operation: string, context?: Omit<ErrorContext, 'component' | 'action' | 'timestamp' | 'sessionId' | 'userAgent' | 'url'>) {
        super(
            `Operation timeout: ${operation}`,
            'TIMEOUT_ERROR',
            408,
            { ...context, component: 'AsyncOperation', action: 'timeout', timestamp: Date.now(), sessionId: '', userAgent: '', url: '', operation },
            true
        )
    }
}

export class ErrorHandler {
    private static instance: ErrorHandler
    private errorReporters: Array<(error: AppError) => void> = []

    public static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler()
        }
        return ErrorHandler.instance
    }

    public addReporter(reporter: (error: AppError) => void): void {
        this.errorReporters.push(reporter)
    }

    public async handleError(error: unknown, context?: Partial<ErrorContext>): Promise<AppError> {
        const appError = this.normalizeError(error, context)

        this.errorReporters.forEach(reporter => {
            try {
                reporter(appError)
            } catch (reporterError) {
                console.error('Error reporter failed:', reporterError)
            }
        })

        if (process.env.NODE_ENV === 'development') {
            // console.group('🚨 Error Details')
            // console.error('Message:', appError.message)
            // console.error('Code:', appError.code)
            // console.error('Status:', appError.statusCode)
            // console.error('Context:', appError.context)
            // console.error('Stack:', appError.stack)
            // console.groupEnd()
        }

        return appError
    }

    private normalizeError(error: unknown, context?: Partial<ErrorContext>): AppError {
        if (error instanceof AppError) {
            if (context) {
                error.context = { ...error.context, ...context } as ErrorContext;
            }
            return error
        }

        if (error instanceof Error) {
            return new AppError(
                error.message,
                'RUNTIME_ERROR',
                500,
                {
                    ...context,
                    component: context?.component || 'unknown',
                    action: context?.action || 'unknown',
                    timestamp: context?.timestamp || Date.now(),
                    sessionId: context?.sessionId || '',
                    userAgent: context?.userAgent || '',
                    url: context?.url || '',
                    originalName: error.name,
                    originalStack: error.stack
                }
            )
        }

        if (typeof error === 'string') {
            return new AppError(
                error,
                'STRING_ERROR',
                500,
                {
                    component: context?.component || 'unknown',
                    action: context?.action || 'unknown',
                    timestamp: context?.timestamp || Date.now(),
                    sessionId: context?.sessionId || '',
                    userAgent: context?.userAgent || '',
                    url: context?.url || ''
                }
            )
        }

        return new AppError(
            `Unknown error: ${JSON.stringify(error)}`,
            'UNKNOWN_ERROR',
            500,
            { ...context,
                component: context?.component || 'unknown',
                action: context?.action || 'unknown',
                timestamp: context?.timestamp || Date.now(),
                sessionId: context?.sessionId || '',
                userAgent: context?.userAgent || '',
                url: context?.url || '',
                originalError: error
            }
        )
    }

    public wrapAsync<T extends (...args: any[]) => Promise<any>>(
        fn: T,
        errorContext?: Partial<ErrorContext>
    ): T {
        return (async (...args: Parameters<T>) => {
            try {
                return await fn(...args)
            } catch (error) {
                throw await this.handleError(error, errorContext)
            }
        }) as T
    }

    public wrapSync<T extends (...args: any[]) => any>(
        fn: T,
        errorContext?: Partial<ErrorContext>
    ): T {
        return ((...args: Parameters<T>) => {
            try {
                return fn(...args)
            } catch (error) {
                throw this.normalizeError(error, errorContext)
            }
        }) as T
    }
}

export const errorHandler = ErrorHandler.getInstance()

export function createErrorContext(
    component: string,
    action: string,
    additionalInfo?: Record<string, unknown>
): ErrorContext {
    return {
        component,
        action,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        additionalInfo: additionalInfo || {}
    }
}

function getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session'

    let sessionId = sessionStorage.getItem('error-session-id')
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('error-session-id', sessionId)
    }
    return sessionId
}
export * from './accessibility/core';