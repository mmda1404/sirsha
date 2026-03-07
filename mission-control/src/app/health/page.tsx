"use client";

import { Sidebar } from "@/components/Sidebar";
import {
    HeartPulse,
    Weight,
    Droplet,
    Zap,
    Moon,
    Calendar,
    Plus,
    Smile,
    Battery,
    Dna,
    Scale,
    Stethoscope,
    TrendingUp,
    Wind,
    CheckCircle2
} from "lucide-react";

export default function HealthWellness() {
    return (
        <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-rose-400/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,100,150,0.05),transparent_50%)]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Health & Support</h1>
                        <p className="text-meraki-white/60">The sustainability layer. Your energy is the business&apos;s most valuable dividend.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-emerald-400/10 border border-emerald-400/20 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                            <Wind className="w-4 h-4" />
                            State: Resilient
                        </div>
                    </div>
                </header>

                {/* Energy & State Check-in */}
                <section className="mb-12 grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-8 glass bg-white/[0.02] border-white/5 rounded-[40px] p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Battery className="w-5 h-5 text-rose-400" />
                                Daily Energy Check-in
                            </h3>
                            <span className="text-[10px] text-meraki-white/20 font-bold uppercase tracking-widest">Calibrating Sirsha Tone...</span>
                        </div>

                        <div className="flex justify-between gap-4">
                            {[
                                { label: "Depleted", icon: Battery, color: "text-red-400" },
                                { label: "Drained", icon: Battery, color: "text-orange-400" },
                                { label: "Neutral", icon: Battery, color: "text-meraki-gold" },
                                { label: "Steady", icon: Battery, color: "text-emerald-400" },
                                { label: "Radiant", icon: Zap, color: "text-meraki-violet" },
                            ].map((state) => (
                                <button key={state.label} className="flex-1 glass bg-white/5 hover:bg-white/10 p-6 rounded-3xl border-white/5 transition-all flex flex-col items-center gap-3 group">
                                    <state.icon className={`w-6 h-6 ${state.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 group-hover:text-meraki-white">{state.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4 glass bg-rose-400/5 rounded-[40px] p-10 flex flex-col justify-center border-rose-400/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-400/20 rounded-2xl flex items-center justify-center text-rose-400">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-1">Current Weight</p>
                                <h4 className="text-3xl font-black tracking-tighter">162.4 <span className="text-sm font-normal opacity-30 tracking-normal">lbs</span></h4>
                            </div>
                        </div>
                        <button className="w-full bg-rose-400/20 text-rose-400 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-400 hover:text-white transition-all">
                            Log Weight
                        </button>
                    </div>
                </section>

                {/* Specialized Metrics Grid */}
                <div className="grid grid-cols-12 gap-8 mb-12">
                    {/* PCOS Matrix */}
                    <div className="col-span-12 lg:col-span-7 glass bg-white/[0.02] border-white/5 rounded-[40px] p-10">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Dna className="w-5 h-5 text-meraki-gold" />
                            PCOS Metabolic Matrix
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                                    <span>Protein Goal (120g)</span>
                                    <span className="text-emerald-400">92g</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full">
                                    <div className="bg-emerald-400 h-full w-[76%]" />
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                                    <span>Folic Acid</span>
                                    <span className="text-meraki-white/40">Taken</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-meraki-white/40">
                                    <span>Inositol</span>
                                    <span className="text-emerald-400 font-black">Taken</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-4">Cycle Phase</p>
                                <div className="flex items-center gap-3 mb-2 text-rose-400">
                                    <Moon className="w-5 h-5" />
                                    <span className="text-xl font-bold">Follicular</span>
                                </div>
                                <p className="text-[10px] text-rose-400/60 font-medium">Day 8 of 28. High energy window.</p>
                            </div>
                        </div>
                    </div>

                    {/* GLP-1 Protocol */}
                    <div className="col-span-12 lg:col-span-5 glass bg-emerald-400/5 rounded-[40px] p-10 border-emerald-400/10">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <Stethoscope className="w-5 h-5 text-emerald-400" />
                            GLP-1 Protocol
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-1">Standard Dose</p>
                                    <h4 className="text-xl font-bold">0.5 mg</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-1">Last Shot</p>
                                    <h4 className="text-sm font-bold">May 2nd</h4>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {['Headache', 'Nausea', 'Fatigue'].map((side) => (
                                    <div key={side} className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold uppercase tracking-widest text-meraki-white/30 border border-white/5">
                                        {side}
                                    </div>
                                ))}
                                <div className="px-3 py-1 rounded-full bg-emerald-400/20 text-[9px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/20">
                                    Stable
                                </div>
                            </div>

                            <p className="text-[11px] text-meraki-white/50 italic leading-relaxed pt-2 border-t border-white/5">
                                Sirsha Support: &quot;Michelle, noticed slight fatigue after your last dose. Calibrating your Content Factory task load for tomorrow to ensure you have space to rest.&quot;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Habits Tracker */}
                <section className="glass bg-white/[0.02] border-white/5 rounded-[40px] p-10">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Smile className="w-5 h-5 text-meraki-violet" />
                        Micro-Habit Stacking
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {['Morning Walk', 'Hydration', 'Gratitude', 'Supplement', 'No Screen 1h', 'Deep Work'].map((habit) => (
                            <div key={habit} className="flex flex-col items-center gap-3 group cursor-pointer">
                                <div className="w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center group-hover:border-meraki-violet transition-all">
                                    <CheckCircle2 className="w-6 h-6 text-white/5 group-hover:text-meraki-violet transition-colors" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest text-meraki-white/30 text-center">{habit}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
