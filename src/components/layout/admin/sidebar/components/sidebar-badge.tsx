// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-badge.tsx - FIXED
// ============================================================================

import * as React from 'react'
import { BADGE_STYLES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Badge } from '@/types/sidebar'

interface SidebarBadgeProps {
  badge: Badge
  className?: string
  showIndicatorOnly?: boolean // New prop for notification dots
}

export function SidebarBadge({
                               badge,
                               className,
                               showIndicatorOnly = false
                             }: SidebarBadgeProps) {
  const { count, color = 'blue', variant = 'default' } = badge

  // Format count (999+ for large numbers)
  const displayCount = React.useMemo(() => {
    if (!count && count !== 0) return '0'

    const numCount = typeof count === 'string' ? parseInt(count, 10) : count

    // Handle NaN or invalid numbers
    if (isNaN(numCount) || numCount < 0) return '0'

    return numCount > 999 ? '999+' : numCount.toString()
  }, [count])

  const numericCount = React.useMemo(() => {
    const num = typeof count === 'string' ? parseInt(count, 10) : count
    return isNaN(num || 0) ? 0 : (num || 0)
  }, [count])

  // Show notification indicator dot if no count but badge exists
  const showIndicator = numericCount === 0 && badge
  const showCount = numericCount > 0

  // If showing indicator only (notification dot), render minimal indicator
  if (showIndicatorOnly && showIndicator) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center w-2 h-2 rounded-full shrink-0',
                color === 'red' ? 'bg-red-500' :
                    color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                            color === 'yellow' ? 'bg-yellow-500' :
                                color === 'orange' ? 'bg-orange-500' :
                                    color === 'purple' ? 'bg-purple-500' :
                                        'bg-gray-500',
                className
            )}
            aria-label="Has notifications"
        />
    )
  }

  // Don't render if no count and not showing as indicator
  if (!showCount && !showIndicator) return null

  const badgeStyles = BADGE_STYLES[variant]?.[color] || BADGE_STYLES.default.blue

  // Show notification indicator dot when count is 0 but badge exists
  if (showIndicator) {
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center w-2 h-2 rounded-full shrink-0',
                color === 'red' ? 'bg-red-500' :
                    color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                            color === 'yellow' ? 'bg-yellow-500' :
                                color === 'orange' ? 'bg-orange-500' :
                                    color === 'purple' ? 'bg-purple-500' :
                                        'bg-gray-500',
                className
            )}
            aria-label="Has notifications"
        />
    )
  }

  // Show count badge
  return (
      <span
          className={cn(
              'inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-medium',
              'min-w-[1.25rem] h-5 shrink-0',
              badgeStyles,
              className
          )}
          aria-label={`${count} notifications`}
      >
      {displayCount}
    </span>
  )
}