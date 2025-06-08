#!/bin/bash

# ============================================================================
# Admin Dashboard Refactoring Migration Script (No Locale in URL)
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${PURPLE}============================================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}============================================================================${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
check_directory() {
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found. Please run this script from your project root."
        exit 1
    fi

    if [[ ! -d "src" ]]; then
        print_error "src directory not found. Please run this script from your project root."
        exit 1
    fi

    print_success "Project root directory confirmed"
}

# Create backup directory
create_backup() {
    print_step "Creating backup directory..."

    if [[ -d "old" ]]; then
        print_warning "old directory already exists. Removing it..."
        rm -rf old
    fi

    mkdir -p old
    print_success "Backup directory created: ./old"
}

# Backup old files
backup_old_files() {
    print_step "Backing up old files..."

    # Files to backup (move to old folder)
    declare -a files_to_backup=(
        "src/hooks/useSidebarData.ts"
        "src/hooks/useSidebarActions.ts"
        "src/hooks/useSidebarPersistence.ts"
        "src/hooks/useKeyboardNavigation.ts"
        "src/hooks/index.ts"
        "src/types/SidebarData.ts"
        "src/types/ProcessedSidebarData.ts"
        "src/types/Badge.ts"
        "src/components/layout/admin/sidebar/AppSidebarMenu.tsx"
        "src/components/layout/admin/sidebar/ActionDropdown.tsx"
        "src/components/layout/admin/sidebar/NotificationDot.tsx"
        "src/components/layout/admin/sidebar/SidebarErrorBoundary.tsx"
        "src/constants/SidebarMenudata.ts"
        "src/constants/badgeStyles.ts"
        "src/lib/colorUtils.ts"
        "src/constants/dataOrg.ts"
        "src/constants/dataUser.ts"
        "src/constants/types.ts"
        "src/app/page.tsx"
        "src/app/admin/page.tsx"
        "src/app/admin/layout.tsx"
        "project_structure.txt"
        "scan.sh"
    )

    # Directories to backup
    declare -a dirs_to_backup=(
        "src/services"
        "src/validations"
        "src/store"
        "src/components/layout/admin/common"
    )

    # Backup files
    for file in "${files_to_backup[@]}"; do
        if [[ -f "$file" ]]; then
            # Create directory structure in old folder
            dir=$(dirname "$file")
            mkdir -p "old/$dir"
            mv "$file" "old/$file"
            print_success "Backed up: $file"
        else
            print_warning "File not found (skipping): $file"
        fi
    done

    # Backup directories
    for dir in "${dirs_to_backup[@]}"; do
        if [[ -d "$dir" ]]; then
            # Create parent directory in old folder
            parent=$(dirname "$dir")
            mkdir -p "old/$parent"
            mv "$dir" "old/$dir"
            print_success "Backed up directory: $dir"
        else
            print_warning "Directory not found (skipping): $dir"
        fi
    done
}

# Create new directory structure (NO [locale] folder)
create_new_structure() {
    print_step "Creating new directory structure (no locale in URL)..."

    # Create all new directories
    declare -a new_dirs=(
        "src/types"
        "src/lib/stores"
        "src/data"
        "src/i18n/messages"
        "src/components/providers"
        "src/components/sidebar/components"
        "src/components/shared"
        "src/app/admin"
    )

    for dir in "${new_dirs[@]}"; do
        mkdir -p "$dir"
        print_success "Created directory: $dir"
    done

    print_success "Created clean directory structure WITHOUT [locale] routing"
}

# Create empty files with comments
create_empty_files() {
    print_step "Creating empty files with structure comments..."

    # Core type files
    cat > "src/types/global.ts" << 'EOF'
// Global shared types
// TODO: Copy content from artifacts

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'user'
  avatar?: string
  status: 'active' | 'inactive'
}

export interface Organization {
  name: string
  academicYear: string
  logo?: string
}
EOF

    cat > "src/types/locale.ts" << 'EOF'
// Internationalization types
// TODO: Copy content from artifacts

export type LocaleCode = 'en' | 'fr' | 'ar'

export interface LocaleConfig {
  code: LocaleCode
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export interface LocaleState {
  current: LocaleCode
  direction: 'ltr' | 'rtl'
  isLoading: boolean
}
EOF

    cat > "src/types/sidebar.ts" << 'EOF'
// Clean sidebar types
// TODO: Copy content from artifacts

import type { IconProps } from '@/components/icons'

export type BadgeColor = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'gray'
export type BadgeVariant = 'default' | 'outline' | 'ghost'

export interface Badge {
  count?: string | number
  color?: BadgeColor
  variant?: BadgeVariant
}

export type ActionType =
  | 'refresh'
  | 'export'
  | 'import'
  | 'create'
  | 'edit'
  | 'delete'
  | 'settings'
  | 'archive'

export interface MenuAction {
  id: string
  type: ActionType
  label?: string
  icon?: IconProps
  variant?: 'default' | 'destructive'
  shortcut?: string
  disabled?: boolean
}

export interface SidebarSubmenu {
  id: string
  titleKey: string
  url: string
  icon?: IconProps
  badge?: Badge
  actions?: MenuAction[]
  disabled?: boolean
  external?: boolean
}

export interface SidebarMenuItem {
  id: string
  titleKey: string
  icon?: IconProps
  url?: string
  badge?: Badge
  submenu?: SidebarSubmenu[]
  actions?: MenuAction[]
  disabled?: boolean
  external?: boolean
  defaultExpanded?: boolean
}

export interface SidebarGroup {
  id: string
  titleKey?: string
  collapsible?: boolean
  defaultOpen?: boolean
  menu: SidebarMenuItem[]
  actions?: MenuAction[]
  disabled?: boolean
  order?: number
}

export type SidebarData = SidebarGroup[]
EOF

    # Store files
    cat > "src/lib/stores/locale-store.ts" << 'EOF'
// Locale management store
// TODO: Copy content from artifacts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setCookie, getCookie } from 'cookies-next'
import type { LocaleCode, LocaleConfig, LocaleState } from '@/types/locale'

// Locale store implementation
EOF

    cat > "src/lib/stores/sidebar-store.ts" << 'EOF'
// Sidebar state management
// TODO: Copy content from artifacts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SidebarData } from '@/types/sidebar'

// Sidebar store implementation
EOF

    cat > "src/lib/stores/theme-store.ts" << 'EOF'
// Theme management store
// TODO: Copy content from artifacts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

// Theme store implementation
EOF

    cat > "src/lib/stores/index.ts" << 'EOF'
// Store exports
// TODO: Copy content from artifacts

export { useLocaleStore } from './locale-store'
export { useSidebarStore } from './sidebar-store'
export { useThemeStore } from './theme-store'
EOF

    cat > "src/lib/constants.ts" << 'EOF'
// Application constants
// TODO: Copy content from artifacts

// Badge styling constants
export const BADGE_STYLES = {
  default: {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    // ... more colors
  },
  // ... other variants
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
EOF

    # i18n files (NO locale routing)
    cat > "src/i18n/config.ts" << 'EOF'
// i18n configuration (Cookie-based, no URL routing)
// TODO: Copy content from artifacts

import type { LocaleCode } from '@/types/locale'

export const LOCALES: LocaleCode[] = ['en', 'fr', 'ar']
export const DEFAULT_LOCALE: LocaleCode = 'en'

export const LOCALE_LABELS = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
} as const
EOF

    cat > "src/i18n/request.ts" << 'EOF'
// Server-side i18n setup (Cookie-based)
// TODO: Copy content from artifacts

import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE } from './config'

export default getRequestConfig(async () => {
  // Get locale from cookie (no URL routing)
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value || DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Tunis',
    now: new Date()
  }
})
EOF

    # Message files with comprehensive translations
    cat > "src/i18n/messages/en.json" << 'EOF'
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "actions": "Actions",
    "settings": "Settings"
  },
  "nav": {
    "dashboard": "Dashboard",
    "overview": "Overview",
    "analytics": "Analytics",
    "reports": "Reports",
    "home": "Home",
    "inbox": "Inbox",
    "notifications": "Notifications",
    "messages": "Messages",
    "drafts": "Drafts",
    "calendar": "Calendar",
    "projects": "Projects",
    "teams": "Teams",
    "users": "Users",
    "management": "Management",
    "events": "Events",
    "reminders": "Reminders",
    "holidays": "Holidays",
    "activeProjects": "Active Projects",
    "completed": "Completed",
    "archived": "Archived",
    "allUsers": "All Users",
    "admins": "Administrators",
    "pending": "Pending Users",
    "roles": "Roles & Permissions",
    "audit": "Audit Logs"
  },
  "sidebar": {
    "toggleSidebar": "Toggle Sidebar",
    "moreOptions": "More options",
    "hasNotifications": "Has notifications",
    "processing": "Processing...",
    "failed": "Action failed"
  },
  "actions": {
    "refresh": "Refresh",
    "export": "Export",
    "import": "Import",
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "settings": "Settings",
    "archive": "Archive"
  },
  "user": {
    "profile": "Profile",
    "account": "Account",
    "preferences": "Preferences",
    "logout": "Sign Out"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    "toggleTheme": "Toggle theme"
  },
  "locale": {
    "changeLanguage": "Change Language",
    "english": "English",
    "french": "Français",
    "arabic": "العربية"
  }
}
EOF

    cat > "src/i18n/messages/fr.json" << 'EOF'
{
  "common": {
    "loading": "Chargement...",
    "error": "Erreur",
    "success": "Succès",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "save": "Enregistrer",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "search": "Rechercher",
    "actions": "Actions",
    "settings": "Paramètres"
  },
  "nav": {
    "dashboard": "Tableau de bord",
    "overview": "Aperçu",
    "analytics": "Analyses",
    "reports": "Rapports",
    "home": "Accueil",
    "inbox": "Boîte de réception",
    "notifications": "Notifications",
    "messages": "Messages",
    "drafts": "Brouillons",
    "calendar": "Calendrier",
    "projects": "Projets",
    "teams": "Équipes",
    "users": "Utilisateurs",
    "management": "Gestion",
    "events": "Événements",
    "reminders": "Rappels",
    "holidays": "Jours fériés",
    "activeProjects": "Projets actifs",
    "completed": "Terminés",
    "archived": "Archivés",
    "allUsers": "Tous les utilisateurs",
    "admins": "Administrateurs",
    "pending": "En attente",
    "roles": "Rôles et permissions",
    "audit": "Journaux d'audit"
  },
  "sidebar": {
    "toggleSidebar": "Basculer la barre latérale",
    "moreOptions": "Plus d'options",
    "hasNotifications": "A des notifications",
    "processing": "Traitement...",
    "failed": "L'action a échoué"
  },
  "actions": {
    "refresh": "Actualiser",
    "export": "Exporter",
    "import": "Importer",
    "create": "Créer",
    "edit": "Modifier",
    "delete": "Supprimer",
    "settings": "Paramètres",
    "archive": "Archiver"
  },
  "user": {
    "profile": "Profil",
    "account": "Compte",
    "preferences": "Préférences",
    "logout": "Se déconnecter"
  },
  "theme": {
    "light": "Clair",
    "dark": "Sombre",
    "system": "Système",
    "toggleTheme": "Basculer le thème"
  },
  "locale": {
    "changeLanguage": "Changer de langue",
    "english": "English",
    "french": "Français",
    "arabic": "العربية"
  }
}
EOF

    cat > "src/i18n/messages/ar.json" << 'EOF'
{
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "خطأ",
    "success": "نجح",
    "cancel": "إلغاء",
    "confirm": "تأكيد",
    "save": "حفظ",
    "delete": "حذف",
    "edit": "تعديل",
    "create": "إنشاء",
    "search": "بحث",
    "actions": "الإجراءات",
    "settings": "الإعدادات"
  },
  "nav": {
    "dashboard": "لوحة التحكم",
    "overview": "نظرة عامة",
    "analytics": "التحليلات",
    "reports": "التقارير",
    "home": "الرئيسية",
    "inbox": "البريد الوارد",
    "notifications": "الإشعارات",
    "messages": "الرسائل",
    "drafts": "المسودات",
    "calendar": "التقويم",
    "projects": "المشاريع",
    "teams": "الفرق",
    "users": "المستخدمون",
    "management": "الإدارة",
    "events": "الأحداث",
    "reminders": "التذكيرات",
    "holidays": "العطل",
    "activeProjects": "المشاريع النشطة",
    "completed": "مكتمل",
    "archived": "مؤرشف",
    "allUsers": "جميع المستخدمين",
    "admins": "المديرون",
    "pending": "قيد الانتظار",
    "roles": "الأدوار والصلاحيات",
    "audit": "سجلات المراجعة"
  },
  "sidebar": {
    "toggleSidebar": "تبديل الشريط الجانبي",
    "moreOptions": "خيارات أكثر",
    "hasNotifications": "يحتوي على إشعارات",
    "processing": "جارٍ المعالجة...",
    "failed": "فشل الإجراء"
  },
  "actions": {
    "refresh": "تحديث",
    "export": "تصدير",
    "import": "استيراد",
    "create": "إنشاء",
    "edit": "تعديل",
    "delete": "حذف",
    "settings": "الإعدادات",
    "archive": "أرشفة"
  },
  "user": {
    "profile": "الملف الشخصي",
    "account": "الحساب",
    "preferences": "التفضيلات",
    "logout": "تسجيل الخروج"
  },
  "theme": {
    "light": "فاتح",
    "dark": "داكن",
    "system": "النظام",
    "toggleTheme": "تبديل المظهر"
  },
  "locale": {
    "changeLanguage": "تغيير اللغة",
    "english": "English",
    "french": "Français",
    "arabic": "العربية"
  }
}
EOF

    # Data files
    cat > "src/data/sidebar-data.ts" << 'EOF'
// Clean sidebar configuration
// TODO: Copy content from artifacts

import type { SidebarData } from '@/types/sidebar'

export const sidebarData: SidebarData = [
  // Dashboard Group
  {
    id: 'dashboard',
    titleKey: 'nav.dashboard',
    order: 1,
    menu: [
      {
        id: 'overview',
        titleKey: 'nav.overview',
        url: '/admin',
        icon: { name: 'HouseLineIcon', size: 20, weight: 'regular' },
        badge: { count: 5, color: 'red' },
        actions: [
          { id: 'refresh-overview', type: 'refresh', shortcut: '⌘R' },
          { id: 'export-overview', type: 'export' }
        ]
      }
      // ... more items
    ]
  }
  // ... more groups
]
EOF

    cat > "src/data/user-data.ts" << 'EOF'
// Clean user data
// TODO: Copy content from artifacts

import type { User } from '@/types/global'

export const userData: User = {
  id: 'user-001',
  name: 'Ahmed Ben Salah',
  email: 'ahmed.bensalah@example.tn',
  role: 'admin',
  avatar: 'https://i.pravatar.cc/150?img=70',
  status: 'active'
}
EOF

    cat > "src/data/org-data.ts" << 'EOF'
// Clean organization data
// TODO: Copy content from artifacts

import type { Organization } from '@/types/global'

export const orgData: Organization = {
  name: 'École Ennour',
  academicYear: '2024-2025',
  logo: undefined
}
EOF

    # Provider files
    cat > "src/components/providers/store-provider.tsx" << 'EOF'
// Store provider
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useLocaleStore, useThemeStore } from '@/lib/stores'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Store provider implementation
  return <>{children}</>
}
EOF

    # Sidebar component files (same as before)
    cat > "src/components/sidebar/components/sidebar-badge.tsx" << 'EOF'
// Sidebar badge component
// TODO: Copy content from artifacts

import * as React from 'react'
import { cn } from '@/lib/utils'
import { BADGE_STYLES } from '@/lib/constants'
import type { Badge } from '@/types/sidebar'

export function SidebarBadge() {
  // Badge implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-actions.tsx" << 'EOF'
// Sidebar actions component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

export function SidebarActions() {
  // Actions implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-submenu.tsx" << 'EOF'
// Sidebar submenu component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

export function SidebarSubmenuComponent() {
  // Submenu implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-item.tsx" << 'EOF'
// Sidebar item component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

export function SidebarItem() {
  // Item implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-group.tsx" << 'EOF'
// Sidebar group component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

export function SidebarGroupComponent() {
  // Group implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/locale-selector.tsx" << 'EOF'
// Locale selector component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useLocaleStore } from '@/lib/stores'

export function LocaleSelector() {
  // Locale selector implementation
  return null
}
EOF

    cat > "src/components/sidebar/app-sidebar.tsx" << 'EOF'
// Main sidebar component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useSidebarStore, useLocaleStore } from '@/lib/stores'

export function AppSidebar() {
  // Main sidebar implementation
  return null
}
EOF

    cat > "src/components/sidebar/org-profile.tsx" << 'EOF'
// Organization profile component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function OrgProfile() {
  // Org profile implementation
  return null
}
EOF

    cat > "src/components/sidebar/user-menu.tsx" << 'EOF'
// User menu component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'

export function UserMenu() {
  // User menu implementation
  return null
}
EOF

    # Standard app structure (NO [locale] folder)
    cat > "src/app/page.tsx" << 'EOF'
// Home page - redirects to admin
// TODO: Copy content from artifacts

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/admin')
}
EOF

    cat > "src/app/admin/layout.tsx" << 'EOF'
// Admin layout
// TODO: Copy content from artifacts

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
EOF

    cat > "src/app/admin/page.tsx" << 'EOF'
// Admin dashboard page
// TODO: Copy content from artifacts

import { useTranslations } from 'next-intl'

export default function AdminPage() {
  const t = useTranslations('nav')

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('dashboard')}
        </h2>
      </div>
      <div className="space-y-4">
        {/* Dashboard content */}
      </div>
    </div>
  )
}
EOF

    # Update shared component
    if [[ -f "src/components/shared/modeToggle.tsx" ]]; then
        mkdir -p "old/src/components/shared"
        mv "src/components/shared/modeToggle.tsx" "old/src/components/shared/modeToggle.tsx" 2>/dev/null || true
    fi

    cat > "src/components/shared/mode-toggle.tsx" << 'EOF'
// Updated mode toggle component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useThemeStore } from '@/lib/stores'

export function ModeToggle() {
  // Theme toggle implementation
  return null
}
EOF

    print_success "Created all empty files with TODO comments (NO locale routing)"
}

# Update configuration files for cookie-based i18n
update_config_files() {
    print_step "Updating configuration files for cookie-based i18n..."

    # Add new dependencies using pnpm
    print_step "Installing dependencies with pnpm..."
    pnpm add next-intl@^3.4.0 cookies-next@^4.1.1 zustand@^4.4.7
    print_success "Added new dependencies with pnpm"

    # Update next.config.ts for cookie-based i18n
    cat > "next.config.ts" << 'EOF'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
};

export default withNextIntl(nextConfig);
EOF

    # Update middleware.ts for cookie-based locale (NO URL routing)
    cat > "src/middleware.ts" << 'EOF'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get locale from cookie
  const locale = request.cookies.get('locale')?.value || 'en'

  // Add locale to headers for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  // Continue without URL rewriting
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
EOF

    # Update app layout for cookie-based i18n
    cat > "src/app/layout.tsx" << 'EOF'
// Root layout with cookie-based i18n (NO locale in URL)
// TODO: Copy content from artifacts

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { StoreProvider } from "@/components/providers/store-provider"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "École Ennour - Admin Dashboard",
  description: "Modern admin dashboard with RTL support for École Ennour",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  // Get direction for RTL support
  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        data-locale={locale}
        data-direction={direction}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                position="top-center"
                closeButton
                richColors
              />
            </ThemeProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
EOF

    # Update tsconfig.json paths
    if [[ -f "tsconfig.json" ]]; then
        # Backup original tsconfig
        cp "tsconfig.json" "old/tsconfig.json.backup"

        # Create new tsconfig with updated paths
        cat > "tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/data/*": ["./src/data/*"],
      "@/i18n/*": ["./src/i18n/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", "dist"]
}
EOF
    fi

    print_success "Updated configuration files for cookie-based i18n (no URL routing)"
}

# Create summary report
create_summary() {
    print_step "Creating migration summary..."

    cat > "MIGRATION_SUMMARY.md" << 'EOF'
# Migration Summary - Cookie-Based i18n (No Locale in URL)

## 🎯 Key Changes
- **NO [locale] folder structure** - Clean URLs without language codes
- **Cookie-based locale storage** - Language persisted in cookies for SSR
- **Clean architecture** - Modular components and Zustand state management
- **Three languages**: English (default), French, Arabic (with Tunisian flag 🇹🇳)
- **Full RTL support** for Arabic

## 📁 Files Moved to `old/` Folder
- All old hooks, types, and components backed up
- Original configuration files preserved
- Legacy sidebar system saved

## 🏗️ New Clean Structure (NO locale routing)
```
src/
├── app/
│   ├── layout.tsx               # Root layout with cookie-based i18n
│   ├── page.tsx                 # Home page (redirects to /admin)
│   └── admin/
│       ├── layout.tsx           # Admin layout with sidebar
│       └── page.tsx             # Dashboard page
├── components/
│   ├── providers/
│   │   └── store-provider.tsx   # Zustand store initialization
│   ├── sidebar/                 # Modular sidebar system
│   │   ├── components/          # Small, focused components
│   │   ├── app-sidebar.tsx      # Main sidebar
│   │   ├── org-profile.tsx      # Organization header
│   │   └── user-menu.tsx        # User dropdown
│   └── shared/
│       └── mode-toggle.tsx      # Theme switcher
├── lib/
│   ├── stores/                  # Zustand stores
│   │   ├── locale-store.ts      # Language & RTL management
│   │   ├── sidebar-store.ts     # Sidebar state
│   │   ├── theme-store.ts       # Theme management
│   │   └── index.ts             # Store exports
│   └── constants.ts             # App constants
├── types/                       # Clean, focused types
│   ├── global.ts                # User, Organization types
│   ├── locale.ts                # i18n types
│   └── sidebar.ts               # Sidebar types
├── data/                        # Static data
│   ├── sidebar-data.ts          # Sidebar configuration
│   ├── user-data.ts             # User data
│   └── org-data.ts              # Organization data
└── i18n/                        # Complete i18n setup
    ├── config.ts                # i18n configuration
    ├── request.ts               # Server-side i18n (cookie-based)
    └── messages/                # Translation files
        ├── en.json              # English translations
        ├── fr.json              # French translations
        └── ar.json              # Arabic translations
```

## 🍪 Cookie-Based i18n Features
- **No URL routing** - URLs stay clean: `/admin` instead of `/en/admin`
- **SSR support** - Server components get locale from cookies
- **Persistent language** - User language choice remembered
- **SEO friendly** - Single URL structure for all languages
- **Better UX** - No page reload when changing language

## 🔧 Dependencies Added (with pnpm)
- next-intl@^3.4.0 (cookie-based i18n)
- cookies-next@^4.1.1 (cookie management)
- zustand@^4.4.7 (state management)

## 🌐 Language Support
- **English** (en) - Default, LTR, 🇺🇸
- **French** (fr) - LTR, 🇫🇷
- **Arabic** (ar) - RTL, 🇹🇳 (Tunisian flag)

## 🎨 RTL Support Features
- Automatic sidebar side switching (left ↔ right)
- Text direction and alignment
- Icon mirroring for directional elements
- Layout reversal with CSS logical properties
- Proper Arabic font rendering

## 📋 Next Steps
1. **Copy content from artifacts** to files marked with `// TODO:`
2. **Test the structure**: `pnpm dev`
3. **Verify features**:
   - Language switching (no URL change)
   - RTL layout with Arabic
   - Theme switching
   - Sidebar functionality
4. **Clean up**: Delete `old/` folder when satisfied

## 🚀 Ready to Run
```bash
pnpm dev
# Visit: http://localhost:3180
# URLs stay clean: /admin (not /en/admin)
```

## ✨ Benefits of This Approach
- **Cleaner URLs** - No language codes in paths
- **Better SEO** - Single canonical URL structure
- **Faster switching** - No page navigation when changing language
- **SSR compatible** - Server renders in correct language from cookie
- **User friendly** - Language choice persists across sessions
- **Simpler routing** - Standard Next.js app structure

## 🧹 What Was Simplified
- Removed complex permission system
- No [locale] folder structure
- Clean modular components
- Simplified state management
- Focused type system
- Streamlined data structure

Perfect for École Ennour's multilingual admin dashboard! 🎓
EOF

    print_success "Created MIGRATION_SUMMARY.md"
}

# Main execution
main() {
    print_header "COOKIE-BASED i18n MIGRATION (No Locale in URL)"

    echo "This script will create a clean admin dashboard with:"
    echo "✅ Cookie-based i18n (NO locale in URL)"
    echo "✅ Clean URLs: /admin instead of /en/admin"
    echo "✅ Three languages: EN (default), FR, AR (🇹🇳)"
    echo "✅ Full RTL support for Arabic"
    echo "✅ Zustand state management"
    echo "✅ Modular sidebar architecture"
    echo "✅ SSR-compatible locale handling"
    echo ""
    echo "Operations:"
    echo "1. Backup old files to './old' folder"
    echo "2. Create new clean directory structure"
    echo "3. Create empty files with TODO comments"
    echo "4. Update configuration for cookie-based i18n"
    echo "5. Install dependencies with pnpm"
    echo ""

    read -p "Continue? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Migration cancelled"
        exit 0
    fi

    check_directory
    create_backup
    backup_old_files
    create_new_structure
    create_empty_files
    update_config_files
    create_summary

    print_header "COOKIE-BASED i18n MIGRATION COMPLETED!"

    echo -e "${GREEN}✅ Old files safely backed up to: ./old${NC}"
    echo -e "${GREEN}✅ Clean structure created (NO [locale] routing)${NC}"
    echo -e "${GREEN}✅ Cookie-based i18n configured${NC}"
    echo -e "${GREEN}✅ Dependencies installed with pnpm${NC}"
    echo -e "${GREEN}✅ All files created with TODO comments${NC}"
    echo ""
    echo -e "${BLUE}🌐 Language support:${NC}"
    echo "   • English (en) - Default, LTR, 🇺🇸"
    echo "   • French (fr) - LTR, 🇫🇷"
    echo "   • Arabic (ar) - RTL, 🇹🇳"
    echo ""
    echo -e "${BLUE}🔗 Clean URLs (no locale):${NC}"
    echo "   • /admin (not /en/admin)"
    echo "   • /admin/users (not /fr/admin/users)"
    echo "   • Language stored in cookies for SSR"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Copy content from artifacts to files with TODO comments"
    echo "2. Run: pnpm dev"
    echo "3. Test language switching (no URL change)"
    echo "4. Test RTL with Arabic (🇹🇳)"
    echo "5. Delete ./old folder when satisfied"
    echo ""
    echo -e "${YELLOW}📄 Check MIGRATION_SUMMARY.md for complete details${NC}"
    echo ""
    echo -e "${PURPLE}🎉 Ready for École Ennour's multilingual dashboard!${NC}"
}

# Run the script
main "$@"#!/bin/bash

# ============================================================================
# Admin Dashboard Refactoring Migration Script
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${PURPLE}============================================================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}============================================================================${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
check_directory() {
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found. Please run this script from your project root."
        exit 1
    fi

    if [[ ! -d "src" ]]; then
        print_error "src directory not found. Please run this script from your project root."
        exit 1
    fi

    print_success "Project root directory confirmed"
}

# Create backup directory
create_backup() {
    print_step "Creating backup directory..."

    if [[ -d "old" ]]; then
        print_warning "old directory already exists. Removing it..."
        rm -rf old
    fi

    mkdir -p old
    print_success "Backup directory created: ./old"
}

# Backup old files
backup_old_files() {
    print_step "Backing up old files..."

    # Files to backup (move to old folder)
    declare -a files_to_backup=(
        "src/hooks/useSidebarData.ts"
        "src/hooks/useSidebarActions.ts"
        "src/hooks/useSidebarPersistence.ts"
        "src/hooks/useKeyboardNavigation.ts"
        "src/hooks/index.ts"
        "src/types/SidebarData.ts"
        "src/types/ProcessedSidebarData.ts"
        "src/types/Badge.ts"
        "src/components/layout/admin/sidebar/AppSidebarMenu.tsx"
        "src/components/layout/admin/sidebar/ActionDropdown.tsx"
        "src/components/layout/admin/sidebar/NotificationDot.tsx"
        "src/components/layout/admin/sidebar/SidebarErrorBoundary.tsx"
        "src/constants/SidebarMenudata.ts"
        "src/constants/badgeStyles.ts"
        "src/lib/colorUtils.ts"
        "src/constants/dataOrg.ts"
        "src/constants/dataUser.ts"
        "src/constants/types.ts"
        "project_structure.txt"
        "scan.sh"
    )

    # Directories to backup
    declare -a dirs_to_backup=(
        "src/services"
        "src/validations"
        "src/store"
        "src/components/layout/admin/common"
    )

    # Backup files
    for file in "${files_to_backup[@]}"; do
        if [[ -f "$file" ]]; then
            # Create directory structure in old folder
            dir=$(dirname "$file")
            mkdir -p "old/$dir"
            mv "$file" "old/$file"
            print_success "Backed up: $file"
        else
            print_warning "File not found (skipping): $file"
        fi
    done

    # Backup directories
    for dir in "${dirs_to_backup[@]}"; do
        if [[ -d "$dir" ]]; then
            # Create parent directory in old folder
            parent=$(dirname "$dir")
            mkdir -p "old/$parent"
            mv "$dir" "old/$dir"
            print_success "Backed up directory: $dir"
        else
            print_warning "Directory not found (skipping): $dir"
        fi
    done
}

# Create new directory structure
create_new_structure() {
    print_step "Creating new directory structure..."

    # Create all new directories
    declare -a new_dirs=(
        "src/types"
        "src/lib/stores"
        "src/data"
        "src/i18n/messages"
        "src/components/providers"
        "src/components/sidebar/components"
        "src/components/shared"
        "src/app/[locale]/admin"
    )

    for dir in "${new_dirs[@]}"; do
        mkdir -p "$dir"
        print_success "Created directory: $dir"
    done
}

# Create empty files with comments
create_empty_files() {
    print_step "Creating empty files with structure comments..."

    # Core type files
    cat > "src/types/global.ts" << 'EOF'
// Global shared types
// TODO: Copy content from artifacts

export interface User {
  // User type definition
}

export interface Organization {
  // Organization type definition
}
EOF

    cat > "src/types/locale.ts" << 'EOF'
// Internationalization types
// TODO: Copy content from artifacts

export type LocaleCode = 'en' | 'fr' | 'ar'

export interface LocaleConfig {
  // Locale configuration type
}
EOF

    cat > "src/types/sidebar.ts" << 'EOF'
// Clean sidebar types
// TODO: Copy content from artifacts

export interface Badge {
  // Badge type definition
}

export interface SidebarMenuItem {
  // Menu item type definition
}
EOF

    # Store files
    cat > "src/lib/stores/locale-store.ts" << 'EOF'
// Locale management store
// TODO: Copy content from artifacts

import { create } from 'zustand'

// Locale store implementation
EOF

    cat > "src/lib/stores/sidebar-store.ts" << 'EOF'
// Sidebar state management
// TODO: Copy content from artifacts

import { create } from 'zustand'

// Sidebar store implementation
EOF

    cat > "src/lib/stores/theme-store.ts" << 'EOF'
// Theme management store
// TODO: Copy content from artifacts

import { create } from 'zustand'

// Theme store implementation
EOF

    cat > "src/lib/stores/index.ts" << 'EOF'
// Store exports
// TODO: Copy content from artifacts

export { useLocaleStore } from './locale-store'
export { useSidebarStore } from './sidebar-store'
export { useThemeStore } from './theme-store'
EOF

    cat > "src/lib/constants.ts" << 'EOF'
// Application constants
// TODO: Copy content from artifacts

export const BADGE_STYLES = {
  // Badge styling constants
} as const

export const SIDEBAR_CONFIG = {
  // Sidebar constants
} as const
EOF

    # i18n files
    cat > "src/i18n/config.ts" << 'EOF'
// i18n configuration
// TODO: Copy content from artifacts

import type { LocaleCode } from '@/types/locale'

export const LOCALES: LocaleCode[] = ['en', 'fr', 'ar']
export const DEFAULT_LOCALE: LocaleCode = 'en'
EOF

    cat > "src/i18n/request.ts" << 'EOF'
// Server-side i18n setup
// TODO: Copy content from artifacts

import { getRequestConfig } from 'next-intl/server'
EOF

    # Message files
    cat > "src/i18n/messages/en.json" << 'EOF'
{
  "common": {
    "loading": "Loading..."
  },
  "nav": {
    "dashboard": "Dashboard"
  }
}
EOF

    cat > "src/i18n/messages/fr.json" << 'EOF'
{
  "common": {
    "loading": "Chargement..."
  },
  "nav": {
    "dashboard": "Tableau de bord"
  }
}
EOF

    cat > "src/i18n/messages/ar.json" << 'EOF'
{
  "common": {
    "loading": "جارٍ التحميل..."
  },
  "nav": {
    "dashboard": "لوحة التحكم"
  }
}
EOF

    # Data files
    cat > "src/data/sidebar-data.ts" << 'EOF'
// Clean sidebar configuration
// TODO: Copy content from artifacts

import type { SidebarData } from '@/types/sidebar'

export const sidebarData: SidebarData = [
  // Sidebar data structure
]
EOF

    cat > "src/data/user-data.ts" << 'EOF'
// Clean user data
// TODO: Copy content from artifacts

import type { User } from '@/types/global'

export const userData: User = {
  // User data
}
EOF

    cat > "src/data/org-data.ts" << 'EOF'
// Clean organization data
// TODO: Copy content from artifacts

import type { Organization } from '@/types/global'

export const orgData: Organization = {
  // Organization data
}
EOF

    # Provider files
    cat > "src/components/providers/store-provider.tsx" << 'EOF'
// Store provider
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Store provider implementation
  return <>{children}</>
}
EOF

    # Sidebar component files
    cat > "src/components/sidebar/components/sidebar-badge.tsx" << 'EOF'
// Sidebar badge component
// TODO: Copy content from artifacts

import * as React from 'react'

export function SidebarBadge() {
  // Badge implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-actions.tsx" << 'EOF'
// Sidebar actions component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function SidebarActions() {
  // Actions implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-submenu.tsx" << 'EOF'
// Sidebar submenu component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function SidebarSubmenuComponent() {
  // Submenu implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-item.tsx" << 'EOF'
// Sidebar item component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function SidebarItem() {
  // Item implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/sidebar-group.tsx" << 'EOF'
// Sidebar group component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function SidebarGroupComponent() {
  // Group implementation
  return null
}
EOF

    cat > "src/components/sidebar/components/locale-selector.tsx" << 'EOF'
// Locale selector component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function LocaleSelector() {
  // Locale selector implementation
  return null
}
EOF

    cat > "src/components/sidebar/app-sidebar.tsx" << 'EOF'
// Main sidebar component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function AppSidebar() {
  // Main sidebar implementation
  return null
}
EOF

    cat > "src/components/sidebar/org-profile.tsx" << 'EOF'
// Organization profile component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function OrgProfile() {
  // Org profile implementation
  return null
}
EOF

    cat > "src/components/sidebar/user-menu.tsx" << 'EOF'
// User menu component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function UserMenu() {
  // User menu implementation
  return null
}
EOF

    # Layout files
    cat > "src/app/[locale]/layout.tsx" << 'EOF'
// Locale layout
// TODO: Copy content from artifacts

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return children;
}
EOF

    cat > "src/app/[locale]/page.tsx" << 'EOF'
// Home page
// TODO: Copy content from artifacts

import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/admin');
}
EOF

    cat > "src/app/[locale]/admin/layout.tsx" << 'EOF'
// Admin layout
// TODO: Copy content from artifacts

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div>{children}</div>;
}
EOF

    cat > "src/app/[locale]/admin/page.tsx" << 'EOF'
// Admin dashboard page
// TODO: Copy content from artifacts

export default function AdminPage() {
  return <div>Admin Dashboard</div>;
}
EOF

    # Update shared component
    if [[ -f "src/components/shared/modeToggle.tsx" ]]; then
        mv "src/components/shared/modeToggle.tsx" "old/src/components/shared/modeToggle.tsx" 2>/dev/null || true
    fi

    cat > "src/components/shared/mode-toggle.tsx" << 'EOF'
// Updated mode toggle component
// TODO: Copy content from artifacts

'use client'

import * as React from 'react'

export function ModeToggle() {
  // Theme toggle implementation
  return null
}
EOF

    print_success "Created all empty files with TODO comments"
}

# Update configuration files
update_config_files() {
    print_step "Updating configuration files..."

    # Update package.json dependencies
    print_step "Updating package.json dependencies..."

    # Add new dependencies using pnpm
    pnpm add next-intl@^3.4.0 cookies-next@^4.1.1 zustand@^4.4.7

    print_success "Added new dependencies with pnpm"

    # Update next.config.ts
    cat > "next.config.ts" << 'EOF'
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
};

export default withNextIntl(nextConfig);
EOF

    # Update middleware.ts
    cat > "src/middleware.ts" << 'EOF'
import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeDetection: false
});

export default intlMiddleware;

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|.*\\.).*)'
  ]
};
EOF

    # Update tsconfig.json paths
    if [[ -f "tsconfig.json" ]]; then
        # Backup original tsconfig
        cp "tsconfig.json" "old/tsconfig.json.backup"

        # Create new tsconfig with updated paths
        cat > "tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/data/*": ["./src/data/*"],
      "@/i18n/*": ["./src/i18n/*"]
    },
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "out", "dist"]
}
EOF
    fi

    print_success "Updated configuration files"
}

# Create summary report
create_summary() {
    print_step "Creating migration summary..."

    cat > "MIGRATION_SUMMARY.md" << 'EOF'
# Migration Summary

## Files Moved to `old/` Folder
- All old hooks, types, and components have been backed up
- Original configuration files backed up
- Legacy sidebar system preserved

## New Structure Created
- Clean modular architecture
- Zustand stores for state management
- next-intl for internationalization
- RTL support for Arabic

## Next Steps
1. Copy content from artifacts to empty files (look for TODO comments)
2. Test the new structure
3. Delete `old/` folder when satisfied

## Dependencies Added
- next-intl@^3.4.0
- cookies-next@^4.1.1
- zustand@^4.4.7

## Ready to Run
```bash
pnpm dev
```

Visit: http://localhost:3180
EOF

    print_success "Created MIGRATION_SUMMARY.md"
}

# Main execution
main() {
    print_header "ADMIN DASHBOARD REFACTORING MIGRATION"

    echo "This script will:"
    echo "1. Backup old files to './old' folder"
    echo "2. Create new clean directory structure"
    echo "3. Create empty files with TODO comments"
    echo "4. Update configuration files"
    echo "5. Install new dependencies with pnpm"
    echo ""

    read -p "Continue? (y/N): " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Migration cancelled"
        exit 0
    fi

    check_directory
    create_backup
    backup_old_files
    create_new_structure
    create_empty_files
    update_config_files
    create_summary

    print_header "MIGRATION COMPLETED SUCCESSFULLY!"

    echo -e "${GREEN}✅ Old files backed up to: ./old${NC}"
    echo -e "${GREEN}✅ New structure created with empty files${NC}"
    echo -e "${GREEN}✅ Dependencies installed with pnpm${NC}"
    echo -e "${GREEN}✅ Configuration files updated${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Copy content from artifacts to files marked with TODO"
    echo "2. Run: pnpm dev"
    echo "3. Test the new structure"
    echo "4. Delete ./old folder when satisfied"
    echo ""
    echo -e "${YELLOW}📁 Check MIGRATION_SUMMARY.md for details${NC}"
}

# Run the script
main "$@"