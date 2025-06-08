// ============================================================================
// src/components/ui/sonner.tsx - FIXED
// ============================================================================

"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme()

    // Ensure theme is never undefined to satisfy exactOptionalPropertyTypes
    const validTheme: "light" | "dark" | "system" = theme === "light" || theme === "dark" || theme === "system"
        ? theme
        : "system"

    return (
        <Sonner
            theme={validTheme}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }