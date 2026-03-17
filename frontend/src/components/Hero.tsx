import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Wallet } from "lucide-react";

export function Hero() {
  const { shortAddress, balance } = useWallet();

  return (
    <section className="relative pt-44 pb-16 px-5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold mb-8"
        >
          <ShieldCheck className="w-4 h-4" />
          Verified Ecosystem Dashboard
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight"
        >
          Welcome to the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Arc Showcase
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          {/* Wallet Summary Card */}
          <div className="glass-card p-6 flex items-center gap-5 border-emerald-500/10 min-w-[240px]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Wallet</p>
              <p className="text-white font-mono font-bold">{shortAddress}</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="glass-card p-6 flex items-center gap-5 border-emerald-500/10 min-w-[240px]">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Assets</p>
              <p className="text-emerald-400 font-bold text-xl">{balance || "0.00 ARC"}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
