// ====================
// BADGES
// ====================

export type BadgeColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'gray' | 'pink'
export type BadgeVariant = 'default' | 'outline' | 'ghost'

export interface Badge {
    count?: string | number
    color?: BadgeColor
    variant?: BadgeVariant
}