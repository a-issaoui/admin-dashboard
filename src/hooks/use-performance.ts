// ============================================================================
// src/hooks/use-performance.ts - Simplified, HMR-Safe Performance Monitoring
// ============================================================================

'use client'

import { useCallback, useRef, useState } from 'react'

// Simple performance measurement for critical operations only
export function usePerformance(componentName: string) {
    const renderCount = useRef(0)
    const [metrics, setMetrics] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 })

    const measureOperation = useCallback(<T>(
        operation: () => T,
        operationName = 'operation'
    ): T => {
        if (process.env.NODE_ENV !== 'production') {
            return operation() // Skip measurement in development
        }

        const start = performance.now()
        const result = operation()
        const duration = performance.now() - start

        // Only log slow operations (>100ms)
        if (duration > 100) {
            console.warn(`Slow ${operationName} in ${componentName}: ${duration.toFixed(2)}ms`)
        }

        return result
    }, [componentName])

    const measureAsync = useCallback(async <T>(
        operation: () => Promise<T>,
        operationName = 'async-operation'
    ): Promise<T> => {
        if (process.env.NODE_ENV !== 'production') {
            return operation() // Skip measurement in development
        }

        const start = performance.now()
        const result = await operation()
        const duration = performance.now() - start

        // Only log slow operations (>200ms for async)
        if (duration > 200) {
            console.warn(`Slow ${operationName} in ${componentName}: ${duration.toFixed(2)}ms`)
        }

        return result
    }, [componentName])

    return {
        measureOperation,
        measureAsync,
        renderCount: renderCount.current,
        metrics
    }
}

// Simple debounce hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useState(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    })

    return debouncedValue
}

// Simple throttle hook
export function useThrottle<Args extends unknown[], Return>(
    fn: (...args: Args) => Return,
    delay: number
): (...args: Args) => Return | undefined {
    const lastCall = useRef<number>(0)

    return useCallback((...args: Args): Return | undefined => {
        const now = Date.now()
        if (now - lastCall.current >= delay) {
            lastCall.current = now
            return fn(...args)
        }
    }, [fn, delay])
}

// Simple intersection observer for lazy loading
export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [element, setElement] = useState<Element | null>(null)

    const observer = useRef<IntersectionObserver>()

    const ref = useCallback((node: Element | null) => {
        if (observer.current) observer.current.disconnect()

        if (node) {
            observer.current = new IntersectionObserver(
                ([entry]) => setIsIntersecting(entry?.isIntersecting ?? false),
                { threshold: 0.1, ...options }
            )
            observer.current.observe(node)
            setElement(node)
        }
    }, [options])

    return { ref, isIntersecting, element }
}