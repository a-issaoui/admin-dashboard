// ============================================================================
// src/lib/performance-analytics.ts - FIXED for web-vitals v5 API
// ============================================================================
import * as React from 'react'
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'
import { errorManager } from './error-management'
import { TypedError } from '@/types/common';

export interface PerformanceMetric {
    name: string
    value: number
    timestamp: number
    url: string
    userAgent: string
    sessionId: string
    metadata: Record<string, unknown>
}

export interface WebVitalsMetric extends PerformanceMetric {
    metricType: 'CLS' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
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
        } catch (error: unknown) {
            await errorManager.handleError(
                new TypedError(
                    'Failed to initialize performance monitoring',
                    'PERF_INIT_ERROR',
                    500,
                    errorManager.createErrorContext('PerformanceAnalytics', 'initialize', { error: (error as Error).message })
                )
            )
        }
    }

    private async setupWebVitalsMonitoring() {
        try {
            const vitalsHandler = (metric: Metric) => {
                const webVitalsMetric: WebVitalsMetric = {
                    name: metric.name,
                    metricType: metric.name as WebVitalsMetric['metricType'],
                    value: metric.value,
                    delta: metric.delta,
                    id: metric.id,
                    rating: metric.rating,
                    timestamp: Date.now(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    sessionId: this.getSessionId(),
                    metadata: {
                        entries: metric.entries?.map((entry: PerformanceEntry) => ({
                            name: entry.name,
                            startTime: entry.startTime,
                            duration: entry.duration
                        })) || []
                    }
                }

                this.webVitalsMetrics.push(webVitalsMetric)
                this.checkBatchFlush()
            }

            onCLS(vitalsHandler)
            onFCP(vitalsHandler)
            onLCP(vitalsHandler)
            onTTFB(vitalsHandler)
            onINP(vitalsHandler)

        } catch (error: unknown) {
            console.warn('Web Vitals monitoring unavailable:', (error as Error).message)
        }
    }

    private getVitalsRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
        const thresholds: Record<string, { good: number; poor: number }> = {
            CLS: { good: 0.1, poor: 0.25 },
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
        } catch (error: unknown) {
            console.warn('Resource timing monitoring unavailable:', (error as Error).message)
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
                    duration: endTime - startTime,
                    metadata: {}
                })
            })
        })

        const navigationStartTime = performance.now()

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
                    duration: scrollDuration,
                    metadata: {}
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
                    list.getEntries().forEach((entry: PerformanceEntry) => {
                        this.recordMetric(`Long Task`, entry.duration, {
                            attribution: (entry as any).attribution?.[0]?.name || 'unknown'
                        })
                    })
                })

                longTaskObserver.observe({ entryTypes: ['longtask'] })
                this.observers.set('longtask', longTaskObserver)
            } catch (error: unknown) {
                console.warn('Long task monitoring unavailable:', (error as Error).message)
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
                                })) || []
                            })
                        }
                    })
                })

                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
                this.observers.set('layout-shift', layoutShiftObserver)
            } catch (error: unknown) {
                console.warn('Layout shift monitoring unavailable:', (error as Error).message)
            }
        }
    }

    public recordMetric(name: string, value: number, metadata?: Record<string, unknown>) {
        const metric: PerformanceMetric = {
            name,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId(),
            metadata: metadata || {}
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
        metadata: Partial<Omit<ComponentPerformanceMetric, 'name' | 'componentName' | 'renderType' | 'value' | 'timestamp' | 'url' | 'userAgent' | 'sessionId' | 'metadata'>> & { metadata?: Record<string, unknown> } = {}
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
            metadata: metadata.metadata || {},
            ...metadata
        }

        this.componentMetrics.push(metric)
        this.checkBatchFlush()
    }

    private recordUserInteraction(interaction: Omit<UserInteractionMetric, 'name' | 'value' | 'timestamp' | 'url' | 'userAgent' | 'sessionId' >) {
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
                }).catch((error: unknown) => {
                    console.warn('Failed to send performance metrics:', (error as Error).message)
                })
            }
        } catch (error: unknown) {
            console.warn('Failed to flush performance metrics:', (error as Error).message)
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

    public measureFunction<T extends (...args: unknown[]) => unknown>(
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

    public measureAsyncFunction<T extends (...args: unknown[]) => Promise<unknown>>(
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
            performanceAnalytics.recordComponentMetric(componentName, 'update', value, { metadata: { name } }),
        measureFunction: <T extends (...args: unknown[]) => unknown>(fn: T, name: string) =>
            performanceAnalytics.measureFunction(fn, name, componentName)
    }
}