import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist } from 'zustand/middleware'
import type { SidebarStore, SidebarData } from '@/types/sidebar'

export const useSidebarStore = create<SidebarStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
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