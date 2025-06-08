'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/icons'

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback
            return (
                <FallbackComponent
                    error={this.state.error}
                    reset={() => this.setState({ hasError: false, error: undefined })}
                />
            )
        }

        return this.props.children
    }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <Icon name="WarningIcon" className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle>Something went wrong</CardTitle>
                    <CardDescription>
                        An unexpected error occurred. Please try again.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <details className="text-sm">
                        <summary className="cursor-pointer font-medium">
                            Error details
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
              {error.message}
            </pre>
                    </details>
                    <Button onClick={reset} className="w-full">
                        Try again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}