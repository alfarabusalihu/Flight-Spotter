"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getGlobalAirlinesAction } from "@/app/actions/localization";
import { getAirlinesAction } from "@/app/actions/flight";

export default function AirlinesMarquee() {
    const [airlines, setAirlines] = useState<{ name: string; code: string }[]>([]);
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadAirlines = async () => {
            const codes = await getGlobalAirlinesAction();
            const details = await getAirlinesAction(codes.join(','));
            if (details) {
                setAirlines(details.map((a: any) => ({
                    code: a.iataCode,
                    name: a.commonName || a.businessName || a.iataCode
                })));
            }
        };
        loadAirlines();
    }, []);

    if (airlines.length === 0) return null;

    // Triple the array for seamless loop
    const displayList = [...airlines, ...airlines, ...airlines];

    return (
        <section className="w-full pt-10 pb-24 bg-background border-t border-silver/10 overflow-hidden relative z-20">
            <div className="max-w-7xl mx-auto p-8 my-0 text-center">
                <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] block mb-2">Partner Network</span>
                <span className="text-xs font-black text-foreground/40 uppercase tracking-[0.3em]">Trusted by Industry Leaders</span>
            </div>

            <div className="flex relative overflow-hidden group">
                {/* Animated gradient background that merges with footer - Fixed white tint in dark mode */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-background via-foreground/[0.02] to-transparent dark:via-white/[0.01] dark:to-transparent"
                    animate={{
                        backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        backgroundSize: '100% 200%'
                    }}
                />

                {/* Subtle animated overlay - Removed hard from-white/30 */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/[0.05] dark:from-black/40 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <motion.div
                        className="flex gap-8 whitespace-nowrap p-4"
                        animate={{ x: [0, -2400] }}
                        transition={{
                            duration: 80,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {displayList.map((airline, i) => (
                            <motion.div
                                key={`${airline.code}-${i}`}
                                className="flex flex-col items-center gap-3 group/card cursor-default"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Square card with airline logo */}
                                <div className="w-[120px] h-[120px] rounded-2xl bg-white dark:bg-white/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-dark-cyan/10 transition-all duration-300 flex items-center justify-center p-6 group-hover/card:border-dark-cyan/30 overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={imgErrors[airline.code]
                                                ? `https://ui-avatars.com/api/?name=${airline.name.replace(/\s+/g, '+')}&background=06B6D4&color=fff&bold=true&size=70`
                                                : `https://www.gstatic.com/flights/airline_logos/70px/${airline.code}.png`
                                            }
                                            alt={airline.name}
                                            fill
                                            className="object-contain group-hover/card:scale-110 transition-transform duration-300"
                                            unoptimized
                                            onError={() => setImgErrors(prev => ({ ...prev, [airline.code]: true }))}
                                        />
                                    </div>
                                </div>

                                {/* Airline name below */}
                                <span className="text-xs font-black uppercase tracking-wider text-foreground/50 group-hover/card:text-dark-cyan-light transition-colors duration-300 max-w-[120px] text-center leading-tight">
                                    {airline.name}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Edge fades */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
            </div>
        </section>
    );
}
