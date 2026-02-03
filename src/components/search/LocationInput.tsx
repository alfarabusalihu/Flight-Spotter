"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

import { SearchLocation } from "@/types/location";

interface LocationInputProps {
    type: 'origin' | 'destination';
    value: string;
    iataCode: string;
    isFocused: boolean;
    isLoading: boolean;
    compact?: boolean;
    locations: SearchLocation[];
    onFocus: () => void;
    onChange: (val: string) => void;
    onClear: () => void;
    onSelect: (loc: SearchLocation) => void;
    onDetectLocation?: () => Promise<void>;
}

export default function LocationInput({
    type, value, iataCode, isFocused, isLoading, compact, locations,
    onFocus, onChange, onClear, onSelect, onDetectLocation
}: LocationInputProps) {

    // Helper for formatting location names
    const formatName = (name: string) => {
        return name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="flex-1 min-w-[220px] relative group">
            {/* Icon/Action */}
            <div
                onClick={onDetectLocation}
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-dark-cyan-light z-10 p-2 ${onDetectLocation ? 'cursor-pointer' : 'pointer-events-none'}`}
            >
                {isLoading && type === 'origin' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    type === 'origin' ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />
                )}
            </div>

            {/* Input Field */}
            <input
                type="text"
                placeholder={type === 'origin' ? "From where?" : "To where?"}
                value={value}
                onFocus={onFocus}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-12 pr-10 ${compact ? 'py-3.5 text-sm' : 'py-5 text-base'} bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 focus:dark:bg-black/40 border-none rounded-2xl font-bold text-foreground transition-all outline-none placeholder:text-foreground/20`}
            />

            {/* Clear Button */}
            {value && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-red-500 transition-colors p-1"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}

            {/* Dropdown Results */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute top-full left-0 right-0 mt-2 p-2 bg-background rounded-2xl shadow-2xl z-[60] border border-foreground/10 max-h-[350px] overflow-y-auto min-w-[300px]"
                    >
                        {(!locations || locations.length === 0) ? (
                            <div className="p-4 text-center text-foreground/40 text-sm font-medium flex flex-col items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-dark-cyan-light" />
                                        <span>Finding locations...</span>
                                    </>
                                ) : (
                                    <span>Type a city or airport...</span>
                                )}
                            </div>
                        ) : (
                            locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    onClick={() => onSelect(loc)}
                                    className="p-3 hover:bg-dark-cyan/10 rounded-xl cursor-pointer transition-colors flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-dark-cyan/10 flex items-center justify-center text-dark-cyan-light font-bold text-[10px]">
                                        {loc.iataCode}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm truncate">{formatName(loc.name)}</div>
                                        <div className="text-[10px] text-foreground/40 uppercase font-black truncate">
                                            {loc.address?.cityName || loc.cityName}, {loc.address?.countryCode || loc.countryCode} • {loc.subType}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
