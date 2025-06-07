import * as React from 'react'
import { SidebarMenuBadge } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { BADGE_STYLES } from '@/constants/badgeStyles'
import type { Badge } from '@/types/Badge'

// Optimized Badge Component with better validation and accessibility
export const BadgeComponent = React.memo<{
    badge: Badge
    className?: string
    'aria-label'?: string
}>(({ badge, className, 'aria-label': ariaLabel }) => {
    const { color = 'blue', variant = 'default', count } = badge

    const shouldShowBadge = React.useMemo(() => {
        if (count === undefined || count === null || count === '') return false

        if (typeof count === 'string') {
            const trimmed = count.trim()
            if (trimmed === '' || trimmed === '0') return false
            const numCount = parseInt(trimmed, 10)
            return !isNaN(numCount) && numCount > 0
        }

        return count > 0
    }, [count])

    const displayCount = React.useMemo(() => {
        if (typeof count === 'string') {
            const numCount = parseInt(count, 10)
            if (!isNaN(numCount) && numCount > 999) {
                return '999+'
            }
            return count
        }

        if (typeof count === 'number' && count > 999) {
            return '999+'
        }

        return count
    }, [count])

    if (!shouldShowBadge) return null

    const badgeStyles = BADGE_STYLES[variant]?.[color] || BADGE_STYLES.default.blue

    return (
        <SidebarMenuBadge
            className={cn(
                badgeStyles,
                "shrink-0 font-medium text-xs leading-4 min-w-[1.25rem] h-5 flex items-center justify-center",
                "transition-colors duration-150",
                className
            )}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {displayCount}
        </SidebarMenuBadge>
    )
})

BadgeComponent.displayName = 'BadgeComponent'