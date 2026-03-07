"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Zap,
  Download,
  Users,
  ArrowRight,
  TrendingUp,
  Mail,
  FileText,
  BarChart2,
  Plus
} from "lucide-react";

export default function LeadMagnets() {
  const magnets = [
    { name: "The AI Cloning Cheat Sheet", leads: 425, conversion: "12.4%", status: "Active" },
    { name: "Executive Burnout Checklist", leads: 182, conversion: "8.1%", status: "Active" },
    { name: "GHL Mastermind Recording", leads: 89, conversion: "24.5%", status: "High Perf" },
    { name: "PCOS Productivity Framework", leads: 54, conversion: "6.2%", status: "Beta" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Lead Magnets</h1>
            <p className="text-meraki-white/60">Front-of-funnel conversion assets and email list growth.</p>
          </div>
          <button className="bg-meraki-gold text-meraki-indigo px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-meraki-gold/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Magnet
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8 glass rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-meraki-gold" />
              Magnet Performance
            </h3>
            <div className="space-y-6">
              {magnets.map((magnet, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-meraki-gold/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-meraki-gold/10 flex items-center justify-center text-meraki-gold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{magnet.name}</h4>
                      <p className="text-[10px] text-meraki-white/40 font-bold uppercase tracking-widest">{magnet.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] text-meraki-white/40 uppercase font-bold tracking-widest">Leads</p>
                      <p className="text-sm font-bold">{magnet.leads}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-meraki-white/40 uppercase font-bold tracking-widest">CR</p>
                      <p className="text-sm font-bold text-emerald-400">{magnet.conversion}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-all bg-white/5 p-2 rounded-lg hover:text-meraki-gold">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-meraki-gold/10 to-transparent">
              <h4 className="text-sm font-bold uppercase tracking-widest text-meraki-gold mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                List Growth
              </h4>
              <div className="text-4xl font-black mb-2">2,482</div>
              <p className="text-xs text-meraki-white/60 mb-6 font-medium">New leads (+142 this week)</p>
              <div className="h-24 flex items-end gap-1">
                {[3, 5, 4, 7, 6, 9, 8].map((h, i) => (
                  <div key={i} className="flex-1 bg-meraki-gold/30 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-4">Traffic Sources</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-meraki-white/60">LinkedIn Strategy</span>
                  <span className="font-bold">64%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-meraki-white/60">Facebook Group</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-meraki-white/60">Direct / Other</span>
                  <span className="font-bold">8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
