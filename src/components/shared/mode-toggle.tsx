"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [isClient, setIsClient] = useState(false);
    const t = useTranslations('theme');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    // Show skeleton during hydration to prevent layout shift
    if (!isClient) {
        return (
            <Skeleton className="w-10 h-10 rounded-full" />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                type: "spring",
                stiffness: 600,
                damping: 20
            }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={t('toggleTheme')}
                className="rounded-full cursor-pointer w-10 h-10 p-0 overflow-hidden"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={resolvedTheme}
                        initial={{ y: -12, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 12, opacity: 0, rotate: 90 }}
                        transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.2
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon
                            name={resolvedTheme === "light" ? "MoonIcon" : "SunIcon"}
                            size={20}
                            weight="duotone"
                            className="size-5 text-foreground"
                        />
                    </motion.div>
                </AnimatePresence>
            </Button>
        </motion.div>
    );
}