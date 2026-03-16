"use client";

import {
  Shield,
  MapPin,
  Clock,
  Sun,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Coffee,
  Navigation,
  Camera,
  ChevronDown,
  Radio,
  Zap,
  ClipboardList,
  ArrowRight,
  UserCheck,
  Timer,
  CircleDot,
} from "lucide-react";
import { useState } from "react";

// --- Data ---

const crews = [
  {
    name: "Alpha",
    lead: "DeShawn Carter",
    size: 5,
    status: "On Site" as const,
    location: "Deep Ellum — Elm St & Good Latimer",
    checkIn: "7:02 AM",
    completed: 4,
    assigned: 7,
  },
  {
    name: "Bravo",
    lead: "Maria Gonzalez",
    size: 6,
    status: "On Site" as const,
    location: "Cedars — S Lamar & Belleview",
    checkIn: "6:58 AM",
    completed: 5,
    assigned: 6,
  },
  {
    name: "Charlie",
    lead: "James Washington",
    size: 4,
    status: "In Transit" as const,
    location: "En route — Oak Cliff, Jefferson Blvd",
    checkIn: "7:15 AM",
    completed: 3,
    assigned: 5,
  },
  {
    name: "Delta",
    lead: "Tanya Brooks",
    size: 5,
    status: "On Break" as const,
    location: "Fair Park — Parry Ave staging area",
    checkIn: "6:45 AM",
    completed: 6,
    assigned: 8,
  },
  {
    name: "Echo",
    lead: "Robert Kim",
    size: 4,
    status: "On Site" as const,
    location: "Uptown — McKinney Ave & Cole",
    checkIn: "7:10 AM",
    completed: 2,
    assigned: 4,
  },
  {
    name: "Foxtrot",
    lead: "Angela Davis",
    size: 6,
    status: "Completed" as const,
    location: "Downtown — Main St Plaza (done)",
    checkIn: "5:30 AM",
    completed: 5,
    assigned: 5,
  },
];

const assignmentQueue = [
  { id: "RPT-1041", location: "2100 Commerce St — illegal dumping behind lot", severity: "High", time: "8:12 AM" },
  { id: "RPT-1042", location: "Elm St & Crowdus — mattress + debris in alley", severity: "High", time: "8:34 AM" },
  { id: "RPT-1043", location: "S Harwood & Canton — overflowing dumpster area", severity: "Medium", time: "8:47 AM" },
  { id: "RPT-1044", location: "Ervay St underpass — tent site cleared, trash remains", severity: "High", time: "9:01 AM" },
  { id: "RPT-1045", location: "Peak St & Live Oak — broken glass + litter along sidewalk", severity: "Low", time: "9:15 AM" },
  { id: "RPT-1046", location: "Pacific Ave & Akard — graffiti + loose trash near bus stop", severity: "Medium", time: "9:22 AM" },
  { id: "RPT-1047", location: "S Good Latimer & Main — construction debris on curb", severity: "Medium", time: "9:38 AM" },
  { id: "RPT-1048", location: "Ross Ave & Pearl — food waste + bags near restaurant row", severity: "Low", time: "9:51 AM" },
];

const completedJobs = [
  {
    id: "RPT-1033",
    location: "Main St Plaza — north fountain area",
    crew: "Foxtrot",
    timeTaken: "42 min",
    beforeStatus: "Heavy debris + bottles",
    afterStatus: "Cleared, swept, bagged (6 bags)",
    photos: 8,
  },
  {
    id: "RPT-1029",
    location: "Deep Ellum — Malcolm X & Commerce",
    crew: "Alpha",
    timeTaken: "28 min",
    beforeStatus: "Scattered litter + broken furniture",
    afterStatus: "Cleared to sidewalk, furniture hauled",
    photos: 5,
  },
  {
    id: "RPT-1031",
    location: "Cedars — drainage ditch at Lamar",
    crew: "Bravo",
    timeTaken: "55 min",
    beforeStatus: "Clogged drain, standing water + trash",
    afterStatus: "Drain cleared, debris removed (4 bags)",
    photos: 12,
  },
  {
    id: "RPT-1027",
    location: "Fair Park — Parry Ave median",
    crew: "Delta",
    timeTaken: "35 min",
    beforeStatus: "Overgrown weeds, fast food waste",
    afterStatus: "Trimmed, bagged, median restored",
    photos: 6,
  },
  {
    id: "RPT-1025",
    location: "Downtown — Thanksgiving Tower alley",
    crew: "Foxtrot",
    timeTaken: "22 min",
    beforeStatus: "Cardboard stacks + general litter",
    afterStatus: "All removed, alley pressure-washed",
    photos: 4,
  },
];

const workers = [
  { name: "DeShawn Carter", crew: "Alpha", checkIn: "6:58 AM", checkOut: "—", hours: "4.1", status: "Active" },
  { name: "Marcus Williams", crew: "Alpha", checkIn: "7:02 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Tyrone Bell", crew: "Alpha", checkIn: "7:00 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Andre Mitchell", crew: "Alpha", checkIn: "7:05 AM", checkOut: "—", hours: "3.9", status: "Active" },
  { name: "Jamal Foster", crew: "Alpha", checkIn: "7:01 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Maria Gonzalez", crew: "Bravo", checkIn: "6:55 AM", checkOut: "—", hours: "4.1", status: "Active" },
  { name: "Carlos Reyes", crew: "Bravo", checkIn: "6:58 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Sofia Hernandez", crew: "Bravo", checkIn: "6:57 AM", checkOut: "—", hours: "4.1", status: "Active" },
  { name: "Luis Morales", crew: "Bravo", checkIn: "7:02 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Rosa Delgado", crew: "Bravo", checkIn: "6:59 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "Elena Vargas", crew: "Bravo", checkIn: "7:00 AM", checkOut: "—", hours: "4.0", status: "Active" },
  { name: "James Washington", crew: "Charlie", checkIn: "7:12 AM", checkOut: "—", hours: "3.8", status: "In Transit" },
  { name: "Kevin Thomas", crew: "Charlie", checkIn: "7:15 AM", checkOut: "—", hours: "3.8", status: "In Transit" },
  { name: "Brian Jackson", crew: "Charlie", checkIn: "7:14 AM", checkOut: "—", hours: "3.8", status: "In Transit" },
  { name: "Darryl Moore", crew: "Charlie", checkIn: "7:16 AM", checkOut: "—", hours: "3.7", status: "In Transit" },
  { name: "Tanya Brooks", crew: "Delta", checkIn: "6:42 AM", checkOut: "—", hours: "4.3", status: "On Break" },
  { name: "Keisha Brown", crew: "Delta", checkIn: "6:45 AM", checkOut: "—", hours: "4.3", status: "On Break" },
  { name: "Angela Davis", crew: "Foxtrot", checkIn: "5:28 AM", checkOut: "10:45 AM", hours: "5.3", status: "Completed" },
  { name: "Patricia Young", crew: "Foxtrot", checkIn: "5:30 AM", checkOut: "10:42 AM", hours: "5.2", status: "Completed" },
  { name: "Robert Kim", crew: "Echo", checkIn: "7:08 AM", checkOut: "—", hours: "3.9", status: "Active" },
];

// --- Helpers ---

const statusColor = (status: string) => {
  switch (status) {
    case "On Site":
    case "Active":
      return "bg-swept-green";
    case "In Transit":
      return "bg-blue-400";
    case "On Break":
      return "bg-yellow-400";
    case "Completed":
      return "bg-zinc-500";
    default:
      return "bg-zinc-600";
  }
};

const statusTextColor = (status: string) => {
  switch (status) {
    case "On Site":
    case "Active":
      return "text-swept-green";
    case "In Transit":
      return "text-blue-400";
    case "On Break":
      return "text-yellow-400";
    case "Completed":
      return "text-zinc-400";
    default:
      return "text-zinc-500";
  }
};

const severityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    case "Medium":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    case "Low":
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    default:
      return "text-zinc-500";
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "On Site":
      return <MapPin className="w-4 h-4" />;
    case "In Transit":
      return <Truck className="w-4 h-4" />;
    case "On Break":
      return <Coffee className="w-4 h-4" />;
    case "Completed":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <CircleDot className="w-4 h-4" />;
  }
};

// --- Components ---

function Header() {
  return (
    <header className="border-b border-zinc-800 bg-swept-gray/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-swept-green" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-swept-green glow">Swept</span>
            </span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-zinc-700" />
          <div className="hidden sm:flex items-center gap-2">
            <Radio className="w-4 h-4 text-swept-green animate-pulse" />
            <span className="text-sm font-semibold text-zinc-300">Crew Operations</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-zinc-200">Marcus Johnson</p>
            <p className="text-xs text-zinc-500">Zone PM — Downtown Dallas</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-swept-green/20 border border-swept-green/40 flex items-center justify-center">
            <span className="text-sm font-bold text-swept-green">MJ</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function TodayOverview() {
  const stats = [
    { label: "Crews Active", value: "6", icon: Users, accent: true },
    { label: "Reports in Queue", value: "23", icon: FileText, accent: false },
    { label: "Est. Completion", value: "4:30 PM", icon: Timer, accent: false },
  ];

  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Today&apos;s Overview</h2>
          <p className="text-sm text-zinc-500">Sunday, March 16, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-800/60 rounded-lg px-3 py-1.5">
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-zinc-300">82&deg;F &middot; Sunny</span>
          <span className="text-xs text-zinc-600 ml-1">Dallas, TX</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-lg px-4 py-3 ${
              s.accent
                ? "bg-swept-green/10 border border-swept-green/20"
                : "bg-zinc-800/60 border border-zinc-700/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.accent ? "text-swept-green" : "text-zinc-500"}`} />
              <span className="text-xs text-zinc-500 uppercase tracking-wide">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold ${s.accent ? "text-swept-green" : "text-zinc-100"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrewCard({ crew }: { crew: (typeof crews)[0] }) {
  const pct = Math.round((crew.completed / crew.assigned) * 100);

  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-zinc-100">Crew {crew.name}</h3>
            <span
              className={`w-2 h-2 rounded-full ${statusColor(crew.status)} ${
                crew.status === "On Site" ? "pulse-green" : ""
              }`}
            />
          </div>
          <p className="text-sm text-zinc-500">{crew.lead} &middot; {crew.size} workers</p>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            crew.status === "On Site"
              ? "text-swept-green bg-swept-green/10 border-swept-green/20"
              : crew.status === "In Transit"
              ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
              : crew.status === "On Break"
              ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
              : "text-zinc-400 bg-zinc-700/50 border-zinc-600/50"
          }`}
        >
          {statusIcon(crew.status)}
          {crew.status}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3">
        <Navigation className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-snug">{crew.location}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
        <Clock className="w-3.5 h-3.5" />
        GPS check-in: {crew.checkIn}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-zinc-500">
            Progress: {crew.completed}/{crew.assigned} reports
          </span>
          <span className={`font-medium ${pct === 100 ? "text-swept-green" : "text-zinc-400"}`}>
            {pct}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct === 100 ? "bg-swept-green" : "bg-swept-green/70"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ActiveCrews() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-zinc-100">Active Crews</h2>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">
          6 deployed
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {crews.map((c) => (
          <CrewCard key={c.name} crew={c} />
        ))}
      </div>
    </div>
  );
}

function AssignmentQueue() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-swept-orange" />
          <h2 className="text-lg font-bold text-zinc-100">Assignment Queue</h2>
        </div>
        <span className="text-xs text-swept-orange font-medium bg-swept-orange/10 px-2.5 py-1 rounded-full border border-swept-orange/20">
          {assignmentQueue.length} pending
        </span>
      </div>
      <div className="space-y-2">
        {assignmentQueue.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-zinc-600">{item.id}</span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${severityColor(
                    item.severity
                  )}`}
                >
                  {item.severity}
                </span>
              </div>
              <p className="text-sm text-zinc-300 truncate">{item.location}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-zinc-600">{item.time}</span>
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.id ? null : item.id)
                  }
                  className="flex items-center gap-1 text-xs font-medium text-swept-green bg-swept-green/10 hover:bg-swept-green/20 border border-swept-green/20 rounded-lg px-3 py-1.5 transition-colors"
                >
                  Assign
                  <ChevronDown className="w-3 h-3" />
                </button>
                {openDropdown === item.id && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-30 py-1">
                    {crews
                      .filter((c) => c.status !== "Completed")
                      .map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setOpenDropdown(null)}
                          className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/60 hover:text-white flex items-center justify-between"
                        >
                          <span>Crew {c.name}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColor(c.status)}`} />
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedJobs() {
  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-swept-green" />
          <h2 className="text-lg font-bold text-zinc-100">Today&apos;s Completed Jobs</h2>
        </div>
        <span className="text-xs text-swept-green font-medium bg-swept-green/10 px-2.5 py-1 rounded-full border border-swept-green/20">
          {completedJobs.length} done
        </span>
      </div>
      <div className="space-y-3">
        {completedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg px-4 py-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-zinc-600">{job.id}</span>
                  <span className="text-xs text-zinc-500">&middot;</span>
                  <span className="text-xs text-zinc-500">Crew {job.crew}</span>
                  <span className="text-xs text-zinc-500">&middot;</span>
                  <span className="text-xs text-zinc-500">{job.timeTaken}</span>
                </div>
                <p className="text-sm text-zinc-300">{job.location}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-700/40 rounded-full px-2.5 py-1 shrink-0">
                <Camera className="w-3 h-3" />
                {job.photos} photos
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-red-500/5 border border-red-500/10 rounded-md px-3 py-2">
                <span className="text-red-400/70 font-medium uppercase tracking-wide text-[10px]">
                  Before
                </span>
                <p className="text-zinc-400 mt-0.5">{job.beforeStatus}</p>
              </div>
              <div className="bg-swept-green/5 border border-swept-green/10 rounded-md px-3 py-2">
                <span className="text-swept-green/70 font-medium uppercase tracking-wide text-[10px]">
                  After
                </span>
                <p className="text-zinc-400 mt-0.5">{job.afterStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkerCheckInLog() {
  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-swept-green" />
          <h2 className="text-lg font-bold text-zinc-100">Worker Check-in Log</h2>
        </div>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">
          {workers.length} workers today
        </span>
      </div>
      <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Worker
              </th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Crew
              </th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="text-left py-2 pr-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="text-left py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w, i) => (
              <tr
                key={i}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="py-2.5 pr-4 text-zinc-300 font-medium">{w.name}</td>
                <td className="py-2.5 pr-4 text-zinc-500">{w.crew}</td>
                <td className="py-2.5 pr-4 text-zinc-400 font-mono text-xs">{w.checkIn}</td>
                <td className="py-2.5 pr-4 text-zinc-400 font-mono text-xs">{w.checkOut}</td>
                <td className="py-2.5 pr-4 text-zinc-400 font-mono text-xs">{w.hours}h</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor(w.status)}`} />
                    <span className={`text-xs font-medium ${statusTextColor(w.status)}`}>
                      {w.status}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      label: "Dispatch New Crew",
      icon: Truck,
      color: "text-swept-green border-swept-green/30 bg-swept-green/10 hover:bg-swept-green/20",
    },
    {
      label: "Emergency Redirect",
      icon: AlertTriangle,
      color: "text-red-400 border-red-400/30 bg-red-400/10 hover:bg-red-400/20",
    },
    {
      label: "End of Day Report",
      icon: FileText,
      color: "text-zinc-300 border-zinc-600 bg-zinc-800 hover:bg-zinc-700",
    },
  ];

  return (
    <div className="bg-swept-gray border border-zinc-800 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-swept-green" />
        <h2 className="text-lg font-bold text-zinc-100">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${a.color}`}
          >
            <a.icon className="w-4 h-4" />
            {a.label}
            <ArrowRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Page ---

export default function CrewPage() {
  return (
    <div className="min-h-screen bg-swept-dark">
      <Header />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <TodayOverview />
        <ActiveCrews />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AssignmentQueue />
          <CompletedJobs />
        </div>
        <WorkerCheckInLog />
        <QuickActions />
        <footer className="text-center py-6 text-xs text-zinc-700">
          Swept Crew Operations &middot; Zone: Downtown Dallas &middot; Live Dashboard
        </footer>
      </main>
    </div>
  );
}
