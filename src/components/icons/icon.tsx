"use client";

import * as Icons from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

// Export the IconName type
export type IconName = keyof typeof Icons;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    color?: string;
    isRTL?: boolean;
}

export const Icon = ({
                         name,
                         size = 20,
                         weight = "regular",
                         color = "currentColor",
                         isRTL = false,
                         className,
                         ...props
                     }: IconProps) => {
    const Component = Icons[name] as React.FC<React.SVGProps<SVGSVGElement> & {
        size?: number | string;
        weight?: IconProps["weight"];
        color?: string;
        mirrored?: boolean;
    }>;

    if (!Component) {
        // It's good practice to also return a fallback or handle the error gracefully
        // For example, render a default "unknown" icon or nothing,
        // instead of just logging to console which might be missed.
        console.warn(`Icon "${name}" not found in @phosphor-icons/react/ssr.`);
        // Consider returning a default icon or null
        // For example: return <Icons.Question size={size} color={color} className={className} {...props} />;
        return null;
    }

    return (
        <Component
            size={size}
            weight={weight}
            color={color}
            mirrored={isRTL} // The 'mirrored' prop from Phosphor handles RTL flipping
            className={cn("inline align-middle", className)} // Added align-middle for better default inline layout
            {...props}
        />
    );
};