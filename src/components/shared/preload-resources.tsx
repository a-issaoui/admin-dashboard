// ============================================================================
// src/components/shared/preload-resources.tsx - OPTIMIZED preloading
// ============================================================================

'use client'

import * as React from 'react'
import { useLocaleStore } from '@/lib/stores'

interface PreloadResourcesProps {
    preloadImages?: string[]
    preloadFonts?: string[]
}

export function PreloadResources({
                                     preloadImages = [],
                                     preloadFonts = []
                                 }: PreloadResourcesProps) {
    const { current } = useLocaleStore()

    React.useEffect(() => {
        // Preload critical images
        const imagesToPreload = [
            ...preloadImages,
            // Add any critical images here
        ]

        imagesToPreload.forEach(src => {
            if (src) {
                const img = new Image()
                img.src = src
            }
        })

        // Preload fonts
        const fontsToPreload = [
            ...preloadFonts,
            // Add critical fonts here
        ]

        fontsToPreload.forEach(font => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'font'
            link.href = font
            link.crossOrigin = 'anonymous'
            document.head.appendChild(link)
        })

        // Preload next locale messages
        const preloadLocales = ['en', 'fr', 'ar'].filter(locale => locale !== current)

        preloadLocales.forEach(locale => {
            import(`@/i18n/messages/${locale}.json`).catch(() => {
                // Silently fail - not critical
            })
        })

    }, [current, preloadImages, preloadFonts])

    return null
}