// Sidebar hooks barrel exports
export { useSidebarData, useSidebarActions } from './useSidebarData'
export { useSidebarPersistence } from './useSidebarPersistence'
export { useKeyboardNavigation } from './useKeyboardNavigation'

// Re-export types for convenience
export type {
    SidebarPersistenceHookReturn,
} from './useSidebarPersistence'

export type {
    ProcessedGroup,
    ProcessedMenu,
    ProcessedSubMenu,
    SidebarDataHookReturn,
    SidebarActionsHookReturn
} from '@/types/ProcessedSidebarData'