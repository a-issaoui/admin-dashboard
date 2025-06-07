import * as React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { SidebarContent, SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
    errorInfo?: React.ErrorInfo
}

interface SidebarErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

// Error boundary specifically designed for sidebar components
export class SidebarErrorBoundary extends React.Component<
    SidebarErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: SidebarErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        })

        // Log error to monitoring service
        console.error('Sidebar Error Boundary caught an error:', error, errorInfo)

        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: Sentry.captureException(error, { extra: errorInfo })
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback
                return (
                    <FallbackComponent
                        error={this.state.error!}
                        retry={this.handleRetry}
                    />
                )
            }

            return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />
        }

        return this.props.children
    }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
                                                                                 error,
                                                                                 retry
                                                                             }) => {
    return (
        <SidebarContent className="flex items-center justify-center min-h-[200px]">
            <SidebarGroup>
                <SidebarGroupContent>
                    <div className="flex flex-col items-center gap-4 p-4 text-center">
                        <AlertCircle
                            className="h-8 w-8 text-red-500"
                            aria-hidden="true"
                        />
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm">
                                Navigation Error
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-[200px]">
                                Something went wrong loading the navigation menu.
                            </p>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="text-xs text-left mt-2">
                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                        Error Details
                                    </summary>
                                    <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-auto max-h-32">
                                        {error.message}
                                        {error.stack}
                                    </pre>
                                </details>
                            )}
                        </div>
                        <Button
                            onClick={retry}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                        >
                            <RefreshCw className="h-3 w-3" />
                            Try Again
                        </Button>
                    </div>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}