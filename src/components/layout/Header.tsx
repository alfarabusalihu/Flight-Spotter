"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Auth from "./Auth";
import { motion, AnimatePresence } from "framer-motion";
import { useFlightStore } from "@/lib/store";
import { Plane, Menu, X } from "lucide-react";

interface HeaderProps {
    onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
    const { resetSearch } = useFlightStore();
    const pathname = usePathname();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleHomeClick = () => {
        resetSearch();
        setIsMenuOpen(false);
        if (onLogoClick) {
            onLogoClick();
        }
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-[100] w-full bg-background/80 backdrop-blur-2xl border-b border-silver/10 shadow-sm transition-colors"
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <button
                    onClick={handleHomeClick}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-dark-cyan to-dark-cyan-light rounded-2xl flex items-center justify-center shadow-lg shadow-dark-cyan/20 group-hover:scale-110 transition-transform overflow-hidden"
                    >
                        <Plane className="w-5 h-5 text-white rotate-45" />
                    </motion.div>
                    <motion.span
                        className="text-lg md:text-xl font-display font-black text-foreground tracking-tighter group-hover:text-dark-cyan-light transition-colors"
                    >
                        Flight Spotter
                    </motion.span>
                </button>

                <nav className="hidden md:flex items-center gap-8">
                    <button
                        onClick={handleHomeClick}
                        className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive('/')
                            ? 'text-dark-cyan-light'
                            : 'text-foreground/70 hover:text-dark-cyan-light'
                            }`}
                    >
                        Home
                    </button>
                    <Link href="/flights">
                        <span
                            className={`text-sm font-black uppercase tracking-widest transition-colors inline-block ${isActive('/flights')
                                ? 'text-dark-cyan-light'
                                : 'text-foreground/70 hover:text-dark-cyan-light'
                                }`}
                        >
                            Search
                        </span>
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Auth />
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-foreground hover:text-dark-cyan-light transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-silver/10 bg-background overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            <button
                                onClick={handleHomeClick}
                                className={`text-base font-black uppercase tracking-widest text-left ${isActive('/') ? 'text-dark-cyan-light' : 'text-foreground'}`}
                            >
                                Home
                            </button>
                            <Link href="/flights" onClick={() => setIsMenuOpen(false)}>
                                <span className={`text-base font-black uppercase tracking-widest ${isActive('/flights') ? 'text-dark-cyan-light' : 'text-foreground'}`}>
                                    Search Flights
                                </span>
                            </Link>

                            {/* Mobile Actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-silver/10">
                                <span className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Account & Theme</span>
                                <div className="flex items-center gap-4">
                                    <ThemeToggle />
                                    <Auth />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
