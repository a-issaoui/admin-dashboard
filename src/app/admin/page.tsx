// ============================================================================
// src/app/admin/page.tsx - COMPLETELY FIXED - NO PERFORMANCE IMPORTS
// ============================================================================

'use client'

import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icon } from '@/components/icons'
import type { IconName } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Simplified interfaces
interface StatData {
    title: string
    value: string | number
    change: string
    icon: IconName
    trend: 'up' | 'down'
}

interface ActivityData {
    color: string
    title: string
    time: string
}

// Static data - no expensive computation needed
const STATS_DATA: StatData[] = [
    {
        title: 'Total Users',
        value: '1,234',
        change: '+20.1% from last month',
        icon: 'UsersIcon',
        trend: 'up'
    },
    {
        title: 'Revenue',
        value: '$45,231',
        change: '+15.2% from last month',
        icon: 'CurrencyDollarIcon',
        trend: 'up'
    },
    {
        title: 'Orders',
        value: '573',
        change: '+12.5% from last month',
        icon: 'ShoppingCartIcon',
        trend: 'up'
    },
    {
        title: 'Active Now',
        value: '89',
        change: '+3 from last hour',
        icon: 'ActivityIcon',
        trend: 'up'
    }
]

const ACTIVITY_DATA: ActivityData[] = [
    {
        color: 'bg-blue-500',
        title: 'New user registered',
        time: '2 minutes ago'
    },
    {
        color: 'bg-green-500',
        title: 'Order completed',
        time: '5 minutes ago'
    },
    {
        color: 'bg-yellow-500',
        title: 'Payment pending',
        time: '10 minutes ago'
    }
]

// Simple memoized stat card
const StatCard = React.memo(function StatCard({
                                                  title,
                                                  value,
                                                  change,
                                                  icon,
                                                  trend = 'up'
                                              }: StatData) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon name={icon} className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </p>
            </CardContent>
        </Card>
    )
})

// Simple activity item
const ActivityItem = React.memo(function ActivityItem({
                                                          color,
                                                          title,
                                                          time
                                                      }: ActivityData) {
    return (
        <div className="flex items-center space-x-4">
            <div className={`w-2 h-2 ${color} rounded-full`} />
            <div className="flex-1 text-sm">
                <p>{title}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
        </div>
    )
})

export default function AdminPage() {
    const t = useTranslations('nav')

    return (
        <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('dashboard')}
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to your admin dashboard
                    </p>
                </div>
                <Button>
                    <Icon name="PlusIcon" className="mr-2 h-4 w-4" />
                    New Item
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {STATS_DATA.map((stat, index) => (
                    <StatCard key={`${stat.title}-${index}`} {...stat} />
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('analytics')}</CardTitle>
                        <CardDescription>
                            Overview of your performance metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            Chart Component Placeholder
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions in your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ACTIVITY_DATA.map((activity, index) => (
                                <ActivityItem key={`${activity.title}-${index}`} {...activity} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}