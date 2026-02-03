"use client";

import { FOOTER_LINKS, Plane } from "@/constants/landingData";
import { Mail, MapPin, Phone, Globe, Coins } from "lucide-react";
import { useFlightStore } from "@/lib/store";

export default function Footer() {
    return (
        <footer className="relative mt-0 border-t border-slate-200 dark:border-white/5 py-fluid bg-white/30 dark:bg-black/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-fluid grid grid-cols-1 md:grid-cols-12 gap-fluid">

                {/* Brand Section */}
                <div className="md:col-span-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-dark-cyan rounded-xl flex items-center justify-center shadow-lg shadow-dark-cyan/20">
                            <Plane className="w-5 h-5 text-white rotate-45" />
                        </div>
                        <span className="text-2xl font-display font-black tracking-tighter text-foreground">
                            Flight <span className="text-dark-cyan-light">Spotter</span>
                        </span>
                    </div>
                    <p className="text-foreground/40 text-sm leading-relaxed max-w-xs">
                        Elevating the art of discovery. We combine global data intelligence with a premium aesthetic to provide the ultimate flight spotting experience.
                    </p>
                </div>

                {/* Platform Links */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start">
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

                {/* Company Links */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6 uppercase">Legal</h5>
                    <ul className="space-y-4">
                        <li>
                            <a href="/privacy" className="text-sm font-bold text-foreground/60 hover:text-dark-cyan-light transition-colors">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="/terms" className="text-sm font-bold text-foreground/60 hover:text-dark-cyan-light transition-colors">Terms of Service</a>
                        </li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="md:col-span-2 flex flex-col items-center md:items-start" />

                {/* Contact Section */}
                <div className="md:col-span-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/30 mb-6 font-dynamic">Contact</h5>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-dark-cyan-light shrink-0" />
                            <a href="mailto:hello@flightspotter.com" className="text-xs font-bold text-foreground hover:underline">hello@flightspotter.com</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-dark-cyan-light shrink-0" />
                            <span className="text-xs font-bold text-foreground">+1 (888) SKY-LINE</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-fluid mt-20 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
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
