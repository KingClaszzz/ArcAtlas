"use client";

import { useWallet } from "@/hooks/useWallet";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Plus, ArrowLeft, Vote, Info, ChevronUp, ChevronDown, Rocket, Lock, ExternalLink } from "lucide-react";
import ArcLogo from "@/img/arc_logo.jpg";

export default function GovernancePage() {
    const { address, isLoggedIn, isConnected } = useWallet();
    const mounted = useIsMounted();
    const { open } = useWeb3Modal();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [votingId, setVotingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // States for new project form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [forumUrl, setForumUrl] = useState("");
    const [twitterUrl, setTwitterUrl] = useState("");

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000") + "/api";

    useEffect(() => {
        if (isConnected) {
            fetchProjects();
        }
    }, [isConnected]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/projects?status=PENDING`);
            if (res.data.success) {
                setProjects(res.data.data);
            }
        } catch (e) {
            console.error("Failed to fetch projects", e);
        } finally {
            setLoading(false);
        }
    };

    const submitProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Please login first to submit a project!");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("websiteUrl", websiteUrl);
            formData.append("forumUrl", forumUrl);
            formData.append("twitterUrl", twitterUrl);
            if (imageFile) {
                formData.append("image", imageFile);
            } else if (imageUrl) {
                formData.append("imageUrl", imageUrl);
            } else {
                // If no image is provided, use the official Arc Logo as default
                formData.append("imageUrl", "/arc_logo.jpg");
            }

            await axios.post(`${API_URL}/projects`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-wallet-address': address
                }
            });

            setName("");
            setDescription("");
            setWebsiteUrl("");
            setImageFile(null);
            setPreviewUrl(null);
            setForumUrl("");
            setTwitterUrl("");
            setShowForm(false);
            fetchProjects();
        } catch (e) {
            alert("Failed to submit project. Make sure you are logged in.");
        }
    };

    const handleVote = async (projectId: string, isUpvote: boolean) => {
        if (!isLoggedIn) {
            alert("Please login to vote!");
            return;
        }
        try {
            setVotingId(projectId);
            await axios.post(`${API_URL}/projects/${projectId}/vote`, { isUpvote });
            await fetchProjects();
        } catch (e: any) {
            alert(e.response?.data?.message || "Voting failed. You can only vote once per project.");
        } finally {
            setVotingId(null);
        }
    };

    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-5 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-md glass-card p-6 md:p-8 border-white/10 shadow-2xl overflow-hidden bg-[#0a0f1a]"
                >
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-8">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4">Gated Participation</h1>
                    <p className="text-slate-400 mb-10 leading-relaxed font-medium">
                        To participate in Arc Governance, you must first connect your wallet. This ensures all votes are verified and decentralized.
                    </p>
                    <button onClick={() => open()} className="btn-primary w-full">
                        Connect Wallet to Access
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-10 pb-24 px-5 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Back Link */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Ecosystem
                </a>

                <div id="submit" className="flex flex-col md:row items-start md:items-center justify-between pt-10 gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">Governance</h1>
                        <p className="text-slate-400 font-medium">Shaping the future of the Arc ecosystem through community voting.</p>
                    </div>
                    <button
                        onClick={() => isLoggedIn ? setShowForm(!showForm) : open()}
                        className="btn-primary flex items-center gap-2 whitespace-nowrap"
                    >
                        {showForm ? "Cancel Proposal" : "Submit New Project"}
                        {showForm ? null : <Plus className="w-5 h-5" />}
                    </button>
                </div>

                {/* Governance Rules Note */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/[0.02]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <ChevronUp className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Approval Path</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Projects reaching a <span className="text-emerald-400 font-bold">+10 net score</span> are automatically verified and whitelisted in the Ecosystem Explorer.
                        </p>
                    </div>
                    <div className="glass-card p-6 border-red-500/20 bg-red-500/[0.02]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Rejection Path</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Proposals falling to a <span className="text-red-400 font-bold">-10 net score</span> will be permanently removed from the governance queue.
                        </p>
                    </div>
                    <div className="glass-card p-6 border-blue-500/20 bg-blue-500/[0.02]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Info className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Community Power</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            One wallet, one vote per project. Governance ensures only the most trusted protocols join the Arc ecosystem.
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={submitProject}
                            className="mb-16 p-8 glass-card border-emerald-500/30 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Project Name</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all" placeholder="e.g. ArcSwap" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Website URL</label>
                                    <input required value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all" placeholder="https://..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Arc Forum Link (Mandatory Verification)</label>
                                    <input required value={forumUrl} onChange={e => setForumUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all" placeholder="https://community.arc.network/t/..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">X Builder Username / Profile</label>
                                    <input required value={twitterUrl} onChange={e => setTwitterUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all" placeholder="e.g. @username or x.com/username" />
                                </div>
                                <div className="col-span-full space-y-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Project Logo Selection</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                        <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus className="w-8 h-8 text-slate-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2 text-center sm:text-left">
                                            <p className="text-sm text-slate-400 font-medium">Upload a square logo for your project (JPG, PNG, WEBP)</p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all">
                                                    Choose From Device
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                </label>
                                                <span className="text-xs text-slate-600 font-bold">OR</span>
                                                <input
                                                    value={imageUrl}
                                                    onChange={e => {
                                                        setImageUrl(e.target.value);
                                                        setPreviewUrl(e.target.value);
                                                    }}
                                                    className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-medium focus:border-emerald-500/50 outline-none"
                                                    placeholder="Paste Image URL"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Mission</label>
                                    <span className={`text-[10px] font-bold ${description.length >= 300 ? 'text-red-400' : 'text-slate-600'}`}>
                                        {description.length} / 300
                                    </span>
                                </div>
                                <textarea
                                    required
                                    maxLength={300}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium h-32 focus:border-emerald-500/50 focus:bg-emerald-500/[0.02] outline-none transition-all resize-none"
                                    placeholder="Tell the community why this project belongs on Arc..."
                                />
                            </div>
                            <button type="submit" className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3">
                                <Rocket className="w-6 h-6" />
                                Launch Proposal
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-40 w-full glass-card animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {projects.length === 0 ? (
                            <div className="glass-card p-20 text-center border-dashed border-white/5">
                                <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No pending proposals at the moment.</p>
                            </div>
                        ) : projects.map((p: any) => (
                            <motion.div
                                key={p.id}
                                layout
                                className="glass-card p-10 flex flex-col md:flex-row items-center justify-between group gap-8"
                            >
                                <div className="flex-1 flex flex-col md:flex-row items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={ArcLogo.src} alt="Arc" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{p.name}</h3>
                                            <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wider">Under Review</span>
                                        </div>
                                        <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">{p.description}</p>
                                        <div className="pt-2">
                                            <a href={p.websiteUrl} target="_blank" className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 hover:underline">
                                                Project Whitepaper ↗
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 px-6 py-4 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <div className="flex flex-col items-center gap-3">
                                        <button
                                            disabled={!!votingId}
                                            onClick={() => handleVote(p.id, true)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${votingId === p.id ? 'opacity-50' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-[#05070a] shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/20'}`}
                                        >
                                            {votingId === p.id ? (
                                                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full" />
                                            ) : <ChevronUp className="w-6 h-6" />}
                                        </button>

                                        <div className="text-center">
                                            <p className={`text-xl font-black ${p.netScore > 0 ? 'text-emerald-400' : p.netScore < 0 ? 'text-red-400' : 'text-white'}`}>
                                                {p.netScore > 0 ? `+${p.netScore}` : p.netScore}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Net Votes</p>
                                        </div>

                                        <button
                                            disabled={!!votingId}
                                            onClick={() => handleVote(p.id, false)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${votingId === p.id ? 'opacity-50' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-[#05070a] shadow-lg shadow-red-500/5 hover:shadow-red-500/20'}`}
                                        >
                                            {votingId === p.id ? (
                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
                                            ) : <ChevronDown className="w-6 h-6" />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
