"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Users,
  Linkedin,
  Facebook,
  Zap,
  Target,
  Lightbulb,
  Box,
  PenTool,
  HeartPulse,
  BrainCircuit,
  Link2,
  Settings,
  Cloud,
  Calendar,
  DollarSign,
  Plus,
  Send,
  Weight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  const [cost, setCost] = useState(0);
  const [leadCount, setLeadCount] = useState(0);
  const [lastLog, setLastLog] = useState<any>(null);

  useEffect(() => {
    // 1. Fetch Weekly Costs
    const fetchStats = async () => {
      const { data: costData } = await supabase
        .from('api_costs')
        .select('estimated_cost_usd');

      const total = costData?.reduce((acc: any, curr: any) => acc + (curr.estimated_cost_usd || 0), 0) || 0;
      setCost(total);

      // 2. Fetch Lead Count
      const { count } = await supabase
        .from('ghl_opportunities')
        .select('*', { count: 'exact', head: true });
      setLeadCount(count || 0);

      // 3. Fetch Last Event
      const { data: logData } = await supabase
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (logData && logData[0]) setLastLog(logData[0]);
    };

    fetchStats();

    // 3. Real-time Subscription
    const logChannel = supabase
      .channel('agent_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, (payload) => {
        setLastLog(payload.new);
        // Refresh costs on new log too
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(logChannel);
    };
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Command Center", active: true, href: "/" },
    { icon: DollarSign, label: "Revenue Tracker", href: "/revenue" },
    { icon: Users, label: "Clients", href: "/clients" },
    { icon: PenTool, label: "Content Factory", href: "/content" },
    { icon: Zap, label: "Lead Magnets", href: "/magnets" },
    { icon: Linkedin, label: "LinkedIn Strategy", href: "/linkedin" },
    { icon: Facebook, label: "Facebook Strategy", href: "/facebook" },
    { icon: Cloud, label: "Email & List", href: "/email" },
    { icon: Target, label: "Funnels", href: "/funnels" },
    { icon: Link2, label: "Connections", href: "/connections" },
    { icon: Lightbulb, label: "Ideas Lab", href: "/ideas" },
    { icon: Box, label: "Builds & Projects", href: "/projects" },
    { icon: BrainCircuit, label: "Second Brain", href: "/brain" },
    { icon: HeartPulse, label: "Health & Wellness", href: "/health" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Command Center</h1>
            <div className="flex items-center gap-3">
              <p className="text-meraki-white/60">Welcome back, Michelle. Removing bottlenecks today.</p>
              <span className="w-1.5 h-1.5 rounded-full bg-meraki-white/20" />
              <p className="text-meraki-gold font-medium text-sm">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="glass px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-meraki-violet/10 transition-all border-meraki-violet/30 active:scale-95 text-meraki-gold">
              Morning Brief
            </button>
            <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95">
              Launch Agent
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6 pb-12">
          {/* Daily Brief Card */}
          <div className="col-span-8 glass rounded-3xl p-8 relative overflow-hidden group min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-meraki-gold/5 blur-[100px] pointer-events-none" />
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Cloud className="w-6 h-6 text-meraki-gold" />
                Daily Brief
              </h2>
              <span className="text-xs text-meraki-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                Sirsha Operational • Active Pulse
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-meraki-gold text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Today&apos;s Focus
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-sm text-meraki-white/80 italic">
                      <span className="text-meraki-gold">✨</span>
                      No tasks scheduled. Michelle, I&apos;m standing by for your next strategic move.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-meraki-violet text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Sirsha Signal
                  </h3>
                  <p className="text-sm italic text-meraki-white/70 leading-relaxed border-l-2 border-meraki-violet/30 pl-4">
                    {lastLog?.event_type === 'heartbeat'
                      ? lastLog.description
                      : "\"Michelle, your open rate for the 'Authority' sequence jumped by 14% overnight. I recommend scaling the outreach tomorrow.\""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="col-span-4 glass rounded-3xl p-8 bg-gradient-to-br from-meraki-violet/10 to-transparent flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-meraki-white">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Link href="/tasks" className="flex">
                <ActionButton icon={Plus} label="New Task" color="violet" />
              </Link>
              <Link href="/ideas" className="flex">
                <ActionButton icon={Lightbulb} label="New Idea" color="indigo" />
              </Link>
              <Link href="/content" className="flex">
                <ActionButton icon={PenTool} label="New Draft" color="indigo" />
              </Link>
              <Link href="/clients" className="flex">
                <ActionButton icon={Users} label="Clients" color="gold" />
              </Link>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
              <Link href="/costs" className="flex justify-between items-center group bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-meraki-gold" />
                  <span className="text-xs font-bold uppercase tracking-widest text-meraki-white/60 group-hover:text-meraki-white transition-colors">API Consumption</span>
                </div>
                <span className="text-meraki-gold font-bold font-mono">${cost.toFixed(4)}</span>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="col-span-4 glass rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-meraki-violet/20 flex items-center justify-center text-meraki-violet">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-meraki-white/40 mb-1">API Cost (Total)</p>
              <h3 className="text-2xl font-bold text-meraki-white">${cost.toFixed(2)}</h3>
            </div>
          </div>

          <div className="col-span-4 glass rounded-3xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-meraki-gold/20 flex items-center justify-center text-meraki-gold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-meraki-white/40 mb-1">Active Leads</p>
              <h3 className="text-2xl font-bold text-meraki-white">{leadCount}</h3>
            </div>
          </div>

          <div className="col-span-4 glass rounded-3xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-meraki-white/40 mb-1">Goal Progress</p>
                <h3 className="text-2xl font-bold text-meraki-white">$0 / $1.0M</h3>
              </div>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div className="bg-emerald-400 h-full w-[2%]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color }: { icon: any, label: string, color: 'violet' | 'indigo' | 'gold' }) {
  const colors = {
    violet: "bg-meraki-violet hover:bg-meraki-violet/80 text-white",
    indigo: "glass text-meraki-white hover:bg-meraki-violet/10",
    gold: "bg-meraki-gold hover:bg-meraki-gold/80 text-meraki-indigo",
  };

  return (
    <div className={`p-4 rounded-2xl transition-all active:scale-95 flex flex-col items-center gap-2 group w-full cursor-pointer ${colors[color]}`}>
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function StatusDot({ color }: { color: string }) {
  return <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />;
}
