"use client";

import * as React from "react";
import * as Icons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof Icons;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    name: IconName;
    size?: number | string;
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    color?: string;
    mirrored?: boolean;
}

export const Icon = ({
                         name,
                         size = 20,
                         weight = "regular",
                         color = "currentColor",
                         mirrored = false,
                         className,
                         ...props
                     }: IconProps) => {
    const Component = Icons[name] as React.ComponentType<{
        size?: number | string;
        weight?: IconProps["weight"];
        color?: string;
        mirrored?: boolean;
    } & React.SVGProps<SVGSVGElement>>;

    if (!Component) {
        console.warn(`Icon "${name}" not found in @phosphor-icons/react.`);
        const FallbackIcon = Icons.QuestionIcon;
        return (
            <FallbackIcon
                size={size}
                weight={weight}
                color={color}
                mirrored={mirrored}
                className={cn("inline align-middle", className)}
                {...props}
            />
        );
    }

    return (
        <Component
            size={size}
            weight={weight}
            color={color}
            mirrored={mirrored}
            className={cn("inline align-middle", className)}
            {...props}
        />
    );
};