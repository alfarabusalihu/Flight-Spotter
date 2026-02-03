"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Star, Sparkles, Navigation } from "lucide-react";
import { useFlightStore } from "@/lib/store";

export default function TouristPlaces() {
    const {
        destination,
        destinationCode,
        destinationPOIs,
        isPOILoading
    } = useFlightStore();

    // Only show if we have a destination selected or it's loading
    if (!destinationCode && !isPOILoading) return null;

    const renderSkeleton = (index: number) => (
        <div key={`skeleton-${index}`} className="group relative rounded-[2rem] overflow-hidden bg-foreground/5 dark:bg-white/5 border border-foreground/5 p-4 space-y-4">
            <div className="aspect-[16/10] bg-foreground/10 dark:bg-white/10 rounded-2xl animate-pulse" />
            <div className="space-y-3">
                <div className="h-2 w-20 bg-foreground/10 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-foreground/10 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-full bg-foreground/10 dark:bg-white/10 rounded animate-pulse" />
            </div>
        </div>
    );

    const renderCard = (poi: any, index: number) => {
        const searchTerm = encodeURIComponent(`${poi.name} ${destination?.split(' - ')[0] || ''}`);
        return (
            <motion.div
                key={poi.id || index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-foreground/[0.03] dark:bg-white/[0.03] border border-foreground/10 dark:border-white/10 rounded-[2rem] overflow-hidden p-3 hover:bg-foreground/[0.05] dark:hover:bg-white/[0.05] transition-all duration-500"
            >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4">
                    <Image
                        src={`https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80&sig=${poi.id || index}&q=${searchTerm}`}
                        alt={poi.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full flex items-center gap-1.5 border border-white/10">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-black text-white">{poi.rank || "4.8"}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-sm font-display font-black text-white line-clamp-1 drop-shadow-lg">
                            {poi.name}
                        </h4>
                    </div>
                </div>

                <div className="px-2 pb-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-dark-cyan-light/10 text-dark-cyan-light text-[9px] font-black uppercase tracking-widest rounded-md border border-dark-cyan-light/20">
                            {poi.category?.replace(/_/g, " ") || "Attraction"}
                        </span>
                    </div>

                    <p className="text-[11px] text-foreground/50 leading-relaxed font-medium line-clamp-2 italic">
                        "{poi.intro}"
                    </p>
                </div>
            </motion.div>
        );
    };

    return (
        <section className="relative w-full py-8">
            <div className="w-full max-w-7xl mx-auto px-4 space-y-8">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-foreground/5 pb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-dark-cyan-light" />
                            <span className="text-xs font-black text-dark-cyan uppercase tracking-widest">Local Insights</span>
                        </div>
                        <h3 className="text-2xl font-display font-black text-foreground tracking-tight">
                            Must-See in {destination?.split(" - ")[0] || "Destination"}
                        </h3>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-foreground/5 dark:bg-white/5 rounded-2xl border border-foreground/5">
                        <Navigation className="w-3.5 h-3.5 text-foreground/40" />
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-tighter">AI Curated Content</span>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {isPOILoading ? (
                            Array.from({ length: 4 }).map((_, i) => renderSkeleton(i))
                        ) : (
                            destinationPOIs?.slice(0, 8).map((poi: any, i: number) => renderCard(poi, i))
                        )}
                    </AnimatePresence>
                </div>

                {!isPOILoading && (!destinationPOIs || destinationPOIs.length === 0) && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-foreground/[0.02] dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-foreground/10">
                        <MapPin className="w-12 h-12 text-foreground/10" />
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-foreground/40">No insights found yet</h4>
                            <p className="text-xs text-foreground/20 font-medium">Try selecting a different major city or airport</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
