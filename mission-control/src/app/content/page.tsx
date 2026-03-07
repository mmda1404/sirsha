"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  PenTool,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  Share2,
  Linkedin,
  Facebook,
  Instagram,
  Zap
} from "lucide-react";

export default function ContentFactory() {
  const content = [
    { title: "The Hidden Cost of 'Standard' AI Workflows", status: "Draft", platform: "LinkedIn", date: "Mar 6", icon: Linkedin, color: "text-blue-400" },
    { title: "How I built Sirsha's Memory System", status: "Scheduled", platform: "Newsletter", date: "Mar 8", icon: Share2, color: "text-meraki-gold" },
    { title: "3 PCOS Bottlenecks for Solopreneurs", status: "Draft", platform: "LinkedIn", date: "Mar 10", icon: Linkedin, color: "text-blue-400" },
    { title: "Automation vs. Authenticity: The Meraki Way", status: "Published", platform: "Facebook", date: "Feb 28", icon: Facebook, color: "text-meraki-violet" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Content Factory</h1>
            <p className="text-meraki-white/60">Manage drafts, schedules, and cross-platform authority assets.</p>
          </div>
          <div className="flex gap-4">
            <button className="glass px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-meraki-violet/10 transition-all border-meraki-violet/30 active:scale-95 text-meraki-white/60">
              Content Calendar
            </button>
            <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Content Draft
            </button>
          </div>
        </header>

        {/* Action Row */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Active Workstation */}
          <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <PenTool className="w-5 h-5 text-meraki-gold" />
                Drafting Workstation
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-meraki-white/20">
                <span>Recent Activity</span>
                <span className="w-1.5 h-1.5 rounded-full bg-meraki-gold" />
              </div>
            </div>

            <div className="space-y-4">
              {content.map((item, i) => (
                <div key={i} className="group glass bg-white/5 hover:bg-white/10 p-5 rounded-2x border-white/5 transition-all flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 group-hover:text-meraki-gold transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-meraki-white/40 font-bold uppercase tracking-widest">{item.platform} • {item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${item.status === 'Draft' ? 'border-meraki-white/10 text-meraki-white/40' :
                        item.status === 'Scheduled' ? 'border-meraki-gold/30 text-meraki-gold' :
                          'border-emerald-400/30 text-emerald-400'
                      }`}>
                      {item.status}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-all bg-white/5 p-2 rounded-lg hover:bg-meraki-violet/20 hover:text-meraki-violet">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Inspiration */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 bg-meraki-violet/10">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-meraki-gold" />
                Sirsha Inspiration
              </h4>
              <p className="text-sm text-meraki-white/70 italic leading-relaxed mb-6">
                &quot;Michelle, your recent post about PCOS & Productivity got 3x the average engagement. People are hungry for that intersection. I recommend a follow-up on 'Executive Function Systems for the Founder Trapped in a Depleted Body'.&quot;
              </p>
              <button className="w-full py-3 rounded-xl bg-meraki-violet text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
                Generate Outline
              </button>
            </div>

            <div className="glass rounded-3xl p-8">
              <h4 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-6">Audience Sentiment</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-meraki-white/60">
                    <span>Authority Ranking</span>
                    <span>84%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-meraki-gold h-full w-[84%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-meraki-white/60">
                    <span>Engagement Health</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
