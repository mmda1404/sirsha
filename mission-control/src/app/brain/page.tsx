"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  BrainCircuit,
  FileText,
  Database,
  Search,
  BookOpen,
  Users,
  TrendingUp,
  ShieldCheck,
  CloudDownload,
  Terminal
} from "lucide-react";

export default function SecondBrain() {
  const docs = [
    { name: "Strategic Goal Summary.pdf", type: "Core", status: "Loaded", date: "Mar 1" },
    { name: "ICP: Overwhelmed Visionary.docx", type: "ICP", status: "Indexed", date: "Feb 28" },
    { name: "Competitor Gap Analysis.pdf", type: "Research", status: "Pending", date: "Draft" },
    { name: "PCOS Productivity Framework.txt", type: "Authority", status: "Loaded", date: "Mar 4" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Second Brain</h1>
            <p className="text-meraki-white/60">Global strategic intelligence and knowledge base handoff hub.</p>
          </div>
          <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <CloudDownload className="w-4 h-4" />
            Upload Intelligence
          </button>
        </header>

        {/* Knowledge Status */}
        <section className="mb-12">
          <div className="glass rounded-[32px] p-8 border-l-4 border-meraki-violet bg-meraki-violet/5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-meraki-violet/20 rounded-2xl flex items-center justify-center text-meraki-violet">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Knowledge Base Status</h3>
                  <p className="text-xs text-meraki-white/40 font-medium uppercase tracking-widest">Memory Handoff: Phase 1</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-meraki-violet tracking-tighter">42%</p>
                <p className="text-[10px] text-meraki-white/30 font-bold uppercase tracking-widest">Saturated</p>
              </div>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
              <div className="bg-meraki-violet h-full w-[42%]" />
            </div>
            <p className="text-sm text-meraki-white/70 italic leading-relaxed max-w-2xl">
              &quot;Sirsha: I have successfully ingested your top-tier strategic frameworks. My tone and decision-making are now aligned with your $1M goal. I am currently awaiting the handoff of the Client Case Studies folder to sharpen my conversion logic.&quot;
            </p>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Document Library */}
          <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <FileText className="w-5 h-5 text-meraki-gold" />
                Strategic Intelligence Library
              </h3>
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-meraki-white/20 group-focus-within:text-meraki-gold transition-colors" />
                <input
                  type="text"
                  placeholder="Search knowledge..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] focus:outline-none focus:border-meraki-gold/50 transition-all w-48 font-bold uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-3">
              {docs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-meraki-gold/20 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-meraki-white/20 group-hover:text-meraki-gold transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs group-hover:text-meraki-gold transition-colors">{doc.name}</h4>
                      <p className="text-[8px] text-meraki-white/30 uppercase tracking-widest font-bold">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${doc.status === 'Loaded' ? 'border-emerald-400/20 text-emerald-400' :
                        doc.status === 'Indexed' ? 'border-meraki-gold/20 text-meraki-gold' :
                          'border-white/10 text-meraki-white/40'
                      }`}>
                      {doc.status}
                    </div>
                    <Terminal className="w-4 h-4 text-meraki-white/10 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Context Column */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-meraki-gold mb-6 flex items-center gap-2">
                <Users className="w-4 h-4" />
                ICP Intelligence
              </h3>
              <div className="bg-white/5 p-5 rounded-2xl space-y-3 border-l-2 border-meraki-gold">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-meraki-white/40 underline decoration-meraki-gold/40">The Overwhelmed Visionary</h5>
                <p className="text-[11px] text-meraki-white/80 leading-relaxed font-medium">Core Desire: Scalability without soul-loss. Core Pain: Manual bottlenecks in relationship management. Primary Objection: &quot;Will the AI sound like me?&quot;</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-meraki-violet mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Research Signals
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                  <span>Market Gap: AI+Women</span>
                  <span className="text-emerald-400">Expanding</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                  <span>Sentiment: Brand Auth</span>
                  <span className="text-emerald-400">Critical Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
