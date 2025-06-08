// ============================================================================
// src/lib/stores/sidebar-store.ts - OPTIMIZED with proper selectors (FIXED)
// ============================================================================

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { SidebarStore, SidebarData, ProcessedGroup } from '@/types/sidebar'

interface OptimizedSidebarStore extends SidebarStore {
    processedData: ProcessedGroup[]
    isDataLoaded: boolean
    setProcessedData: (data: ProcessedGroup[]) => void
    invalidateCache: () => void
    getCollapsedState: (id: string) => boolean
    hasNotifications: (groupId: string) => boolean
}

export const useSidebarStore = create<OptimizedSidebarStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // State
                data: [],
                processedData: [],
                collapsedStates: {},
                isLoading: false,
                isDataLoaded: false,
                error: null,

                // Actions
                setData: (data: SidebarData) => {
                    set({ data, isDataLoaded: true, error: null })
                },

                setProcessedData: (processedData: ProcessedGroup[]) => {
                    set({ processedData })
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

                invalidateCache: () => {
                    set({ processedData: [] })
                },

                // Helper methods
                getCollapsedState: (id: string) => {
                    const state = get()
                    return state.collapsedStates[id] ?? false
                },

                hasNotifications: (groupId: string) => {
                    const state = get()
                    const group = state.data.find(g => g.id === groupId)
                    if (!group) return false

                    return group.menu.some(item => {
                        // Check if item has badge with count
                        if (item.badge?.count) {
                            const count = typeof item.badge.count === 'string'
                                ? parseInt(item.badge.count, 10)
                                : item.badge.count
                            if (!isNaN(count) && count > 0) return true
                        }

                        // Check submenu items
                        if (item.submenu) {
                            return item.submenu.some(sub => {
                                if (sub.badge?.count) {
                                    const count = typeof sub.badge.count === 'string'
                                        ? parseInt(sub.badge.count, 10)
                                        : sub.badge.count
                                    return !isNaN(count) && count > 0
                                }
                                return false
                            })
                        }

                        return false
                    })
                }
            }),
            {
                name: 'sidebar-store',
                partialize: (state) => ({
                    collapsedStates: state.collapsedStates,
                    data: state.data,
                    isDataLoaded: state.isDataLoaded
                })
            }
        )
    )
)

// Optimized selectors with proper typing
export const useSidebarData = () => useSidebarStore(state => state.data)
export const useSidebarProcessedData = () => useSidebarStore(state => state.processedData)
export const useSidebarCollapsedStates = () => useSidebarStore(state => ({
    collapsedStates: state.collapsedStates,
    toggleCollapsed: state.toggleCollapsed,
    setCollapsed: state.setCollapsed,
    getCollapsedState: state.getCollapsedState
}))
export const useIsSidebarDataLoaded = () => useSidebarStore(state => state.isDataLoaded)
export const useSidebarError = () => useSidebarStore(state => state.error)
export const useSidebarLoading = () => useSidebarStore(state => state.isLoading)

// Specific selectors for performance
export const useSidebarNotifications = (groupId?: string) => {
    return useSidebarStore(state => {
        if (!groupId) {
            // Return total notifications across all groups
            return state.data.reduce((total, group) => {
                return total + (state.hasNotifications(group.id) ? 1 : 0)
            }, 0)
        }
        return state.hasNotifications(groupId)
    })
}

// Memoized selector for active items
export const useSidebarActiveItems = (pathname: string) => {
    return useSidebarStore(state => {
        const activeItems: string[] = []

        state.data.forEach(group => {
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
    })
}