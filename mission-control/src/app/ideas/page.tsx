"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Lightbulb,
  Search,
  Plus,
  MoreHorizontal,
  Archive,
  Zap,
  ArrowRight,
  Sparkles,
  Tag
} from "lucide-react";

export default function IdeasLab() {
  const ideas = [
    { title: "AI-Driven PCOS Nutrition Assistant", category: "App Build", status: "Active", date: "2h ago", description: "A companion app that tracks high-protein intake and provides AI recipes." },
    { title: "The $1M Mission Live Stream", category: "Content", status: "Active", date: "1d ago", description: "Weekly live show tracking real progress toward the revenue goal." },
    { title: "Closed-Loop Referral System", category: "Infrastructure", status: "Active", date: "3d ago", description: "Automated GHL workflow to track and reward client referrals." },
    { title: "HeyGen Video Clone Strategy", category: "Social", status: "Archived", date: "1w ago", description: "Scrapped original plan. Archiving for later retrieval if budget allows." },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Ideas Lab</h1>
            <p className="text-meraki-white/60">Creative capture and strategic ideation. No thought is ever discarded.</p>
          </div>
          <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Capture Idea
          </button>
        </header>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-meraki-white/40 group-focus-within:text-meraki-gold transition-colors" />
            <input
              type="text"
              placeholder="Search thoughts & concepts..."
              className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-meraki-gold/50 transition-all w-full"
            />
          </div>
          <div className="flex gap-2">
            <button className="glass px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-meraki-gold border-meraki-gold/20">All Ideas</button>
            <button className="glass px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-meraki-white/40 border-white/5">Archived</button>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, i) => (
            <div key={i} className={`glass bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-meraki-violet/30 transition-all group flex flex-col justify-between ${idea.status === 'Archived' ? 'opacity-50' : ''}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${idea.status === 'Archived' ? 'border-white/10 text-meraki-white/40' : 'border-meraki-gold/30 text-meraki-gold'
                    }`}>
                    {idea.category}
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-meraki-white/10" />
                </div>
                <h3 className="font-bold text-lg mb-3 tracking-tight group-hover:text-meraki-gold transition-colors">{idea.title}</h3>
                <p className="text-sm text-meraki-white/50 leading-relaxed mb-6">
                  {idea.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-[10px] text-meraki-white/30 font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {idea.date}
                </div>
                <div className="flex gap-2">
                  {idea.status === 'Active' ? (
                    <>
                      <button className="p-2 rounded-lg bg-white/5 text-meraki-white/40 hover:text-red-400 hover:bg-white/10 transition-all" title="Archive">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-meraki-violet/10 text-meraki-violet hover:bg-meraki-violet hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-[10px] font-bold text-meraki-white/20 uppercase">Archived with note</div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Sirsha Prediction / Suggestion */}
          <div className="glass bg-gradient-to-br from-meraki-violet/20 to-transparent p-6 rounded-3xl border border-meraki-violet/10 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-meraki-gold/20 rounded-2xl flex items-center justify-center text-meraki-gold mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm mb-2">Sirsha Idea Synthesizer</h4>
            <p className="text-xs text-meraki-white/60 italic leading-relaxed mb-6 px-4">
              &quot;Michelle, I see a connection between the PCOS Nutrition App and the High-Ticket DFY service. What if we use the app as a unique authority bonus for the coaching program?&quot;
            </p>
            <button className="bg-meraki-violet px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-meraki-violet/20">
              Explore Connection
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
