import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ProcessedGroup, ProcessedMenu, ProcessedSubMenu } from '@/types/ProcessedSidebarData'

interface KeyboardNavigationOptions {
    enabled?: boolean
    enableShortcuts?: boolean
    enableArrowNavigation?: boolean
    enableHomeEnd?: boolean
    enableTypeAhead?: boolean
}

/**
 * Enhanced keyboard navigation hook for sidebar
 */
export const useKeyboardNavigation = (
    processedData: ProcessedGroup[],
    options: KeyboardNavigationOptions = {}
) => {
    const {
        enabled = true,
        enableShortcuts = true,
        enableArrowNavigation = true,
        enableHomeEnd = true,
        enableTypeAhead = true
    } = options

    const router = useRouter()
    const [currentFocusIndex, setCurrentFocusIndex] = React.useState<number>(-1)
    const [typeAheadQuery, setTypeAheadQuery] = React.useState<string>('')
    const typeAheadTimeoutRef = React.useRef<NodeJS.Timeout>()

    // Flatten all navigable items
    const navigableItems = React.useMemo(() => {
        const items: Array<{ item: ProcessedMenu | ProcessedSubMenu; type: 'menu' | 'submenu'; url?: string }> = []

        processedData.forEach(group => {
            group.menu.forEach(menu => {
                if (!menu.disabled && !menu.hidden) {
                    items.push({ item: menu, type: 'menu', url: menu.url })

                    if (menu.submenu && menu.hasActiveChild) {
                        menu.submenu.forEach(sub => {
                            if (!sub.disabled && !sub.hidden) {
                                items.push({ item: sub, type: 'submenu', url: sub.url })
                            }
                        })
                    }
                }
            })
        })

        return items
    }, [processedData])

    // Collect all shortcuts
    const shortcuts = React.useMemo(() => {
        const shortcutMap = new Map<string, () => void>()

        processedData.forEach(group => {
            group.menu.forEach(menu => {
                if (menu.shortcut && menu.url) {
                    shortcutMap.set(menu.shortcut.toLowerCase(), () => {
                        router.push(menu.url!)
                    })
                }

                menu.submenu?.forEach(sub => {
                    if (sub.shortcut && sub.url) {
                        shortcutMap.set(sub.shortcut.toLowerCase(), () => {
                            router.push(sub.url)
                        })
                    }
                })

                menu.actions?.forEach(action => {
                    if (action.shortcut) {
                        shortcutMap.set(action.shortcut.toLowerCase(), () => {
                            // Trigger action execution
                            console.log(`Executing action: ${action.label}`)
                        })
                    }
                })
            })
        })

        return shortcutMap
    }, [processedData, router])

    // Type-ahead search
    const handleTypeAhead = React.useCallback((char: string) => {
        if (!enableTypeAhead) return

        clearTimeout(typeAheadTimeoutRef.current)

        const newQuery = typeAheadQuery + char.toLowerCase()
        setTypeAheadQuery(newQuery)

        // Find matching item
        const matchIndex = navigableItems.findIndex(({ item }) =>
            item.title.toLowerCase().startsWith(newQuery)
        )

        if (matchIndex !== -1) {
            setCurrentFocusIndex(matchIndex)
            // Focus the actual element
            const element = document.querySelector(`[data-sidebar-item="${matchIndex}"]`) as HTMLElement
            element?.focus()
        }

        // Clear type-ahead after delay
        typeAheadTimeoutRef.current = setTimeout(() => {
            setTypeAheadQuery('')
        }, 1000)
    }, [typeAheadQuery, navigableItems, enableTypeAhead])

    // Navigation functions
    const navigateToIndex = React.useCallback((index: number) => {
        if (index < 0 || index >= navigableItems.length) return

        setCurrentFocusIndex(index)
        const element = document.querySelector(`[data-sidebar-item="${index}"]`) as HTMLElement
        element?.focus()
    }, [navigableItems.length])

    const navigateNext = React.useCallback(() => {
        const nextIndex = currentFocusIndex < navigableItems.length - 1
            ? currentFocusIndex + 1
            : 0
        navigateToIndex(nextIndex)
    }, [currentFocusIndex, navigableItems.length, navigateToIndex])

    const navigatePrevious = React.useCallback(() => {
        const prevIndex = currentFocusIndex > 0
            ? currentFocusIndex - 1
            : navigableItems.length - 1
        navigateToIndex(prevIndex)
    }, [currentFocusIndex, navigableItems.length, navigateToIndex])

    const navigateToFirst = React.useCallback(() => {
        navigateToIndex(0)
    }, [navigateToIndex])

    const navigateToLast = React.useCallback(() => {
        navigateToIndex(navigableItems.length - 1)
    }, [navigableItems.length, navigateToIndex])

    const activateCurrentItem = React.useCallback(() => {
        const currentItem = navigableItems[currentFocusIndex]
        if (currentItem?.url) {
            router.push(currentItem.url)
        }
    }, [currentFocusIndex, navigableItems, router])

    // Keyboard event handler
    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        if (!enabled) return

        const { key, metaKey, ctrlKey, altKey, shiftKey } = event
        const modifierKey = metaKey || ctrlKey

        // Handle shortcuts
        if (enableShortcuts && (modifierKey || altKey)) {
            const shortcutKey = `${modifierKey ? 'cmd+' : ''}${altKey ? 'alt+' : ''}${shiftKey ? 'shift+' : ''}${key.toLowerCase()}`
            const shortcutHandler = shortcuts.get(shortcutKey)

            if (shortcutHandler) {
                event.preventDefault()
                shortcutHandler()
                return
            }
        }

        // Handle arrow navigation
        if (enableArrowNavigation) {
            switch (key) {
                case 'ArrowDown':
                    event.preventDefault()
                    navigateNext()
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    navigatePrevious()
                    break
                case 'Enter':
                case ' ':
                    event.preventDefault()
                    activateCurrentItem()
                    break
            }
        }

        // Handle Home/End
        if (enableHomeEnd) {
            switch (key) {
                case 'Home':
                    event.preventDefault()
                    navigateToFirst()
                    break
                case 'End':
                    event.preventDefault()
                    navigateToLast()
                    break
            }
        }

        // Handle type-ahead
        if (enableTypeAhead && key.length === 1 && !modifierKey && !altKey) {
            handleTypeAhead(key)
        }

        // Handle Escape - clear focus and type-ahead
        if (key === 'Escape') {
            setCurrentFocusIndex(-1)
            setTypeAheadQuery('')
            const activeElement = document.activeElement as HTMLElement
            activeElement?.blur()
        }
    }, [
        enabled,
        enableShortcuts,
        enableArrowNavigation,
        enableHomeEnd,
        enableTypeAhead,
        shortcuts,
        navigateNext,
        navigatePrevious,
        navigateToFirst,
        navigateToLast,
        activateCurrentItem,
        handleTypeAhead
    ])

    // Attach/detach keyboard listeners
    React.useEffect(() => {
        if (!enabled) return

        document.addEventListener('keydown', handleKeyDown, true)

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true)
            clearTimeout(typeAheadTimeoutRef.current)
        }
    }, [enabled, handleKeyDown])

    // Provide data attributes for focus management
    const getItemProps = React.useCallback((index: number) => ({
        'data-sidebar-item': index,
        'data-focused': currentFocusIndex === index,
        tabIndex: currentFocusIndex === index ? 0 : -1,
        onFocus: () => setCurrentFocusIndex(index),
        onBlur: () => {
            // Only clear focus if not moving to another sidebar item
            setTimeout(() => {
                const newFocused = document.activeElement?.getAttribute('data-sidebar-item')
                if (!newFocused) {
                    setCurrentFocusIndex(-1)
                }
            }, 0)
        }
    }), [currentFocusIndex])

    return {
        // State
        currentFocusIndex,
        typeAheadQuery,
        navigableItems,

        // Actions
        navigateNext,
        navigatePrevious,
        navigateToFirst,
        navigateToLast,
        navigateToIndex,
        activateCurrentItem,

        // Props helpers
        getItemProps,

        // Utils
        clearTypeAhead: () => setTypeAheadQuery(''),
        clearFocus: () => setCurrentFocusIndex(-1)
    }
}