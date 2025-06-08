// ============================================================================
// src/hooks/use-performance.ts - Performance optimization hooks (FIXED)
// ============================================================================

'use client'

import * as React from 'react'

/**
 * Hook for memoizing expensive computations with dependencies
 * Uses a stable factory function to prevent infinite re-renders
 */
export function useExpensiveMemo<T>(
    factory: () => T,
    deps: React.DependencyList,
    debugName?: string
): T {
    // Use a ref to store the factory function to prevent it from being a dependency
    const factoryRef = React.useRef(factory)
    const debugNameRef = React.useRef(debugName)

    // Update refs on each render
    factoryRef.current = factory
    debugNameRef.current = debugName

    return React.useMemo(() => {
        if (process.env.NODE_ENV === 'development' && debugNameRef.current) {
            const start = performance.now()
            const result = factoryRef.current()
            const end = performance.now()
            console.info(`🧮 ${debugNameRef.current}: ${(end - start).toFixed(2)}ms`)
            return result
        }
        return factoryRef.current()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps) // Only deps should be in the dependency array
}

/**
 * Hook for debouncing values to prevent excessive re-renders
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
 * Hook for throttling function calls
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): T {
    const lastCall = React.useRef<number>(0)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    return React.useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now()

            if (now - lastCall.current >= delay) {
                lastCall.current = now
                return func(...args)
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }
                timeoutRef.current = setTimeout(() => {
                    lastCall.current = Date.now()
                    func(...args)
                }, delay - (now - lastCall.current))

                return undefined as ReturnType<T>
            }
        }) as T,
        [func, delay]
    )
}

/**
 * Hook for preventing unnecessary re-renders using shallow comparison
 */
export function useShallowMemo<T extends Record<string, unknown>>(obj: T): T {
    const prevRef = React.useRef<T>(obj)

    return React.useMemo(() => {
        if (shallowEqual(prevRef.current, obj)) {
            return prevRef.current
        }
        prevRef.current = obj
        return obj
    }, [obj])
}

/**
 * Hook for intersection observer with performance optimizations
 */
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = React.useState(false)
    const [hasIntersected, setHasIntersected] = React.useState(false)

    // Memoize the options to prevent effect re-runs
    const memoizedOptions = React.useMemo(() => ({
        threshold: 0.1,
        rootMargin: '50px',
        ...options
    }), [options])

    React.useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isCurrentlyIntersecting = entry!.isIntersecting
                setIsIntersecting(isCurrentlyIntersecting)

                if (isCurrentlyIntersecting && !hasIntersected) {
                    setHasIntersected(true)
                }
            },
            memoizedOptions
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [elementRef, hasIntersected, memoizedOptions])

    return { isIntersecting, hasIntersected }
}

/**
 * Hook for measuring render performance
 */
export function useRenderPerformance(componentName: string) {
    const renderCount = React.useRef(0)
    const startTime = React.useRef<number>(0)

    React.useEffect(() => {
        renderCount.current += 1
    })

    React.useLayoutEffect(() => {
        startTime.current = performance.now()
    })

    React.useEffect(() => {
        const endTime = performance.now()
        const renderTime = endTime - startTime.current

        if (process.env.NODE_ENV === 'development') {
            console.info(
                `🎨 ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
            )
        }
    })

    return renderCount.current
}

/**
 * Hook for lazy loading components with error boundary
 */
export function useLazyComponent<T extends React.ComponentType<unknown>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
) {
    const [Component, setComponent] = React.useState<T | null>(null)
    const [error, setError] = React.useState<Error | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)

    // Use ref to store the import function to prevent it from being a dependency
    const importFuncRef = React.useRef(importFunc)
    importFuncRef.current = importFunc

    React.useEffect(() => {
        let isMounted = true

        const loadComponent = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const { default: LoadedComponent } = await importFuncRef.current()

                if (isMounted) {
                    setComponent(() => LoadedComponent)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Component loading failed'))
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadComponent()

        return () => {
            isMounted = false
        }
        // Empty dependency array since we're using a ref for the import function
    }, [])

    const LazyComponent = React.useMemo(() => {
        if (error) {
            return fallback || (() => React.createElement('div', {}, 'Error loading component'))
        }

        if (!Component) {
            return fallback || (() => React.createElement('div', {}, 'Loading...'))
        }

        return Component
    }, [Component, error, fallback])

    return {
        Component: LazyComponent,
        isLoading,
        error
    }
}

/**
 * Hook for virtual scrolling optimization
 */
export function useVirtualScrolling<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    overscan: number = 3
) {
    const [scrollTop, setScrollTop] = React.useState(0)

    const visibleRange = React.useMemo(() => {
        const start = Math.floor(scrollTop / itemHeight)
        const end = Math.min(
            start + Math.ceil(containerHeight / itemHeight),
            items.length - 1
        )

        return {
            start: Math.max(0, start - overscan),
            end: Math.min(items.length - 1, end + overscan)
        }
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan])

    const visibleItems = React.useMemo(() => {
        return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
            item,
            index: visibleRange.start + index
        }))
    }, [items, visibleRange])

    const totalHeight = items.length * itemHeight
    const offsetY = visibleRange.start * itemHeight

    return {
        visibleItems,
        totalHeight,
        offsetY,
        setScrollTop
    }
}

// Utility function for shallow comparison
function shallowEqual<T extends Record<string, unknown>>(objA: T, objB: T): boolean {
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    for (const key of keysA) {
        if (objA[key] !== objB[key]) {
            return false
        }
    }

    return true
}