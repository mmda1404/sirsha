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
    DollarSign
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();
    const [lastLog, setLastLog] = useState<any>(null);

    useEffect(() => {
        const fetchLastEvent = async () => {
            const { data: logData } = await supabase
                .from('agent_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1);

            if (logData && logData[0]) setLastLog(logData[0]);
        };

        fetchLastEvent();

        const logChannel = supabase
            .channel('sidebar_logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_logs' }, (payload) => {
                setLastLog(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(logChannel);
        };
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: "Command Center", href: "/" },
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
        <aside className="w-64 border-r border-border-subtle bg-meraki-indigo/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="relative w-40 h-10">
                    <Image
                        src="/meraki-ai-logo-light.png"
                        alt="Meraki AI"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                ? "bg-meraki-violet text-white shadow-lg shadow-meraki-violet/20"
                                : "text-meraki-white/60 hover:bg-meraki-violet/10 hover:text-meraki-white"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-meraki-gold transition-colors"}`} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border-subtle">
                <div className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-meraki-gold animate-pulse" />
                        <span className="text-xs font-medium text-meraki-gold uppercase tracking-wider">Sirsha Online</span>
                    </div>
                    <p className="text-[10px] text-meraki-white/50 leading-relaxed uppercase tracking-widest opacity-80">
                        {lastLog ? lastLog.description : "High-Performance, Proactive AI for Meraki Media."}
                    </p>
                </div>
            </div>
        </aside>
    );
}
