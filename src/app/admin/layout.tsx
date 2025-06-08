// ============================================================================
// src/app/admin/layout.tsx - PERFORMANCE OPTIMIZED with monitoring
// ============================================================================

import * as React from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppSidebar } from '@/components/layout/admin/sidebar/app-sidebar'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { PageLanguageSelector } from '@/components/shared/page-language-selector'
import { PreloadResources } from '@/components/shared/preload-resources'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

interface AdminLayoutProps {
    children: React.ReactNode
}

// OPTIMIZED: Memoized header component
const AdminHeader = React.memo(function AdminHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="flex items-center gap-2">
                {/* Breadcrumbs or page title can go here */}
            </div>

            <div className="flex items-center gap-2">
                <PageLanguageSelector />
                <ModeToggle />
            </div>
        </header>
    )
})

// OPTIMIZED: Memoized main content wrapper
const AdminMain = React.memo(function AdminMain({
                                                    children
                                                }: {
    children: React.ReactNode
}) {
    return (
        <main className="flex-1 overflow-hidden">
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </main>
    )
})

// OPTIMIZED: Memoized sidebar wrapper
const SidebarWrapper = React.memo(function SidebarWrapper() {
    return <AppSidebar />
})

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ErrorBoundary>
            {/* OPTIMIZED: Preload critical resources */}
            <PreloadResources
                preloadImages={[
                    // Add any critical images that should be preloaded
                ]}
                preloadFonts={[
                    // Add any critical fonts that should be preloaded
                ]}
            />

            <SidebarProvider defaultOpen={true}>
                <SidebarWrapper />

                <SidebarInset className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader />
                    <AdminMain>
                        {children}
                    </AdminMain>
                </SidebarInset>
            </SidebarProvider>
        </ErrorBoundary>
    )
}