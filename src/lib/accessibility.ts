export const a11y = {
    // Generate unique IDs for ARIA relationships
    generateId: (prefix: string): string => {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
    },

    // Focus management utilities
    focusManagement: {
        trapFocus: (container: HTMLElement) => {
            const focusableElements = container.querySelectorAll(
                'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
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

            container.addEventListener('keydown', handleTabKey)
            firstElement?.focus()

            return () => {
                container.removeEventListener('keydown', handleTabKey)
            }
        },

        restoreFocus: (previousElement?: HTMLElement | null) => {
            if (previousElement && typeof previousElement.focus === 'function') {
                previousElement.focus()
            }
        }
    },

    // Screen reader utilities
    announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const announcement = document.createElement('div')
        announcement.setAttribute('aria-live', priority)
        announcement.setAttribute('aria-atomic', 'true')
        announcement.className = 'sr-only'
        announcement.textContent = message

        document.body.appendChild(announcement)

        setTimeout(() => {
            document.body.removeChild(announcement)
        }, 1000)
    },

    // Keyboard navigation helpers
    handleKeyboardNavigation: (
        event: KeyboardEvent,
        handlers: {
            onEnter?: () => void
            onSpace?: () => void
            onEscape?: () => void
            onArrowUp?: () => void
            onArrowDown?: () => void
            onArrowLeft?: () => void
            onArrowRight?: () => void
        }
    ) => {
        const { key } = event

        switch (key) {
            case 'Enter':
                handlers.onEnter?.()
                break
            case ' ':
                event.preventDefault()
                handlers.onSpace?.()
                break
            case 'Escape':
                handlers.onEscape?.()
                break
            case 'ArrowUp':
                event.preventDefault()
                handlers.onArrowUp?.()
                break
            case 'ArrowDown':
                event.preventDefault()
                handlers.onArrowDown?.()
                break
            case 'ArrowLeft':
                event.preventDefault()
                handlers.onArrowLeft?.()
                break
            case 'ArrowRight':
                event.preventDefault()
                handlers.onArrowRight?.()
                break
        }
    }
}