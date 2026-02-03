"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LocationPermissionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAllow: () => void;
}

export default function LocationPermissionDialog({
    isOpen,
    onClose,
    onAllow
}: LocationPermissionDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md mx-4"
                    >
                        <div className="bg-white dark:bg-black/90 dark:glass-card p-8 rounded-[2.5rem] border border-black/5 dark:border-white/10 shadow-2xl relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-all group"
                            >
                                <X className="w-4 h-4 text-foreground/40 group-hover:text-foreground" />
                            </button>

                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dark-cyan to-dark-cyan-light flex items-center justify-center mb-6 shadow-lg shadow-dark-cyan/20">
                                <Navigation className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-display font-black text-foreground mb-3 tracking-tight">
                                Enable Location Access
                            </h2>
                            <p className="text-sm text-foreground/60 leading-relaxed mb-6 font-medium">
                                Allow Flight Spotter to access your location to unlock premium features:
                            </p>

                            {/* Benefits */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-dark-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin className="w-3 h-3 text-dark-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Auto-fill your origin</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">Instantly detect your nearest airport</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-dark-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs">✨</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Discover nearby deals</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">Get personalized flight offers from your location</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-dark-cyan/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs">🎯</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-foreground">Personalized insights</p>
                                        <p className="text-[10px] text-foreground/40 font-medium">AI-powered recommendations based on your area</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={onAllow}
                                    className="w-full py-3 bg-dark-cyan hover:bg-dark-cyan-light text-white rounded-xl font-bold transition-all shadow-lg shadow-dark-cyan/20"
                                >
                                    Allow Location
                                </Button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl font-bold transition-all font-sans"
                                >
                                    Not Now
                                </button>
                            </div>

                            {/* Privacy Note */}
                            <p className="text-[9px] text-foreground/30 text-center mt-6 font-bold uppercase tracking-widest">
                                🔒 Your location is never stored or shared
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
