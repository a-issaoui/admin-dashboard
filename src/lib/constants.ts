// ============================================================================
// src/lib/constants.ts - Application constants
// ============================================================================

// Badge styling constants
export const BADGE_STYLES = {
    default: {
        red: 'bg-red-500 text-white',
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        orange: 'bg-orange-500 text-white',
        purple: 'bg-purple-500 text-white',
        gray: 'bg-gray-500 text-white'
    },
    outline: {
        red: 'border border-red-300 text-red-600 bg-red-50 dark:border-red-600 dark:text-red-400 dark:bg-red-950/20',
        blue: 'border border-blue-300 text-blue-600 bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:bg-blue-950/20',
        green: 'border border-green-300 text-green-600 bg-green-50 dark:border-green-600 dark:text-green-400 dark:bg-green-950/20',
        yellow: 'border border-yellow-300 text-yellow-600 bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400 dark:bg-yellow-950/20',
        orange: 'border border-orange-300 text-orange-600 bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:bg-orange-950/20',
        purple: 'border border-purple-300 text-purple-600 bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:bg-purple-950/20',
        gray: 'border border-gray-300 text-gray-600 bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-950/20'
    },
    ghost: {
        red: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/10',
        blue: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/10',
        green: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/10',
        yellow: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950/10',
        orange: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/10',
        purple: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/10',
        gray: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950/10'
    }
} as const

// Sidebar constants
export const SIDEBAR_CONFIG = {
    COLLAPSED_WIDTH: 64,
    EXPANDED_WIDTH: 240,
    ANIMATION_DURATION: 200,
    MAX_BADGE_COUNT: 999
} as const

// Theme constants
export const THEME_CONFIG = {
    DEFAULT: 'system',
    STORAGE_KEY: 'theme-store'
} as const

// Locale constants
export const LOCALE_CONFIG = {
    DEFAULT: 'en',
    COOKIE_NAME: 'locale',
    COOKIE_MAX_AGE: 365 * 24 * 60 * 60 // 1 year
} as const