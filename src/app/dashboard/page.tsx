"use client";

import { useState } from "react";
import {
  Trash2,
  Users,
  FileCheck,
  ThumbsUp,
  ChevronDown,
  Calendar,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Bell,
  Settings,
  Image,
  BarChart3,
  Shield,
  Zap,
  Award,
  Activity,
} from "lucide-react";

/* ─── Mock Data ─── */

const reportRows = [
  { id: "RPT-4821", location: "Main St & Elm Ave", severity: "High", status: "Resolved", crew: "Alpha-7", reported: "Mar 15, 8:12 AM", resolved: "Mar 15, 11:45 AM" },
  { id: "RPT-4820", location: "Commerce St Bridge", severity: "Critical", status: "In Progress", crew: "Bravo-3", reported: "Mar 15, 7:30 AM", resolved: "—" },
  { id: "RPT-4819", location: "Deep Ellum Alley #4", severity: "Medium", status: "Resolved", crew: "Delta-1", reported: "Mar 14, 6:22 PM", resolved: "Mar 14, 9:10 PM" },
  { id: "RPT-4818", location: "Oak Cliff Park", severity: "Low", status: "Resolved", crew: "Echo-5", reported: "Mar 14, 3:15 PM", resolved: "Mar 14, 4:50 PM" },
  { id: "RPT-4817", location: "Bishop Arts District", severity: "High", status: "Assigned", crew: "Alpha-7", reported: "Mar 14, 1:00 PM", resolved: "—" },
  { id: "RPT-4816", location: "Greenville Ave", severity: "Medium", status: "Resolved", crew: "Charlie-2", reported: "Mar 14, 11:30 AM", resolved: "Mar 14, 2:15 PM" },
  { id: "RPT-4815", location: "Trinity River Trail", severity: "Critical", status: "Resolved", crew: "Bravo-3", reported: "Mar 14, 9:00 AM", resolved: "Mar 14, 1:30 PM" },
  { id: "RPT-4814", location: "Uptown McKinney Ave", severity: "Low", status: "Resolved", crew: "Foxtrot-9", reported: "Mar 13, 4:45 PM", resolved: "Mar 13, 5:30 PM" },
  { id: "RPT-4813", location: "Fair Park East Lot", severity: "High", status: "In Progress", crew: "Delta-1", reported: "Mar 13, 2:20 PM", resolved: "—" },
  { id: "RPT-4812", location: "Cedars District", severity: "Medium", status: "Resolved", crew: "Echo-5", reported: "Mar 13, 10:15 AM", resolved: "Mar 13, 1:00 PM" },
];

const crewData = [
  { rank: 1, name: "Alpha-7", lead: "Marcus Johnson", completed: 342, avgTime: "2.1 hrs", rating: 4.9 },
  { rank: 2, name: "Bravo-3", lead: "Sarah Chen", completed: 318, avgTime: "2.4 hrs", rating: 4.8 },
  { rank: 3, name: "Charlie-2", lead: "David Okafor", completed: 291, avgTime: "2.6 hrs", rating: 4.7 },
  { rank: 4, name: "Delta-1", lead: "Maria Santos", completed: 275, avgTime: "2.8 hrs", rating: 4.6 },
  { rank: 5, name: "Echo-5", lead: "James Wright", completed: 264, avgTime: "3.0 hrs", rating: 4.5 },
  { rank: 6, name: "Foxtrot-9", lead: "Aisha Patel", completed: 248, avgTime: "3.2 hrs", rating: 4.4 },
];

const galleryItems = [
  { location: "Main St & Elm", date: "Mar 12, 2026", zone: "Downtown" },
  { location: "Deep Ellum Alley", date: "Mar 11, 2026", zone: "Deep Ellum" },
  { location: "Trinity Riverbank", date: "Mar 10, 2026", zone: "Trinity" },
  { location: "Oak Cliff Lot", date: "Mar 9, 2026", zone: "Oak Cliff" },
  { location: "Fair Park Gate", date: "Mar 8, 2026", zone: "Fair Park" },
  { location: "Bishop Arts Wall", date: "Mar 7, 2026", zone: "Bishop Arts" },
];

const zones = [
  { name: "Zone A: Downtown", status: "clean", x: "42%", y: "30%", size: "lg" },
  { name: "Zone B: Deep Ellum", status: "progress", x: "62%", y: "25%", size: "md" },
  { name: "Zone C: Oak Cliff", status: "attention", x: "30%", y: "60%", size: "lg" },
  { name: "Zone D: Uptown", status: "clean", x: "45%", y: "15%", size: "md" },
  { name: "Zone E: Bishop Arts", status: "clean", x: "25%", y: "45%", size: "sm" },
  { name: "Zone F: Fair Park", status: "progress", x: "70%", y: "45%", size: "md" },
  { name: "Zone G: Trinity River", status: "clean", x: "38%", y: "48%", size: "sm" },
  { name: "Zone H: Cedars", status: "attention", x: "50%", y: "52%", size: "sm" },
];

/* ─── Sparkline Component ─── */

function Sparkline({ trend, color }: { trend: "up" | "down" | "flat"; color: string }) {
  const paths: Record<string, string> = {
    up: "M0,28 L8,24 L16,26 L24,20 L32,22 L40,16 L48,18 L56,10 L64,12 L72,6 L80,4",
    down: "M0,6 L8,8 L16,10 L24,14 L32,12 L40,18 L48,20 L56,24 L64,22 L72,26 L80,28",
    flat: "M0,16 L8,14 L16,18 L24,15 L32,17 L40,14 L48,16 L56,15 L64,17 L72,14 L80,16",
  };
  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none" className="opacity-60">
      <path d={paths[trend]} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Severity Badge ─── */

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    Critical: "bg-red-500/20 text-red-400 border-red-500/30",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[severity] ?? ""}`}>
      {severity}
    </span>
  );
}

/* ─── Status Badge ─── */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Resolved: "bg-swept-green/15 text-swept-green border-swept-green/30",
    "In Progress": "bg-swept-orange/15 text-swept-orange border-swept-orange/30",
    Assigned: "bg-swept-lime/15 text-swept-lime border-swept-lime/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

/* ─── Zone Dot ─── */

function ZoneDot({ zone }: { zone: typeof zones[number] }) {
  const colorMap: Record<string, string> = {
    clean: "bg-swept-green",
    progress: "bg-yellow-400",
    attention: "bg-red-500",
  };
  const pulseMap: Record<string, string> = {
    clean: "",
    progress: "animate-pulse",
    attention: "animate-pulse",
  };
  const sizeMap: Record<string, string> = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  return (
    <div
      className="absolute group cursor-pointer"
      style={{ left: zone.x, top: zone.y, transform: "translate(-50%, -50%)" }}
    >
      <div className={`${sizeMap[zone.size]} ${colorMap[zone.status]} ${pulseMap[zone.status]} rounded-full shadow-lg`} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-swept-gray border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap shadow-xl">
          {zone.name}
          <span className={`ml-2 inline-block w-2 h-2 rounded-full ${colorMap[zone.status]}`} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MAIN DASHBOARD ═══════════════════ */

export default function DashboardPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  const filteredReports = reportRows.filter((r) => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (severityFilter !== "All" && r.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-swept-dark text-white">
      {/* ───────── TOP BAR ───────── */}
      <header className="sticky top-0 z-50 bg-swept-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 py-3">
          {/* Logo + Label */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-swept-green flex items-center justify-center">
                <Zap className="w-5 h-5 text-swept-dark" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-swept-green">Swept</span>
              </span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-sm text-white/50 font-medium tracking-wide uppercase">City Dashboard</span>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-3">
            {/* City Selector */}
            <button className="flex items-center gap-2 bg-swept-gray border border-white/10 rounded-lg px-4 py-2 text-sm hover:border-white/20 transition-colors">
              <MapPin className="w-4 h-4 text-swept-green" />
              <span className="font-medium">Dallas, TX</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </button>

            {/* Date Range */}
            <button className="flex items-center gap-2 bg-swept-gray border border-white/10 rounded-lg px-4 py-2 text-sm hover:border-white/20 transition-colors">
              <Calendar className="w-4 h-4 text-white/50" />
              <span>Mar 1 – Mar 15, 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-white/50" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-swept-orange rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5 text-white/50" />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">Mayor&apos;s Office</div>
                <div className="text-xs text-white/40">City of Dallas</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-swept-green to-swept-lime flex items-center justify-center text-swept-dark font-bold text-sm">
                MO
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* ───────── KEY METRICS ROW ───────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Tons Removed */}
          <div className="bg-swept-gray border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-swept-green/10 border border-swept-green/20">
                <Trash2 className="w-5 h-5 text-swept-green" />
              </div>
              <div className="flex items-center gap-1 text-swept-green text-xs font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +12%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">47.2</div>
              <div className="text-sm text-white/40 mt-0.5">Tons Removed</div>
              <div className="text-xs text-white/30 mt-1">vs 42.1 last month</div>
            </div>
            <div className="mt-3">
              <Sparkline trend="up" color="#39FF14" />
            </div>
          </div>

          {/* Active Workers */}
          <div className="bg-swept-gray border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-blue-400 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5" />
                24 crews
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">186</div>
              <div className="text-sm text-white/40 mt-0.5">Active Workers</div>
              <div className="text-xs text-white/30 mt-1">Across 12 zones today</div>
            </div>
            <div className="mt-3">
              <Sparkline trend="flat" color="#60A5FA" />
            </div>
          </div>

          {/* Reports Resolved */}
          <div className="bg-swept-gray border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-swept-orange/10 border border-swept-orange/20">
                <FileCheck className="w-5 h-5 text-swept-orange" />
              </div>
              <div className="flex items-center gap-1 text-swept-orange text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                4.2 hr avg
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">12,847</div>
              <div className="text-sm text-white/40 mt-0.5">Reports Resolved</div>
              <div className="text-xs text-white/30 mt-1">Avg response: 4.2 hours</div>
            </div>
            <div className="mt-3">
              <Sparkline trend="up" color="#FF6B00" />
            </div>
          </div>

          {/* Citizen Satisfaction */}
          <div className="bg-swept-gray border border-white/5 rounded-2xl p-5 card-hover">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl bg-swept-lime/10 border border-swept-lime/20">
                <ThumbsUp className="w-5 h-5 text-swept-lime" />
              </div>
              <div className="flex items-center gap-1 text-swept-lime text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                +3.2%
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold tracking-tight">94%</div>
              <div className="text-sm text-white/40 mt-0.5">Citizen Satisfaction</div>
              <div className="text-xs text-white/30 mt-1">Based on 2,341 surveys</div>
            </div>
            <div className="mt-3">
              <Sparkline trend="up" color="#CCFF00" />
            </div>
          </div>
        </section>

        {/* ───────── ACTIVITY MAP ───────── */}
        <section className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-semibold">Activity Map</h2>
              <p className="text-sm text-white/40 mt-0.5">Real-time zone status across Dallas</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-swept-green" />
                <span className="text-white/50">Clean</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="text-white/50">In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-white/50">Needs Attention</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] bg-[#0d1117] overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            {/* Radial glow behind city center */}
            <div className="absolute left-[42%] top-[35%] w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-swept-green/5 rounded-full blur-3xl" />
            {/* Road-like lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" />
              <line x1="42%" y1="0" x2="42%" y2="100%" stroke="white" strokeWidth="1" />
              <line x1="10%" y1="20%" x2="80%" y2="70%" stroke="white" strokeWidth="0.5" />
              <line x1="20%" y1="80%" x2="75%" y2="15%" stroke="white" strokeWidth="0.5" />
              <line x1="5%" y1="35%" x2="95%" y2="35%" stroke="white" strokeWidth="0.5" />
              <line x1="55%" y1="5%" x2="55%" y2="95%" stroke="white" strokeWidth="0.5" />
              {/* Trinity River curve */}
              <path d="M 15% 10% Q 35% 50%, 25% 90%" fill="none" stroke="#39FF14" strokeWidth="1" opacity="0.3" />
            </svg>
            {/* Zone dots */}
            {zones.map((z) => (
              <ZoneDot key={z.name} zone={z} />
            ))}
            {/* Zone labels */}
            {zones.map((z) => (
              <div
                key={`label-${z.name}`}
                className="absolute text-[10px] text-white/25 font-medium pointer-events-none"
                style={{ left: z.x, top: z.y, transform: "translate(-50%, 14px)" }}
              >
                {z.name.split(": ")[1]}
              </div>
            ))}
          </div>
        </section>

        {/* ───────── REPORTS QUEUE ───────── */}
        <section className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-semibold">Reports Queue</h2>
              <p className="text-sm text-white/40 mt-0.5">Citizen-reported cleanup requests</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-swept-dark/60 border border-white/5 rounded-lg px-3 py-1.5">
                <Filter className="w-3.5 h-3.5 text-white/30" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-sm text-white/70 outline-none cursor-pointer"
                >
                  <option value="All" className="bg-swept-gray">All Status</option>
                  <option value="Resolved" className="bg-swept-gray">Resolved</option>
                  <option value="In Progress" className="bg-swept-gray">In Progress</option>
                  <option value="Assigned" className="bg-swept-gray">Assigned</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-swept-dark/60 border border-white/5 rounded-lg px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 text-white/30" />
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="bg-transparent text-sm text-white/70 outline-none cursor-pointer"
                >
                  <option value="All" className="bg-swept-gray">All Severity</option>
                  <option value="Critical" className="bg-swept-gray">Critical</option>
                  <option value="High" className="bg-swept-gray">High</option>
                  <option value="Medium" className="bg-swept-gray">Medium</option>
                  <option value="Low" className="bg-swept-gray">Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">Location</th>
                  <th className="text-left px-4 py-3 font-medium">Severity</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Crew</th>
                  <th className="text-left px-4 py-3 font-medium">Reported</th>
                  <th className="text-left px-4 py-3 font-medium">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-mono text-swept-green text-xs">{r.id}</td>
                    <td className="px-4 py-3 text-white/80">{r.location}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={r.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-white/60 font-mono text-xs">{r.crew}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">{r.reported}</td>
                    <td className="px-4 py-3 text-white/40 text-xs">{r.resolved}</td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/30">
                      No reports match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ───────── CREW PERFORMANCE + BEFORE/AFTER SPLIT ───────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Crew Performance */}
          <section className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-swept-lime" />
                Crew Leaderboard
              </h2>
              <p className="text-sm text-white/40 mt-0.5">Top performing crews this month</p>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {crewData.map((crew) => (
                <div key={crew.name} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    crew.rank === 1 ? "bg-swept-green/20 text-swept-green" :
                    crew.rank === 2 ? "bg-swept-lime/20 text-swept-lime" :
                    crew.rank === 3 ? "bg-swept-orange/20 text-swept-orange" :
                    "bg-white/5 text-white/30"
                  }`}>
                    {crew.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{crew.name}</div>
                    <div className="text-xs text-white/40">{crew.lead}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white/90">{crew.completed}</div>
                    <div className="text-xs text-white/30">completed</div>
                  </div>
                  <div className="text-right w-16">
                    <div className="text-sm text-white/70">{crew.avgTime}</div>
                    <div className="text-xs text-white/30">avg</div>
                  </div>
                  <div className="flex items-center gap-1 w-14 justify-end">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-yellow-400 font-medium">{crew.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Before/After Gallery */}
          <section className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Image className="w-5 h-5 text-swept-orange" />
                Before / After Gallery
              </h2>
              <p className="text-sm text-white/40 mt-0.5">Visual proof of cleanup impact</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              {galleryItems.map((item) => (
                <div key={item.location} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden border border-white/5">
                    {/* Before */}
                    <div className="h-20 bg-gradient-to-br from-red-900/40 to-orange-900/30 flex items-center justify-center border-b border-white/5">
                      <span className="text-[10px] text-red-300/60 uppercase tracking-widest font-semibold">Before</span>
                    </div>
                    {/* After */}
                    <div className="h-20 bg-gradient-to-br from-swept-green/10 to-emerald-900/20 flex items-center justify-center">
                      <span className="text-[10px] text-swept-green/60 uppercase tracking-widest font-semibold">After</span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-swept-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Search className="w-5 h-5 text-white/50" />
                    </div>
                  </div>
                  <div className="mt-1.5 px-0.5">
                    <div className="text-xs text-white/60 font-medium truncate">{item.location}</div>
                    <div className="text-[10px] text-white/30">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ───────── FINANCIAL SUMMARY ───────── */}
        <section className="bg-swept-gray border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-swept-green" />
                Financial Summary
              </h2>
              <p className="text-sm text-white/40 mt-0.5">March 2026 operational costs</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-swept-green/10 border border-swept-green/20 rounded-xl px-4 py-2 text-center">
                <div className="text-xs text-swept-green/70 uppercase tracking-wider font-medium">Cost per Ton</div>
                <div className="text-xl font-bold text-swept-green mt-0.5">$3,178</div>
              </div>
              <div className="bg-swept-green/10 border border-swept-green/20 rounded-xl px-4 py-2 text-center">
                <div className="text-xs text-swept-green/70 uppercase tracking-wider font-medium">Savings vs Prior</div>
                <div className="text-xl font-bold text-swept-green mt-0.5 flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  34%
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-right px-6 py-3 font-medium">Swept Cost</th>
                  <th className="text-right px-6 py-3 font-medium">Prior Contract</th>
                  <th className="text-right px-6 py-3 font-medium">Savings</th>
                  <th className="text-left px-6 py-3 font-medium w-48">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cat: "Labor", swept: 84200, prior: 126000, pct: 56 },
                  { cat: "Equipment & Supplies", swept: 28400, prior: 41500, pct: 19 },
                  { cat: "Fuel & Transport", swept: 18900, prior: 32100, pct: 13 },
                  { cat: "Technology & Platform", swept: 12500, prior: 0, pct: 8 },
                  { cat: "Admin & Overhead", swept: 6000, prior: 28400, pct: 4 },
                ].map((row) => (
                  <tr key={row.cat} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 text-white/80 font-medium">{row.cat}</td>
                    <td className="px-6 py-3 text-right font-mono text-white/80">
                      ${row.swept.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-white/40">
                      {row.prior > 0 ? `$${row.prior.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {row.prior > 0 ? (
                        <span className="text-swept-green font-semibold">
                          -${(row.prior - row.swept).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-swept-green/40"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/30 w-8 text-right">{row.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Totals */}
                <tr className="bg-white/[0.02]">
                  <td className="px-6 py-3 font-bold text-white">Total</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-white">$150,000</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-white/50">$228,000</td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-swept-green font-bold text-base">-$78,000</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs text-white/30">100%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ───────── EXPORT / REPORT BUTTONS ───────── */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-swept-gray border border-white/5 rounded-2xl px-6 py-5">
          <div>
            <h3 className="font-semibold">Ready to share with stakeholders?</h3>
            <p className="text-sm text-white/40 mt-0.5">Generate a comprehensive report of this month&apos;s operations and impact.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-swept-dark border border-white/10 rounded-xl px-5 py-2.5 text-sm font-medium hover:border-white/20 transition-colors">
              <Download className="w-4 h-4 text-white/50" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 bg-swept-green text-swept-dark rounded-xl px-5 py-2.5 text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-swept-green/20">
              <FileText className="w-4 h-4" />
              Generate Monthly Report
            </button>
          </div>
        </section>

        {/* Footer spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}
