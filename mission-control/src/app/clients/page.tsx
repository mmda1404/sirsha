"use client";

import { Sidebar } from "@/components/Sidebar";
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    DollarSign,
    Clock,
    UserPlus
} from "lucide-react";

export default function Clients() {
    const pipeline = [
        { title: "Discovery Phase", count: 4, value: 45000, color: "border-meraki-gold" },
        { title: "Proposal Sent", count: 2, value: 32000, color: "border-meraki-violet" },
        { title: "Negotiation", count: 3, value: 58000, color: "border-emerald-400" },
        { title: "Signed / Onboarding", count: 5, value: 125000, color: "border-meraki-white/20" },
    ];

    return (
        <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Clients & Pipeline</h1>
                        <p className="text-meraki-white/60">High-ticket relationship management and revenue flow.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-meraki-white/40 group-focus-within:text-meraki-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-meraki-gold/50 transition-all w-64"
                            />
                        </div>
                        <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Pipeline Lead
                        </button>
                    </div>
                </header>

                {/* Pipeline Summary */}
                <div className="grid grid-cols-4 gap-6 mb-12">
                    {pipeline.map((stage) => (
                        <div key={stage.title} className={`glass p-6 rounded-2xl border-l-4 ${stage.color}`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-1">{stage.title}</p>
                            <div className="flex justify-between items-end">
                                <h3 className="text-2xl font-bold">{stage.count} <span className="text-sm font-normal text-meraki-white/30">Deals</span></h3>
                                <p className="text-meraki-gold font-mono font-bold text-sm">${stage.value.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Board View (Simplified) */}
                <div className="grid grid-cols-4 gap-6 h-[500px]">
                    {[1, 2, 3, 4].map((col) => (
                        <div key={col} className="bg-white/2 rounded-3xl p-4 border border-white/5 flex flex-col gap-4">
                            <div className="flex justify-between items-center px-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-meraki-white/20">Stage {col}</span>
                                <Plus className="w-4 h-4 text-meraki-white/20 cursor-pointer hover:text-meraki-white" />
                            </div>

                            {/* Mock Cards */}
                            <div className="glass p-4 rounded-xl border-white/5 space-y-3 cursor-grab active:scale-95 transition-all">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] bg-meraki-violet/20 text-meraki-violet px-2 py-0.5 rounded font-bold uppercase">Strategy Call</span>
                                    <MoreHorizontal className="w-4 h-4 text-meraki-white/20" />
                                </div>
                                <h4 className="font-bold text-sm text-meraki-white/90">Visionary Tech Corp</h4>
                                <div className="flex items-center gap-4 text-[10px] text-meraki-white/40">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        $12,500
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        3d
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-4 rounded-xl border-white/5 space-y-3 cursor-grab active:scale-95 transition-all">
                                <div className="flex justify-between items-start">
                                    <span className="text-[10px] bg-meraki-gold/20 text-meraki-gold px-2 py-0.5 rounded font-bold uppercase">Follow Up</span>
                                    <MoreHorizontal className="w-4 h-4 text-meraki-white/20" />
                                </div>
                                <h4 className="font-bold text-sm text-meraki-white/90">Sarah Mitchell (Coaching)</h4>
                                <div className="flex items-center gap-4 text-[10px] text-meraki-white/40">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        $4,200
                                    </div>
                                    <div className="flex items-center gap-1 text-red-400">
                                        <Clock className="w-3 h-3" />
                                        Overdue
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
