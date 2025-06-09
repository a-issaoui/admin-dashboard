// ============================================================================
// src/lib/stores/sidebar-store.ts - SIMPLIFIED APPROACH
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SidebarStore, SidebarData } from '@/types/sidebar'

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set, _get) => ({
            // State
            data: [],
            collapsedStates: {},
            isLoading: false,
            error: null,

            // Actions - Keep them simple
            setData: (data: SidebarData) => {
                set({ data, isLoading: false, error: null })
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

            resetCollapsed: () => set({ collapsedStates: {} }),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setError: (error: string | null) => set({ error })
        }),
        {
            name: 'sidebar-store',
            partialize: (state) => ({ collapsedStates: state.collapsedStates })
        }
    )
)

// Simple selectors - let React handle the optimization
export const useSidebarData = () => useSidebarStore(state => state.data)
export const useSidebarCollapsed = (id: string) =>
    useSidebarStore(state => state.collapsedStates[id] ?? false)

// Compatibility exports for existing code
export const useSidebarProcessedData = useSidebarData
export const useSidebarCollapsedStates = () => useSidebarStore(state => ({
    collapsedStates: state.collapsedStates,
    toggleCollapsed: state.toggleCollapsed,
    setCollapsed: state.setCollapsed
}))
export const useIsSidebarDataLoaded = () => useSidebarStore(state => state.data.length > 0)
export const useSidebarError = () => useSidebarStore(state => state.error)
export const useSidebarLoading = () => useSidebarStore(state => state.isLoading)

// Additional compatibility exports
export const useSidebarNotifications = (groupId?: string) => {
    return useSidebarStore(state => {
        if (!groupId) return 0

        // Simple notification count calculation
        const group = state.data.find(g => g.id === groupId)
        if (!group) return 0

        return group.menu.reduce((count, item) => {
            if (item.badge?.count) {
                const badgeCount = typeof item.badge.count === 'string'
                    ? parseInt(item.badge.count, 10)
                    : item.badge.count
                return count + (isNaN(badgeCount) ? 0 : badgeCount)
            }
            return count
        }, 0)
    })
}

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