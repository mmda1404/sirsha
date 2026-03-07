"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Target,
  ArrowRight,
  Layers,
  TrendingUp,
  Clock,
  MousePointer2,
  DollarSign,
  Zap,
  Box
} from "lucide-react";

export default function Funnels() {
  const funnelSteps = [
    { name: "Top of Funnel (Social)", icon: Zap, volume: "12,400", dropoff: "0%", color: "bg-meraki-violet" },
    { name: "Lead Magnets", icon: Target, volume: "2,482", dropoff: "80%", color: "bg-meraki-gold" },
    { name: "Email Sequence", icon: Layers, volume: "842", dropoff: "66%", color: "bg-emerald-400" },
    { name: "Client Discovery", icon: MousePointer2, volume: "24", dropoff: "97%", color: "bg-meraki-white/20" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Conversion Funnels</h1>
            <p className="text-meraki-white/60">The architecture of the $1M revenue engine.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-meraki-gold flex items-center gap-2">
              <Box className="w-4 h-4" />
              LTV: $14,200
            </div>
          </div>
        </header>

        {/* Funnel Visualization */}
        <section className="mb-12">
          <div className="glass rounded-[40px] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-meraki-gold/5 blur-[120px] pointer-events-none" />

            <div className="grid grid-cols-4 gap-4 relative z-10">
              {funnelSteps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-full ${step.color} p-8 rounded-[32px] shadow-xl relative group hover:scale-[1.02] transition-transform cursor-help`}>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                    <div className="flex justify-between items-start mb-6 relative">
                      <step.icon className="w-6 h-6 text-meraki-indigo" />
                      <span className="text-[10px] font-black tracking-tighter uppercase p-1 bg-black/10 rounded">Phase {i + 1}</span>
                    </div>
                    <h4 className="text-meraki-indigo font-black text-xl mb-1 tracking-tight">{step.volume}</h4>
                    <p className="text-meraki-indigo/60 text-[10px] font-bold uppercase tracking-wider">{step.name}</p>
                  </div>

                  {i < 3 && (
                    <div className="w-full flex justify-center py-6 opacity-40">
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{step.dropoff} Drop</p>
                        <ArrowRight className="w-6 h-6 rotate-90 text-meraki-white/20" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leakage Monitoring */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8 glass rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-meraki-violet" />
              Funnel Health & Leakage
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Lead Magnet {"->"} Email Sequence</h4>
                  <p className="text-xs text-meraki-white/40">34% Retention. Below benchmark (45%).</p>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <span>Alert</span>
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                </div>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-meraki-gold h-full w-[34%]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Email {"->"} Client Discovery</h4>
                  <p className="text-xs text-meraki-white/40">8% Conversion. Healthy for High-Ticket.</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>Optimal</span>
                </div>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[8%]" />
              </div>
            </div>
          </div>

          <div className="col-span-4 glass rounded-3xl p-8 bg-gradient-to-br from-meraki-violet/10 to-transparent">
            <h4 className="text-sm font-bold uppercase tracking-widest text-meraki-violet mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time to Convert
            </h4>
            <div className="text-4xl font-black mb-2">14.2 Days</div>
            <p className="text-xs text-meraki-white/60 mb-8 font-medium">Average journey from Lead {"->"} Sign-off</p>
            <div className="space-y-4">
              <p className="text-[10px] text-meraki-white/40 italic leading-relaxed">
                Sirsha Note: We can shave 2 days off this journey by automating the initial Discovery scheduling on the Content Factory page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
