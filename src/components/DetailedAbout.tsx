"use client";

import { motion } from "framer-motion";
import { Shield, Brain, Eye, LucideIcon } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: LucideIcon, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="p-6 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all group"
    >
        <div className="w-12 h-12 rounded-2xl bg-dark-cyan/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-dark-cyan-light" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-foreground/60 leading-relaxed font-medium">
            {description}
        </p>
    </motion.div>
);

export default function DetailedAbout() {
    return (
        <section className="relative w-full py-24 px-4 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dark-cyan/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1600px] mx-auto relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-dark-cyan/10 border border-dark-cyan/20 text-dark-cyan text-xs font-black uppercase tracking-[0.2em] mb-6"
                    >
                        Why Choose Us
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-black text-foreground tracking-tighter"
                    >
                        Built on <span className="text-dark-cyan-light">Trust</span> & <span className="text-sky-500">Innovation</span>
                    </motion.h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-24">
                    <FeatureCard
                        icon={Shield}
                        title="Uncompromising Integrity"
                        description="We source directly from global distribution systems (GDS) used by major airlines. No hidden fees, no bias—just pure, unfiltered data."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Brain}
                        title="Predictive AI Models"
                        description="Our Gemini-powered prediction engine analyzes millions of historical data points to forecast price changes with unprecedented accuracy."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={Eye}
                        title="Absolute Privacy"
                        description="We do not track your personal searches or store cookies. Your search intent remains private, ensuring you always get the fair market price."
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
}
