"use client";

import { Sidebar } from "@/components/Sidebar";
import {
    TrendingUp,
    Target,
    DollarSign,
    Calendar,
    ArrowUpRight,
    TrendingDown,
    PieChart,
    BarChart3,
    Lightbulb
} from "lucide-react";

export default function RevenueTracker() {
    const channelData = [
        { name: "DFY AI Strategy", revenue: 15400, color: "bg-meraki-violet" },
        { name: "LinkedIn Automation", revenue: 8200, color: "bg-meraki-gold" },
        { name: "Brand Authority Consulting", revenue: 12100, color: "bg-emerald-400" },
        { name: "Templates & Assets", revenue: 1200, color: "bg-meraki-white/20" },
    ];

    return (
        <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Revenue Tracker</h1>
                        <p className="text-meraki-white/60">The $1.0M Scoreboard. Every dollar counts toward the mission.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="glass px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-meraki-violet/10 transition-all border-meraki-violet/30 active:scale-95 text-meraki-gold">
                            Download Report
                        </button>
                        <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95">
                            Log Revenue
                        </button>
                    </div>
                </header>

                {/* Global Progress Board */}
                <section className="mb-12">
                    <div className="glass rounded-[32px] p-10 relative overflow-hidden bg-gradient-to-br from-meraki-violet/20 via-transparent to-transparent border-meraki-white/5">
                        <div className="absolute top-0 right-0 p-8">
                            <Target className="w-48 h-48 text-meraki-white/5 absolute -top-10 -right-10 pointer-events-none" />
                        </div>

                        <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
                            <div className="col-span-12 lg:col-span-5">
                                <p className="text-meraki-gold font-bold uppercase tracking-[0.3em] text-xs mb-4">Total Revenue Progress</p>
                                <h2 className="text-6xl font-black font-display mb-6 tracking-tighter">
                                    $36,900 <span className="text-2xl text-meraki-white/30">/ $1.0M</span>
                                </h2>
                                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden border border-white/10 mb-6">
                                    <div className="bg-gradient-to-r from-meraki-violet to-meraki-gold h-full w-[3.69%] shadow-[0_0_20px_rgba(157,78,221,0.5)]" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-meraki-white/60">3.7% of goal achieved</p>
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>+12.5% this month</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 lg:col-span-1 h-32 border-l border-white/10 hidden lg:block" />

                            <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
                                <div className="glass bg-white/5 p-6 rounded-2xl border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Projected EOFY</p>
                                    <p className="text-2xl font-bold">$425,000</p>
                                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" />
                                        -$575k from target
                                    </p>
                                </div>
                                <div className="glass bg-white/5 p-6 rounded-2xl border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Customer LTV</p>
                                    <p className="text-2xl font-bold">$12,400</p>
                                    <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        +5.2% vs last qtr
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-12 gap-8 mb-12">
                    {/* Revenue by Channel */}
                    <div className="col-span-12 lg:col-span-7 glass rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-meraki-gold" />
                            Revenue By Channel
                        </h3>
                        <div className="space-y-6">
                            {channelData.map((channel) => (
                                <div key={channel.name}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-meraki-white/80">{channel.name}</span>
                                        <span className="text-sm font-bold">${channel.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`${channel.color} h-full transition-all duration-1000`}
                                            style={{ width: `${(channel.revenue / 36900) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Trajectory */}
                    <div className="col-span-12 lg:col-span-5 glass rounded-3xl p-8 bg-gradient-to-b from-meraki-indigo/20 to-transparent">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-meraki-violet" />
                            Monthly Trajectory
                        </h3>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[40, 65, 45, 80, 55, 90, 100].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                                    <div className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-meraki-violet px-2 py-1 rounded-md mb-1">
                                        ${(height * 100).toLocaleString()}
                                    </div>
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 hover:brightness-125 ${i === 6 ? 'bg-meraki-gold shadow-[0_0_15px_rgba(255,191,0,0.4)]' : 'bg-meraki-violet/40'}`}
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[10px] text-meraki-white/30 uppercase tracking-tighter">Jan - Jul</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Strategy Signal */}
                <div className="glass rounded-[32px] p-8 border-l-4 border-meraki-gold bg-meraki-gold/5">
                    <div className="flex items-start gap-4">
                        <div className="bg-meraki-gold/20 p-3 rounded-2xl text-meraki-gold shrink-0">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-meraki-gold mb-2 uppercase tracking-widest text-sm">Sirsha Intelligence Signal</h4>
                            <p className="text-meraki-white/80 leading-relaxed italic">
                                &quot;Michelle, based on the current trajectory, the High-Ticket DFY strategy is our primary lever.
                                Increasing the LinkedIn conversion rate by just 2% will put our projected EOFY at $482k.
                                I recommend doubling down on the &apos;Authority&apos; sequence for the next 14 days.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
