"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import React from "react";

interface FilterOption {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface FilterDropdownProps {
    label: string;
    icon: React.ReactNode;
    options: FilterOption[];
    selectedIds: string[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (id: string) => void;
    renderOption?: (option: FilterOption, isSelected: boolean) => React.ReactNode;
}

export default function FilterDropdown({
    label, icon, options, selectedIds, isOpen, onToggle, onSelect, renderOption
}: FilterDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isOpen || selectedIds.length > 0
                        ? "bg-dark-cyan/10 border-dark-cyan/30 text-dark-cyan"
                        : "bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10"
                    }`}
            >
                {icon}
                <span className="text-xs font-bold whitespace-nowrap">
                    {selectedIds.length > 0
                        ? `${label}: ${selectedIds.length}`
                        : label}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 p-2 bg-background rounded-2xl shadow-2xl z-[70] border border-foreground/10 min-w-[200px] max-h-[300px] overflow-y-auto"
                    >
                        {options.map((option) => {
                            const isSelected = selectedIds.includes(option.id);
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => onSelect(option.id)}
                                    className="p-2.5 hover:bg-dark-cyan/10 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                                >
                                    {renderOption ? (
                                        renderOption(option, isSelected)
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            {option.icon}
                                            <span className={`text-xs font-bold ${isSelected ? 'text-dark-cyan' : 'text-foreground/70'}`}>
                                                {option.label}
                                            </span>
                                        </div>
                                    )}
                                    {isSelected && <Check className="w-3.5 h-3.5 text-dark-cyan" />}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
