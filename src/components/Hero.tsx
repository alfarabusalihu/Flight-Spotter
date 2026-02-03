"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { HERO_CONTENT } from "@/constants/landingData";

export default function Hero() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.05]);
    const router = useRouter();
    const { title, subtitle, description, buttonLabel } = HERO_CONTENT;

    const handleSearchClick = () => {
        router.push('/flights');
    };

    return (
        <motion.section
            id="hero"
            style={{ opacity }}
            className="relative h-screen w-full overflow-hidden bg-background p-0 m-0"
        >
            {/* Radiant Background Layer */}
            <motion.div
                style={{ scale }}
                className="absolute inset-0 z-0 bg-background"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-dark-cyan-light)_0%,transparent_70%)] opacity-20 dark:opacity-30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--color-dark-cyan)_0%,transparent_50%)] opacity-10" />
                <div className="absolute inset-0 backdrop-blur-[120px]" />
            </motion.div>

            {/* Branding Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center gap-8 md:gap-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-[1600px] flex flex-col items-center gap-6 md:gap-8"
                >
                    <div className="relative inline-block">
                        {/* Animated Plane SVG - Decoupled from centering */}
                        <motion.div
                            layoutId="nav-logo-icon"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
                            className="hidden xl:block absolute -left-48 top-1/2 -translate-y-1/2 w-40 h-40"
                        >
                            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
                                <path d="M98.5 160L100 190L101.5 160Z" fill="black" fillOpacity="0.2" className="blur-sm" />
                                <path d="M100 20C95 20 90 25 90 40V140C90 155 95 160 100 160C105 160 110 155 110 140V40C110 25 105 20 100 20Z" fill="currentColor" className="text-foreground" />
                                <path d="M100 60L20 100V120L100 90L180 120V100L100 60Z" fill="currentColor" className="text-foreground/90" />
                                <path d="M100 140L70 160V170L100 155L130 170V160L100 140Z" fill="currentColor" className="text-foreground/90" />
                                <path d="M96 35H104V40H96V35Z" fill="#38bdf8" />
                                <circle cx="20" cy="110" r="4" fill="#ef4444" className="opacity-0 dark:opacity-100 animate-[flicker_2s_infinite]" />
                                <circle cx="20" cy="110" r="8" fill="#ef4444" className="opacity-0 dark:opacity-30 animate-[flicker_2s_infinite_0.1s] blur-md" />
                                <circle cx="180" cy="110" r="4" fill="#10b981" className="opacity-0 dark:opacity-100 animate-[flicker_2.5s_infinite_0.5s]" />
                                <circle cx="180" cy="110" r="8" fill="#10b981" className="opacity-0 dark:opacity-30 animate-[flicker_2.5s_infinite_0.6s] blur-md" />
                                <circle cx="100" cy="170" r="3" fill="white" className="opacity-0 dark:opacity-100 animate-[pulse_1s_infinite]" />
                            </svg>
                        </motion.div>

                        <motion.h1
                            layoutId="nav-logo-text"
                            className="text-6xl md:text-[10rem] font-display font-black tracking-tighter text-foreground leading-[0.85] text-center"
                        >
                            {title}<br />
                            <span className="text-dark-cyan-light transition-colors duration-700">{subtitle}</span>
                        </motion.h1>
                    </div>

                    <p className="text-lg md:text-2xl text-foreground/60 font-medium tracking-wide max-w-2xl text-center">
                        {description}
                    </p>
                </motion.div>

                {/* Search Button */}
                <motion.button
                    layoutId="hero-search-button"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    onClick={handleSearchClick}
                    className="group relative px-12 py-5 bg-dark-cyan hover:bg-dark-cyan-light text-white font-bold rounded-2xl shadow-2xl shadow-dark-cyan/30 hover:shadow-dark-cyan-light/40 transition-all duration-300 hover:scale-105 flex items-center gap-3 text-lg"
                >
                    Search
                    <Plane className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </motion.button>
            </div>

            {/* Bottom SVG Curvature */}
            <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto text-background fill-current transition-colors duration-1000"
                    preserveAspectRatio="none"
                >
                    <path d="M0 120H1440V0.5C1440 0.5 1200 40 720 40C240 40 0 0.5 0 0.5V120Z" />
                </svg>
            </div>
        </motion.section>
    );
}
