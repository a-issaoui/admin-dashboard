// ============================================================================
// src/lib/error-management.ts - Centralized and Robust Error Management
// ============================================================================

import { TypedError, ErrorContext } from '@/types/common'

interface SerializedError {
    message: string
    code: string
    statusCode: number
    context: ErrorContext
    stack?: string
    timestamp: number
}

interface ErrorReportingService {
    reportError: (error: TypedError) => Promise<void>
    reportPerformanceIssue?: (metric: string, value: number) => Promise<void>
}

class ErrorManager {
    private _reportingService?: ErrorReportingService
    private errorQueue: TypedError[] = []
    private isReporting = false

    constructor() {
        this.initializeErrorReporting()
        this.setupGlobalErrorHandlers()
    }

    public get reportingService(): ErrorReportingService | undefined {
        return this._reportingService
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
        this._reportingService = {
            reportError: async (error: TypedError) => {
                try {
                    interface SerializedError {
                        message: string
                        code: string
                        statusCode: number
                        context: ErrorContext
                        stack?: string  // Make stack optional
                        timestamp: number
                    }
                    // In a real app, you would send this to your logging endpoint
                    // console.info("Reporting error to production service:", serializedError);
                    // await fetch('/api/errors', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(serializedError)
                    // })
                } catch (reportingError) {
                    console.error('Failed to report error:', reportingError)
                }
            },
        }
    }

    private setupDevelopmentReporting() {
        this._reportingService = {
            reportError: async (error: TypedError) => {
                console.group('🚨 Error Report (ErrorManager)')
                console.error('Message:', error.message)
                console.error('Code:', error.code)
                console.error('Context:', error.context)
                console.error('Stack:', error.stack)
                console.groupEnd()
            },
            reportPerformanceIssue: async (metric: string, value: number) => {
                console.warn(`⚡ Dev Performance Issue: ${metric} = ${value}ms`)
            }
        }
    }

    private setupGlobalErrorHandlers() {
        if (typeof window === 'undefined') return;

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
                this.createErrorContext('window', 'unhandled_rejection', { originalReason: event.reason })
            ))
        })
    }

    createErrorContext(component: string, action: string, additionalInfo?: Record<string, unknown>): ErrorContext {
        return {
            component,
            action,
            timestamp: Date.now(),
            sessionId: this.getSessionId(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
            url: typeof window !== 'undefined' ? window.location.href : 'server',
            additionalInfo: additionalInfo || {},
        }
    }

    private createDefaultContext(): ErrorContext {
        return this.createErrorContext('unknown', 'unknown')
    }

    private getSessionId(): string {
        if (typeof window === 'undefined') return 'server-session'
        let sessionId = sessionStorage.getItem('error-manager-session-id')
        if (!sessionId) {
            sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            sessionStorage.setItem('error-manager-session-id', sessionId)
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
            const errorToReport = this.errorQueue.shift()
            if (errorToReport && this._reportingService) {
                await this._reportingService.reportError(errorToReport)
            }
        }
        this.isReporting = false
    }
}

export const errorManager = new ErrorManager()