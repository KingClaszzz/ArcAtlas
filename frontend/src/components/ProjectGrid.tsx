import { useProjects } from "@/hooks/useProjects";
import { ProjectCard, ProjectCardSkeleton } from "./ProjectCard";
import { LayoutGrid, Info, AlertTriangle, ArrowRight } from "lucide-react";

export function ProjectGrid() {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <section className="max-w-6xl mx-auto px-5 py-24">
      {/* Heading */}
      <div className="flex flex-col md:row items-center justify-between gap-6 mb-16">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            Arc <span className="text-emerald-400">Ecosystem</span>
          </h2>
          <p className="text-slate-500 font-medium">
            {projects ? `Discovering ${projects.length} innovative projects building the future.` : "Explore the next generation of decentralized applications."}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <LayoutGrid className="w-4 h-4" />
          Verified Directory
        </div>
      </div>

      {isError && (
        <div className="py-20 text-center glass-card border-red-500/20 bg-red-500/5">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Connection Failed</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Unable to sync with Arc Indexer. Please ensure the backend service is running locally.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projects && projects.length > 0
            ? projects.map((p) => <ProjectCard key={p.id} project={p} />)
            : !isError && (
              <div className="col-span-full py-32 text-center glass-card border-dashed border-white/10 bg-white/[0.01]">
                <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg mb-6 tracking-tight">Ecosystem directory is currently empty.</p>
                <a
                  href="/governance"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Start a DAO Proposal <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
      </div>
    </section>
  );
}
