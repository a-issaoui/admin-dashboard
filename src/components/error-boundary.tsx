// ============================================================================
// src/components/error-boundary.tsx - Simplified Error Handling
// ============================================================================

'use client'

import { Component, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AppError } from '@/types'

interface ErrorBoundaryState {
    hasError: boolean
    error?: AppError
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: (error: AppError, reset: () => void) => ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error: {
                message: error.message,
                code: 'REACT_ERROR',
                statusCode: 500,
                context: { stack: error.stack }
            }
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Simple error logging
        if (process.env.NODE_ENV === 'production') {
            console.error('Error Boundary caught an error:', {
                error: error.message,
                componentStack: errorInfo.componentStack
            })
        } else {
            console.group('🚨 Error Boundary')
            console.error('Error:', error)
            console.error('Component Stack:', errorInfo.componentStack)
            console.groupEnd()
        }
    }

    render() {
        if (this.state.hasError && this.state.error) {
            const reset = () => this.setState({ hasError: false, error: undefined })

            if (this.props.fallback) {
                return this.props.fallback(this.state.error, reset)
            }

            return <DefaultErrorFallback error={this.state.error} onReset={reset} />
        }

        return this.props.children
    }
}

function DefaultErrorFallback({
                                  error,
                                  onReset
                              }: {
    error: AppError
    onReset: () => void
}) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className="text-destructive">⚠️</span>
                        Something went wrong
                    </CardTitle>
                    <CardDescription>
                        An unexpected error occurred. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <details className="text-sm">
                            <summary className="cursor-pointer font-medium">
                                Error Details
                            </summary>
                            <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                {error.message}
              </pre>
                        </details>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={onReset} className="flex-1">
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex-1"
                        >
                            Reload Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Simple error notification function
export function showErrorToast(error: AppError | Error | string) {
    const message = typeof error === 'string'
        ? error
        : error.message || 'An error occurred'

    // If you have a toast system, use it here
    // For now, just console.error
    console.error('Error:', message)
}