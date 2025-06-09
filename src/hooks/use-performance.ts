// ============================================================================
// src/hooks/use-performance.ts - PRODUCTION-READY UTILITIES
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
 * Development-only render performance monitoring
 */
export const useRenderPerformance = process.env.NODE_ENV === 'development'
    ? (componentName: string) => {
        const renderCount = React.useRef(0)
        const startTime = React.useRef<number>(0)

        React.useLayoutEffect(() => {
            renderCount.current += 1
            startTime.current = performance.now()
        })

        React.useEffect(() => {
            const renderTime = performance.now() - startTime.current
            console.info(`🎨 ${componentName}: ${renderTime.toFixed(2)}ms`)
        })
    }
    : () => {} // No-op function in production