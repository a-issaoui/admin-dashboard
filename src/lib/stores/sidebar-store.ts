// ============================================================================
// src/lib/stores/sidebar-store.ts - FIXED TypeScript errors
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SidebarStore, SidebarData, SidebarMenuItem } from '@/types/sidebar'

// FIXED: Proper TypeScript interfaces
interface ProcessedSidebarMenuItem extends SidebarMenuItem {
    _notificationCount?: number
}

interface ProcessedSidebarData extends Omit<SidebarData[0], 'menu'> {
    menu: ProcessedSidebarMenuItem[]
}

interface OptimizedSidebarStore extends SidebarStore {
    isDataLoaded: boolean
    getCollapsedState: (id: string) => boolean
    hasNotifications: (groupId: string) => boolean
    getTotalNotifications: () => number
    getActiveItems: (pathname: string) => string[]
    processedData: ProcessedSidebarData[]
}

export const useSidebarStore = create<OptimizedSidebarStore>()(
    persist(
        (set, get) => ({
            // State
            data: [],
            collapsedStates: {},
            isLoading: false,
            isDataLoaded: false,
            error: null,
            processedData: [],

            // OPTIMIZED: Immediate data setting with processing
            setData: (data: SidebarData) => {
                // Process data immediately for better performance
                const processedData: ProcessedSidebarData[] = data.map(group => ({
                    ...group,
                    menu: group.menu.map(item => ({
                        ...item,
                        // Pre-calculate notification counts
                        _notificationCount: item.submenu?.reduce((count, sub) => {
                            if (sub.badge?.count) {
                                const badgeCount = typeof sub.badge.count === 'string'
                                    ? parseInt(sub.badge.count, 10)
                                    : sub.badge.count
                                return count + (isNaN(badgeCount) ? 0 : badgeCount)
                            }
                            return count
                        }, 0) || 0
                    }))
                }))

                set({
                    data,
                    processedData,
                    isDataLoaded: true,
                    error: null,
                    isLoading: false
                })
            },

            toggleCollapsed: (id: string) => {
                set((state) => ({
                    collapsedStates: {
                        ...state.collapsedStates,
                        [id]: !state.collapsedStates[id]
                    }
                }))
            },

            setCollapsed: (id: string, collapsed: boolean) => {
                set((state) => ({
                    collapsedStates: {
                        ...state.collapsedStates,
                        [id]: collapsed
                    }
                }))
            },

            resetCollapsed: () => {
                set({ collapsedStates: {} })
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading })
            },

            setError: (error: string | null) => {
                set({ error })
            },

            // OPTIMIZED: Memoized helper methods with better performance
            getCollapsedState: (id: string) => {
                const state = get()
                return state.collapsedStates[id] ?? false
            },

            hasNotifications: (groupId: string) => {
                const state = get()
                const group = state.processedData.find(g => g.id === groupId)
                if (!group) return false

                return group.menu.some(item => {
                    // Check if item has badge with count
                    if (item.badge?.count) {
                        const count = typeof item.badge.count === 'string'
                            ? parseInt(item.badge.count, 10)
                            : item.badge.count
                        if (!isNaN(count) && count > 0) return true
                    }

                    // FIXED: Use properly typed notification count
                    return (item as ProcessedSidebarMenuItem)._notificationCount! > 0
                })
            },

            // NEW: Get total notifications across all groups
            getTotalNotifications: () => {
                const state = get()
                return state.processedData.reduce((total, group) => {
                    const groupNotifications = group.menu.reduce((groupTotal, item) => {
                        let itemTotal = 0

                        // Add item badge count
                        if (item.badge?.count) {
                            const count = typeof item.badge.count === 'string'
                                ? parseInt(item.badge.count, 10)
                                : item.badge.count
                            itemTotal += isNaN(count) ? 0 : count
                        }

                        // FIXED: Add submenu notification count with proper typing
                        itemTotal += (item as ProcessedSidebarMenuItem)._notificationCount || 0

                        return groupTotal + itemTotal
                    }, 0)

                    return total + groupNotifications
                }, 0)
            },

            // NEW: Get active items for a given pathname
            getActiveItems: (pathname: string) => {
                const state = get()
                const activeItems: string[] = []

                state.processedData.forEach(group => {
                    group.menu.forEach(item => {
                        if (item.url === pathname) {
                            activeItems.push(item.id)
                        }

                        if (item.submenu) {
                            item.submenu.forEach(sub => {
                                if (sub.url === pathname) {
                                    activeItems.push(item.id, sub.id)
                                }
                            })
                        }
                    })
                })

                return activeItems
            }
        }),
        {
            name: 'sidebar-store',
            partialize: (state) => ({
                collapsedStates: state.collapsedStates,
                // Don't persist data to prevent stale data issues
            })
        }
    )
)

// OPTIMIZED: Lightweight selectors with better performance
export const useSidebarData = () => useSidebarStore(state => state.processedData)
export const useSidebarCollapsedStates = () => useSidebarStore(state => ({
    collapsedStates: state.collapsedStates,
    toggleCollapsed: state.toggleCollapsed,
    setCollapsed: state.setCollapsed,
    getCollapsedState: state.getCollapsedState
}))
export const useIsSidebarDataLoaded = () => useSidebarStore(state => state.isDataLoaded)

// OPTIMIZED: Specific selectors for notifications
export const useSidebarNotifications = (groupId?: string) => {
    return useSidebarStore(state => {
        if (!groupId) {
            return state.getTotalNotifications()
        }
        return state.hasNotifications(groupId)
    })
}

// OPTIMIZED: Memoized selector for active items
export const useSidebarActiveItems = (pathname: string) => {
    return useSidebarStore(state => state.getActiveItems(pathname))
}

// NEW: Performance-focused selectors
export const useSidebarProcessedData = () => useSidebarStore(state => state.processedData)
export const useSidebarError = () => useSidebarStore(state => state.error)
export const useSidebarLoading = () => useSidebarStore(state => state.isLoading)