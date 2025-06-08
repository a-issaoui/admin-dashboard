// ============================================================================
// src/lib/stores/sidebar-store.ts - Sidebar state management
// ============================================================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SidebarStore, SidebarData } from '@/types/sidebar'

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set, get) => ({
            // State
            data: [],
            collapsedStates: {},
            isLoading: false,
            error: null,

            // Actions
            setData: (data: SidebarData) => {
                set({ data })
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
            }
        }),
        {
            name: 'sidebar-store',
            partialize: (state) => ({
                collapsedStates: state.collapsedStates
            })
        }
    )
)
