// ============================================================================
// src/lib/accessibility/core.ts - FIXED for exactOptionalPropertyTypes
// ============================================================================

export interface AccessibilityPreferences {
    reduceMotion: boolean
    highContrast: boolean
    largeText: boolean
    screenReader: boolean
    keyboardNavigation: boolean
    autoplayMedia: boolean
    colorBlindnessType: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'none'
}

export interface FocusManagementOptions {
    trap: boolean
    restore: boolean
    initialFocus?: HTMLElement | string
    finalFocus?: HTMLElement | string
    skipLinks?: boolean
}

class AccessibilityCore {
    private preferences: AccessibilityPreferences
    private announcements: HTMLElement[]
    private focusHistory: HTMLElement[]
    private skipLinksContainer?: HTMLElement
    private colorFilters: Map<string, string>

    constructor() {
        this.preferences = this.detectSystemPreferences()
        this.announcements = []
        this.focusHistory = []
        this.colorFilters = new Map([
            ['protanopia', 'sepia(1) saturate(0.8) hue-rotate(340deg)'],
            ['deuteranopia', 'sepia(1) saturate(0.6) hue-rotate(80deg)'],
            ['tritanopia', 'sepia(1) saturate(0.7) hue-rotate(200deg)']
        ])

        if (typeof window !== 'undefined') {
            this.initializeAccessibilityFeatures()
        }
    }

    private detectSystemPreferences(): AccessibilityPreferences {
        if (typeof window === 'undefined') {
            return {
                reduceMotion: false,
                highContrast: false,
                largeText: false,
                screenReader: false,
                keyboardNavigation: false,
                autoplayMedia: false,
                colorBlindnessType: 'none'
            }
        }

        return {
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            largeText: window.matchMedia('(min-resolution: 120dpi)').matches,
            screenReader: this.detectScreenReader(),
            keyboardNavigation: false,
            autoplayMedia: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            colorBlindnessType: this.getStoredColorBlindnessType()
        }
    }

    private detectScreenReader(): boolean {
        if (typeof window === 'undefined') return false

        const hasAriaSupport = 'ariaLabel' in document.createElement('div')
        const hasScreenReaderClass = document.body.classList.contains('sr-only')
        const hasAriaLiveRegion = document.querySelector('[aria-live]') !== null

        return hasAriaSupport || hasScreenReaderClass || hasAriaLiveRegion
    }

    private getStoredColorBlindnessType(): AccessibilityPreferences['colorBlindnessType'] {
        const stored = localStorage.getItem('accessibility-color-blindness')
        const validTypes: AccessibilityPreferences['colorBlindnessType'][] = ['protanopia', 'deuteranopia', 'tritanopia', 'none']

        if (stored && validTypes.includes(stored as AccessibilityPreferences['colorBlindnessType'])) {
            return stored as AccessibilityPreferences['colorBlindnessType']
        }

        return 'none'
    }

    private initializeAccessibilityFeatures() {
        this.createSkipLinks()
        this.setupKeyboardDetection()
        this.setupPreferencesMonitoring()
        this.applyAccessibilityFeatures()
        this.createAriaLiveRegions()
    }

    private createSkipLinks() {
        const skipLinks = document.createElement('div')
        skipLinks.id = 'skip-links'
        skipLinks.className = 'skip-links sr-only-focusable'
        skipLinks.setAttribute('role', 'navigation')
        skipLinks.setAttribute('aria-label', 'Skip navigation links')

        const skipToMain = this.createSkipLink('#main-content', 'Skip to main content')
        const skipToNav = this.createSkipLink('#main-navigation', 'Skip to navigation')
        const skipToSearch = this.createSkipLink('#search', 'Skip to search')

        skipLinks.appendChild(skipToMain)
        skipLinks.appendChild(skipToNav)
        skipLinks.appendChild(skipToSearch)

        document.body.insertBefore(skipLinks, document.body.firstChild)
        this.skipLinksContainer = skipLinks
    }

    private createSkipLink(target: string, text: string): HTMLAnchorElement {
        const link = document.createElement('a')
        link.href = target
        link.className = 'skip-link'
        link.textContent = text
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const targetElement = document.querySelector(target) as HTMLElement
            if (targetElement) {
                targetElement.focus()
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        })
        return link
    }

    private setupKeyboardDetection() {
        let keyboardUser = false

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                keyboardUser = true
                this.preferences.keyboardNavigation = true
                document.body.classList.add('keyboard-navigation')
                this.updateAriaLiveRegion('Keyboard navigation mode enabled', 'polite')
            }
        })

        document.addEventListener('mousedown', () => {
            if (keyboardUser) {
                keyboardUser = false
                this.preferences.keyboardNavigation = false
                document.body.classList.remove('keyboard-navigation')
            }
        })
    }

    private setupPreferencesMonitoring() {
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.preferences.reduceMotion = e.matches
            this.applyMotionPreferences()
        })

        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            this.preferences.highContrast = e.matches
            this.applyContrastPreferences()
        })
    }

    private applyAccessibilityFeatures() {
        this.applyMotionPreferences()
        this.applyContrastPreferences()
        this.applyTextSizePreferences()
        this.applyColorBlindnessFilter()
    }

    private applyMotionPreferences() {
        if (this.preferences.reduceMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms')
            document.documentElement.style.setProperty('--transition-duration', '0.01ms')
            document.body.classList.add('reduce-motion')
        } else {
            document.documentElement.style.removeProperty('--animation-duration')
            document.documentElement.style.removeProperty('--transition-duration')
            document.body.classList.remove('reduce-motion')
        }
    }

    private applyContrastPreferences() {
        if (this.preferences.highContrast) {
            document.body.classList.add('high-contrast')
        } else {
            document.body.classList.remove('high-contrast')
        }
    }

    private applyTextSizePreferences() {
        if (this.preferences.largeText) {
            document.body.classList.add('large-text')
        } else {
            document.body.classList.remove('large-text')
        }
    }

    private applyColorBlindnessFilter() {
        const filter = this.colorFilters.get(this.preferences.colorBlindnessType)
        if (filter && this.preferences.colorBlindnessType !== 'none') {
            document.documentElement.style.filter = filter
        } else {
            document.documentElement.style.filter = 'none'
        }
    }

    private createAriaLiveRegions() {
        const politeRegion = document.createElement('div')
        politeRegion.id = 'aria-live-polite'
        politeRegion.setAttribute('aria-live', 'polite')
        politeRegion.setAttribute('aria-atomic', 'true')
        politeRegion.className = 'sr-only'
        document.body.appendChild(politeRegion)

        const assertiveRegion = document.createElement('div')
        assertiveRegion.id = 'aria-live-assertive'
        assertiveRegion.setAttribute('aria-live', 'assertive')
        assertiveRegion.setAttribute('aria-atomic', 'true')
        assertiveRegion.className = 'sr-only'
        document.body.appendChild(assertiveRegion)

        this.announcements = [politeRegion, assertiveRegion]
    }

    public updateAriaLiveRegion(message: string, priority: 'polite' | 'assertive' = 'polite') {
        const regionId = priority === 'polite' ? 'aria-live-polite' : 'aria-live-assertive'
        const region = document.getElementById(regionId)

        if (region) {
            region.textContent = ''

            setTimeout(() => {
                region.textContent = message

                setTimeout(() => {
                    region.textContent = ''
                }, 1000)
            }, 100)
        }
    }

    public manageFocus(options: FocusManagementOptions): () => void {
        const { trap, restore, initialFocus, finalFocus } = options
        let currentFocusedElement = document.activeElement as HTMLElement

        if (restore) {
            this.focusHistory.push(currentFocusedElement)
        }

        if (initialFocus) {
            const element = typeof initialFocus === 'string'
                ? document.querySelector(initialFocus) as HTMLElement
                : initialFocus

            if (element) {
                element.focus()
                currentFocusedElement = element
            }
        }

        let cleanup: (() => void) | undefined

        if (trap) {
            cleanup = this.trapFocus(currentFocusedElement.closest('[role="dialog"], .modal, .popup') as HTMLElement)
        }

        return () => {
            if (cleanup) cleanup()

            if (restore && this.focusHistory.length > 0) {
                const elementToRestore = this.focusHistory.pop()
                if (elementToRestore && elementToRestore.isConnected) {
                    elementToRestore.focus()
                }
            } else if (finalFocus) {
                const element = typeof finalFocus === 'string'
                    ? document.querySelector(finalFocus) as HTMLElement
                    : finalFocus

                if (element) {
                    element.focus()
                }
            }
        }
    }

    private trapFocus(container: HTMLElement): () => void {
        if (!container) return () => {}

        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus()
                    e.preventDefault()
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus()
                    e.preventDefault()
                }
            }
        }

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                const event = new CustomEvent('escape-key-pressed', {
                    bubbles: true,
                    cancelable: true
                })
                container.dispatchEvent(event)
            }
        }

        container.addEventListener('keydown', handleTabKey)
        container.addEventListener('keydown', handleEscapeKey)

        firstElement?.focus()

        return () => {
            container.removeEventListener('keydown', handleTabKey)
            container.removeEventListener('keydown', handleEscapeKey)
        }
    }

    public updatePreferences(newPreferences: Partial<AccessibilityPreferences>) {
        this.preferences = { ...this.preferences, ...newPreferences }

        localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences))

        this.applyAccessibilityFeatures()

        const changes = Object.keys(newPreferences).join(', ')
        this.updateAriaLiveRegion(`Accessibility preferences updated: ${changes}`, 'polite')
    }

    public getPreferences(): AccessibilityPreferences {
        return { ...this.preferences }
    }
}

export const accessibilityCore = new AccessibilityCore()