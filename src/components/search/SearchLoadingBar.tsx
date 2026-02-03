"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SearchLoadingBarProps {
    isLoading: boolean;
    layoutId?: string;
}

export default function SearchLoadingBar({ isLoading, layoutId }: SearchLoadingBarProps) {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 4 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-background overflow-hidden"
                >
                    <motion.div
                        layoutId={layoutId}
                        className="h-full bg-gradient-to-r from-transparent via-dark-cyan-light to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
