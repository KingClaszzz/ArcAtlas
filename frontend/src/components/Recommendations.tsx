import { useWallet } from "@/hooks/useWallet";
import { useRecommendations } from "@/hooks/useProjects";
import { ProjectCard, ProjectCardSkeleton } from "./ProjectCard";
import { Sparkles } from "lucide-react";

export function Recommendations() {
  const { isConnected } = useWallet();
  const { data, isLoading } = useRecommendations(isConnected);

  if (!isConnected) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 py-8">
      <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-transparent border border-emerald-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-colors" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Curated <span className="text-emerald-400">Picks</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Customized for your active wallet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : data?.map((p) => <ProjectCard key={p.id} project={p} variant="recommended" />)}
        </div>
      </div>
    </section>
  );
}
