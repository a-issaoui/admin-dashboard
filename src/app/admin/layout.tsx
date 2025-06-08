// ============================================================================
// src/app/admin/layout.tsx - OPTIMIZED with preloading (FIXED)
// ============================================================================

import * as React from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppSidebar, AppSidebarPreloader } from '@/components/layout/admin/sidebar/app-sidebar'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { PageLanguageSelector } from '@/components/shared/page-language-selector'
import { PreloadResources } from '@/components/shared/preload-resources'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ErrorBoundary>
            {/* Preload critical resources */}
            <PreloadResources />
            <AppSidebarPreloader />

            <SidebarProvider defaultOpen={true}>
                <AppSidebar />

                <SidebarInset className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            {/* Breadcrumbs or page title can go here */}
                        </div>

                        <div className="flex items-center gap-2">
                            <PageLanguageSelector />
                            <ModeToggle />
                        </div>
                    </header>

                    <main className="flex-1 overflow-hidden">
                        <ErrorBoundary>
                            <React.Suspense fallback={
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                </div>
                            }>
                                {children}
                            </React.Suspense>
                        </ErrorBoundary>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ErrorBoundary>
    )
}