// ============================================================================
// src/components/layout/admin/sidebar/server-sidebar-data.tsx - SSR OPTIMIZED
// ============================================================================

import { headers } from 'next/headers'
import { sidebarData } from '@/data/sidebar-data'
import { orgData } from '@/data/org-data'
import { userData } from '@/data/user-data'
import type { SidebarData } from '@/types/sidebar'

// Server component to provide sidebar data with SSR
export async function getSidebarServerData() {
    // Get locale from headers for server-side rendering
    const headersList = await headers()
    const locale = headersList.get('x-locale') || 'en'

    // Return static data that can be hydrated on client
    return {
        sidebarData,
        orgData,
        userData,
        locale,
        timestamp: Date.now()
    }
}

// Server component wrapper for sidebar data
export async function ServerSidebarData() {
    const data = await getSidebarServerData()

    // Inject data into script tag for client hydration
    return (
        <script
            id="sidebar-server-data"
            type="application/json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data)
            }}
            suppressHydrationWarning
        />
    )
}

// Client-side hook to get server data
export function useServerSidebarData() {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const script = document.getElementById('sidebar-server-data')
        if (!script) return null

        return JSON.parse(script.textContent || '{}')
    } catch (error) {
        console.warn('Failed to parse server sidebar data:', error)
        return null
    }
}