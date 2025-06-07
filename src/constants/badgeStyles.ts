// Badge styles constants - extracted for better maintainability
export const BADGE_STYLES = {
    default: {
        red: 'bg-red-500 text-white shadow-sm border-0',
        blue: 'bg-blue-500 text-white shadow-sm border-0',
        green: 'bg-green-500 text-white shadow-sm border-0',
        yellow: 'bg-yellow-500 text-white shadow-sm border-0',
        purple: 'bg-purple-500 text-white shadow-sm border-0',
        orange: 'bg-orange-500 text-white shadow-sm border-0',
        gray: 'bg-gray-500 text-white shadow-sm border-0',
        pink: 'bg-pink-500 text-white shadow-sm border-0',
    },
    outline: {
        red: 'border border-red-300 text-red-600 bg-red-50 dark:border-red-600 dark:text-red-400 dark:bg-red-950/20',
        blue: 'border border-blue-300 text-blue-600 bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:bg-blue-950/20',
        green: 'border border-green-300 text-green-600 bg-green-50 dark:border-green-600 dark:text-green-400 dark:bg-green-950/20',
        yellow: 'border border-yellow-300 text-yellow-600 bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:bg-yellow-950/20',
        purple: 'border border-purple-300 text-purple-600 bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:bg-purple-950/20',
        orange: 'border border-orange-300 text-orange-600 bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:bg-orange-950/20',
        gray: 'border border-gray-300 text-gray-600 bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-950/20',
        pink: 'border border-pink-300 text-pink-600 bg-pink-50 dark:border-pink-600 dark:text-pink-400 dark:bg-pink-950/20',
    },
    ghost: {
        red: 'text-red-600 bg-red-50 border-0 dark:text-red-400 dark:bg-red-950/10',
        blue: 'text-blue-600 bg-blue-50 border-0 dark:text-blue-400 dark:bg-blue-950/10',
        green: 'text-green-600 bg-green-50 border-0 dark:text-green-400 dark:bg-green-950/10',
        yellow: 'text-yellow-600 bg-yellow-50 border-0 dark:text-yellow-400 dark:bg-yellow-950/10',
        purple: 'text-purple-600 bg-purple-50 border-0 dark:text-purple-400 dark:bg-purple-950/10',
        orange: 'text-orange-600 bg-orange-50 border-0 dark:text-orange-400 dark:bg-orange-950/10',
        gray: 'text-gray-600 bg-gray-50 border-0 dark:text-gray-400 dark:bg-gray-950/10',
        pink: 'text-pink-600 bg-pink-50 border-0 dark:text-pink-400 dark:bg-pink-950/10',
    }
} as const

// Default theme colors - fallbacks for invalid colors
export const DEFAULT_COLORS = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#059669',
    muted: '#9ca3af',
    danger: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    info: '#0ea5e9'
} as const

// Sidebar constants
export const SIDEBAR_CONSTANTS = {
    MIN_WIDTH: 240,
    COLLAPSED_WIDTH: 64,
    ANIMATION_DURATION: 200,
    MAX_BADGE_COUNT: 999,
    NOTIFICATION_PULSE_DURATION: 2000
} as const