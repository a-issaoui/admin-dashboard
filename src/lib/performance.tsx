// ============================================================================
// src/lib/performance.ts - FIXED performance utilities
// ============================================================================

import * as React from 'react'

export function measurePerformance<T>(
    fn: () => T,
    label: string
): T {
    if (typeof window === 'undefined') return fn()

    const start = performance.now()
    const result = fn()
    const end = performance.now()

    console.info(`⚡ ${label}: ${(end - start).toFixed(2)}ms`)
    return result
}

export function withPerformanceMonitoring<T extends (...args: unknown[]) => unknown>(
    fn: T,
    label: string
): T {
    return ((...args: Parameters<T>) => {
        return measurePerformance(() => fn(...args), label)
    }) as T
}

// Lazy loading utilities
export function createLazyComponent<P extends Record<string, unknown> = Record<string, never>>(
    factory: () => Promise<{ default: React.ComponentType<P> }>,
    fallback?: React.ComponentType
): React.ComponentType<P> {
    const LazyComponent = React.lazy(factory)

    return function LazyWrapper(props: P) {
        return (
            <React.Suspense fallback={fallback ? React.createElement(fallback) : null}>
                <LazyComponent {...props} />
            </React.Suspense>
        )
    }
}