"use client";

import { motion } from "framer-motion";
import { Plane, ArrowRight, Tag } from "lucide-react";
import { useFlightStore } from "@/lib/store";
import { format } from "date-fns";

export default function FlightDeals() {
    const {
        discoveryDeals,
        isDiscoveryLoading,
        updateSearchParam,
        formatPrice
    } = useFlightStore();

    if (isDiscoveryLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 rounded-[2rem] bg-foreground/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (!discoveryDeals || discoveryDeals.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-dark-cyan-light" />
                        <span className="text-[10px] font-black text-dark-cyan-light uppercase tracking-[0.3em]">Exclusive Discovery</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-foreground tracking-tighter">
                        Upcoming Flight Deals
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {discoveryDeals.map((deal, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="group bg-background dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl transition-all"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-xl bg-dark-cyan/10 flex items-center justify-center text-dark-cyan-light">
                                    <Plane className="w-5 h-5 rotate-45" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">Starting From</p>
                                    <p className="text-2xl font-display font-black text-dark-cyan-light">
                                        {formatPrice(deal.price?.total || deal.price?.amount || 0)}
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-xl font-display font-black text-foreground mb-1">
                                {deal.destination}
                            </h4>
                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mb-4">
                                Round Trip • Economy
                            </p>

                            <div className="flex items-center gap-2 text-foreground/60 text-[10px] font-black uppercase tracking-tighter">
                                <span>{deal.departureDate ? format(new Date(deal.departureDate), "MMM dd") : "TBD"}</span>
                                <ArrowRight className="w-3 h-3" />
                                <span>{deal.returnDate ? format(new Date(deal.returnDate), "MMM dd") : "TBD"}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                updateSearchParam('destination', deal.destination);
                                updateSearchParam('destinationCode', deal.destination);
                                if (deal.departureDate) updateSearchParam('departureDate', deal.departureDate);
                                if (deal.returnDate) updateSearchParam('returnDate', deal.returnDate);

                                // Scroll to search
                                document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full mt-6 py-3 rounded-xl bg-foreground/5 hover:bg-dark-cyan-light hover:text-white text-foreground transition-all text-xs font-black uppercase tracking-widest"
                        >
                            View Details
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
