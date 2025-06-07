// data/sidebarData.ts
import type { SidebarData } from '@/types/SidebarData'
import { createSidebarData } from '@/lib/utils'

// Define your sidebar data with action types instead of functions
const sidebarDataRaw = [
    {
        title: 'Dashboard',
        color: '#1e40af',
        // Group-level actions for Dashboard
        actions: [
            {
                id: 'refresh-all-dashboard',
                label: 'Refresh All Dashboard',
                icon: { name: 'ArrowClockwiseIcon', size: 16, weight: 'regular' },
                actionType: 'refresh' as const,
                shortcut: '⌘⇧R'
            },
            {
                id: 'export-dashboard-data',
                label: 'Export Dashboard Data',
                icon: { name: 'DownloadIcon', size: 16, weight: 'regular' },
                actionType: 'export' as const
            },
            {
                id: 'dashboard-preferences',
                label: 'Dashboard Preferences',
                icon: { name: 'SlidersIcon', size: 16, weight: 'regular' },
                actionType: 'settings' as const
            }
        ],
        menu: [
            {
                title: 'Overview',
                icon: { name: 'HouseLineIcon', size: 20, weight: 'regular' },
                url: '/admin',
                color: '#1f2937',
                badge: { count: '5', color: 'red' as const },
                tooltip: 'Dashboard Overview',
                actions: [
                    {
                        id: 'refresh',
                        label: 'Refresh Data',
                        icon: { name: 'ArrowClockwiseIcon', size: 16, weight: 'regular' },
                        actionType: 'refresh' as const,
                        shortcut: '⌘R'
                    },
                    {
                        id: 'settings',
                        label: 'Dashboard Settings',
                        icon: { name: 'GearIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    }
                ]
            },
            {
                title: 'Analytics',
                icon: { name: 'ChartBarIcon', size: 20, weight: 'bold', color: '#3b82f6' },
                url: '/admin/analytics',
                color: '#3b82f6',
                badge: { count: '12', color: 'blue' as const },
                actions: [
                    {
                        id: 'export',
                        label: 'Export Data',
                        icon: { name: 'DownloadIcon', size: 16, weight: 'regular' },
                        actionType: 'export' as const,
                        shortcut: '⌘E'
                    },
                    {
                        id: 'configure',
                        label: 'Configure Analytics',
                        icon: { name: 'SlidersIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    }
                ]
            },
            {
                title: 'Reports',
                icon: { name: 'FileTextIcon', size: 20, weight: 'light' },
                url: '/admin/reports',
                color: '#059669',
                badge: { count: '3', color: 'green' as const },
                actions: [
                    {
                        id: 'generate',
                        label: 'Generate Report',
                        icon: { name: 'PlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const
                    },
                    {
                        id: 'schedule',
                        label: 'Schedule Reports',
                        icon: { name: 'CalendarIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    }
                ]
            },
            {
                title: 'Settings',
                icon: { name: 'GearIcon', size: 20, weight: 'duotone' },
                url: '/admin/settings',
                color: '#d97706',
                badge: { count: '2', color: 'orange' as const },
                actions: [
                    {
                        id: 'backup',
                        label: 'Backup Settings',
                        icon: { name: 'CloudArrowUpIcon', size: 16, weight: 'regular' },
                        actionType: 'export' as const
                    },
                    {
                        id: 'restore',
                        label: 'Restore Settings',
                        icon: { name: 'CloudArrowDownIcon', size: 16, weight: 'regular' },
                        actionType: 'import' as const
                    }
                ]
            },
        ],
    },
    {
        // No title, no color for this group - no group actions
        menu: [
            {
                title: 'Home',
                url: '/home',
                icon: { name: 'HouseLineIcon', size: 20, weight: 'fill' },
                color: '#374151',
            },
            {
                title: 'Inbox',
                url: '/inbox',
                icon: { name: 'EnvelopeIcon', size: 20, weight: 'regular', color: '#dc2626' },
                color: '#dc2626',
                badge: { count: '5', color: 'red' as const },
                actions: [
                    {
                        id: 'mark-all-read',
                        label: 'Mark All as Read',
                        icon: { name: 'CheckIcon', size: 16, weight: 'regular' },
                        actionType: 'mark-read' as const,
                        shortcut: '⌘⇧R'
                    },
                    {
                        id: 'compose',
                        label: 'Compose Message',
                        icon: { name: 'PencilIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const,
                        shortcut: '⌘N'
                    }
                ]
            },
            {
                title: 'Notifications',
                icon: { name: 'BellIcon', size: 20, weight: 'bold' },
                color: '#1f2937',
                dotColor: '#ef4444',
                badge: { color: 'blue' as const, variant: 'outline' as const },
                actions: [
                    {
                        id: 'clear-all',
                        label: 'Clear All Notifications',
                        icon: { name: 'TrashIcon', size: 16, weight: 'regular' },
                        actionType: 'clear-all' as const,
                        variant: 'destructive' as const
                    },
                    {
                        id: 'notification-settings',
                        label: 'Notification Settings',
                        icon: { name: 'GearIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    }
                ],
                submenu: [
                    {
                        title: 'All Notifications',
                        url: '/notifications/all',
                        icon: { name: 'BellIcon', size: 16, weight: 'fill', color: '#3b82f6' },
                        color: '#3b82f6',
                        badge: { count: '8', color: 'blue' as const },
                        actions: [
                            {
                                id: 'mark-read',
                                label: 'Mark as Read',
                                actionType: 'mark-read' as const
                            },
                            {
                                id: 'archive',
                                label: 'Archive',
                                actionType: 'archive' as const
                            }
                        ]
                    },
                    {
                        title: 'Unread',
                        url: '/notifications/unread',
                        icon: { name: 'MailIcon', size: 16, weight: 'bold' },
                        color: '#dc2626',
                        badge: { count: '3', color: 'red' as const, variant: 'outline' as const },
                        actions: [
                            {
                                id: 'mark-all-read',
                                label: 'Mark All as Read',
                                actionType: 'mark-read' as const
                            }
                        ]
                    },
                    {
                        title: 'Archive',
                        url: '/notifications/archive',
                        icon: { name: 'ArchiveIcon', size: 16, weight: 'light' },
                        color: '#6b7280',
                        badge: { count: '25', color: 'gray' as const },
                        actions: [
                            {
                                id: 'clear-archive',
                                label: 'Clear Archive',
                                actionType: 'delete' as const,
                                variant: 'destructive' as const
                            }
                        ]
                    },
                ],
            },
            {
                title: 'Messages',
                url: '/messages',
                icon: { name: 'EnvelopeIcon', size: 20, weight: 'duotone', color: '#059669' },
                color: '#059669',
                badge: { count: '3', color: 'green' as const, variant: 'ghost' as const },
                actions: [
                    {
                        id: 'new-message',
                        label: 'New Message',
                        icon: { name: 'PlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const,
                        shortcut: '⌘M'
                    }
                ]
            },
            {
                title: 'Drafts',
                url: '/drafts',
                icon: { name: 'FileTextIcon', size: 20, weight: 'thin' },
                color: '#7c3aed',
                badge: { count: '8', color: 'purple' as const },
                actions: [
                    {
                        id: 'clear-drafts',
                        label: 'Clear All Drafts',
                        icon: { name: 'TrashIcon', size: 16, weight: 'regular' },
                        actionType: 'delete' as const,
                        variant: 'destructive' as const
                    }
                ]
            },
        ],
    },
    {
        title: 'Analytics',
        color: '#059669',
        collapsible: true,
        // Group-level actions for Analytics
        actions: [
            {
                id: 'export-all-analytics',
                label: 'Export All Analytics',
                icon: { name: 'DownloadSimpleIcon', size: 16, weight: 'regular' },
                actionType: 'export' as const,
                shortcut: '⌘⇧E'
            },
            {
                id: 'refresh-analytics',
                label: 'Refresh Analytics Data',
                icon: { name: 'ArrowsClockwiseIcon', size: 16, weight: 'regular' },
                actionType: 'refresh' as const
            },
            {
                id: 'analytics-settings',
                label: 'Analytics Settings',
                icon: { name: 'GearSixIcon', size: 16, weight: 'regular' },
                actionType: 'settings' as const
            }
        ],
        menu: [
            {
                title: 'Calendar',
                icon: { name: 'CalendarIcon', size: 20, weight: 'regular' },
                color: '#1f2937',
                dotColor: '#f59e0b',
                badge: { color: 'orange' as const },
                actions: [
                    {
                        id: 'sync-calendar',
                        label: 'Sync Calendar',
                        icon: { name: 'ArrowPathIcon', size: 16, weight: 'regular' },
                        actionType: 'refresh' as const
                    },
                    {
                        id: 'export-calendar',
                        label: 'Export Calendar',
                        icon: { name: 'CalendarDaysIcon', size: 16, weight: 'regular' },
                        actionType: 'export' as const
                    }
                ],
                submenu: [
                    {
                        title: 'Events',
                        url: '/calendar/events',
                        icon: { name: 'CalendarCheckIcon', size: 16, weight: 'bold' },
                        color: '#3b82f6',
                        badge: { count: '5', color: 'blue' as const },
                        actions: [
                            {
                                id: 'new-event',
                                label: 'New Event',
                                actionType: 'create' as const
                            }
                        ]
                    },
                    {
                        title: 'Reminders',
                        url: '/admin',
                        icon: { name: 'BellIcon', size: 16, weight: 'light' },
                        color: '#059669',
                        badge: { color: 'green' as const, variant: 'ghost' as const },
                    },
                    {
                        title: 'Holidays',
                        url: '/calendar/holidays',
                        icon: { name: 'StarIcon', size: 16, weight: 'fill', color: '#eab308' },
                        color: '#eab308',
                        badge: { count: '2', color: 'yellow' as const },
                    },
                ],
            },
            {
                title: 'Projects',
                icon: { name: 'FolderIcon', size: 20, weight: 'duotone' },
                color: '#1f2937',
                dotColor: '#10b981',
                badge: { color: 'green' as const, variant: 'outline' as const },
                actions: [
                    {
                        id: 'new-project',
                        label: 'New Project',
                        icon: { name: 'PlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const,
                        shortcut: '⌘⇧N'
                    },
                    {
                        id: 'import-project',
                        label: 'Import Project',
                        icon: { name: 'DownloadIcon', size: 16, weight: 'regular' },
                        actionType: 'import' as const
                    },
                    {
                        id: 'project-settings',
                        label: 'Project Settings',
                        icon: { name: 'GearIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    }
                ],
                submenu: [
                    {
                        title: 'Active Projects',
                        url: '/projects/active',
                        icon: { name: 'PlayIcon', size: 16, weight: 'fill', color: '#059669' },
                        color: '#059669',
                        badge: { count: '7', color: 'green' as const, variant: 'outline' as const },
                        actions: [
                            {
                                id: 'pause-all',
                                label: 'Pause All Projects',
                                actionType: 'pause' as const
                            },
                            {
                                id: 'export-active',
                                label: 'Export Active Projects',
                                actionType: 'export' as const
                            }
                        ]
                    },
                    {
                        title: 'Completed',
                        url: '/projects/completed',
                        icon: { name: 'CheckCircleIcon', size: 16, weight: 'bold' ,color: '#5c5c5c'},
                        color: '#3b82f6',
                        badge: { count: '23', color: 'red' as const },
                        actions: [
                            {
                                id: 'archive-completed',
                                label: 'Archive Completed',
                                actionType: 'archive' as const
                            },
                            {
                                id: 'generate-report',
                                label: 'Generate Report',
                                actionType: 'create' as const
                            }
                        ]
                    },
                    {
                        title: 'Archived Projects',
                        url: '/projects/archived',
                        icon: { name: 'ArchiveIcon', size: 16, weight: 'light' },
                        color: '#6b7280',
                        badge: { count: '12', color: 'gray' as const },
                        actions: [
                            {
                                id: 'restore-archived',
                                label: 'Restore Project',
                                actionType: 'resume' as const
                            },
                            {
                                id: 'delete-permanently',
                                label: 'Delete Permanently',
                                actionType: 'delete' as const,
                                variant: 'destructive' as const
                            }
                        ]
                    },
                ],
            },
            {
                title: 'Teams',
                url: '/teams',
                icon: { name: 'UsersIcon', size: 20, weight: 'bold', color: '#ec4899' },
                color: '#ec4899',
                badge: { count: '0', color: 'pink' as const },
                actions: [
                    {
                        id: 'create-team',
                        label: 'Create Team',
                        icon: { name: 'PlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const
                    },
                    {
                        id: 'invite-members',
                        label: 'Invite Members',
                        icon: { name: 'UserPlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const
                    }
                ]
            },
        ],
    },
    {
        title: 'Management',
        color: '#7c3aed',
        collapsible: true,
        menu: [
            {
                title: 'Users',
                icon: { name: 'UserIcon', size: 20, weight: 'regular' },
                color: '#1f2937',
                dotColor: '#3b82f6',
                badge: { count: '156', color: 'blue' as const },
                submenu: [
                    {
                        title: 'All Users',
                        url: '/users',
                        icon: { name: 'UsersIcon', size: 16, weight: 'bold' },
                        color: '#3b82f6',
                        badge: { count: '156', color: 'blue' as const },
                    },
                    {
                        title: 'Admins',
                        url: '/admin',
                        icon: { name: 'ShieldIcon', size: 16, weight: 'fill', color: '#dc2626' },
                        color: '#dc2626',
                        badge: { count: '5', color: 'red' as const },
                        actions: [
                            {
                                id: 'promote-user',
                                label: 'Promote User to Admin',
                                actionType: 'edit' as const
                            },
                            {
                                id: 'admin-audit',
                                label: 'Admin Activity Audit',
                                actionType: 'export' as const
                            }
                        ]
                    },
                    {
                        title: 'Pending',
                        url: '/users/pending',
                        icon: { name: 'ClockIcon', size: 16, weight: 'light' },
                        color: '#d97706',
                        badge: { count: '12', color: 'yellow' as const },
                        actions: [
                            {
                                id: 'approve-all',
                                label: 'Approve All Pending',
                                actionType: 'approve' as const
                            },
                            {
                                id: 'reject-all',
                                label: 'Reject All Pending',
                                actionType: 'reject' as const,
                                variant: 'destructive' as const
                            },
                            {
                                id: 'send-reminder',
                                label: 'Send Reminder Emails',
                                actionType: 'create' as const
                            }
                        ]
                    },
                ],
            },
            {
                title: 'Roles & Permissions',
                url: '/roles',
                icon: { name: 'KeyIcon', size: 20, weight: 'duotone', color: '#7c3aed' },
                color: '#7c3aed',
                badge: { color: 'purple' as const, variant: 'outline' as const },
                actions: [
                    {
                        id: 'create-role',
                        label: 'Create New Role',
                        icon: { name: 'PlusIcon', size: 16, weight: 'regular' },
                        actionType: 'create' as const,
                        shortcut: '⌘R'
                    },
                    {
                        id: 'permission-matrix',
                        label: 'Permission Matrix',
                        icon: { name: 'TableIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    },
                    {
                        id: 'role-audit',
                        label: 'Role Assignment Audit',
                        icon: { name: 'MagnifyingGlassIcon', size: 16, weight: 'regular' },
                        actionType: 'export' as const
                    }
                ]
            },
            {
                title: 'Audit Logs',
                url: '/audit',
                icon: { name: 'FileTextIcon', size: 20, weight: 'thin' },
                color: '#6b7280',
                badge: { color: 'gray' as const },
                actions: [
                    {
                        id: 'export-logs',
                        label: 'Export Audit Logs',
                        icon: { name: 'DownloadIcon', size: 16, weight: 'regular' },
                        actionType: 'export' as const,
                        shortcut: '⌘L'
                    },
                    {
                        id: 'filter-logs',
                        label: 'Advanced Log Filter',
                        icon: { name: 'FunnelIcon', size: 16, weight: 'regular' },
                        actionType: 'settings' as const
                    },
                    {
                        id: 'archive-logs',
                        label: 'Archive Old Logs',
                        icon: { name: 'ArchiveIcon', size: 16, weight: 'regular' },
                        actionType: 'archive' as const
                    },
                    {
                        id: 'clear-logs',
                        label: 'Clear All Logs',
                        icon: { name: 'TrashIcon', size: 16, weight: 'regular' },
                        actionType: 'delete' as const,
                        variant: 'destructive' as const
                    }
                ]
            },
        ],
    },
]

// Export the sidebar data with auto-generated IDs
export const SidebarMenudata: SidebarData = createSidebarData(sidebarDataRaw)