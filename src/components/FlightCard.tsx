"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlaneTakeoff, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFlightStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

// Comprehensive IATA Map for common cities
const IATA_MAP: Record<string, string> = {
    'PAR': 'Paris', 'LON': 'London', 'MAD': 'Madrid', 'BER': 'Berlin',
    'FRA': 'Frankfurt', 'AMS': 'Amsterdam', 'CDG': 'Paris-CDG',
    'LHR': 'London-Heathrow', 'JFK': 'New York', 'DXB': 'Dubai',
    'HND': 'Tokyo', 'BCN': 'Barcelona', 'FCO': 'Rome', 'IST': 'Istanbul',
    'MUC': 'Munich', 'DUB': 'Dublin', 'VIE': 'Vienna', 'ZRH': 'Zurich'
};

const getCityName = (code: string) => IATA_MAP[code] || code;

interface FlightCardProps {
    flight: any;
    index: number;
    isInspiration?: boolean;
}

export default function FlightCard({ flight, index, isInspiration }: FlightCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { topAirlines, formatPrice } = useFlightStore();

    const price = flight.price?.total || flight.price?.amount || flight.price;
    const airlineCode = flight.validatingAirlineCodes?.[0] || flight.airline || "Discovery";
    const airlineName = topAirlines.find(a => a.code === airlineCode)?.name || airlineCode;

    // Derived Flight Data
    const isSearchRes = !!flight.itineraries;
    const duration = isSearchRes
        ? flight.itineraries[0]?.duration?.replace("PT", "").toLowerCase()
        : "Varies";
    const stopsCount = isSearchRes
        ? flight.itineraries[0]?.segments?.length - 1
        : 0;
    const stopsLabel = isInspiration ? "Round trip" : stopsCount === 0 ? "Non-stop" : `${stopsCount} stop${stopsCount > 1 ? "s" : ""}`;

    const depTime = isSearchRes
        ? flight.itineraries[0]?.segments[0]?.departure?.at?.split("T")[1]?.slice(0, 5)
        : "Flexible";
    const arrTime = isSearchRes
        ? flight.itineraries[0]?.segments?.slice(-1)[0]?.arrival?.at?.split("T")[1]?.slice(0, 5)
        : "Flexible";

    const destinationName = isInspiration
        ? getCityName(flight.destination)
        : airlineName;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group glass-card hover:shadow-xl transition-all overflow-hidden"
        >
            {/* Main Card Content */}
            <div
                className="p-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Airline Branding */}
                <div className="flex flex-col items-center gap-2 shrink-0 md:min-w-[84px] w-full md:w-auto">
                    <div className="w-14 h-14 bg-white/50 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-silver/10">
                        {airlineCode !== "Discovery" ? (
                            <div className="relative w-10 h-10">
                                <Image
                                    src={`https://www.gstatic.com/flights/airline_logos/70px/${airlineCode}.png`}
                                    alt={airlineName}
                                    width={40}
                                    height={40}
                                    className="object-contain brightness-110 contrast-125"
                                    unoptimized // External branding logos don't always need optimization
                                />
                            </div>
                        ) : (
                            <span className="text-2xl">🌍</span>
                        )}
                    </div>
                </div>

                {/* Time & Duration */}
                <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-dark-cyan/10 text-[10px] font-black text-dark-cyan uppercase tracking-widest">{airlineName}</span>
                        </div>
                        <span className="text-xl font-black text-foreground font-sans tracking-tighter">
                            {isSearchRes ? `${depTime} – ${arrTime}` : `To ${destinationName}`}
                        </span>
                        <div className="flex items-center gap-3 mt-1 underline-offset-4 decoration-dark-cyan-light/30">
                            <span className="md:hidden text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                • {stopsLabel}
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-dark-cyan/40 uppercase tracking-[0.2em]">{duration}</span>
                        <div className="w-24 h-[3px] bg-silver/10 relative rounded-full overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-dark-cyan shadow-[0_0_10px_var(--color-dark-cyan-light)]" />
                        </div>
                        <div className="flex items-center gap-1 mt-1 font-black text-[9px] uppercase tracking-widest">
                            {stopsCount === 0 ? (
                                <span className="text-emerald-500 flex items-center gap-1">
                                    <PlaneTakeoff className="w-3 h-3" /> Non-stop
                                </span>
                            ) : (
                                <span className="text-amber-500">
                                    {stopsCount} Stop{stopsCount > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        {isSearchRes && (
                            <div className="flex flex-col items-end gap-0.5">
                                {stopsCount > 0 && flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode && (
                                    <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-tight">
                                        {stopsCount === 1 ? `Layover in ${getCityName(flight.itineraries[0].segments[0].arrival.iataCode)}` : "Multiple stops"}
                                    </span>
                                )}
                                {flight.itineraries?.[0]?.segments?.[0]?.aircraft?.code && (
                                    <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-tight">
                                        Jet: {flight.itineraries[0].segments[0].aircraft.code}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between w-full md:w-auto gap-6 shrink-0">
                    <div className="text-right">
                        <span className="text-2xl font-display font-bold text-foreground font-sans">
                            {formatPrice(price)}
                        </span>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isExpanded
                        ? 'bg-dark-cyan text-white rotate-180'
                        : 'bg-silver/10 group-hover:bg-dark-cyan-light group-hover:text-white'
                        }`}>
                        <ChevronDown className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Expanded Detail View */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-dashed border-foreground/10 bg-foreground/[0.02]"
                    >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
                            {/* Left: Itinerary Details */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-dark-cyan uppercase tracking-widest flex items-center gap-2">
                                    <PlaneTakeoff className="w-3 h-3" /> Itinerary
                                </h4>
                                <div className="space-y-4">
                                    {flight.itineraries?.[0]?.segments?.map((seg: any, i: number) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-foreground/10 space-y-1">
                                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-dark-cyan ring-4 ring-background" />

                                            <div className="flex justify-between items-start">
                                                <span className="font-black text-sm text-foreground">
                                                    {getCityName(seg.departure?.iataCode)}
                                                    <span className="mx-2 text-foreground/30">→</span>
                                                    {getCityName(seg.arrival?.iataCode)}
                                                </span>
                                                <span className="font-bold text-foreground/60">
                                                    {seg.duration?.replace('PT', '').toLowerCase()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-foreground/50 font-medium">
                                                <span>{seg.carrierCode} {seg.number}</span>
                                                <span>{seg.departure?.at?.split('T')[1]?.slice(0, 5)} - {seg.arrival?.at?.split('T')[1]?.slice(0, 5)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Flight Features & Price */}
                            <div className="flex flex-col gap-6">
                                <h4 className="font-bold text-dark-cyan uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-3 h-3" /> Details & Fare
                                </h4>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-background/50 border border-foreground/5 rounded-xl p-3 flex flex-col justify-center items-center text-center gap-1 shadow-sm">
                                        <span className="text-xl">🧳</span>
                                        <span className="font-bold text-foreground/70 uppercase tracking-tight text-[10px]">
                                            {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity || '0'} Bags
                                        </span>
                                    </div>
                                    <div className="bg-background/50 border border-foreground/5 rounded-xl p-3 flex flex-col justify-center items-center text-center gap-1 shadow-sm">
                                        <span className="text-xl">💺</span>
                                        <span className="font-bold text-foreground/70 uppercase tracking-tight text-[10px]">
                                            {flight.numberOfBookableSeats || 0} Seats
                                        </span>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/5 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground/50 font-bold">Base Fare</span>
                                        <span className="font-black">{formatPrice(flight.price?.base || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground/50 font-bold">Taxes & Fees</span>
                                        <span className="font-black">{formatPrice(parseFloat(flight.price?.total || "0") - parseFloat(flight.price?.base || "0"))}</span>
                                    </div>
                                    <div className="h-px bg-foreground/10 my-1"></div>
                                    <div className="flex justify-between items-center text-base">
                                        <span className="font-black uppercase tracking-tighter text-dark-cyan">Total</span>
                                        <span className="font-black text-2xl text-foreground">{formatPrice(flight.price?.total || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
