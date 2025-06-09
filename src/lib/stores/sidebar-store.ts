import { create } from 'zustand'
import { subscribeWithSelector,persist } from 'zustand/middleware'
import type { SidebarStore, SidebarData } from '@/types/sidebar'

export const useSidebarStore = create<SidebarStore>()(
    subscribeWithSelector(
        persist(
            (set) => ({
                data: [],
                collapsedStates: {},
                isLoading: false,
                error: null,

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
                partialize: (state) => ({ collapsedStates: state.collapsedStates }),
                version: 1
            }
        )
    )
)

// Optimized selectors to prevent unnecessary re-renders
export const useSidebarData = () => useSidebarStore(state => state.data)
export const useSidebarCollapsedStates = () => useSidebarStore(state => state.collapsedStates)
export const useIsSidebarDataLoaded = () => useSidebarStore(state => state.data.length > 0)
export const useSidebarLoading = () => useSidebarStore(state => state.isLoading)
export const useSidebarError = () => useSidebarStore(state => state.error)

export const useSidebarCollapsed = (id: string) =>
    useSidebarStore(state => state.collapsedStates[id] ?? false)

// Computed selectors with memoization
export const useSidebarProcessedData = () => {
    return useSidebarStore(state => {
        if (!state.data.length) return []

        return state.data.map(group => ({
            ...group,
            menu: group.menu.map(item => ({
                ...item,
                isCollapsed: state.collapsedStates[item.id] ?? !item.defaultExpanded
            }))
        }))
    })
}

// Additional computed selectors for enhanced functionality
export const useSidebarNotifications = () => {
    return useSidebarStore(state => {
        if (!state.data.length) return 0

        return state.data.reduce((total, group) => {
            return total + group.menu.reduce((groupTotal, item) => {
                const itemCount = item.badge?.count ?
                    (typeof item.badge.count === 'string' ? parseInt(item.badge.count, 10) || 0 : item.badge.count) : 0
                const submenuCount = item.submenu?.reduce((subTotal, sub) => {
                    const subCount = sub.badge?.count ?
                        (typeof sub.badge.count === 'string' ? parseInt(sub.badge.count, 10) || 0 : sub.badge.count) : 0
                    return subTotal + subCount
                }, 0) || 0
                return groupTotal + itemCount + submenuCount
            }, 0)
        }, 0)
    })
}

export const useSidebarActiveItems = () => {
    return useSidebarStore(state => {
        if (!state.data.length) return []

        const activeItems: string[] = []

        state.data.forEach(group => {
            group.menu.forEach(item => {
                if (!state.collapsedStates[item.id]) {
                    activeItems.push(item.id)
                }
            })
        })

        return activeItems
    })
}