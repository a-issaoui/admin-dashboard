// ============================================================================
// src/components/ui/loading.tsx - Simplified Loading Components
// ============================================================================

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    }

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}

interface LoadingSkeletonProps {
    className?: string
    lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-muted animate-pulse rounded"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                />
            ))}
        </div>
    )
}

interface LoadingCardProps {
    className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
    return (
        <div className={cn('rounded-lg border p-4 space-y-3', className)}>
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-20 bg-muted animate-pulse rounded" />
        </div>
    )
}

interface LoadingPageProps {
    message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
    return (
        <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}