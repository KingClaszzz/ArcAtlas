import ArcLogo from "@/img/arc_logo.jpg";
import Link from "next/link";

export function Footer() {
  const badgeStyle = "px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-slate-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default select-none";
  
  return (
    <footer className="mt-32 border-t border-white/[0.05] bg-[#05070a] pt-24 pb-12 px-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-0.5 bg-white/5 shadow-2xl">
                  <img src={ArcLogo.src} alt="Arc Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight font-outfit leading-tight">Arc Showcase Hub</h2>
                  <p className="text-[11px] uppercase tracking-[0.3em] font-black text-emerald-500/50 mt-1">Community Ecosystem</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                Discover, share, and celebrate projects built by the Arc community. Built for builders who want to ship faster and scale the decentralized future.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
              <span className={badgeStyle}>Builders</span>
              <span className={badgeStyle}>Ecosystem</span>
              <span className={badgeStyle}>Web3</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            <div className="space-y-6 text-left">
              <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Explore</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Arc Showcase</Link></li>
                <li><Link href="/governance" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Governance</Link></li>
                <li><Link href="/governance" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Submit Build</Link></li>
              </ul>
            </div>

            <div className="space-y-6 text-left">
              <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Community</h4>
              <ul className="space-y-4">
                <li><a href="https://community.arc.network" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Arc Forum</a></li>
                <li><a href="https://x.com/arc_network" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">X Arc (Twitter)</a></li>
                <li><a href="https://discord.com/invite/buildonarc" target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Discord Community</a></li>
              </ul>
            </div>

            <div className="space-y-6 text-left">
              <h4 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors font-semibold text-sm">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-600 text-[11px] font-medium opacity-60">
            © 2026 Arc Showcase Hub · Built for the Arc Community
          </div>
          
          <div className="flex items-center gap-4 lg:pr-12 group cursor-default">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-500 text-[10px] font-mono tracking-tight group-hover:text-emerald-400 transition-colors">Build By Arlor09</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
