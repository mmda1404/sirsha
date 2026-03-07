"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Link2,
  Users,
  UserPlus,
  Clock,
  Heart,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";

export default function Connections() {
  const people = [
    { name: "Jessica R.", role: "Potential DFY Client", lastContact: "2d ago", status: "Warm", color: "text-meraki-gold" },
    { name: "David L.", role: "Strategic Partner", lastContact: "5d ago", status: "Warm", color: "text-meraki-violet" },
    { name: "Sarah Mitchell", role: "Coaching Student", lastContact: "Overdue", status: "Hot", color: "text-red-400" },
    { name: "Amanda K.", role: "Referral Source", lastContact: "1d ago", status: "Hot", color: "text-emerald-400" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Connections CRM</h1>
            <p className="text-meraki-white/60">Relationship intelligence. The human layer behind the revenue.</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Relationship
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Priority Queue */}
          <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Clock className="w-5 h-5 text-meraki-gold" />
                Follow-Up Queue
              </h3>
              <span className="text-[10px] text-meraki-white/30 font-bold uppercase tracking-widest leading-none">
                4 Actionable Leads
              </span>
            </div>

            <div className="space-y-4">
              {people.map((person, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-meraki-violet/20 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-meraki-violet/10 flex items-center justify-center text-meraki-violet font-bold text-lg">
                      {person.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm mb-1 group-hover:text-meraki-gold transition-colors">{person.name}</h4>
                      <p className="text-[10px] text-meraki-white/40 uppercase tracking-widest font-bold">{person.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-[10px] text-meraki-white/40 uppercase font-bold tracking-widest">Last Contact</p>
                      <p className={`text-xs font-bold ${person.lastContact === 'Overdue' ? 'text-red-400' : 'text-meraki-white/80'}`}>{person.lastContact}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-tighter border ${person.status === 'Hot' ? 'border-red-400/30 text-red-400' :
                        person.status === 'Warm' ? 'border-meraki-gold/30 text-meraki-gold' :
                          'border-meraki-white/10 text-meraki-white/40'
                      }`}>
                      {person.status}
                    </div>
                    <button className="bg-white/5 p-2 rounded-lg hover:text-meraki-gold opacity-0 group-hover:opacity-100 transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Column */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 bg-emerald-400/5 flex flex-col justify-center border-emerald-400/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Referral Health</p>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-3xl font-black text-emerald-400 tracking-tighter">88%</h4>
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs text-meraki-white/40 leading-relaxed font-medium">Reciprocity is high. 4 leads sent this month, 3 received.</p>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-6 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-meraki-violet" />
                Network Insights
              </h3>
              <div className="space-y-4">
                <p className="text-xs italic text-meraki-white/80 leading-relaxed">
                  &quot;Michelle, David L. hasn&apos;t heard from you in 5 days. He has a following of 10k+ woman founders—dropping a personalized loom today would be high ROI.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
