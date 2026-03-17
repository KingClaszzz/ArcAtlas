"use client";

import { useWallet } from "@/hooks/useWallet";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Wallet, History, Image as ImageIcon, ArrowLeft, Lock, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";

// Token color + label config — USDC & EURC only
const TOKEN_CONFIG: Record<string, { color: string; bgSent: string; bgReceived: string; label: string }> = {
    USDC: {
        color: "text-blue-400",
        bgSent: "bg-red-500/10 text-red-400",
        bgReceived: "bg-blue-500/10 text-blue-400",
        label: "USDC",
    },
    EURC: {
        color: "text-violet-400",
        bgSent: "bg-red-500/10 text-red-400",
        bgReceived: "bg-violet-500/10 text-violet-400",
        label: "EURC",
    },
};

function formatAmount(tx: any): string {
    const decimals = Number(tx.tokenDecimal ?? "18");
    const raw = BigInt(tx.value ?? "0");
    const divisor = BigInt(10 ** decimals);
    const whole = raw / divisor;
    const fraction = raw % divisor;
    const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, 4);
    return `${whole}.${fractionStr}`;
}

export default function ProfilePage() {
    const { address, balance, isConnected } = useWallet();
    const mounted = useIsMounted();
    const { open } = useWeb3Modal();
    const [history, setHistory] = useState<any[]>([]);
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
    const [eurcBalance, setEurcBalance] = useState<string | null>(null);

    useEffect(() => {
        if (mounted && isConnected && address) {
            fetchProfileData();
        }
    }, [mounted, isConnected, address]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const backendUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api/user";

            const [historyRes, nftRes, tokenRes] = await Promise.allSettled([
                axios.get(`${backendUrl}/${address}/history`),
                axios.get(`${backendUrl}/${address}/nfts`),
                axios.get(`${backendUrl}/${address}/tokens`),
            ]);

            if (historyRes.status === "fulfilled" && historyRes.value.data.success) {
                setHistory(historyRes.value.data.data);
            }
            if (nftRes.status === "fulfilled" && nftRes.value.data.success) {
                setNfts(nftRes.value.data.data);
            }
            if (tokenRes.status === "fulfilled" && tokenRes.value.data.success) {
                const tokens: any[] = tokenRes.value.data.data;
                tokens.forEach((t: any) => {
                    const sym = (t.symbol || "").toUpperCase();
                    const decimals = Number(t.decimals || 6);
                    const formatted = (Number(t.balance) / 10 ** decimals).toFixed(4);
                    if (sym === "USDC") setUsdcBalance(formatted);
                    if (sym === "EURC") setEurcBalance(formatted);
                });
            }
        } catch (e) {
            console.error("Failed to fetch profile data", e);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-5 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 max-w-lg text-center border-white/10"
                >
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4">Private Profile</h1>
                    <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                        Your profile contains sensitive asset and activity data. Connect your wallet to securely access your personal dashboard.
                    </p>
                    <button onClick={() => open()} className="btn-primary w-full">
                        Connect Wallet to Access
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-10 pb-24 px-5 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-10 space-y-4">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Ecosystem
                    </a>
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">Your Profile</h1>
                        <p className="text-sm text-slate-500">
                            Wallet dashboard connected to {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Panel */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="glass-card p-10 border-emerald-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                                <Wallet className="w-6 h-6 text-emerald-400" />
                                My Portfolio
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Active Address</p>
                                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-[11px] text-emerald-200 break-all leading-relaxed">
                                        {address}
                                    </div>
                                </div>
                                {/* ARC Balance */}
                                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">ARC Balance</p>
                                    <p className="text-4xl font-black text-white">{balance || "0.0000 ARC"}</p>
                                </div>
                                {/* Stablecoin Balances */}
                                <div className="flex gap-3">
                                    <div className="flex-1 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                        <p className="text-[9px] font-bold text-blue-500/60 uppercase tracking-wider mb-1">USDC Balance</p>
                                        <p className="text-xl font-black text-blue-400">{usdcBalance ?? "—"}</p>
                                        <p className="text-[9px] text-blue-500/40 font-medium mt-0.5">Circle USD Coin</p>
                                    </div>
                                    <div className="flex-1 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10">
                                        <p className="text-[9px] font-bold text-violet-500/60 uppercase tracking-wider mb-1">EURC Balance</p>
                                        <p className="text-xl font-black text-violet-400">{eurcBalance ?? "—"}</p>
                                        <p className="text-[9px] text-violet-500/40 font-medium mt-0.5">Circle Euro Coin</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-10">
                            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                <ImageIcon className="w-5 h-5 text-purple-400" />
                                NFT Assets
                            </h2>
                            {nfts.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {nfts.map((nft, i) => (
                                        <a
                                            key={i}
                                            href={`https://testnet.arcscan.app/token/${nft.contractAddress}`}
                                            target="_blank"
                                            className="aspect-square rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center p-4 text-center group hover:border-purple-500/30 hover:bg-purple-500/5 transition-all relative overflow-hidden"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <span className="text-2xl">🖼️</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">{nft.symbol}</p>
                                            <p className="text-xs font-bold text-white line-clamp-1">{nft.name}</p>
                                            <div className="absolute inset-x-0 bottom-0 py-1 bg-purple-500 text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase text-center">
                                                Explorer ↗
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl">
                                    <p className="text-slate-500 text-sm font-medium italic">No NFT assets found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Transaction History */}
                    <div className="lg:col-span-8">
                        <div className="glass-card p-10 h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <History className="w-6 h-6 text-blue-400" />
                                    Transaction History
                                </h2>
                                {history.length > 0 && (
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        {history.length} / 100 txs
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-20 w-full bg-white/[0.03] animate-pulse rounded-2xl" />
                                    ))}
                                </div>
                            ) : history.length > 0 ? (
                                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                                    {history.map((tx, i) => {
                                        const isSent = tx.from.toLowerCase() === address?.toLowerCase();
                                        const symbol = (tx.tokenSymbol || "ARC").toUpperCase();
                                        const cfg = TOKEN_CONFIG[symbol] ?? TOKEN_CONFIG["ARC"];
                                        const amount = formatAmount(tx);

                                        return (
                                            <motion.a
                                                key={i}
                                                href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                                                target="_blank"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.02 }}
                                                className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSent ? cfg.bgSent : cfg.bgReceived}`}>
                                                        {isSent ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="text-base font-bold text-white">
                                                                {isSent ? "Sent" : "Received"} {cfg.label}
                                                            </p>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.color} bg-white/[0.04] border border-white/5`}>
                                                                {symbol}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {new Date(Number(tx.timeStamp) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-black ${isSent ? 'text-white' : cfg.color}`}>
                                                        {isSent ? '-' : '+'}{amount}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-500/60 transition-colors flex items-center justify-end gap-1 uppercase">
                                                        Details <ExternalLink className="w-2.5 h-2.5" />
                                                    </p>
                                                </div>
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center text-slate-700 mb-4">
                                        <History className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-500 font-medium">No recent transactions found on ArcScan</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
