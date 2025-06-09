import { TypedError, ErrorContext } from '@/types/common'

interface ErrorReportingService {
    reportError: (error: TypedError) => Promise<void>
    reportPerformanceIssue: (metric: string, value: number) => Promise<void>
}

interface SerializedError {
    message: string
    code: string
    statusCode: number
    context?: ErrorContext
    stack?: string
    timestamp: number
}

interface PerformanceIssue {
    metric: string
    value: number
    timestamp: number
    url: string
    userAgent: string
}

class ErrorManager {
    private reportingService?: ErrorReportingService
    private errorQueue: TypedError[] = []
    private isReporting = false

    constructor() {
        this.initializeErrorReporting()
        this.setupGlobalErrorHandlers()
    }

    private initializeErrorReporting() {
        if (typeof window !== 'undefined') {
            if (process.env.NODE_ENV === 'production') {
                this.setupProductionReporting()
            } else {
                this.setupDevelopmentReporting()
            }
        }
    }

    private setupProductionReporting() {
        this.reportingService = {
            reportError: async (error: TypedError) => {
                try {
                    const serializedError: SerializedError = {
                        message: error.message,
                        code: error.code,
                        statusCode: error.statusCode,
                        context: error.context,
                        stack: error.stack,
                        timestamp: Date.now()
                    }

                    await fetch('/api/errors', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(serializedError)
                    })
                } catch (reportingError) {
                    console.error('Failed to report error:', reportingError)
                }
            },
            reportPerformanceIssue: async (metric: string, value: number) => {
                try {
                    const performanceIssue: PerformanceIssue = {
                        metric,
                        value,
                        timestamp: Date.now(),
                        url: window.location.href,
                        userAgent: navigator.userAgent
                    }

                    await fetch('/api/performance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(performanceIssue)
                    })
                } catch (error) {
                    console.error('Failed to report performance issue:', error)
                }
            }
        }
    }

    private setupDevelopmentReporting() {
        this.reportingService = {
            reportError: async (error: TypedError) => {
                console.info('🚨 Error Report')
                console.error('Message:', error.message)
                console.error('Code:', error.code)
                console.error('Context:', error.context)
                console.error('Stack:', error.stack)
            },
            reportPerformanceIssue: async (metric: string, value: number) => {
                console.warn(`⚡ Performance Issue: ${metric} = ${value}ms`)
            }
        }
    }

    private setupGlobalErrorHandlers() {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.handleError(new TypedError(
                    event.message,
                    'GLOBAL_ERROR',
                    500,
                    this.createErrorContext('window', 'global_error')
                ))
            })

            window.addEventListener('unhandledrejection', (event) => {
                this.handleError(new TypedError(
                    event.reason?.message || 'Unhandled Promise Rejection',
                    'UNHANDLED_REJECTION',
                    500,
                    this.createErrorContext('window', 'unhandled_rejection')
                ))
            })
        }
    }

    createErrorContext(component: string, action: string, additionalInfo?: Record<string, unknown>): ErrorContext {
        return {
            component,
            action,
            timestamp: Date.now(),
            sessionId: this.getSessionId(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
            url: typeof window !== 'undefined' ? window.location.href : 'server',
            additionalInfo
        }
    }

    private getSessionId(): string {
        if (typeof window === 'undefined') return 'server-session'

        let sessionId = sessionStorage.getItem('session-id')
        if (!sessionId) {
            sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            sessionStorage.setItem('session-id', sessionId)
        }
        return sessionId
    }

    async handleError(error: TypedError) {
        this.errorQueue.push(error)

        if (!this.isReporting) {
            await this.processErrorQueue()
        }
    }

    private async processErrorQueue() {
        if (this.isReporting || this.errorQueue.length === 0) return

        this.isReporting = true

        while (this.errorQueue.length > 0) {
            const error = this.errorQueue.shift()
            if (error && this.reportingService) {
                await this.reportingService.reportError(error)
            }
        }

        this.isReporting = false
    }

    wrapAsync<TFunction extends (...args: unknown[]) => Promise<unknown>>(
        fn: TFunction,
        component: string,
        action: string
    ): TFunction {
        return (async (...args: Parameters<TFunction>) => {
            try {
                return await fn(...args)
            } catch (error) {
                const typedError = error instanceof TypedError
                    ? error
                    : new TypedError(
                        error instanceof Error ? error.message : 'Unknown error',
                        'ASYNC_ERROR',
                        500,
                        this.createErrorContext(component, action, { originalError: error })
                    )

                await this.handleError(typedError)
                throw typedError
            }
        }) as TFunction
    }

    wrapSync<TFunction extends (...args: unknown[]) => unknown>(
        fn: TFunction,
        component: string,
        action: string
    ): TFunction {
        return ((...args: Parameters<TFunction>) => {
            try {
                return fn(...args)
            } catch (error) {
                const typedError = error instanceof TypedError
                    ? error
                    : new TypedError(
                        error instanceof Error ? error.message : 'Unknown error',
                        'SYNC_ERROR',
                        500,
                        this.createErrorContext(component, action, { originalError: error })
                    )

                this.handleError(typedError)
                throw typedError
            }
        }) as TFunction
    }
}

export const errorManager = new ErrorManager()