// ============================================================================
// src/hooks/use-performance.ts - COMPLETELY FIXED
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
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    return React.useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now()

            if (now - lastCallTime.current >= delay) {
                lastCallTime.current = now
                return fn(...args)
            } else {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = setTimeout(() => {
                    lastCallTime.current = Date.now()
                    fn(...args)
                }, delay - (now - lastCallTime.current))
            }
        }) as T,
        [fn, delay]
    )
}

/**
 * Expensive memoization hook with performance monitoring
 */
export function useExpensiveMemo<T>(
    factory: () => T,
    deps: React.DependencyList,
    debugName?: string
): T {
    const startTime = React.useRef<number>(0)
    const computeCount = React.useRef<number>(0)

    return React.useMemo(() => {
        startTime.current = performance.now()
        computeCount.current += 1

        const result = factory()

        const duration = performance.now() - startTime.current

        if (process.env.NODE_ENV === 'development' && debugName) {
            console.debug(
                `useExpensiveMemo [${debugName}]: ${duration.toFixed(2)}ms (computation #${computeCount.current})`
            )

            if (duration > 50) {
                console.warn(
                    `⚠️  Expensive computation in useExpensiveMemo [${debugName}]: ${duration.toFixed(2)}ms`
                )
            }
        }

        return result
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
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
            console.info(`🎨 ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`)

            if (renderTime > 16) {
                console.warn(`⚠️  Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
            }
        })
    }
    : () => {} // No-op function in production

/**
 * Hook for measuring async operations
 */
export function useAsyncPerformance(operationName: string) {
    const measureAsync = React.useCallback(
        async <T>(operation: () => Promise<T>): Promise<T> => {
            const startTime = performance.now()

            try {
                const result = await operation()
                const duration = performance.now() - startTime

                if (process.env.NODE_ENV === 'development') {
                    console.debug(`⏱️  ${operationName}: ${duration.toFixed(2)}ms`)

                    if (duration > 1000) {
                        console.warn(`⚠️  Slow async operation [${operationName}]: ${duration.toFixed(2)}ms`)
                    }
                }

                return result
            } catch (error) {
                const duration = performance.now() - startTime

                if (process.env.NODE_ENV === 'development') {
                    console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error)
                }

                throw error
            }
        },
        [operationName]
    )

    return { measureAsync }
}

/**
 * Hook for measuring component mount and update performance
 */
export function useComponentPerformance(componentName: string) {
    const mountTime = React.useRef<number>(0)
    const updateCount = React.useRef<number>(0)
    const lastUpdateTime = React.useRef<number>(0)

    // Measure mount time
    React.useLayoutEffect(() => {
        mountTime.current = performance.now()

        return () => {
            if (process.env.NODE_ENV === 'development') {
                const unmountTime = performance.now()
                const lifetime = unmountTime - mountTime.current
                console.debug(`🔄 ${componentName} lifetime: ${lifetime.toFixed(2)}ms`)
            }
        }
    }, [componentName])

    // Measure update performance
    React.useLayoutEffect(() => {
        updateCount.current += 1
        lastUpdateTime.current = performance.now()
    })

    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development' && updateCount.current > 1) {
            const updateDuration = performance.now() - lastUpdateTime.current
            console.debug(
                `🔄 ${componentName} update #${updateCount.current}: ${updateDuration.toFixed(2)}ms`
            )
        }
    })

    return {
        updateCount: updateCount.current,
        measureOperation: React.useCallback(
            <T>(operation: () => T, operationName: string): T => {
                const start = performance.now()
                const result = operation()
                const duration = performance.now() - start

                if (process.env.NODE_ENV === 'development') {
                    console.debug(`⚡ ${componentName}.${operationName}: ${duration.toFixed(2)}ms`)
                }

                return result
            },
            [componentName]
        )
    }
}