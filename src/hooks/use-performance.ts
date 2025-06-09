// ============================================================================
// src/hooks/use-performance.ts - HMR-SAFE VERSION
// ============================================================================

'use client'

import * as React from 'react'

/**
 * Simple debounce hook for value delays
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

/**
 * Throttle hook for limiting function calls
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): T {
    const lastCallTime = React.useRef<number>(0)

    return React.useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now()
            if (now - lastCallTime.current >= delay) {
                lastCallTime.current = now
                return fn(...args)
            }
        }) as T,
        [fn, delay]
    )
}

/**
 * Intersection observer hook for performance optimization
 */
export function useIntersectionObserver(
    elementRef: React.RefObject<HTMLElement | null>,
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = React.useState(false)

    React.useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => setIsIntersecting(entry?.isIntersecting ?? false),
            { threshold: 0.1, ...options }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [elementRef, options])

    return { isIntersecting }
}

/**
 * NO-OP performance monitoring for development to avoid HMR issues
 */
export const useRenderPerformance = () => {
    // No-op function to avoid HMR issues
}

/**
 * Simple async performance measurement
 */
export function useAsyncPerformance(operationName: string) {
    const measureAsync = React.useCallback(
        async <T>(operation: () => Promise<T>): Promise<T> => {
            return operation() // Just run the operation without monitoring
        },
        [operationName]
    )

    return { measureAsync }
}

/**
 * Simple component performance hook (no-op for HMR safety)
 */
export function useComponentPerformance(componentName: string) {
    return {
        updateCount: 0,
        measureOperation: React.useCallback(
            <T>(operation: () => T, operationName?: string): T => {
                return operation() // Just run the operation
            },
            [componentName]
        )
    }
}