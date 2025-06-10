// ============================================================================
// src/app/admin/page.tsx - Optimized Admin Dashboard
// ============================================================================

'use client'

import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingCard, LoadingPage } from '@/components/ui/loading'
import { useIsRTL } from '@/stores/locale-store'
import { cn } from '@/lib/utils'

// Static data for demo - no expensive computations
const STATS_DATA = [
    {
        id: 'users',
        titleKey: 'totalUsers',
        value: '1,234',
        change: '+20.1%',
        changeType: 'positive' as const,
        icon: 'Users' as const
    },
    {
        id: 'revenue',
        titleKey: 'revenue',
        value: '$45,231',
        change: '+15.2%',
        changeType: 'positive' as const,
        icon: 'CurrencyDollar' as const
    },
    {
        id: 'orders',
        titleKey: 'orders',
        value: '573',
        change: '+12.5%',
        changeType: 'positive' as const,
        icon: 'ShoppingCart' as const
    },
    {
        id: 'active',
        titleKey: 'activeNow',
        value: '89',
        change: '+3',
        changeType: 'positive' as const,
        icon: 'Activity' as const
    }
]

const ACTIVITY_DATA = [
    {
        id: 1,
        type: 'user_registered',
        title: 'New user registered',
        time: '2 minutes ago',
        status: 'success' as const
    },
    {
        id: 2,
        type: 'order_completed',
        title: 'Order completed',
        time: '5 minutes ago',
        status: 'success' as const
    },
    {
        id: 3,
        type: 'payment_pending',
        title: 'Payment pending',
        time: '10 minutes ago',
        status: 'warning' as const
    },
    {
        id: 4,
        type: 'user_login',
        title: 'Admin user login',
        time: '15 minutes ago',
        status: 'info' as const
    }
]

// Simple stat card component
function StatCard({
                      stat,
                      isRTL
                  }: {
    stat: typeof STATS_DATA[0]
    isRTL: boolean
}) {
    const t = useTranslations('dashboard')

    const statusColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-600'
    }

    return (
        <Card>
            <CardHeader className={cn(
                "flex flex-row items-center justify-between space-y-0 pb-2",
                isRTL && "flex-row-reverse"
            )}>
                <CardTitle className="text-sm font-medium">
                    {t(stat.titleKey)}
                </CardTitle>
                <Icon name={stat.icon} size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={cn(
                    "text-xs mt-1",
                    statusColors[stat.changeType]
                )}>
                    {stat.change} from last month
                </p>
            </CardContent>
        </Card>
    )
}

// Simple activity item component
function ActivityItem({
                          activity,
                          isRTL
                      }: {
    activity: typeof ACTIVITY_DATA[0]
    isRTL: boolean
}) {
    const statusColors = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }

    const statusIcons = {
        success: 'CheckCircle',
        warning: 'Warning',
        error: 'XCircle',
        info: 'Info'
    } as const

    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors",
            isRTL && "flex-row-reverse"
        )}>
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                statusColors[activity.status]
            )}>
                <Icon
                    name={statusIcons[activity.status]}
                    size={16}
                    className="text-white"
                />
            </div>
            <div className={cn(
                "flex-1 min-w-0",
                isRTL && "text-right"
            )}>
                <p className="text-sm font-medium truncate">
                    {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">
                    {activity.time}
                </p>
            </div>
            <Badge variant="secondary" className="text-xs">
                {activity.type.replace('_', ' ')}
            </Badge>
        </div>
    )
}

// Chart placeholder component
function ChartPlaceholder() {
    return (
        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed border-muted">
            <Icon name="ChartBar" size={48} className="mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics Chart</h3>
            <p className="text-sm text-center max-w-sm">
                Chart component will be integrated here. This placeholder shows the layout structure.
            </p>
        </div>
    )
}

// Dashboard content component
function DashboardContent() {
    const t = useTranslations('dashboard')
    const isRTL = useIsRTL()

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between",
                isRTL && "flex-row-reverse"
            )}>
                <div className={cn(isRTL && "text-right")}>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>
                <Button className={cn(
                    "gap-2",
                    isRTL && "flex-row-reverse"
                )}>
                    <Icon name="Plus" size={16} />
                    {t('newItem')}
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {STATS_DATA.map((stat) => (
                    <StatCard key={stat.id} stat={stat} isRTL={isRTL} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Analytics Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('analytics')}</CardTitle>
                        <CardDescription>
                            {t('analyticsDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartPlaceholder />
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('recentActivity')}</CardTitle>
                        <CardDescription>
                            {t('recentActivityDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-1">
                            {ACTIVITY_DATA.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    isRTL={isRTL}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('quickActions')}</CardTitle>
                    <CardDescription>
                        {t('quickActionsDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={cn(
                        "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
                        isRTL && "text-right"
                    )}>
                        {[
                            { icon: 'UserPlus', label: 'Add User', color: 'blue' },
                            { icon: 'FolderPlus', label: 'New Project', color: 'green' },
                            { icon: 'FileText', label: 'Generate Report', color: 'purple' },
                            { icon: 'Gear', label: 'Settings', color: 'gray' }
                        ].map((action, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className={cn(
                                    "h-auto p-4 flex flex-col gap-2",
                                    isRTL && "flex-col-reverse"
                                )}
                            >
                                <Icon name={action.icon as any} size={24} />
                                <span className="text-sm font-medium">{action.label}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Main page component
export default function AdminPage() {
    return (
        <Suspense fallback={<LoadingPage message="Loading dashboard..." />}>
            <DashboardContent />
        </Suspense>
    )
}