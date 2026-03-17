import { useWallet } from "@/hooks/useWallet";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { motion } from "framer-motion";
import { Wallet, ExternalLink, Menu, X, Coins } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { isConnected, shortAddress, disconnect, isWrongNetwork, isLoggedIn } = useWallet();
  const { open } = useWeb3Modal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-card px-6 py-4 flex items-center justify-between border-white/10 !rounded-2xl">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#05070a] group-hover:rotate-6 transition-transform">
              <img src="/arc_logo.jpg" alt="Arc Logo" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Arc<span className="text-emerald-400">Showcase</span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {["Home", "Governance", "Profile"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Badge */}
          {isWrongNetwork && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Switch Network
            </div>
          )}

          {/* Faucet */}
          <a
            href="https://faucet.circle.com/"
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            Faucet
          </a>

          {/* Wallet Section */}
          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {isConnected ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => open()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold font-mono">{shortAddress}</span>
              </button>
              <button
                onClick={() => disconnect()}
                className="p-2 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                title="Disconnect"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="px-5 py-2.5 bg-emerald-500 text-[#05070a] font-bold rounded-xl hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              Connect
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-20 left-0 right-0 glass-card p-6 border-white/10 mx-auto w-full flex flex-col gap-4 text-center"
        >
          {["Home", "Governance", "Profile"].map((item) => (
            <a
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="text-lg font-bold text-white py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a href="https://faucet.testnet.arc.network" target="_blank" className="btn-secondary py-3">
            Arc Faucet ↗
          </a>
        </motion.div>
      )}
    </nav>
  );
}
