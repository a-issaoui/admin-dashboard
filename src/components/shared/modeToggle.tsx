"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/ui/button"; // Assuming this path is correct
import { Icon } from "@/components/icons"; // Assuming this path is correct
import { Skeleton } from "@/ui/skeleton";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "light" ? "dark" : "light");
    };

    if (!isClient) {
        return (
            <Skeleton
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center"
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 600, // Made faster
                damping: 20     // Adjusted damping
            }}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full cursor-pointer w-10 h-10 p-0 overflow-hidden"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={resolvedTheme}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={{
                            type: "tween",
                            ease: "easeInOut",
                            duration: 0.2
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon
                            name={resolvedTheme === "light" ? "MoonIcon" : "SunIcon"}
                            size={24}
                            weight="duotone"
                            color={resolvedTheme === "light" ? "#64748b" : "#f59e0b"}
                            className="size-6"
                        />
                    </motion.div>
                </AnimatePresence>

            </Button>
        </motion.div>
    );
}