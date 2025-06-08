import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icons'

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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Icon name="UsersIcon" className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        <Icon name="CurrencyDollarIcon" className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231</div>
                        <p className="text-xs text-muted-foreground">
                            +15.2% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <Icon name="ShoppingCartIcon" className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">573</div>
                        <p className="text-xs text-muted-foreground">
                            +12.5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Icon name="ActivityIcon" className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            +3 from last hour
                        </p>
                    </CardContent>
                </Card>
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
                        {/* Chart component would go here */}
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
                            {/* Activity items would go here */}
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1 text-sm">
                                    <p>New user registered</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1 text-sm">
                                    <p>Order completed</p>
                                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="flex-1 text-sm">
                                    <p>Payment pending</p>
                                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}