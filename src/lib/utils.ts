import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { SidebarData } from '@/types/SidebarData'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Enhanced utility to create sidebar data with auto-generated IDs and validation
 */
export function createSidebarData(rawData: any[]): SidebarData {
  return rawData.map((group, groupIndex) => {
    // Generate group ID if not provided
    const groupId = group.id || `group-${groupIndex}-${slugify(group.title || 'untitled')}`

    return {
      ...group,
      id: groupId,
      menu: group.menu.map((menu: any, menuIndex: number) => {
        // Generate menu ID if not provided
        const menuId = menu.id || `${groupId}-menu-${menuIndex}-${slugify(menu.title)}`

        return {
          ...menu,
          id: menuId,
          submenu: menu.submenu?.map((sub: any, subIndex: number) => ({
            ...sub,
            id: sub.id || `${menuId}-sub-${subIndex}-${slugify(sub.title)}`
          }))
        }
      })
    }
  })
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(
    target: T,
    source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]!)
    } else {
      result[key] = source[key]!
    }
  }

  return result
}

/**
 * Format number for display (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return Math.floor(num / 1000000) + 'M'
  }
  if (num >= 1000) {
    return Math.floor(num / 1000) + 'K'
  }
  return num.toString()
}

/**
 * Validate sidebar data structure
 */
export function validateSidebarData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!Array.isArray(data)) {
    errors.push('Sidebar data must be an array')
    return { isValid: false, errors }
  }

  data.forEach((group, groupIndex) => {
    if (typeof group !== 'object' || group === null) {
      errors.push(`Group at index ${groupIndex} must be an object`)
      return
    }

    if (!Array.isArray(group.menu)) {
      errors.push(`Group at index ${groupIndex} must have a menu array`)
      return
    }

    group.menu.forEach((menu: any, menuIndex: number) => {
      if (typeof menu !== 'object' || menu === null) {
        errors.push(`Menu item at group ${groupIndex}, menu ${menuIndex} must be an object`)
        return
      }

      if (typeof menu.title !== 'string' || menu.title.trim() === '') {
        errors.push(`Menu item at group ${groupIndex}, menu ${menuIndex} must have a non-empty title`)
      }

      if (menu.submenu && !Array.isArray(menu.submenu)) {
        errors.push(`Submenu at group ${groupIndex}, menu ${menuIndex} must be an array`)
      }

      if (menu.submenu) {
        menu.submenu.forEach((sub: any, subIndex: number) => {
          if (typeof sub !== 'object' || sub === null) {
            errors.push(`Submenu item at group ${groupIndex}, menu ${menuIndex}, sub ${subIndex} must be an object`)
            return
          }

          if (typeof sub.title !== 'string' || sub.title.trim() === '') {
            errors.push(`Submenu item at group ${groupIndex}, menu ${menuIndex}, sub ${subIndex} must have a non-empty title`)
          }

          if (typeof sub.url !== 'string' || sub.url.trim() === '') {
            errors.push(`Submenu item at group ${groupIndex}, menu ${menuIndex}, sub ${subIndex} must have a non-empty URL`)
          }
        })
      }
    })
  })

  return { isValid: errors.length === 0, errors }
}

/**
 * Generate accessible IDs for ARIA attributes
 */
export function generateAriaId(prefix: string, ...parts: (string | number)[]): string {
  const cleanParts = parts
      .filter(part => part !== undefined && part !== null && part !== '')
      .map(part => slugify(String(part)))
      .filter(part => part.length > 0)

  return `${prefix}-${cleanParts.join('-')}`
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Safe localStorage access with error handling
 */
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return defaultValue
    }
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error)
      return false
    }
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error)
      return false
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage', error)
      return false
    }
  }
}

/**
 * Focus management utilities
 */
export const focus = {
  trap: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  },

  restore: (previousElement?: HTMLElement | null) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }
}