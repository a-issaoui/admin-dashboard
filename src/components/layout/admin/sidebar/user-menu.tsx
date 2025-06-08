// ============================================================================
// src/components/layout/admin/sidebar/user-menu.tsx - FIXED
// ============================================================================

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLocaleStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import type { User } from '@/types/global'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations('user')
  const { isRTL } = useLocaleStore()

  const initials = React.useMemo(() => {
    return user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word: string) => word[0]?.toUpperCase() || '')
        .join('')
  }, [user.name])

  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background',
                      user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  )} />
                </div>
                <div className={cn(
                    'flex flex-col text-left leading-none min-w-0 flex-1',
                    isRTL() && 'text-right'
                )}>
                  <span className="font-medium text-sm truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-56"
                align={isRTL() ? 'start' : 'end'}
                side={isRTL() ? 'left' : 'right'}
                sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className={cn(
                    'flex items-center gap-2 px-1 py-1.5 text-sm',
                    isRTL() && 'flex-row-reverse'
                )}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                      'flex flex-col leading-none min-w-0',
                      isRTL() && 'text-right'
                  )}>
                    <span className="font-medium truncate">{user.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className={cn(
                  'cursor-pointer gap-2',
                  isRTL() && 'flex-row-reverse'
              )}>
                <UserIcon className="h-4 w-4" />
                <span>{t('profile')}</span>
              </DropdownMenuItem>

              <DropdownMenuItem className={cn(
                  'cursor-pointer gap-2',
                  isRTL() && 'flex-row-reverse'
              )}>
                <Settings className="h-4 w-4" />
                <span>{t('preferences')}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className={cn(
                  'cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20',
                  isRTL() && 'flex-row-reverse'
              )}>
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}