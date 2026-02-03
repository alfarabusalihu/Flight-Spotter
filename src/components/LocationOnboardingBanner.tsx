"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, X } from "lucide-react";

interface LocationOnboardingBannerProps {
    isAuthenticated: boolean;
}

export default function LocationOnboardingBanner({ isAuthenticated }: LocationOnboardingBannerProps) {
    const [isVisible, setIsVisible] = useState(isAuthenticated);

    useEffect(() => {
        setIsVisible(isAuthenticated);
    }, [isAuthenticated]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="w-full overflow-hidden"
                >
                    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-4">
                        <div className="relative glass-card p-4 rounded-2xl border border-dark-cyan/20 bg-dark-cyan/5 backdrop-blur-xl shadow-lg">
                            {/* Close Button */}
                            <button
                                onClick={handleDismiss}
                                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-all group"
                            >
                                <X className="w-3 h-3 text-foreground/40 group-hover:text-foreground" />
                            </button>

                            <div className="flex items-start gap-4 pr-8">
                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dark-cyan to-dark-cyan-light flex items-center justify-center shrink-0 shadow-md shadow-dark-cyan/20">
                                    <Navigation className="w-5 h-5 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-black text-foreground mb-1 tracking-tight">
                                        🌍 Unlock Location-Based Features
                                    </h3>
                                    <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                                        Click the <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-dark-cyan/10 rounded-md text-dark-cyan font-bold">
                                            <Navigation className="w-3 h-3" /> compass icon
                                        </span> in the Origin field to auto-detect your location and discover personalized flight deals!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
