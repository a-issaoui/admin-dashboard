// ============================================================================
// src/app/admin/layout.tsx - Optimized Admin Layout
// ============================================================================

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { AppSidebar } from '@/components/layout/admin/sidebar/app-sidebar'
import { AdminHeader } from '@/components/layout/admin/header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { LoadingSpinner } from '@/components/ui/loading'

interface AdminLayoutProps {
    children: React.ReactNode
}

// Loading fallback for suspense boundaries
function AdminLayoutLoading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <LoadingSpinner size="lg" />
        </div>
    )
}

// Main content wrapper with proper error boundaries
function AdminContent({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex-1 overflow-auto" id="main-content">
            <ErrorBoundary>
                <Suspense fallback={<AdminLayoutLoading />}>
                    {children}
                </Suspense>
            </ErrorBoundary>
        </main>
    )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ErrorBoundary>
            <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full">
                    <AppSidebar />

                    <SidebarInset className="flex min-w-0 flex-1 flex-col">
                        <AdminHeader />
                        <AdminContent>
                            {children}
                        </AdminContent>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </ErrorBoundary>
    )
}