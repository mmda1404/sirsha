"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Linkedin,
  Users,
  MessageCircle,
  TrendingUp,
  Target,
  MoreHorizontal,
  ExternalLink,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function LinkedInStrategy() {
  const activities = [
    { title: "Engagement Loop: Top 20 ICP", status: "Done", time: "Morning" },
    { title: "DM Follow-up: High Ticket Leads", status: "Pending", time: "11:00 AM" },
    { title: "Post: The Hidden Cost of AI Standards", status: "Scheduled", time: "1:45 PM" },
    { title: "Networking: Woman AI Founders Group", status: "Pending", time: "Afternoon" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">LinkedIn Strategy</h1>
            <p className="text-meraki-white/60">Authority engine and high-ticket lead generation hub.</p>
          </div>
          <button className="bg-[#0A66C2] px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            Open LinkedIn
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Daily Routine */}
          <div className="col-span-12 lg:col-span-7 glass rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Target className="w-5 h-5 text-meraki-gold" />
                Daily Authority Loop
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Ready to Execute
              </span>
            </div>

            <div className="space-y-4">
              {activities.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${item.status === 'Done' ? 'bg-emerald-400 border-emerald-400' : 'border-white/10 group-hover:border-meraki-gold/40'
                      }`}>
                      {item.status === 'Done' && <CheckCircle2 className="w-4 h-4 text-meraki-indigo" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${item.status === 'Done' ? 'text-meraki-white/40 line-through' : 'text-meraki-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-meraki-white/30 uppercase tracking-widest font-bold">{item.time}</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-meraki-white/10" />
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Column */}
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="glass rounded-3xl p-8 flex flex-col justify-center bg-gradient-to-br from-[#0A66C2]/10 to-transparent">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">Profile Velocity</p>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  +24%
                </div>
              </div>
              <h4 className="text-3xl font-black mb-2">1,240 <span className="text-sm font-normal text-meraki-white/40 tracking-normal">Views</span></h4>
              <p className="text-xs text-meraki-white/40">Last 7 days. High engagement on &apos;System Architecture&apos; posts.</p>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-meraki-gold" />
                Sirsha Network Insights
              </h3>
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border-l-2 border-meraki-violet">
                  <p className="text-xs italic text-meraki-white/80 leading-relaxed">
                    &quot;Michelle, I noticed 4 individuals from Goldman Sachs viewed your profile in the last 24h. Perfect timing to share the ROI case study draft.&quot;
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border-l-2 border-meraki-gold">
                  <p className="text-xs italic text-meraki-white/80 leading-relaxed">
                    &quot;DM Response Rate is up. Your new personalized intro is converting at 42%. Scale this tonight.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
