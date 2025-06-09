import { errorManager } from './error-management'

export interface PerformanceMetric {
    name: string
    value: number
    timestamp: number
    url: string
    userAgent: string
    sessionId: string
    userId?: string
    metadata?: Record<string, any>
}

export interface WebVitalsMetric extends PerformanceMetric {
    metricType: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
    rating: 'good' | 'needs-improvement' | 'poor'
    delta: number
    id: string
}

export interface UserInteractionMetric extends PerformanceMetric {
    interactionType: 'click' | 'scroll' | 'navigation' | 'form_submission' | 'search'
    elementSelector?: string
    targetUrl?: string
    duration?: number
}

export interface ComponentPerformanceMetric extends PerformanceMetric {
    componentName: string
    renderType: 'initial' | 'update' | 'remount'
    propsCount?: number
    childrenCount?: number
}

class PerformanceAnalytics {
    private metrics: PerformanceMetric[] = []
    private webVitalsMetrics: WebVitalsMetric[] = []
    private userInteractions: UserInteractionMetric[] = []
    private componentMetrics: ComponentPerformanceMetric[] = []
    private observers: Map<string, PerformanceObserver> = new Map()
    private isInitialized = false
    private batchSize = 10
    private flushInterval = 30000

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializeMonitoring()
        }
    }

    private async initializeMonitoring() {
        if (this.isInitialized) return

        try {
            await this.setupWebVitalsMonitoring()
            this.setupNavigationTimingMonitoring()
            this.setupResourceTimingMonitoring()
            this.setupUserInteractionMonitoring()
            this.setupPerformanceObservers()
            this.startBatchFlushTimer()

            this.isInitialized = true
        } catch (error) {
            await errorManager.handleError(
                new (await import('@/types/common')).TypedError(
                    'Failed to initialize performance monitoring',
                    'PERF_INIT_ERROR',
                    500,
                    errorManager.createErrorContext('PerformanceAnalytics', 'initialize', { error })
                )
            )
        }
    }

    private async setupWebVitalsMonitoring() {
        try {
            const { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } = await import('web-vitals')

            const vitalsHandler = (metric: any) => {
                const webVitalsMetric: WebVitalsMetric = {
                    name: metric.name,
                    metricType: metric.name as WebVitalsMetric['metricType'],
                    value: metric.value,
                    delta: metric.delta,
                    id: metric.id,
                    rating: this.getVitalsRating(metric.name, metric.value),
                    timestamp: Date.now(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    sessionId: this.getSessionId(),
                    metadata: {
                        entries: metric.entries?.map((entry: any) => ({
                            name: entry.name,
                            startTime: entry.startTime,
                            duration: entry.duration
                        }))
                    }
                }

                this.webVitalsMetrics.push(webVitalsMetric)
                this.checkBatchFlush()
            }

            getCLS(vitalsHandler)
            getFID(vitalsHandler)
            getFCP(vitalsHandler)
            getLCP(vitalsHandler)
            getTTFB(vitalsHandler)
            onINP(vitalsHandler)

        } catch (error) {
            console.warn('Web Vitals monitoring unavailable:', error)
        }
    }

    private getVitalsRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
        const thresholds: Record<string, { good: number; poor: number }> = {
            CLS: { good: 0.1, poor: 0.25 },
            FID: { good: 100, poor: 300 },
            FCP: { good: 1800, poor: 3000 },
            LCP: { good: 2500, poor: 4000 },
            TTFB: { good: 800, poor: 1800 },
            INP: { good: 200, poor: 500 }
        }

        const threshold = thresholds[metricName]
        if (!threshold) return 'good'

        if (value <= threshold.good) return 'good'
        if (value <= threshold.poor) return 'needs-improvement'
        return 'poor'
    }

    private setupNavigationTimingMonitoring() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

                if (navigation) {
                    this.recordMetric('DNS Lookup', navigation.domainLookupEnd - navigation.domainLookupStart)
                    this.recordMetric('TCP Connection', navigation.connectEnd - navigation.connectStart)
                    this.recordMetric('SSL Handshake', navigation.secureConnectionStart > 0
                        ? navigation.connectEnd - navigation.secureConnectionStart : 0)
                    this.recordMetric('Request Time', navigation.responseStart - navigation.requestStart)
                    this.recordMetric('Response Time', navigation.responseEnd - navigation.responseStart)
                    this.recordMetric('DOM Processing', navigation.domContentLoadedEventEnd - navigation.responseEnd)
                    this.recordMetric('Resource Loading', navigation.loadEventStart - navigation.domContentLoadedEventEnd)
                    this.recordMetric('Total Page Load', navigation.loadEventEnd - navigation.fetchStart)
                }
            }, 0)
        })
    }

    private setupResourceTimingMonitoring() {
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    const resource = entry as PerformanceResourceTiming

                    if (resource.duration > 1000) {
                        this.recordMetric(`Slow Resource: ${resource.name}`, resource.duration, {
                            resourceType: this.getResourceType(resource.name),
                            size: resource.transferSize,
                            cached: resource.transferSize === 0 && resource.decodedBodySize > 0
                        })
                    }
                }
            })
        })

        try {
            resourceObserver.observe({ entryTypes: ['resource'] })
            this.observers.set('resource', resourceObserver)
        } catch (error) {
            console.warn('Resource timing monitoring unavailable:', error)
        }
    }

    private getResourceType(url: string): string {
        const extension = url.split('.').pop()?.toLowerCase()
        const typeMap: Record<string, string> = {
            'js': 'javascript',
            'css': 'stylesheet',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'gif': 'image',
            'svg': 'image',
            'woff': 'font',
            'woff2': 'font',
            'ttf': 'font'
        }
        return typeMap[extension || ''] || 'other'
    }

    private setupUserInteractionMonitoring() {
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement
            const startTime = performance.now()

            requestAnimationFrame(() => {
                const endTime = performance.now()

                this.recordUserInteraction({
                    interactionType: 'click',
                    elementSelector: this.getElementSelector(target),
                    duration: endTime - startTime
                })
            })
        })

        let navigationStartTime = performance.now()

        window.addEventListener('beforeunload', () => {
            const sessionDuration = performance.now() - navigationStartTime
            this.recordMetric('Session Duration', sessionDuration)
        })

        let scrollTimer: NodeJS.Timeout
        let scrollStart = 0

        window.addEventListener('scroll', () => {
            if (!scrollStart) {
                scrollStart = performance.now()
            }

            clearTimeout(scrollTimer)
            scrollTimer = setTimeout(() => {
                const scrollDuration = performance.now() - scrollStart
                this.recordUserInteraction({
                    interactionType: 'scroll',
                    duration: scrollDuration
                })
                scrollStart = 0
            }, 150)
        }, { passive: true })
    }

    private getElementSelector(element: HTMLElement): string {
        if (element.id) return `#${element.id}`
        if (element.className) return `.${element.className.split(' ')[0]}`
        return element.tagName.toLowerCase()
    }

    private setupPerformanceObservers() {
        if ('PerformanceObserver' in window) {
            try {
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        this.recordMetric(`Long Task`, entry.duration, {
                            attribution: (entry as any).attribution?.[0]?.name || 'unknown'
                        })
                    })
                })

                longTaskObserver.observe({ entryTypes: ['longtask'] })
                this.observers.set('longtask', longTaskObserver)
            } catch (error) {
                console.warn('Long task monitoring unavailable:', error)
            }

            try {
                const layoutShiftObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        const layoutShift = entry as any
                        if (!layoutShift.hadRecentInput && layoutShift.value > 0.001) {
                            this.recordMetric('Layout Shift', layoutShift.value * 1000, {
                                sources: layoutShift.sources?.map((source: any) => ({
                                    node: source.node?.tagName || 'unknown',
                                    currentRect: source.currentRect,
                                    previousRect: source.previousRect
                                }))
                            })
                        }
                    })
                })

                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
                this.observers.set('layout-shift', layoutShiftObserver)
            } catch (error) {
                console.warn('Layout shift monitoring unavailable:', error)
            }
        }
    }

    public recordMetric(name: string, value: number, metadata?: Record<string, any>) {
        const metric: PerformanceMetric = {
            name,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId(),
            metadata
        }

        this.metrics.push(metric)

        if (value > 5000) {
            errorManager.reportingService?.reportPerformanceIssue?.(name, value)
        }

        this.checkBatchFlush()
    }

    public recordComponentMetric(
        componentName: string,
        renderType: ComponentPerformanceMetric['renderType'],
        value: number,
        metadata?: Partial<ComponentPerformanceMetric>
    ) {
        const metric: ComponentPerformanceMetric = {
            name: `Component: ${componentName}`,
            componentName,
            renderType,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId(),
            ...metadata
        }

        this.componentMetrics.push(metric)
        this.checkBatchFlush()
    }

    private recordUserInteraction(interaction: Omit<UserInteractionMetric, keyof PerformanceMetric>) {
        const metric: UserInteractionMetric = {
            ...interaction,
            name: `User Interaction: ${interaction.interactionType}`,
            value: interaction.duration || 0,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
        }

        this.userInteractions.push(metric)
        this.checkBatchFlush()
    }

    private checkBatchFlush() {
        const totalMetrics = this.metrics.length +
            this.webVitalsMetrics.length +
            this.userInteractions.length +
            this.componentMetrics.length

        if (totalMetrics >= this.batchSize) {
            this.flushMetrics()
        }
    }

    private startBatchFlushTimer() {
        setInterval(() => {
            this.flushMetrics()
        }, this.flushInterval)
    }

    private async flushMetrics() {
        if (this.metrics.length === 0 &&
            this.webVitalsMetrics.length === 0 &&
            this.userInteractions.length === 0 &&
            this.componentMetrics.length === 0) {
            return
        }

        const payload = {
            metrics: [...this.metrics],
            webVitals: [...this.webVitalsMetrics],
            userInteractions: [...this.userInteractions],
            componentMetrics: [...this.componentMetrics],
            timestamp: Date.now(),
            sessionId: this.getSessionId()
        }

        this.metrics = []
        this.webVitalsMetrics = []
        this.userInteractions = []
        this.componentMetrics = []

        try {
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics/performance', JSON.stringify(payload))
            } else {
                fetch('/api/analytics/performance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(error => {
                    console.warn('Failed to send performance metrics:', error)
                })
            }
        } catch (error) {
            console.warn('Failed to flush performance metrics:', error)
        }
    }

    private getSessionId(): string {
        let sessionId = sessionStorage.getItem('perf-session-id')
        if (!sessionId) {
            sessionId = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            sessionStorage.setItem('perf-session-id', sessionId)
        }
        return sessionId
    }

    public measureFunction<T extends (...args: any[]) => any>(
        fn: T,
        name: string,
        component?: string
    ): T {
        return ((...args: Parameters<T>) => {
            const start = performance.now()
            const result = fn(...args)
            const end = performance.now()

            if (component) {
                this.recordComponentMetric(component, 'update', end - start)
            } else {
                this.recordMetric(name, end - start)
            }

            return result
        }) as T
    }

    public measureAsyncFunction<T extends (...args: any[]) => Promise<any>>(
        fn: T,
        name: string,
        component?: string
    ): T {
        return (async (...args: Parameters<T>) => {
            const start = performance.now()
            const result = await fn(...args)
            const end = performance.now()

            if (component) {
                this.recordComponentMetric(component, 'update', end - start)
            } else {
                this.recordMetric(name, end - start)
            }

            return result
        }) as T
    }

    public destroy() {
        this.observers.forEach(observer => observer.disconnect())
        this.observers.clear()
        this.flushMetrics()
    }
}

export const performanceAnalytics = new PerformanceAnalytics()

export function useComponentPerformance(componentName: string) {
    const renderStartTime = React.useRef<number>(0)
    const renderCount = React.useRef<number>(0)

    React.useLayoutEffect(() => {
        renderStartTime.current = performance.now()
        renderCount.current += 1
    })

    React.useEffect(() => {
        const renderTime = performance.now() - renderStartTime.current
        performanceAnalytics.recordComponentMetric(
            componentName,
            renderCount.current === 1 ? 'initial' : 'update',
            renderTime
        )
    })

    return {
        recordMetric: (name: string, value: number) =>
            performanceAnalytics.recordComponentMetric(componentName, 'update', value, { name }),
        measureFunction: <T extends (...args: any[]) => any>(fn: T, name: string) =>
            performanceAnalytics.measureFunction(fn, name, componentName)
    }
}