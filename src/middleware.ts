// ============================================================================
// src/middleware.ts - Fixed locale handling
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/config'

export function middleware(request: NextRequest) {
  // Get locale from cookie or default
  const cookieLocale = request.cookies.get('locale')?.value
  const locale = cookieLocale && LOCALES.includes(cookieLocale as any)
      ? cookieLocale
      : DEFAULT_LOCALE

  // Clone headers and add locale
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set cookie if not present or invalid
  if (cookieLocale !== locale) {
    response.cookies.set('locale', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
  }

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next|api|favicon.ico|.*\\.).*)'
  ]
}