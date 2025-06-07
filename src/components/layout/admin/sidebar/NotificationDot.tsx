import * as React from 'react'
import { cn } from '@/lib/utils'

// Enhanced notification dot with better accessibility
export const NotificationDot = React.memo<{
    color: string
    hasNotifications: boolean
    className?: string
    'aria-label'?: string
}>(({ color, hasNotifications, className, 'aria-label': ariaLabel }) => {
    if (!hasNotifications) return null

    return (
        <div
            className={cn(
                "relative h-2 w-2 rounded-full shrink-0",
                "before:absolute before:inset-0 before:rounded-full before:animate-ping before:opacity-75",
                className
            )}
            style={{
                backgroundColor: color,
                '--tw-before-bg-color': color
            } as React.CSSProperties & { '--tw-before-bg-color': string }}
            aria-hidden={!ariaLabel}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            <style jsx>{`
                div::before {
                    background-color: var(--tw-before-bg-color);
                }
            `}</style>
        </div>
    )
})

NotificationDot.displayName = 'NotificationDot'