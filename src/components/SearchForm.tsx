"use client";

import { useState, useEffect, useRef } from "react";
import { searchLocationsAction } from "@/app/actions/flight";
import { format } from "date-fns";
import { MapPin, Calendar, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useFlightStore } from "@/lib/store";
import PremiumCalendar from "./PremiumCalendar";
import { locationCache } from "@/lib/locationCache";
import SearchErrorDisplay from "./SearchErrorDisplay";
import { smartSearch } from "@/lib/smartSearch";
import { Skeleton } from "@/components/ui/Skeleton";
import LocationInput from "./search/LocationInput";
import { type SearchLocation } from "@/types/location";
import SearchLoadingBar from "./search/SearchLoadingBar";

interface SearchFormProps {
    compact?: boolean;
}

export default function SearchForm({ compact }: SearchFormProps) {
    const {
        origin, originCode, destination, destinationCode, departureDate, returnDate,
        searchFlights, isSearchLoading, updateSearchParam, retrievedLocations,
        setRetrievedLocations, detectUserLocation, searchError, clearError,
        fetchDiscoveryDeals, fetchOriginInsights
    } = useFlightStore();

    const [isMounted, setIsMounted] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const [activeCalendar, setActiveCalendar] = useState<'departure' | 'return' | null>(null);
    const [focusedField, setFocusedField] = useState<'origin' | 'destination' | null>(null);

    const calendarRef = useRef<HTMLDivElement>(null);
    const returnCalendarRef = useRef<HTMLDivElement>(null);
    const originRef = useRef<HTMLDivElement>(null);
    const destRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close overlays on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                if (activeCalendar === 'departure') setActiveCalendar(null);
            }
            if (returnCalendarRef.current && !returnCalendarRef.current.contains(event.target as Node)) {
                if (activeCalendar === 'return') setActiveCalendar(null);
            }
            if (originRef.current && !originRef.current.contains(event.target as Node)) {
                if (focusedField === 'origin') setFocusedField(null);
            }
            if (destRef.current && !destRef.current.contains(event.target as Node)) {
                if (focusedField === 'destination') setFocusedField(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [focusedField, activeCalendar]);

    // Handle Location Search with Cache-First Strategy + Debounce
    const handleLocationSearch = async (val: string, type: 'origin' | 'destination') => {
        updateSearchParam(type, val);
        updateSearchParam(type === 'origin' ? 'originCode' : 'destinationCode', "");
        clearError();

        const cachedResults = locationCache.search(val).map(loc => ({
            id: loc.id, iataCode: loc.iataCode, name: loc.name, subType: loc.subType,
            address: { cityName: loc.cityName, countryCode: loc.countryCode }
        }));
        setRetrievedLocations(cachedResults);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (val.length >= 2) {
            setDetectingLocation(true);
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const apiResults = await searchLocationsAction(val);
                    if (apiResults && apiResults.length > 0) {
                        apiResults.forEach((loc: SearchLocation) => locationCache.addToCache(loc));
                        const apiCodes = new Set(apiResults.map((r: any) => r.iataCode));
                        const merged = [...apiResults, ...cachedResults.filter(c => !apiCodes.has(c.iataCode))];
                        setRetrievedLocations(merged);
                    }
                } finally {
                    setDetectingLocation(false);
                }
            }, 400);
        }
    };

    const handleSelect = (loc: SearchLocation, type: 'origin' | 'destination') => {
        const cityRaw = loc.address?.cityName || loc.cityName || "";
        const city = cityRaw.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const displayName = city || loc.name;

        updateSearchParam(type, displayName);
        updateSearchParam(type === 'origin' ? 'originCode' : 'destinationCode', loc.iataCode);

        console.info(`[SearchForm] 📍 Selected ${type}: ${displayName} (${loc.iataCode}) - ${loc.name}`);

        if (type === 'origin') {
            fetchDiscoveryDeals(loc.iataCode);
            fetchOriginInsights(displayName, loc.iataCode);
        }

        locationCache.addToRecent({
            id: loc.id, iataCode: loc.iataCode, name: loc.name, subType: loc.subType,
            cityName: loc.address?.cityName || '', countryCode: loc.address?.countryCode || ''
        });

        setFocusedField(null);
    };

    const handleFocus = async (field: 'origin' | 'destination') => {
        setFocusedField(field);
        clearError();
        const val = field === 'origin' ? origin : destination;
        const cachedResults = locationCache.search(val || '').map(loc => ({
            id: loc.id, iataCode: loc.iataCode, name: loc.name, subType: loc.subType,
            address: { cityName: loc.cityName, countryCode: loc.countryCode }
        }));
        setRetrievedLocations(cachedResults);
    };

    // Auto-search logic
    useEffect(() => {
        const triggerSearch = async () => {
            const iataRegex = /^[A-Z]{3}$/;
            if (originCode && iataRegex.test(originCode)) smartSearch.predictAndCacheDestinations(origin);
            if (iataRegex.test(originCode) && iataRegex.test(destinationCode) && departureDate) {
                await searchFlights({
                    originLocationCode: originCode, destinationLocationCode: destinationCode,
                    departureDate, returnDate: returnDate || undefined, adults: "1",
                });
            }
        };
        const timer = setTimeout(triggerSearch, 500);
        return () => clearTimeout(timer);
    }, [originCode, destinationCode, departureDate, returnDate, origin]);

    if (!isMounted) return (
        <div className={`w-full max-w-7xl mx-auto -mt-20 px-4 relative z-40`}>
            <Skeleton className="h-24 w-full rounded-[2.5rem] bg-white/10 backdrop-blur-md" />
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: compact ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full relative z-40 transition-all duration-500 ${compact ? 'px-0' : 'max-w-7xl mx-auto -mt-20 px-4'}`}
        >
            <div className={`glass-card relative overflow-visible shadow-2xl backdrop-blur-3xl border border-white/10 ${compact ? 'p-1.5 rounded-2xl' : 'p-2 md:p-4 rounded-[2.5rem]'}`}>
                <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden rounded-b-2xl pointer-events-none z-20">
                    <SearchLoadingBar isLoading={isSearchLoading || detectingLocation} layoutId="loading-bar" />
                </div>

                <div className="flex flex-col lg:flex-row items-stretch gap-1">
                    <div ref={originRef} className="flex-[1.5]">
                        <LocationInput
                            type="origin" value={origin} iataCode={originCode}
                            isFocused={focusedField === 'origin'} isLoading={detectingLocation} compact={compact}
                            locations={retrievedLocations} onFocus={() => handleFocus('origin')}
                            onChange={(val) => handleLocationSearch(val, 'origin')}
                            onClear={() => { updateSearchParam('origin', ''); updateSearchParam('originCode', ''); }}
                            onSelect={(loc) => handleSelect(loc, 'origin')}
                            onDetectLocation={async () => {
                                setDetectingLocation(true);
                                await detectUserLocation();
                                setDetectingLocation(false);
                            }}
                        />
                    </div>

                    <div ref={destRef} className="flex-[1.5]">
                        <LocationInput
                            type="destination" value={destination} iataCode={destinationCode}
                            isFocused={focusedField === 'destination'} isLoading={detectingLocation} compact={compact}
                            locations={retrievedLocations} onFocus={() => handleFocus('destination')}
                            onChange={(val) => handleLocationSearch(val, 'destination')}
                            onClear={() => { updateSearchParam('destination', ''); updateSearchParam('destinationCode', ''); }}
                            onSelect={(loc) => handleSelect(loc, 'destination')}
                        />
                    </div>

                    {/* Departure Date */}
                    <div className="flex-1 min-w-[180px] relative" ref={calendarRef}>
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-cyan-light pointer-events-none">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div
                            aria-label="Departure Date"
                            onClick={() => setActiveCalendar(activeCalendar === 'departure' ? null : 'departure')}
                            className={`w-full pl-12 pr-4 ${compact ? 'py-3.5' : 'py-5'} bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-foreground transition-all cursor-pointer flex flex-col justify-center`}
                        >
                            <span className={departureDate ? "text-foreground" : "text-foreground/20"}>
                                {departureDate ? format(new Date(departureDate), "MMM dd") : "Departure"}
                            </span>
                            <span className="text-[9px] text-foreground/30 tracking-tighter">Outbound</span>
                        </div>
                        <AnimatePresence>
                            {activeCalendar === 'departure' && (
                                <PremiumCalendar
                                    selectedDate={departureDate}
                                    onSelect={(date) => {
                                        updateSearchParam('departureDate', date);
                                        setActiveCalendar(null);
                                    }}
                                    onClose={() => setActiveCalendar(null)}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Arriving (Return) Date */}
                    <div className="flex-1 min-w-[180px] relative" ref={returnCalendarRef}>
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-cyan-light pointer-events-none">
                            <Calendar className="w-4 h-4 opacity-50" />
                        </div>
                        <div
                            aria-label="Return Date"
                            onClick={() => setActiveCalendar(activeCalendar === 'return' ? null : 'return')}
                            className={`w-full pl-12 pr-4 ${compact ? 'py-3.5' : 'py-5'} bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 border-none rounded-2xl text-xs font-black uppercase tracking-widest text-foreground transition-all cursor-pointer flex flex-col justify-center`}
                        >
                            <span className={returnDate ? "text-foreground" : "text-foreground/20"}>
                                {returnDate ? format(new Date(returnDate), "MMM dd") : "Arriving"}
                            </span>
                            <span className="text-[9px] text-foreground/30 tracking-tighter">Inbound (Optional)</span>
                        </div>
                        <AnimatePresence>
                            {activeCalendar === 'return' && (
                                <PremiumCalendar
                                    selectedDate={returnDate}
                                    onSelect={(date) => {
                                        updateSearchParam('returnDate', date);
                                        setActiveCalendar(null);
                                    }}
                                    onClose={() => setActiveCalendar(null)}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Animated Loading Bar - Attached to bottom of card */}
                <AnimatePresence>
                    {isSearchLoading && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 4 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-1 bg-background overflow-hidden"
                        >
                            <motion.div
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
            </div>

            {/* Error Display Area */}
            <div className="relative">
                <AnimatePresence mode="wait">
                    {searchError && (
                        <motion.div
                            key="search-error"
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="overflow-hidden"
                        >
                            <SearchErrorDisplay
                                type={searchError}
                                origin={origin}
                                destination={destination}
                                departureDate={departureDate}
                                onDismiss={clearError}
                                onRetry={() => {
                                    clearError();
                                    if (originCode && destinationCode && departureDate) {
                                        searchFlights({
                                            originLocationCode: originCode,
                                            destinationLocationCode: destinationCode,
                                            departureDate,
                                            returnDate: returnDate || undefined,
                                            adults: "1",
                                        });
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
