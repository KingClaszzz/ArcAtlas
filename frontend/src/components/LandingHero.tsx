"use client";

import { motion } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Rocket, Shield, Zap, Globe } from "lucide-react";

export function LandingHero() {
    const { open } = useWeb3Modal();

    return (
        <div className="relative min-h-[80dvh] flex flex-col items-center justify-center overflow-hidden px-5 pt-32 pb-20">
            {/* Animated Background Blobs - Reduced blur for performance */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse will-change-[opacity,transform]" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-700 will-change-[opacity,transform]" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className="relative z-10 text-center max-w-4xl"
            >

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8">
                    Explore the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                        Arc Universe
                    </span>
                </h1>

                <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    Discover, vote, and track projects featured in the Arc Atlas.
                    Connect your wallet to participate.
                </p>

                <div className="flex flex-col sm:row items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => open()}
                        className="btn-primary flex items-center gap-2 text-lg px-10 py-4"
                    >
                        Get Started
                        <Rocket className="w-5 h-5" />
                    </motion.button>

                    <p className="text-zinc-600 text-xs font-medium mt-4">
                        No registration required. Just connect your wallet.
                    </p>
                </div>
            </motion.div>

            {/* Floating Icons Background Piece */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 left-1/4 text-emerald-400"
                ><Globe className="w-12 h-12" /></motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/3 right-1/4 text-emerald-500"
                ><Shield className="w-10 h-10" /></motion.div>
            </div>
        </div>
    );
}
