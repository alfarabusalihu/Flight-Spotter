"use client";

import { FOOTER_LINKS, Plane } from "@/constants/landingData";
import { Mail, MapPin, Phone, Globe, Coins, Instagram, Linkedin } from "lucide-react";
import { useFlightStore } from "@/lib/store";

export default function Footer() {
    return (
        <footer className="relative mt-0 border-t border-slate-200 dark:border-white/5 py-fluid bg-white/30 dark:bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-fluid grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-fluid">

                {/* Brand Section - Full width on mobile */}
                <div className="col-span-2 md:col-span-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-dark-cyan rounded-xl flex items-center justify-center shadow-lg shadow-dark-cyan/20">
                            <Plane className="w-5 h-5 text-white rotate-45" />
                        </div>
                        <span className="text-xl md:text-2xl font-display font-black tracking-tighter text-foreground">
                            Flight <span className="text-dark-cyan-light">Spotter</span>
                        </span>
                    </div>
                    <p className="text-foreground/40 text-sm leading-relaxed max-w-xs">
                        Elevating the art of discovery. We combine global data intelligence with a premium aesthetic to provide the ultimate flight spotting experience.
                    </p>
                </div>

                {/* Platform Links */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-start">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6 uppercase">Navigation</h5>
                    <ul className="space-y-4">
                        <li>
                            <a href="/" className="text-sm font-bold text-foreground/60 hover:text-dark-cyan-light transition-colors">Home</a>
                        </li>
                        <li>
                            <a href="/flights" className="text-sm font-bold text-foreground/60 hover:text-dark-cyan-light transition-colors">Search Flights</a>
                        </li>
                    </ul>
                </div>

                {/* Spacer (Hidden on mobile) */}
                <div className="hidden md:block md:col-span-4" />

                {/* Contact Section - Compact & Interactive - Right Aligned */}
                <div className="col-span-1 md:col-span-2 flex flex-col items-end">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6 font-dynamic text-right">Contact</h5>
                    <div className="flex items-center gap-4 justify-end">
                        <a href="mailto:flightspotter2000@gmail.com" className="group p-2 rounded-full hover:bg-dark-cyan/5 transition-colors" title="Email Us">
                            <Mail className="w-5 h-5 text-dark-cyan-light group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="group p-2 rounded-full hover:bg-dark-cyan/5 transition-colors" title="Call Us" onClick={(e) => { e.preventDefault(); alert(`Call us at: +1 (888) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`); }}>
                            <Phone className="w-5 h-5 text-dark-cyan-light group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group p-2 rounded-full hover:bg-dark-cyan/5 transition-colors" title="Instagram">
                            <Instagram className="w-5 h-5 text-dark-cyan-light group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group p-2 rounded-full hover:bg-dark-cyan/5 transition-colors" title="LinkedIn">
                            <Linkedin className="w-5 h-5 text-dark-cyan-light group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-fluid mt-10 pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
                        © 2026 Flight Spotter Aero Intelligence. All Rights Reserved.
                    </p>
                    {useFlightStore.getState().contextHub && (
                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-tighter text-dark-cyan-light/60 bg-dark-cyan/5 px-4 py-1.5 rounded-full border border-dark-cyan/10">
                            <div className="flex items-center gap-1.5">
                                <Globe className="w-3 h-3" />
                                <span>Global Data Hub: {useFlightStore.getState().contextHub}</span>
                            </div>
                            <div className="w-[1px] h-3 bg-dark-cyan/20" />
                            <div className="flex items-center gap-1.5">
                                <Coins className="w-3 h-3" />
                                <span>Currency: {useFlightStore.getState().currency}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-8">
                    <a href="/terms" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-dark-cyan-light transition-colors">Terms</a>
                    <a href="/privacy" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-dark-cyan-light transition-colors">Privacy</a>
                    <a href="#" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-dark-cyan-light transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
}
