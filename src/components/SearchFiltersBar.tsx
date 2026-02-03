"use client";

import { useFlightStore } from "@/lib/store";
import SearchForm from "./SearchForm";
import { Filter, X, Plane, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import FilterDropdown from "./search/FilterDropdown";
import PriceRangeSelector from "./search/PriceRangeSelector";

import { SUPPORTED_CURRENCIES, SUPPORTED_LANGUAGES } from "@/constants/localizationData";

export default function SearchFiltersBar() {
    const {
        filters, updateFilters, topAirlines, availableCabinClasses,
        flightResults, currency, setCurrency, formatPrice, fetchRates,
        language, setLanguage, t
    } = useFlightStore();

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const toggleDropdown = (key: string) => {
        if (key === 'currency' && Object.keys(useFlightStore.getState().exchangeRates).length <= 1) {
            fetchRates();
        }
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    // Derived Statistics
    const totalFlights = flightResults.length;
    const cheapestPrice = totalFlights > 0
        ? Math.min(...flightResults.map(f => parseFloat(f.price?.total || f.price?.amount || "0")))
        : 0;

    const stopOptions = [0, 1, 2].map(s => ({ id: s.toString(), label: s === 0 ? t("Non-stop") : `${s} ${t("Stop")}${s > 1 ? 's' : ''}` }));
    const cabinOptions = availableCabinClasses.map(c => ({ id: c, label: t(c) }));
    const airlineOptions = topAirlines.map(a => ({ id: a.code, label: a.name }));

    const currencyOptions = SUPPORTED_CURRENCIES.map(curr => ({
        id: curr.code,
        label: curr.code,
        icon: <span className="text-[10px] font-bold text-dark-cyan/50">{curr.symbol}</span>
    }));

    const languageOptions = SUPPORTED_LANGUAGES.map(lang => ({
        id: lang.code,
        label: lang.label.toUpperCase(),
        native: lang.nativeLabel
    }));

    return (
        <div className="sticky top-[64px] md:top-20 z-50 w-full bg-background/95 backdrop-blur-3xl border-b border-silver/10 shadow-sm transition-all pb-4 pt-4 px-fluid flex flex-col gap-4">

            <div className="w-full">
                <SearchForm compact />
            </div>

            <AnimatePresence>
                {flightResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="flex items-center gap-2 flex-wrap pb-2"
                    >
                        {/* Status Pills */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-cyan/5 border border-dark-cyan/10 mr-2">
                            <Plane className="w-3 h-3 text-dark-cyan" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-dark-cyan">
                                {totalFlights} {t("Flights Found")}
                            </span>
                        </div>
                        {cheapestPrice > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 mr-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                    {t("From")} {formatPrice(cheapestPrice)}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 mr-4">
                            <Filter className="w-3.5 h-3.5" />
                            <span>{t("Quick Filters")}</span>
                        </div>

                        {/* Currency Dropdown */}
                        <FilterDropdown
                            label={currency}
                            icon={<Filter className="w-3 h-3" />}
                            options={currencyOptions}
                            selectedIds={[currency]}
                            isOpen={activeDropdown === 'currency'}
                            onToggle={() => toggleDropdown('currency')}
                            onSelect={(id: string) => { setCurrency(id); setActiveDropdown(null); }}
                        />

                        {/* Language Dropdown */}
                        <FilterDropdown
                            label={language.toUpperCase()}
                            icon={<Filter className="w-3 h-3" />}
                            options={languageOptions}
                            selectedIds={[language]}
                            isOpen={activeDropdown === 'language'}
                            onToggle={() => toggleDropdown('language')}
                            onSelect={(id: string) => { setLanguage(id); setActiveDropdown(null); }}
                        />

                        {/* Price Filter */}
                        <PriceRangeSelector
                            isOpen={activeDropdown === 'price'}
                            onToggle={() => toggleDropdown('price')}
                        />

                        {/* Stops Dropdown */}
                        <FilterDropdown
                            label="Stops"
                            icon={<Filter className="w-3 h-3" />}
                            options={stopOptions}
                            selectedIds={filters.stops.map(String)}
                            isOpen={activeDropdown === 'stops'}
                            onToggle={() => toggleDropdown('stops')}
                            onSelect={(id: string) => {
                                const stop = parseInt(id);
                                const updated = filters.stops.includes(stop)
                                    ? filters.stops.filter(s => s !== stop)
                                    : [...filters.stops, stop];
                                updateFilters({ stops: updated });
                            }}
                        />

                        {/* Airlines Dropdown */}
                        <FilterDropdown
                            label="Airlines"
                            icon={<Plane className="w-3 h-3" />}
                            options={airlineOptions}
                            selectedIds={filters.airlines}
                            isOpen={activeDropdown === 'airlines'}
                            onToggle={() => toggleDropdown('airlines')}
                            onSelect={(id: string) => {
                                const updated = filters.airlines.includes(id)
                                    ? filters.airlines.filter(a => a !== id)
                                    : [...filters.airlines, id];
                                updateFilters({ airlines: updated });
                            }}
                            renderOption={(option: any, isSelected: boolean) => (
                                <div className="flex items-center gap-3 w-full">
                                    <div className="relative w-4 h-4">
                                        <Image
                                            src={`https://www.gstatic.com/flights/airline_logos/70px/${option.id}.png`}
                                            alt={option.label}
                                            fill
                                            className="object-contain brightness-110"
                                            unoptimized
                                        />
                                    </div>
                                    <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-dark-cyan' : 'text-foreground'}`}>
                                        {option.label}
                                    </span>
                                </div>
                            )}
                        />

                        {/* Cabin Dropdown */}
                        <FilterDropdown
                            label={filters.cabinClass}
                            icon={<Briefcase className="w-3 h-3" />}
                            options={cabinOptions}
                            selectedIds={[filters.cabinClass]}
                            isOpen={activeDropdown === 'cabin'}
                            onToggle={() => toggleDropdown('cabin')}
                            onSelect={(id: string) => { updateFilters({ cabinClass: id }); setActiveDropdown(null); }}
                        />

                        {/* Clear Button */}
                        {(filters.stops.length > 0 || filters.maxPrice < 5000 || filters.airlines.length > 0 || filters.cabinClass !== 'Economy') && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => updateFilters({ stops: [], maxPrice: 5000, airlines: [], cabinClass: 'Economy' })}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
