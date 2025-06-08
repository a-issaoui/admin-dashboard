// ============================================================================
// src/app/admin/layout.tsx - OPTIMIZED with better performance
// ============================================================================

import * as React from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppSidebar } from '@/components/layout/admin/sidebar/app-sidebar'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { PageLanguageSelector } from '@/components/shared/page-language-selector'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

interface AdminLayoutProps {
    children: React.ReactNode
}

// Remove preloader component as it's causing the loading flash
export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ErrorBoundary>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />

                <SidebarInset className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
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
                            {children}
                        </ErrorBoundary>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ErrorBoundary>
    )
}