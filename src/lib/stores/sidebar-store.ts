// ============================================================================
// src/lib/stores/sidebar-store.ts - OPTIMIZED with caching (FIXED)
// ============================================================================

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import type { SidebarStore, SidebarData, ProcessedGroup } from '@/types/sidebar'

interface CachedSidebarStore extends SidebarStore {
    processedData: ProcessedGroup[]
    isDataLoaded: boolean
    setProcessedData: (data: ProcessedGroup[]) => void
    invalidateCache: () => void
}

export const useSidebarStore = create<CachedSidebarStore>()(
    subscribeWithSelector(
        persist(
            (set) => ({
                // State
                data: [],
                processedData: [],
                collapsedStates: {},
                isLoading: false,
                isDataLoaded: false,
                error: null,

                // Actions
                setData: (data: SidebarData) => {
                    set({ data, isDataLoaded: true })
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

// Optimized selectors
export const useSidebarData = () => useSidebarStore(state => state.data)
export const useSidebarProcessedData = () => useSidebarStore(state => state.processedData)
export const useSidebarCollapsedStates = () => useSidebarStore(state => state.collapsedStates)
export const useIsSidebarDataLoaded = () => useSidebarStore(state => state.isDataLoaded)