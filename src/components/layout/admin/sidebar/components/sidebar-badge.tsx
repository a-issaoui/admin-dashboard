// ============================================================================
// src/components/layout/admin/sidebar/components/sidebar-badge.tsx
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

  // Don't render if no count or count is 0
  if (!count || count === 0 || count === '0') return null

  // Format count (999+ for large numbers)
  const displayCount = React.useMemo(() => {
    const numCount = typeof count === 'string' ? parseInt(count, 10) : count
    return numCount > 999 ? '999+' : count.toString()
  }, [count])

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