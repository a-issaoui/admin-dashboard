// ============================================================================
// src/components/ui/icon.tsx - Simplified Icon Component
// ============================================================================

"use client"

import * as Icons from "@phosphor-icons/react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import type { IconWeight } from "@/types"

// Create proper type for icon names
export type IconName = keyof typeof Icons

export interface IconProps {
    name: IconName
    size?: number | string
    weight?: IconWeight
    color?: string
    className?: string
    mirrored?: boolean
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(({
                                                              name,
                                                              size = 20,
                                                              weight = "regular",
                                                              color = "currentColor",
                                                              className,
                                                              mirrored = false,
                                                              ...props
                                                          }, ref) => {
    const Component = Icons[name] as React.ComponentType<{
        size?: number | string
        weight?: IconWeight
        color?: string
        className?: string
        mirrored?: boolean
        ref?: React.Ref<SVGSVGElement>
    }>

    if (!Component) {
        console.warn(`Icon "${name}" not found in @phosphor-icons/react`)
        // Fallback to Question icon
        const FallbackIcon = Icons.QuestionIcon
        return (
            <FallbackIcon
                ref={ref}
                size={size}
                weight={weight}
                color={color}
                mirrored={mirrored}
                className={cn("inline-flex shrink-0", className)}
                {...props}
            />
        )
    }

    return (
        <Component
            ref={ref}
            size={size}
            weight={weight}
            color={color}
            mirrored={mirrored}
            className={cn("inline-flex shrink-0", className)}
            {...props}
        />
    )
})

Icon.displayName = "Icon"

// Pre-defined icon variants for common use cases
export const CheckIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="CheckIcon" {...props} />

export const XIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="XIcon" {...props} />

export const ChevronDownIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="CaretDownIcon" {...props} />

export const ChevronRightIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="CaretRightIcon" {...props} />

export const LoadingIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="CircleNotchIcon" weight="bold" className="animate-spin" {...props} />

export const MenuIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="ListIcon" {...props} />

export const SearchIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="MagnifyingGlassIcon" {...props} />

export const UserIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="UserIcon" {...props} />

export const SettingsIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="GearIcon" {...props} />

export const HomeIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="HouseIcon" {...props} />

export const NotificationIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="BellIcon" {...props} />

export const MessageIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="EnvelopeIcon" {...props} />

export const CalendarIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="CalendarIcon" {...props} />

export const FolderIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="FolderIcon" {...props} />

export const UsersIcon = (props: Omit<IconProps, 'name'>) =>
    <Icon name="UsersIcon" {...props} />