"use client";

import { Sidebar } from "@/components/Sidebar";
import {
    Cloud,
    Mail,
    UserPlus,
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Zap,
    CheckCircle2,
    Users
} from "lucide-react";

export default function EmailAudience() {
    const campaigns = [
        { title: "The $1M Vision Kickoff", open: "42.5%", click: "8.1%", status: "Sent" },
        { title: "Automation vs Mastery Sequence", open: "56.2%", click: "12.4%", status: "Active" },
        { title: "PCOS Productivity Assets", open: "38.1%", click: "5.2%", status: "Draft" },
    ];

    return (
        <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Email & List</h1>
                        <p className="text-meraki-white/60">Owned audience visibility and broadcast intelligence.</p>
                    </div>
                    <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        New Broadcast
                    </button>
                </header>

                {/* Audience Overview */}
                <div className="grid grid-cols-12 gap-8 mb-12">
                    <div className="col-span-8 glass rounded-[32px] p-8">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Users className="w-5 h-5 text-meraki-gold" />
                            List Segments & Health
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">High-Ticket Leads</p>
                                <div className="flex justify-between items-end">
                                    <h4 className="text-2xl font-bold">142</h4>
                                    <span className="text-emerald-400 text-xs font-bold">+12.4%</span>
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Solopreneur ICP</p>
                                <div className="flex justify-between items-end">
                                    <h4 className="text-2xl font-bold">842</h4>
                                    <span className="text-meraki-gold text-xs font-bold">+5.2%</span>
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">PCOS/Wellness Sub</p>
                                <div className="flex justify-between items-end">
                                    <h4 className="text-2xl font-bold">528</h4>
                                    <span className="text-meraki-violet text-xs font-bold">+8.1%</span>
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Consultants/DFY</p>
                                <div className="flex justify-between items-end">
                                    <h4 className="text-2xl font-bold">24</h4>
                                    <span className="text-meraki-white/20 text-xs font-bold">Steady</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-4 glass rounded-3xl p-8 bg-gradient-to-br from-meraki-gold/10 to-transparent flex flex-col justify-center">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-meraki-gold mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            List Deliverability
                        </h4>
                        <div className="text-5xl font-black mb-2 tracking-tighter">98.2%</div>
                        <p className="text-xs text-meraki-white/60 mb-8 font-medium">Domain Health: Excellent</p>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                                <span>Bounce Rate</span>
                                <span>0.4%</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                                <span>Unsub Rate</span>
                                <span>1.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Benchmarks */}
                <div className="glass rounded-[32px] p-8">
                    <h3 className="text-xl font-bold mb-8">Recent Broadcast Benchmarks</h3>
                    <div className="space-y-4">
                        {campaigns.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-meraki-violet/30 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-meraki-white/60">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1 group-hover:text-meraki-gold transition-colors">{item.title}</h4>
                                        <p className="text-[10px] text-meraki-white/40 font-bold uppercase tracking-widest">{item.status}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-20">
                                    <div className="text-center">
                                        <p className="text-[10px] text-meraki-white/40 uppercase font-bold tracking-widest">Open Rate</p>
                                        <p className="text-sm font-black text-emerald-400">{item.open}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-meraki-white/40 uppercase font-bold tracking-widest">CTR</p>
                                        <p className="text-sm font-black text-meraki-gold">{item.click}</p>
                                    </div>
                                    <button className="bg-meraki-violet/10 text-meraki-violet p-2 rounded-lg hover:bg-meraki-violet transition-colors hover:text-white">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
