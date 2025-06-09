// ============================================================================
// src/data/sidebar-data.ts - FIXED ICON NAMES
// ============================================================================

import type { SidebarData } from '@/types/sidebar'

export const sidebarData: SidebarData = [
    {
        id: 'dashboard',
        titleKey: 'dashboard',
        order: 1,
        menu: [
            {
                id: 'overview',
                titleKey: 'overview',
                url: '/admin',
                icon: { name: 'House', size: 20, weight: 'regular' },
                badge: { count: 5, color: 'red' },
                actions: [
                    { id: 'refresh-overview', type: 'refresh', shortcut: '⌘R' },
                    { id: 'export-overview', type: 'export' }
                ]
            },
            {
                id: 'analytics',
                titleKey: 'analytics',
                url: '/admin/analytics',
                icon: { name: 'ChartBar', size: 20, weight: 'bold' },
                badge: { count: 12, color: 'blue' }
            },
            {
                id: 'reports',
                titleKey: 'reports',
                url: '/admin/reports',
                icon: { name: 'FileText', size: 20, weight: 'light' },
                badge: { count: 3, color: 'green' }
            }
        ]
    },
    {
        id: 'navigation',
        menu: [
            {
                id: 'home',
                titleKey: 'home',
                url: '/home',
                icon: { name: 'House', size: 20, weight: 'fill' }
            },
            {
                id: 'inbox',
                titleKey: 'inbox',
                url: '/inbox',
                icon: { name: 'Envelope', size: 20, weight: 'regular' },
                badge: { count: 5, color: 'red' }
            },
            {
                id: 'notifications',
                titleKey: 'notifications',
                icon: { name: 'Bell', size: 20, weight: 'bold' },
                defaultExpanded: true,
                // Show notification indicator even with no specific count
                badge: { color: 'red' }, // This will show as a red dot
                submenu: [
                    {
                        id: 'all-notifications',
                        titleKey: 'notifications',
                        url: '/notifications',
                        icon: { name: 'Bell', size: 16, weight: 'fill' },
                        badge: { count: 8, color: 'blue' }
                    },
                    {
                        id: 'pending-notifications',
                        titleKey: 'pending',
                        url: '/notifications/pending',
                        icon: { name: 'Clock', size: 16, weight: 'light' },
                        badge: { count: 3, color: 'yellow' }
                    }
                ]
            },
            {
                id: 'messages',
                titleKey: 'messages',
                url: '/messages',
                icon: { name: 'Envelope', size: 20, weight: 'duotone' },
                badge: { count: 3, color: 'green' }
            },
            {
                id: 'drafts',
                titleKey: 'drafts',
                url: '/drafts',
                icon: { name: 'FileText', size: 20, weight: 'light' }, // Fixed: was DocumentIcon
                // Show notification indicator for items that have activity but no specific count
                badge: { color: 'orange' }
            }
        ]
    },
    // Projects Group
    {
        id: 'projects',
        titleKey: 'projects',
        collapsible: true,
        defaultOpen: true,
        order: 2,
        menu: [
            {
                id: 'calendar',
                titleKey: 'calendar',
                icon: { name: 'Calendar', size: 20, weight: 'regular' },
                defaultExpanded: false,
                // Show indicator for has activity
                badge: { color: 'blue' },
                submenu: [
                    {
                        id: 'events',
                        titleKey: 'events',
                        url: '/calendar/events',
                        icon: { name: 'CalendarCheck', size: 16, weight: 'bold' },
                        badge: { count: 5, color: 'blue' }
                    },
                    {
                        id: 'reminders',
                        titleKey: 'reminders',
                        url: '/calendar/reminders',
                        icon: { name: 'Bell', size: 16, weight: 'light' },
                        badge: { color: 'green', variant: 'ghost' }
                    },
                    {
                        id: 'holidays',
                        titleKey: 'holidays',
                        url: '/calendar/holidays',
                        icon: { name: 'Star', size: 16, weight: 'fill' },
                        badge: { count: 2, color: 'yellow' }
                    }
                ]
            },
            {
                id: 'project-list',
                titleKey: 'projects',
                icon: { name: 'Folder', size: 20, weight: 'duotone' },
                badge: { count: 42, color: 'purple' }, // Total projects indicator
                submenu: [
                    {
                        id: 'active-projects',
                        titleKey: 'activeProjects',
                        url: '/projects/active',
                        icon: { name: 'Play', size: 16, weight: 'fill' },
                        badge: { count: 7, color: 'green', variant: 'outline' }
                    },
                    {
                        id: 'completed-projects',
                        titleKey: 'completed',
                        url: '/projects/completed',
                        icon: { name: 'CheckCircle', size: 16, weight: 'bold' },
                        badge: { count: 23, color: 'blue' }
                    },
                    {
                        id: 'archived-projects',
                        titleKey: 'archived',
                        url: '/projects/archived',
                        icon: { name: 'Archive', size: 16, weight: 'light' },
                        badge: { count: 12, color: 'gray' }
                    }
                ],
                actions: [
                    { id: 'new-project', type: 'create', shortcut: '⌘⇧N' },
                    { id: 'import-project', type: 'import' }
                ]
            },
            {
                id: 'teams',
                titleKey: 'teams',
                url: '/teams',
                icon: { name: 'Users', size: 20, weight: 'bold' },
                // Show indicator for teams with activity but no urgent count
                badge: { color: 'orange' },
                actions: [
                    { id: 'create-team', type: 'create' }
                ]
            }
        ],
        actions: [
            { id: 'export-all-projects', type: 'export', shortcut: '⌘⇧E' },
            { id: 'project-settings', type: 'settings' }
        ]
    },

    // Management Group
    {
        id: 'management',
        titleKey: 'management',
        collapsible: true,
        defaultOpen: false,
        order: 3,
        menu: [
            {
                id: 'users',
                titleKey: 'users',
                icon: { name: 'User', size: 20, weight: 'regular' },
                badge: { count: 173, color: 'blue' }, // Total users count
                submenu: [
                    {
                        id: 'all-users',
                        titleKey: 'allUsers',
                        url: '/users',
                        icon: { name: 'Users', size: 16, weight: 'bold' },
                        badge: { count: 156, color: 'blue' }
                    },
                    {
                        id: 'admins',
                        titleKey: 'admins',
                        url: '/users/admins',
                        icon: { name: 'Shield', size: 16, weight: 'fill' },
                        badge: { count: 5, color: 'red' }
                    },
                    {
                        id: 'pending-users',
                        titleKey: 'pending',
                        url: '/users/pending',
                        icon: { name: 'Clock', size: 16, weight: 'light' },
                        badge: { count: 12, color: 'yellow' }
                    }
                ],
                actions: [
                    { id: 'create-user', type: 'create' },
                    { id: 'export-users', type: 'export' }
                ]
            },
            {
                id: 'roles',
                titleKey: 'roles',
                url: '/roles',
                icon: { name: 'Key', size: 20, weight: 'duotone' },
                badge: { color: 'purple', variant: 'outline' },
                actions: [
                    { id: 'create-role', type: 'create', shortcut: '⌘R' }
                ]
            },
            {
                id: 'audit',
                titleKey: 'audit',
                url: '/audit',
                icon: { name: 'FileText', size: 20, weight: 'thin' },
                // Show indicator for audit activity
                badge: { color: 'gray' },
                actions: [
                    { id: 'export-logs', type: 'export', shortcut: '⌘L' },
                    { id: 'clear-logs', type: 'delete', variant: 'destructive' }
                ]
            }
        ]
    }
]