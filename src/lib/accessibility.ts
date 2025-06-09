// ============================================================================
// src/lib/accessibility.ts - Accessibility utility functions
// ============================================================================

interface KeyboardNavigationHandlers {
    onEnter?: () => void
    onSpace?: () => void
    onArrowRight?: () => void
    onArrowLeft?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onHome?: () => void
    onEnd?: () => void
    onEscape?: () => void
}

class AccessibilityUtils {
    /**
     * Generate a unique, accessible ID for ARIA attributes
     */
    generateId(prefix: string, ...parts: (string | number)[]): string {
        const cleanParts = parts
            .filter(part => part !== undefined && part !== null && part !== '')
            .map(part => String(part).replace(/[^a-zA-Z0-9-_]/g, '-'))
            .filter(part => part.length > 0)

        const timestamp = Date.now().toString(36).slice(-4)
        return `${prefix}-${cleanParts.join('-')}-${timestamp}`
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
        if (typeof document === 'undefined') return

        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', priority)
        announcement.setAttribute('aria-atomic', 'true')
        announcement.className = 'sr-only'
        announcement.textContent = message

        document.body.appendChild(announcement)

        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement)
            }
        }, 1000)
    }

    /**
     * Handle keyboard navigation events
     */
    handleKeyboardNavigation(
        event: React.KeyboardEvent,
        handlers: KeyboardNavigationHandlers
    ): void {
        const { key, shiftKey, ctrlKey, metaKey, altKey } = event

        // Don't handle if modifier keys are pressed (except Shift for Tab)
        if ((ctrlKey || metaKey || altKey) && key !== 'Tab') {
            return
        }

        switch (key) {
            case 'Enter':
                if (handlers.onEnter) {
                    event.preventDefault()
                    handlers.onEnter()
                }
                break

            case ' ':
            case 'Space':
                if (handlers.onSpace) {
                    event.preventDefault()
                    handlers.onSpace()
                }
                break

            case 'ArrowRight':
                if (handlers.onArrowRight) {
                    event.preventDefault()
                    handlers.onArrowRight()
                }
                break

            case 'ArrowLeft':
                if (handlers.onArrowLeft) {
                    event.preventDefault()
                    handlers.onArrowLeft()
                }
                break

            case 'ArrowUp':
                if (handlers.onArrowUp) {
                    event.preventDefault()
                    handlers.onArrowUp()
                }
                break

            case 'ArrowDown':
                if (handlers.onArrowDown) {
                    event.preventDefault()
                    handlers.onArrowDown()
                }
                break

            case 'Home':
                if (handlers.onHome) {
                    event.preventDefault()
                    handlers.onHome()
                }
                break

            case 'End':
                if (handlers.onEnd) {
                    event.preventDefault()
                    handlers.onEnd()
                }
                break

            case 'Escape':
                if (handlers.onEscape) {
                    event.preventDefault()
                    handlers.onEscape()
                }
                break
        }
    }

    /**
     * Get the first focusable element within a container
     */
    getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ')

        return container.querySelector(focusableSelector)
    }

    /**
     * Get all focusable elements within a container
     */
    getFocusableElements(container: HTMLElement): HTMLElement[] {
        const focusableSelector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ')

        return Array.from(container.querySelectorAll(focusableSelector))
    }

    /**
     * Check if an element is currently visible and focusable
     */
    isElementFocusable(element: HTMLElement): boolean {
        if (!element || element.getAttribute('disabled') !== null) {
            return false
        }

        const style = window.getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') {
            return false
        }

        if (element.offsetParent === null && style.position !== 'fixed') {
            return false
        }

        return true
    }

    /**
     * Trap focus within a container element
     */
    trapFocus(container: HTMLElement): () => void {
        const focusableElements = this.getFocusableElements(container)
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

        container.addEventListener('keydown', handleTabKey)
        firstElement?.focus()

        // Return cleanup function
        return () => {
            container.removeEventListener('keydown', handleTabKey)
        }
    }

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion(): boolean {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    /**
     * Check if high contrast mode is preferred
     */
    prefersHighContrast(): boolean {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(prefers-contrast: high)').matches
    }

    /**
     * Create an aria-describedby relationship
     */
    createAriaDescribedBy(element: HTMLElement, descriptionId: string): void {
        const currentDescribedBy = element.getAttribute('aria-describedby')
        const describedByIds = currentDescribedBy ? currentDescribedBy.split(' ') : []

        if (!describedByIds.includes(descriptionId)) {
            describedByIds.push(descriptionId)
            element.setAttribute('aria-describedby', describedByIds.join(' '))
        }
    }

    /**
     * Remove an aria-describedby relationship
     */
    removeAriaDescribedBy(element: HTMLElement, descriptionId: string): void {
        const currentDescribedBy = element.getAttribute('aria-describedby')
        if (!currentDescribedBy) return

        const describedByIds = currentDescribedBy
            .split(' ')
            .filter(id => id !== descriptionId)

        if (describedByIds.length === 0) {
            element.removeAttribute('aria-describedby')
        } else {
            element.setAttribute('aria-describedby', describedByIds.join(' '))
        }
    }
}

export const a11y = new AccessibilityUtils()
export default a11y
// src/lib/accessibility.ts
// Add at the end of the file:
export * from './accessibility/core'