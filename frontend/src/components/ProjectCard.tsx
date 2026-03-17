import { Project } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Eye, ShieldCheck, Twitter, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import ArcLogo from "@/img/arc_logo.jpg";

const CATEGORY_COLORS: Record<string, string> = {
  DEX: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Bridge: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  Tools: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  NFT: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  DeFi: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Infrastructure: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

interface Props {
  project: Project;
  variant?: "default" | "recommended";
}

export function ProjectCard({ project, variant = "default" }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [isVisited, setIsVisited] = useState(false);

  useEffect(() => {
    const checkVisit = () => {
      const today = new Date().toDateString();
      const visitData = localStorage.getItem(`visit_${project.id}`);
      if (visitData === today) {
        setIsVisited(true);
      } else {
        setIsVisited(false);
      }
    };
    checkVisit();
  }, [project.id]);

  const handleVisit = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`visit_${project.id}`, today);
    setIsVisited(true);
  };

  const catClass = CATEGORY_COLORS[project.category] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20";
  const projectUrl = project.websiteUrl || project.url;

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        style={{ willChange: "transform" }}
        className="glass-card p-6 flex flex-col gap-6 group h-full relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all">
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
            ) : (
              <img src={ArcLogo.src} alt="Arc" className="w-full h-full object-cover opacity-80" />
            )}
          </div>
          
          {/* Consolidated Tag: Category + Status Dot */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-black/40 backdrop-blur-md uppercase tracking-wider ${catClass}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isVisited ? 'bg-blue-400' : 'bg-red-500'} shadow-[0_0_8px_rgba(255,255,255,0.1)]`} />
            <span className="text-[10px] font-bold">{project.category}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
              {project.name}
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:text-[#05070a] hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20"
              title="View Project Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVisit}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-emerald-500 hover:text-[#05070a] transition-all duration-300"
        >
          <span>{variant === "recommended" ? "Try dApp" : "Explore Project"}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>

      {/* Modal Detail Project */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-8 md:py-12 overflow-y-auto custom-scrollbar">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-[#05070a]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card border-white/10 shadow-2xl overflow-hidden bg-[#0a0f1a] flex flex-col my-8 md:my-16"
            >
              {/* Header Section */}
              <div className="p-6 md:p-8 border-b border-white/5 flex items-start justify-between bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={ArcLogo.src} alt="Arc Logo" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-white leading-tight">{project.name}</h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                      <div className={`w-1.5 h-1.5 rounded-full ${isVisited ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {isVisited ? 'Visited Today' : 'Awaiting Visit'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 space-y-8">
                <div className="p-1 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 inline-block text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                  {project.category}
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Project Mission</h4>
                  <p className="text-slate-300 leading-relaxed font-medium text-sm">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest">ARC FORUM</h4>
                    <a
                      href={project.forumUrl || "https://community.arc.network/t/verified-builder-program/1234"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline break-all block truncate font-bold"
                    >
                      {project.forumUrl ? "Discussion Link ↗" : "Community Thread ↗"}
                    </a>
                  </div>
                  <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest">X BUILDER</h4>
                    <a
                      href={project.twitterUrl ? (project.twitterUrl.startsWith("http") ? project.twitterUrl : `https://x.com/${project.twitterUrl.replace("@", "")}`) : "https://x.com/arc_network"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-400 hover:underline block truncate font-bold"
                    >
                      {project.twitterUrl ? `@${project.twitterUrl.replace("https://x.com/", "").replace("@", "").split("/").pop()}` : "@arc_builder"}
                    </a>
                  </div>
                </div>

                {/* Security Advisory Warning Section */}
                <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10 flex gap-4 items-start">
                  <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Security Advisory (DYOR)</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Arc Explorer is a community protocol bridge. Builder innovation is experimental. <span className="text-amber-500/90 font-bold">Always DYOR</span> to protect your assets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Button */}
              <div className="p-6 md:p-8 bg-[#0a0f1a] border-t border-white/5 shrink-0 z-10">
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleVisit}
                  className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-base shadow-[0_0_20px_rgba(16,185,129,0.15)] group"
                >
                  Launch Application
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


export function ProjectCardSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col gap-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-white/5" />
        <div className="w-16 h-6 rounded-xl bg-white/5" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-5 w-32 rounded bg-white/5" />
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-white/5" />
      </div>
      <div className="h-10 rounded-2xl bg-white/5" />
    </div>
  );
}
