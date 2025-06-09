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
                icon: { name: 'HouseIcon', size: 20, weight: 'regular' },
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
                icon: { name: 'ChartBarIcon', size: 20, weight: 'bold' },
                badge: { count: 12, color: 'blue' }
            },
            {
                id: 'reports',
                titleKey: 'reports',
                url: '/admin/reports',
                icon: { name: 'FileTextIcon', size: 20, weight: 'light' },
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
                icon: { name: 'HouseIcon', size: 20, weight: 'fill' }
            },
            {
                id: 'inbox',
                titleKey: 'inbox',
                url: '/inbox',
                icon: { name: 'EnvelopeIcon', size: 20, weight: 'regular' },
                badge: { count: 5, color: 'red' }
            },
            {
                id: 'notifications',
                titleKey: 'notifications',
                icon: { name: 'BellIcon', size: 20, weight: 'bold' },
                defaultExpanded: true,
                submenu: [
                    {
                        id: 'all-notifications',
                        titleKey: 'notifications',
                        url: '/notifications',
                        icon: { name: 'BellIcon', size: 16, weight: 'fill' },
                        badge: { count: 8, color: 'blue' }
                    },
                    {
                        id: 'pending-notifications',
                        titleKey: 'pending',
                        url: '/notifications/pending',
                        icon: { name: 'ClockIcon', size: 16, weight: 'light' },
                        badge: { count: 3, color: 'yellow' }
                    }
                ]
            },
            {
                id: 'messages',
                titleKey: 'messages',
                url: '/messages',
                icon: { name: 'EnvelopeIcon', size: 20, weight: 'duotone' },
                badge: { count: 3, color: 'green' }
            }
        ]
    },
    // Projects Group
    {
        id: 'projects',
        titleKey: 'projects', // FIX: Just 'projects'
        collapsible: true,
        defaultOpen: true,
        order: 2,
        menu: [
            {
                id: 'calendar',
                titleKey: 'calendar', // FIX: Just 'calendar'
                icon: { name: 'CalendarIcon', size: 20, weight: 'regular' },
                defaultExpanded: false,
                submenu: [
                    {
                        id: 'events',
                        titleKey: 'events', // FIX: Just 'events'
                        url: '/calendar/events',
                        icon: { name: 'CalendarCheckIcon', size: 16, weight: 'bold' },
                        badge: { count: 5, color: 'blue' }
                    },
                    {
                        id: 'reminders',
                        titleKey: 'reminders', // FIX: Just 'reminders'
                        url: '/calendar/reminders',
                        icon: { name: 'BellIcon', size: 16, weight: 'light' },
                        badge: { color: 'green', variant: 'ghost' }
                    },
                    {
                        id: 'holidays',
                        titleKey: 'holidays', // FIX: Just 'holidays'
                        url: '/calendar/holidays',
                        icon: { name: 'StarIcon', size: 16, weight: 'fill' },
                        badge: { count: 2, color: 'yellow' }
                    }
                ]
            },
            {
                id: 'project-list',
                titleKey: 'projects', // FIX: Just 'projects'
                icon: { name: 'FolderIcon', size: 20, weight: 'duotone' },
                submenu: [
                    {
                        id: 'active-projects',
                        titleKey: 'activeProjects', // FIX: Just 'activeProjects'
                        url: '/projects/active',
                        icon: { name: 'PlayIcon', size: 16, weight: 'fill' },
                        badge: { count: 7, color: 'green', variant: 'outline' }
                    },
                    {
                        id: 'completed-projects',
                        titleKey: 'completed', // FIX: Just 'completed'
                        url: '/projects/completed',
                        icon: { name: 'CheckCircleIcon', size: 16, weight: 'bold' },
                        badge: { count: 23, color: 'blue' }
                    },
                    {
                        id: 'archived-projects',
                        titleKey: 'archived', // FIX: Just 'archived'
                        url: '/projects/archived',
                        icon: { name: 'ArchiveIcon', size: 16, weight: 'light' },
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
                titleKey: 'teams', // FIX: Just 'teams'
                url: '/teams',
                icon: { name: 'UsersIcon', size: 20, weight: 'bold' },
                badge: { count: 0, color: 'orange' },
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
        titleKey: 'management', // FIX: Just 'management'
        collapsible: true,
        defaultOpen: false,
        order: 3,
        menu: [
            {
                id: 'users',
                titleKey: 'users', // FIX: Just 'users'
                icon: { name: 'UserIcon', size: 20, weight: 'regular' },
                submenu: [
                    {
                        id: 'all-users',
                        titleKey: 'allUsers', // FIX: Just 'allUsers'
                        url: '/users',
                        icon: { name: 'UsersIcon', size: 16, weight: 'bold' },
                        badge: { count: 156, color: 'blue' }
                    },
                    {
                        id: 'admins',
                        titleKey: 'admins', // FIX: Just 'admins'
                        url: '/users/admins',
                        icon: { name: 'ShieldIcon', size: 16, weight: 'fill' },
                        badge: { count: 5, color: 'red' }
                    },
                    {
                        id: 'pending-users',
                        titleKey: 'pending', // FIX: Just 'pending'
                        url: '/users/pending',
                        icon: { name: 'ClockIcon', size: 16, weight: 'light' },
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
                titleKey: 'roles', // FIX: Just 'roles'
                url: '/roles',
                icon: { name: 'KeyIcon', size: 20, weight: 'duotone' },
                badge: { color: 'purple', variant: 'outline' },
                actions: [
                    { id: 'create-role', type: 'create', shortcut: '⌘R' }
                ]
            },
            {
                id: 'audit',
                titleKey: 'audit', // FIX: Just 'audit'
                url: '/audit',
                icon: { name: 'FileTextIcon', size: 20, weight: 'thin' },
                badge: { color: 'gray' },
                actions: [
                    { id: 'export-logs', type: 'export', shortcut: '⌘L' },
                    { id: 'clear-logs', type: 'delete', variant: 'destructive' }
                ]
            }
        ]
    }
]