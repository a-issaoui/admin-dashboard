import * as React from 'react'
import { accessibilityCore, AccessibilityPreferences, FocusManagementOptions } from '@/lib/accessibility/core'

export function useAccessibility() {
    const [preferences, setPreferences] = React.useState<AccessibilityPreferences>(
        accessibilityCore.getPreferences()
    )

    const updatePreferences = React.useCallback((newPreferences: Partial<AccessibilityPreferences>) => {
        accessibilityCore.updatePreferences(newPreferences)
        setPreferences(accessibilityCore.getPreferences())
    }, [])

    const announceToScreenReader = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        accessibilityCore.updateAriaLiveRegion(message, priority)
    }, [])

    const manageFocus = React.useCallback((options: FocusManagementOptions) => {
        return accessibilityCore.manageFocus(options)
    }, [])

    return {
        preferences,
        updatePreferences,
        announceToScreenReader,
        manageFocus
    }
}

export function useKeyboardNavigation(containerRef: React.RefObject<HTMLElement>) {
    React.useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowUp':
                    e.preventDefault()
                    const focusableElements = container.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ) as NodeListOf<HTMLElement>

                    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement)
                    let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1

                    if (nextIndex < 0) nextIndex = focusableElements.length - 1
                    if (nextIndex >= focusableElements.length) nextIndex = 0

                    focusableElements[nextIndex]?.focus()
                    break

                case 'Home':
                    e.preventDefault()
                    const firstElement = container.querySelector(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ) as HTMLElement
                    firstElement?.focus()
                    break

                case 'End':
                    e.preventDefault()
                    const allElements = container.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    ) as NodeListOf<HTMLElement>
                    allElements[allElements.length - 1]?.focus()
                    break
            }
        }

        container.addEventListener('keydown', handleKeyDown)
        return () => container.removeEventListener('keydown', handleKeyDown)
    }, [containerRef])
}