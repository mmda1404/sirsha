"use client";

import { Sidebar } from "@/components/Sidebar";
import {
  Box,
  Settings,
  CheckCircle2,
  Clock,
  Zap,
  Settings2,
  Cpu,
  Server,
  Terminal,
  ArrowUpRight,
  Plus
} from "lucide-react";

export default function BuildsProjects() {
  const projects = [
    { name: "Sirsha Mission Control", status: "In Progress", progress: 65, category: "Infrastructure" },
    { name: "GHL Webhook Orchestrator", status: "Active", progress: 100, category: "Automation" },
    { name: "Strategy Knowledge Base", status: "Planning", progress: 10, category: "Intelligence" },
    { name: "LinkedIn CRM Sync", status: "Testing", progress: 85, category: "Relationship" },
  ];

  const services = [
    { name: "Supabase DB", status: "Healthy", icon: Server },
    { name: "HeyGen API", status: "Healthy", icon: Cpu },
    { name: "OpenRouter LLM", status: "Healthy", icon: Zap },
    { name: "ElevenLabs", status: "Limited", icon: Terminal },
  ];

  return (
    <div className="flex min-h-screen bg-meraki-indigo text-meraki-white selection:bg-meraki-violet/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto h-screen bg-[radial-gradient(circle_at_top_right,rgba(92,0,255,0.05),transparent_40%)]">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-display text-meraki-white mb-2 tracking-tight">Builds & Projects</h1>
            <p className="text-meraki-white/60">Active development, infrastructure logs, and Sirsha&apos;s capability roadmap.</p>
          </div>
          <button className="bg-meraki-violet px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-meraki-violet/20 hover:brighten-110 transition-all active:scale-95 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Launch New Build
          </button>
        </header>

        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Active Projects */}
          <div className="col-span-12 lg:col-span-8 glass rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Box className="w-5 h-5 text-meraki-gold" />
              Active Infrastructure Builds
            </h3>

            <div className="space-y-6">
              {projects.map((project, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-meraki-white/20 mb-1 block">{project.category}</span>
                      <h4 className="font-bold text-sm group-hover:text-meraki-gold transition-colors">{project.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-meraki-white/40 uppercase tracking-widest block mb-1">{project.status}</span>
                      <span className="text-xs font-black">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${project.progress === 100 ? 'bg-emerald-400' : 'bg-meraki-violet/60'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Status */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-meraki-white/40 mb-6 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Tech Stack Health
              </h3>
              <div className="space-y-5">
                {services.map((service, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <service.icon className="w-4 h-4 text-meraki-white/30" />
                      <span className="text-xs font-bold text-meraki-white/70">{service.name}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${service.status === 'Healthy' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-meraki-gold/10 text-meraki-gold'
                      }`}>
                      {service.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sirsha Capability Log */}
            <div className="glass rounded-3xl p-8 bg-meraki-violet/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-meraki-gold mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Sirsha Capability Log
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />
                  <p className="text-[10px] text-meraki-white/70 font-medium">Memory Persistence: SQLite Sync Complete</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />
                  <p className="text-[10px] text-meraki-white/70 font-medium">LLM Routing: Dynamic Escalation Active</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full border border-meraki-gold/40 mt-0.5 animate-pulse" />
                  <p className="text-[10px] text-meraki-white/70 font-medium">Knowledge Graph: Mapping Relationships...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
