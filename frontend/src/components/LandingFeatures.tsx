"use client";

import { motion } from "framer-motion";
import { Shield, Rocket, Layout, Users } from "lucide-react";
const features = [
    {
        title: "Ecosystem Bridge",
        desc: "The ultimate gateway connecting Arc builders with a community eager to explore and support new decentralized innovations.",
        icon: Layout,
        color: "emerald"
    },
    {
        title: "Builder Launchpad",
        desc: "Empowering new builders to showcase their projects, gain visibility, and tap into the vibrant Arc network from day one.",
        icon: Rocket,
        color: "teal"
    },
    {
        title: "Community Driven",
        desc: "Harness the wisdom of the crowd. Vote on ecosystem additions and help curate high-quality projects for everyone.",
        icon: Users,
        color: "emerald"
    },
    {
        title: "On-Chain Insights",
        desc: "Verify project activity and track your multi-chain portfolio with transparent, real-time data directly from the source.",
        icon: Shield,
        color: "teal"
    }
];

export function LandingFeatures() {
    return (
        <section className="py-24 px-5 max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Why Arc Showcase?</h2>
                <p className="text-zinc-500 max-w-xl mx-auto">Providing a seamless interface for the most advanced blockchain ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 flex flex-col items-start gap-4 hover:border-emerald-500/30 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-[#05070a] transition-all duration-300">
                            <f.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{f.title}</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
