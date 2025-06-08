// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-badge.tsx - FIXED
// ============================================================================

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BADGE_STYLES } from '@/lib/constants'
import type { Badge } from '@/types/sidebar'

interface SidebarBadgeProps {
  badge: Badge
  className?: string
}

export function SidebarBadge({ badge, className }: SidebarBadgeProps) {
  const { count, color = 'blue', variant = 'default' } = badge

  // Format count (999+ for large numbers) - moved before early return
  const displayCount = React.useMemo(() => {
    if (!count) return '0'

    const numCount = typeof count === 'string' ? parseInt(count, 10) : count

    // Handle NaN or invalid numbers
    if (isNaN(numCount) || numCount < 0) return '0'

    return numCount > 999 ? '999+' : numCount.toString()
  }, [count])

  // Don't render if no count or count is 0
  if (!count || count === 0 || count === '0') return null

  const badgeStyles = BADGE_STYLES[variant]?.[color] || BADGE_STYLES.default.blue

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