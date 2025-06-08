// Performance monitoring utilities

export function measurePerformance<T>(
    fn: () => T,
    label: string
): T {
    if (typeof window === 'undefined') return fn()

    const start = performance.now()
    const result = fn()
    const end = performance.now()

    console.log(`⚡ ${label}: ${(end - start).toFixed(2)}ms`)
    return result
}

export function withPerformanceMonitoring<T extends (...args: any[]) => any>(
    fn: T,
    label: string
): T {
    return ((...args: Parameters<T>) => {
        return measurePerformance(() => fn(...args), label)
    }) as T
}

// Lazy loading utilities
export function createLazyComponent<T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
) {
    const LazyComponent = React.lazy(factory)

    return function LazyWrapper(props: React.ComponentProps<T>) {
        return (
            <React.Suspense fallback={fallback ? React.createElement(fallback) : null}>
                <LazyComponent {...props} />
        </React.Suspense>
    )
    }
}