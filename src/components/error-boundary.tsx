'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppError } from '@/lib/error-handler'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<ErrorBoundaryState>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo })

        // Log to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.logErrorToService(error, errorInfo)
        }
    }

    private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
        // Implement your preferred error monitoring service
        console.error('Error logged to monitoring service:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        })
    }

    override render() {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return <FallbackComponent {...this.state} />
        }

        return this.props.children
    }
}

function DefaultErrorFallback({ error, errorInfo }: ErrorBoundaryState) {
    const isAppError = error instanceof AppError

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {isAppError ? 'Application Error' : 'Unexpected Error'}
                    </CardTitle>
                    <CardDescription>
                        {isAppError
                            ? error.message
                            : error?.message || 'An unexpected error occurred. Please try again.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <details className="text-sm">
                            <summary className="cursor-pointer font-medium">
                                Debug Information
                            </summary>
                            <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground overflow-auto max-h-48">
                                {error?.stack}
                                {errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Reload Application
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}