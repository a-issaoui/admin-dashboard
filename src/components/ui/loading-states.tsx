'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/hooks/use-accessibility'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
    isLoading: boolean
    children: React.ReactNode
    loadingComponent?: React.ReactNode
    loadingText?: string
    delayMs?: number
    minDurationMs?: number
    className?: string
}

export function LoadingState({
                                 isLoading,
                                 children,
                                 loadingComponent,
                                 loadingText = 'Loading content',
                                 delayMs = 200,
                                 minDurationMs = 500,
                                 className
                             }: LoadingStateProps) {
    const [shouldShowLoading, setShouldShowLoading] = React.useState(false)
    const [loadingStartTime, setLoadingStartTime] = React.useState<number | null>(null)
    const { announceToScreenReader } = useAccessibility()

    React.useEffect(() => {
        let delayTimer: NodeJS.Timeout
        let minDurationTimer: NodeJS.Timeout

        if (isLoading) {
            setLoadingStartTime(Date.now())

            delayTimer = setTimeout(() => {
                setShouldShowLoading(true)
                announceToScreenReader(loadingText, 'polite')
            }, delayMs)
        } else {
            const elapsed = loadingStartTime ? Date.now() - loadingStartTime : minDurationMs
            const remainingTime = Math.max(0, minDurationMs - elapsed)

            minDurationTimer = setTimeout(() => {
                setShouldShowLoading(false)
                setLoadingStartTime(null)
            }, remainingTime)
        }

        return () => {
            clearTimeout(delayTimer)
            clearTimeout(minDurationTimer)
        }
    }, [isLoading, delayMs, minDurationMs, loadingText, loadingStartTime, announceToScreenReader])

    const defaultLoadingComponent = (
        <div className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                <span className="text-sm font-medium">{loadingText}</span>
            </div>
        </div>
    )

    return (
        <div className={cn('relative', className)}>
            <AnimatePresence mode="wait">
                {shouldShowLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                        role="status"
                        aria-live="polite"
                        aria-label={loadingText}
                    >
                        {loadingComponent || defaultLoadingComponent}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <motion.div
                animate={{ opacity: shouldShowLoading ? 0.5 : 1 }}
                transition={{ duration: 0.15 }}
                aria-hidden={shouldShowLoading}
            >
                {children}
            </motion.div>
        </div>
    )
}

export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn("p-4 space-y-3", className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    )
}

export function SkeletonTable({ rows = 5, columns = 4, className }: {
    rows?: number
    columns?: number
    className?: string
}) {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-8" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6" />
                    ))}
                </div>
            ))}
        </div>
    )
}