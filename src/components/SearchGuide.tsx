"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { LANDING_FEATURES, GUIDE_CONTENT } from "@/constants/landingData";

export default function SearchGuide() {
    const { placeholder, instruction } = GUIDE_CONTENT;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {LANDING_FEATURES.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                        className="group flex flex-col items-center text-center space-y-4 p-8 rounded-[2.5rem] hover:bg-foreground/5 transition-all duration-500 cursor-default"
                    >
                        <div className="w-20 h-20 rounded-[2.5rem] bg-foreground/5 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-dark-cyan/10 transition-all duration-500 shadow-xl shadow-transparent group-hover:shadow-dark-cyan/5">
                            <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                        </div>
                        <h4 className="text-xl font-display font-black text-foreground">{item.title}</h4>
                        <p className="text-sm text-foreground/40 leading-relaxed max-w-xs font-medium">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24 p-16 border-2 border-dashed border-foreground/5 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group/dash"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-dark-cyan/5 via-transparent to-amber-500/5 opacity-0 group-hover/dash:opacity-100 transition-opacity duration-1000" />

                <div className="w-20 h-20 rounded-full bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center relative z-10 group-hover/dash:rotate-12 transition-transform duration-500 border border-foreground/[0.05] dark:border-white/[0.05]">
                    <Search className="w-8 h-8 text-foreground/10 dark:text-white/10" />
                </div>
                <div className="space-y-3 relative z-10">
                    <h3 className="text-3xl font-display font-black text-foreground/30 dark:text-white/20 uppercase tracking-tighter">{placeholder}</h3>
                    <p className="text-[10px] text-foreground/20 dark:text-white/10 font-black uppercase tracking-[0.3em]">{instruction}</p>
                </div>
            </motion.div>
        </div>
    );
}
