import type { SidebarData } from '@/types'

export const SIDEBAR_DATA: SidebarData = [
  {
    id: 'main',
    titleKey: 'main',
    order: 1,
    menu: [
      {
        id: 'dashboard',
        titleKey: 'dashboard',
        url: '/admin',
        icon: { name: 'House' }
      },
      {
        id: 'users',
        titleKey: 'users',
        url: '/admin/users',
        icon: { name: 'Users' },
        badge: { count: 5, color: 'blue' }
      },
      {
        id: 'analytics',
        titleKey: 'analytics',
        url: '/admin/analytics',
        icon: { name: 'ChartBar' }
      }
    ]
  },
  {
    id: 'system',
    titleKey: 'system',
    order: 2,
    menu: [
      {
        id: 'settings',
        titleKey: 'settings',
        url: '/admin/settings',
        icon: { name: 'Gear' }
      }
    ]
  }
]
