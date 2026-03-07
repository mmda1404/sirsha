"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Facebook,
  MessageSquare,
  Users,
  Heart,
  Share2,
  Plus,
  Zap,
  Flame,
  UserPlus
} from "lucide-react";

export default function FacebookStrategy() {
  const communityMembers = [
    { name: "Jessica R.", activity: "Commented on 3 posts", temperature: "Warm" },
    { name: "David L.", activity: "New Group Member", temperature: "Cold" },
    { name: "Amanda K.", activity: "Shared 'PCOS Hack'", temperature: "Hot" },
    { name: "Robert S.", activity: "Messaged re: Consulting", temperature: "Hot" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Facebook Strategy</h1>
            <p className="text-meraki-white/60">Community warmth, engagement tracking, and group intelligence.</p>
          </div>
          <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <Facebook className="w-4 h-4" />
            Go to Messenger
          </button>
        </header>

        {/* Community Dashboard */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Community Spotlight */}
          <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Flame className="w-5 h-5 text-meraki-gold" />
                Community Spotlight Tracker
              </h3>
              <span className="text-[10px] text-meraki-white/40 font-bold uppercase tracking-widest leading-none">
                Selfie Initiative Sync
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityMembers.map((member, i) => (
                <div key={i} className="glass bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-meraki-gold/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-meraki-violet/10 flex items-center justify-center text-meraki-violet font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-meraki-gold transition-colors">{member.name}</h4>
                      <p className="text-[10px] text-meraki-white/30 uppercase font-bold tracking-widest">{member.activity}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase ${member.temperature === 'Hot' ? 'bg-red-400/10 text-red-400' :
                      member.temperature === 'Warm' ? 'bg-meraki-gold/10 text-meraki-gold' :
                        'bg-meraki-white/10 text-meraki-white/40'
                    }`}>
                    {member.temperature}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Column */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-meraki-violet/20 to-transparent flex flex-col items-center text-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-4 ">Community Health</p>
              <div className="text-5xl font-black text-meraki-gold mb-2 tracking-tighter">94%</div>
              <p className="text-xs text-meraki-white/60 mb-6 font-medium">Warmth & Engagement Score</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full mb-4">
                <div className="bg-meraki-gold h-full w-[94%]" />
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-meraki-gold" />
                Sirsha Warmth Signal
              </h3>
              <div className="space-y-4">
                <p className="text-xs italic text-meraki-white/80 leading-relaxed">
                  &quot;Michelle, Amanda K. just shared your framework in a massive thread. Comment now to dominate the conversation. She is likely a High-Ticket lead in waiting.&quot;
                </p>
                <button className="w-full py-2.5 rounded-xl border border-meraki-violet/30 text-[10px] font-bold uppercase tracking-widest hover:bg-meraki-violet/10 transition-all hover:text-meraki-gold">
                  Draft Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
