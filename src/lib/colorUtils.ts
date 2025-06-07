import { DEFAULT_COLORS } from '@/constants/badgeStyles'

/**
 * Validates if a color string is a valid CSS color
 */
export function isValidColor(color: string): boolean {
    if (!color) return false

    // Check for hex colors
    if (/^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(color)) {
        return true
    }

    // Check for rgb/rgba colors
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color) ||
        /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(color)) {
        return true
    }

    // Check for hsl/hsla colors
    if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(color) ||
        /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i.test(color)) {
        return true
    }

    // Check for CSS named colors (basic set)
    const namedColors = [
        'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
        'pink', 'gray', 'grey', 'brown', 'cyan', 'magenta', 'lime', 'navy',
        'teal', 'silver', 'maroon', 'olive', 'aqua', 'fuchsia', 'transparent',
        'currentColor', 'inherit', 'initial', 'unset'
    ]

    return namedColors.includes(color.toLowerCase())
}

/**
 * Validates and returns a safe color, with fallback
 */
export function validateColor(color?: string, fallback?: string): string {
    if (!color) return fallback || DEFAULT_COLORS.primary

    if (isValidColor(color)) {
        return color
    }

    // Try to extract a valid color from CSS custom properties or variables
    if (color.startsWith('var(') || color.startsWith('--')) {
        return color // Let CSS handle it
    }

    console.warn(`Invalid color "${color}", using fallback`)
    return fallback || DEFAULT_COLORS.primary
}

/**
 * Get theme color from CSS custom properties or return default
 */
export function getThemeColor(colorName: keyof typeof DEFAULT_COLORS): string {
    if (typeof window === 'undefined') {
        return DEFAULT_COLORS[colorName]
    }

    const style = getComputedStyle(document.documentElement)
    const cssVariable = `--color-${colorName}`
    const value = style.getPropertyValue(cssVariable)

    return value.trim() || DEFAULT_COLORS[colorName]
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

/**
 * Check if a color is considered "dark" (useful for determining text color)
 */
export function isColorDark(color: string): boolean {
    const rgb = hexToRgb(color)
    if (!rgb) return false

    // Calculate perceived brightness using the luminance formula
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness < 128
}

/**
 * Generate a contrasting text color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): string {
    return isColorDark(backgroundColor) ? '#ffffff' : '#000000'
}

/**
 * Apply opacity to a color
 */
export function applyOpacity(color: string, opacity: number): string {
    if (color.startsWith('#')) {
        const rgb = hexToRgb(color)
        if (rgb) {
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
        }
    }

    if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
    }

    return color
}