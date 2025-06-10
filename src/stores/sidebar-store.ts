// ============================================================================
// src/stores/sidebar-store.ts - Simplified Sidebar Management
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SidebarData } from '@/types'

interface SidebarState {
    data: SidebarData
    collapsedItems: Record<string, boolean>
    isLoading: boolean
}

interface SidebarActions {
    setData: (data: SidebarData) => void
    toggleItem: (id: string) => void
    setItemCollapsed: (id: string, collapsed: boolean) => void
    setLoading: (loading: boolean) => void
}

type SidebarStore = SidebarState & SidebarActions

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set, get) => ({
            // State
            data: [],
            collapsedItems: {},
            isLoading: false,

            // Actions
            setData: (data) => set({ data, isLoading: false }),

            toggleItem: (id) => set((state) => ({
                collapsedItems: {
                    ...state.collapsedItems,
                    [id]: !state.collapsedItems[id]
                }
            })),

            setItemCollapsed: (id, collapsed) => set((state) => ({
                collapsedItems: {
                    ...state.collapsedItems,
                    [id]: collapsed
                }
            })),

            setLoading: (isLoading) => set({ isLoading })
        }),
        {
            name: 'sidebar-store',
            partialize: (state) => ({ collapsedItems: state.collapsedItems })
        }
    )
)

// Simple selectors
export const useSidebarData = () => useSidebarStore(state => state.data)
export const useSidebarLoading = () => useSidebarStore(state => state.isLoading)
export const useToggleSidebarItem = () => useSidebarStore(state => state.toggleItem)
export const useSidebarCollapsed = (id: string) =>
    useSidebarStore(state => state.collapsedItems[id] ?? false)