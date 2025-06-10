// ============================================================================
// src/middleware.ts - Cookie-based locale handling (No URL routing)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/stores/i18n/config'
import type { LocaleCode } from '@/types/locale'

export function middleware(request: NextRequest) {
  // Get locale from cookie
  const locale = (request.cookies.get('locale')?.value as LocaleCode) || DEFAULT_LOCALE

  // Validate locale
  const validLocale = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE

  // Clone request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', validLocale)

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Ensure locale cookie is set with proper options
  if (!request.cookies.get('locale')?.value || request.cookies.get('locale')?.value !== validLocale) {
    response.cookies.set('locale', validLocale, {
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

// ============================================================================
// Alternative Implementation with next-intl compatibility
// ============================================================================

/*
If you want to use next-intl's utilities while still avoiding URL routing,
you can use this approach:

import { NextRequest, NextResponse } from 'next/server'
import { getLocale } from 'next-intl/server'

export async function middleware(request: NextRequest) {
  // Get locale from next-intl (which reads from cookies)
  const locale = await getLocale()

  // Add locale to headers for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\.).*)'
  ]
}
*/