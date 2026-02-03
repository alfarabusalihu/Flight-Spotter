"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useFlightStore } from "@/lib/store";

interface PriceRangeSelectorProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function PriceRangeSelector({ isOpen, onToggle }: PriceRangeSelectorProps) {
    const { filters, updateFilters, formatPrice, t } = useFlightStore();
    const [localPrice, setLocalPrice] = useState(filters.maxPrice);

    // Sync with global store if changed externally (e.g. clear filters)
    useEffect(() => {
        setLocalPrice(filters.maxPrice);
    }, [filters.maxPrice]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setLocalPrice(value);
    };

    const handleCommit = () => {
        updateFilters({ maxPrice: localPrice });
    };

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isOpen || filters.maxPrice < 5000
                        ? "bg-dark-cyan/10 border-dark-cyan/30 text-dark-cyan"
                        : "bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10"
                    }`}
            >
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-xs font-bold whitespace-nowrap">
                    {filters.maxPrice < 5000 ? `${t("Max")}: ${formatPrice(filters.maxPrice)}` : t("Price")}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 p-6 bg-background rounded-2xl shadow-2xl z-[70] border border-foreground/10 min-w-[280px]"
                    >
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{t("Max Budget")}</h4>
                                <span className="text-sm font-black text-dark-cyan">{formatPrice(localPrice)}</span>
                            </div>

                            <div className="relative h-6 flex items-center">
                                <input
                                    type="range"
                                    min="100"
                                    max="5000"
                                    step="50"
                                    value={localPrice}
                                    onChange={handlePriceChange}
                                    onMouseUp={handleCommit}
                                    onTouchEnd={handleCommit}
                                    className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-dark-cyan"
                                />
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-dark-cyan rounded-lg pointer-events-none"
                                    style={{ width: `${((localPrice - 100) / 4900) * 100}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-[10px] font-bold text-foreground/30">
                                <span>{formatPrice(100)}</span>
                                <span>{formatPrice(5000)}+</span>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <button
                                    onClick={() => { updateFilters({ maxPrice: 5000 }); onToggle(); }}
                                    className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                                >
                                    {t("Reset")}
                                </button>
                                <button
                                    onClick={onToggle}
                                    className="flex-1 py-2 bg-dark-cyan text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-dark-cyan/20"
                                >
                                    {t("Apply")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
