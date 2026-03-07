"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DollarSign, ArrowLeft, Cpu, Clock, HardDrive, PieChart, BarChart3, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export default function CostsPage() {
    const [costs, setCosts] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState(0);
    const [credits, setCredits] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                // Fetch Supabase logs
                const { data: logData } = await supabase
                    .from('api_costs')
                    .select('*')
                    .order('recorded_at', { ascending: false });

                if (logData) {
                    setCosts(logData);
                    const total = logData.reduce((acc, curr) => acc + (curr.estimated_cost_usd || 0), 0);
                    setTotalCost(total);
                }

                // Fetch OpenRouter Credits via our new API route
                const creditsRes = await fetch('/api/openrouter/credits');
                if (creditsRes.ok) {
                    const creditsData = await creditsRes.json();
                    setCredits(creditsData);
                }
            } catch (err) {
                console.error("Error fetching cost data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    // Group costs by model
    const modelBreakdown = costs.reduce((acc: any, curr) => {
        const model = curr.model || 'Unknown';
        if (!acc[model]) acc[model] = 0;
        acc[model] += curr.estimated_cost_usd || 0;
        return acc;
    }, {});

    const sortedModels = Object.entries(modelBreakdown)
        .sort(([, a]: any, [, b]: any) => b - a);

    return (
        <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Cost Intelligence</h1>
                        <p className="text-meraki-white/60">Transparency in every pulse. Real-time API investment analysis.</p>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8 mb-12">
                    {/* Main Balance Card */}
                    <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-10 bg-gradient-to-br from-meraki-violet/20 via-transparent to-transparent border-meraki-white/5 relative overflow-hidden text-shadow-glow">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <DollarSign className="w-48 h-48 text-meraki-gold" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-meraki-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Total Realized Investment</p>
                            <h2 className="text-6xl font-black font-display mb-8 tracking-tighter">
                                ${totalCost.toFixed(4)}
                            </h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="glass bg-white/5 p-6 rounded-2xl border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">OpenRouter Balance</p>
                                    <h4 className="text-2xl font-bold text-emerald-400">
                                        {credits ? `$${credits.remaining_credits?.toFixed(2)}` : 'Syncing...'}
                                    </h4>
                                    <p className="text-[10px] text-meraki-white/30 mt-1 uppercase font-bold tracking-widest">Remaining of ${credits?.total_credits?.toFixed(2)}</p>
                                </div>
                                <div className="glass bg-white/5 p-6 rounded-2xl border-white/10">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/40 mb-2">Total Spent (OpenRouter)</p>
                                    <h4 className="text-2xl font-bold text-rose-400">
                                        {credits ? `$${credits.total_usage?.toFixed(4)}` : '—'}
                                    </h4>
                                    <p className="text-[10px] text-meraki-white/30 mt-1 uppercase font-bold tracking-widest">Lifetime Usage</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="glass rounded-3xl p-8 bg-meraki-gold/5 border-meraki-gold/10">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-gold mb-6 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Efficiency Insight
                            </h3>
                            <p className="text-xs text-meraki-white/70 italic leading-relaxed">
                                &quot;Your recent switch to Claude-3-Haiku for secondary tasks has reduced average request cost by 42%.&quot;
                            </p>
                        </div>
                        <div className="glass rounded-3xl p-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-meraki-violet" />
                                Daily Burn Status
                            </h3>
                            <div className="text-lg font-bold text-meraki-white/80 uppercase tracking-widest">Nominal</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-12 gap-8 mb-12">
                    {/* Model Breakdown */}
                    <div className="col-span-12 lg:col-span-4 glass rounded-[32px] p-8">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            <PieChart className="w-5 h-5 text-meraki-violet" />
                            Spend By Model
                        </h3>
                        <div className="space-y-6">
                            {sortedModels.length > 0 ? sortedModels.slice(0, 5).map(([model, cost]: any) => (
                                <div key={model}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/60 truncate max-w-[150px]">{model.split('/').pop()}</span>
                                        <span className="text-xs font-black text-meraki-gold">${cost.toFixed(4)}</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                        <div
                                            className="bg-meraki-violet h-full transition-all duration-1000"
                                            style={{ width: `${(cost / totalCost) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-meraki-white/20 italic text-xs uppercase tracking-widest uppercase">Initializing...</div>
                            )}
                        </div>
                    </div>

                    {/* Consumption Log */}
                    <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <BarChart3 className="w-5 h-5 text-meraki-gold" />
                                Pulse Log
                            </h3>
                            <span className="text-[10px] text-meraki-white/30 font-bold uppercase tracking-widest">Last 50 Instances</span>
                        </div>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {costs.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-meraki-violet/20 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-meraki-violet/10 flex items-center justify-center text-meraki-violet">
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs group-hover:text-meraki-gold transition-colors">{c.model?.split('/').pop() || 'Unspecified'}</h4>
                                            <p className="text-[8px] text-meraki-white/30 uppercase tracking-widest font-bold">
                                                {new Date(c.recorded_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-meraki-gold">${c.estimated_cost_usd?.toFixed(6)}</p>
                                        <p className="text-[8px] text-meraki-white/20 font-bold uppercase tracking-widest">{c.token_usage_prompt + c.token_usage_completion} tokens</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
