import * as React from 'react'
import { storage } from '@/lib/utils'

const STORAGE_KEY = 'sidebar-collapsed-states'

export interface SidebarPersistenceHookReturn {
    collapsedStates: Record<string, boolean>
    toggleCollapsed: (id: string) => void
    setCollapsed: (id: string, collapsed: boolean) => void
    resetAll: () => void
    isCollapsed: (id: string, defaultValue?: boolean) => boolean
}

/**
 * Custom hook for sidebar state persistence
 * Manages collapsed/expanded states for groups and menus with localStorage persistence
 */
export const useSidebarPersistence = (
    persistenceKey?: string
): SidebarPersistenceHookReturn => {
    const storageKey = persistenceKey || STORAGE_KEY
    const [collapsedStates, setCollapsedStates] = React.useState<Record<string, boolean>>({})
    const [isHydrated, setIsHydrated] = React.useState(false)

    // Load initial state from localStorage on mount
    React.useEffect(() => {
        const loadInitialState = () => {
            try {
                const saved = storage.get(storageKey, {})
                if (saved && typeof saved === 'object') {
                    setCollapsedStates(saved)
                }
            } catch (error) {
                console.warn('Failed to load sidebar state from localStorage:', error)
            } finally {
                setIsHydrated(true)
            }
        }

        loadInitialState()
    }, [storageKey])

    // Save state to localStorage when it changes (but only after hydration)
    React.useEffect(() => {
        if (!isHydrated) return

        try {
            storage.set(storageKey, collapsedStates)
        } catch (error) {
            console.warn('Failed to save sidebar state to localStorage:', error)
        }
    }, [collapsedStates, storageKey, isHydrated])

    // Toggle collapsed state for a specific item
    const toggleCollapsed = React.useCallback((id: string) => {
        setCollapsedStates(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }, [])

    // Set collapsed state for a specific item
    const setCollapsed = React.useCallback((id: string, collapsed: boolean) => {
        setCollapsedStates(prev => ({
            ...prev,
            [id]: collapsed
        }))
    }, [])

    // Reset all collapsed states
    const resetAll = React.useCallback(() => {
        setCollapsedStates({})
    }, [])

    // Check if an item is collapsed with optional default value
    const isCollapsed = React.useCallback((id: string, defaultValue: boolean = false): boolean => {
        return collapsedStates[id] ?? defaultValue
    }, [collapsedStates])

    return {
        collapsedStates,
        toggleCollapsed,
        setCollapsed,
        resetAll,
        isCollapsed
    }
}