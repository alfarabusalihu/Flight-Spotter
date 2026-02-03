"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plane, ABOUT_STATS, MISSION_CONTENT } from "@/constants/landingData";

export default function AboutSection() {
    const { tag, title, description, insightTag, insightText, image } = MISSION_CONTENT;

    return (
        <section className="relative w-full py-20 overflow-hidden">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm z-0" />

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-[2px] w-8 bg-dark-cyan rounded-full" />
                                <span className="text-[10px] font-black text-dark-cyan uppercase tracking-[0.3em]">{tag}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tighter leading-tight">
                                {title.split(' Discovery.')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-dark-cyan to-dark-cyan-light">Discovery.</span>
                            </h2>
                        </div>

                        <p className="text-lg text-foreground/60 leading-relaxed font-medium max-w-xl">
                            {description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ABOUT_STATS.map((stat, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md">
                                    <stat.icon className={`w-8 h-8 ${stat.iconColor} mb-3`} />
                                    <h4 className="font-bold text-foreground mb-1">{stat.title}</h4>
                                    <p className="text-xs text-foreground/50 leading-relaxed">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[500px] w-full rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl group">
                        <div className="absolute inset-0 bg-dark-cyan/10 group-hover:bg-dark-cyan/0 transition-colors duration-700 z-10" />
                        <Image
                            src={image}
                            alt="Airplane wing view"
                            fill
                            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl"
                        >
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">{insightTag}</p>
                                    <p className="text-xl font-black text-white tracking-tight">{insightText}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Plane className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
