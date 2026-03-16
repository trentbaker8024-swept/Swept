"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Upload,
  X,
  Navigation,
  AlertTriangle,
  Trash2,
  Skull,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  Users,
  ImageIcon,
  Send,
  Loader2,
  Sparkles,
  MapPinned,
  Eye,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data — Dallas-area locations
// ---------------------------------------------------------------------------

interface Report {
  id: number;
  location: string;
  neighborhood: string;
  timestamp: string;
  status: "Reported" | "Assigned" | "In Progress" | "Swept";
  severity: "Minor" | "Moderate" | "Major";
  description: string;
  coords: { lat: number; lng: number };
}

const MOCK_REPORTS: Report[] = [
  {
    id: 4846,
    location: "2700 Main St",
    neighborhood: "Deep Ellum",
    timestamp: "12 min ago",
    status: "Reported",
    severity: "Moderate",
    description: "Pile of trash bags behind the mural wall near the parking lot.",
    coords: { lat: 32.784, lng: -96.783 },
  },
  {
    id: 4845,
    location: "1300 S Beckley Ave",
    neighborhood: "Oak Cliff",
    timestamp: "34 min ago",
    status: "Assigned",
    severity: "Major",
    description: "Illegal dump site near vacant lot. Mattress, tires, and construction debris.",
    coords: { lat: 32.738, lng: -96.826 },
  },
  {
    id: 4844,
    location: "3800 Parry Ave",
    neighborhood: "Fair Park",
    timestamp: "1 hr ago",
    status: "In Progress",
    severity: "Minor",
    description: "Fast food wrappers and cups scattered along the sidewalk.",
    coords: { lat: 32.778, lng: -96.762 },
  },
  {
    id: 4843,
    location: "10200 Harry Hines Blvd",
    neighborhood: "Harry Hines",
    timestamp: "1 hr ago",
    status: "Reported",
    severity: "Moderate",
    description: "Overflowing dumpster with bags spilling onto the sidewalk.",
    coords: { lat: 32.862, lng: -96.871 },
  },
  {
    id: 4842,
    location: "700 N Pearl St",
    neighborhood: "Arts District",
    timestamp: "2 hr ago",
    status: "Swept",
    severity: "Minor",
    description: "Cigarette butts and coffee cups near the bus stop bench.",
    coords: { lat: 32.789, lng: -96.798 },
  },
  {
    id: 4841,
    location: "4500 Columbia Ave",
    neighborhood: "Lakewood",
    timestamp: "2 hr ago",
    status: "In Progress",
    severity: "Moderate",
    description: "Broken glass and litter along the jogging trail by White Rock Creek.",
    coords: { lat: 32.811, lng: -96.742 },
  },
  {
    id: 4840,
    location: "1500 Marilla St",
    neighborhood: "Cedars",
    timestamp: "3 hr ago",
    status: "Assigned",
    severity: "Major",
    description: "Large pile of household furniture and bags dumped behind the warehouse.",
    coords: { lat: 32.771, lng: -96.797 },
  },
  {
    id: 4839,
    location: "8300 Park Ln",
    neighborhood: "Vickery Meadow",
    timestamp: "4 hr ago",
    status: "Swept",
    severity: "Moderate",
    description: "Scattered trash around apartment complex dumpster area.",
    coords: { lat: 32.874, lng: -96.769 },
  },
  {
    id: 4838,
    location: "600 Greenville Ave",
    neighborhood: "Lower Greenville",
    timestamp: "5 hr ago",
    status: "Swept",
    severity: "Minor",
    description: "Beer cans and paper plates left after weekend sidewalk party.",
    coords: { lat: 32.818, lng: -96.771 },
  },
  {
    id: 4837,
    location: "2900 Swiss Ave",
    neighborhood: "East Dallas",
    timestamp: "6 hr ago",
    status: "Reported",
    severity: "Minor",
    description: "Plastic bags caught in tree branches and scattered on median.",
    coords: { lat: 32.787, lng: -96.779 },
  },
];

// ---------------------------------------------------------------------------
// Map pin positions (percentage based, mock layout of Dallas area)
// ---------------------------------------------------------------------------

const MAP_PINS = MOCK_REPORTS.map((r) => ({
  id: r.id,
  // Normalize to 0-100 range for display
  x: ((r.coords.lng + 96.9) / 0.2) * 100,
  y: ((32.9 - r.coords.lat) / 0.2) * 100,
  severity: r.severity,
  status: r.status,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG = {
  Reported: { color: "bg-yellow-500", textColor: "text-yellow-400", icon: Eye },
  Assigned: { color: "bg-blue-500", textColor: "text-blue-400", icon: Users },
  "In Progress": { color: "bg-orange-500", textColor: "text-orange-400", icon: Truck },
  Swept: { color: "bg-swept-green", textColor: "text-swept-green", icon: CheckCircle },
} as const;

const SEVERITY_CONFIG = {
  Minor: { color: "border-yellow-500/50 bg-yellow-500/10", text: "text-yellow-400", label: "Minor", icon: Trash2, desc: "Wrapper, cup, small litter" },
  Moderate: { color: "border-orange-500/50 bg-orange-500/10", text: "text-orange-400", label: "Moderate", icon: AlertTriangle, desc: "Pile of bags, scattered debris" },
  Major: { color: "border-red-500/50 bg-red-500/10", text: "text-red-400", label: "Major", icon: Skull, desc: "Illegal dump site, hazardous" },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReportPage() {
  // Form state
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>("");
  const [locationMode, setLocationMode] = useState<"auto" | "manual">("auto");
  const [locating, setLocating] = useState(false);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [severity, setSeverity] = useState<"Minor" | "Moderate" | "Major" | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Photo handling
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  // Geolocation
  const handleLocate = useCallback(() => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // Mock reverse geocode
          setAddress("2417 Commerce St, Dallas, TX 75201");
          setLocating(false);
        },
        () => {
          // Fallback mock
          setCoords({ lat: 32.782, lng: -96.797 });
          setAddress("2417 Commerce St, Dallas, TX 75201");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setCoords({ lat: 32.782, lng: -96.797 });
      setAddress("2417 Commerce St, Dallas, TX 75201");
      setLocating(false);
    }
  }, []);

  // Submit
  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1800);
  }, []);

  // Reset form
  const handleNewReport = useCallback(() => {
    setPhoto(null);
    setPhotoName("");
    setAddress("");
    setCoords(null);
    setSeverity(null);
    setDescription("");
    setSubmitted(false);
    setLocationMode("auto");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const canSubmit = photo && (address || coords) && severity;

  // -------------------------------------------------------------------------
  // Success screen
  // -------------------------------------------------------------------------
  if (submitted) {
    return (
      <div className="min-h-screen bg-swept-dark flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md mx-auto animate-in">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-swept-green/20 animate-ping" />
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-swept-green/10 border-2 border-swept-green">
                <CheckCircle className="w-12 h-12 text-swept-green" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Report Submitted!</h1>
            <p className="text-lg text-swept-green font-mono mb-1">Report #4,847</p>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We&apos;ll notify you when this spot is <span className="text-swept-green font-semibold">Swept</span>. Our crew coordination system is already matching this to the nearest available team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNewReport}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-swept-green text-black font-bold rounded-xl hover:bg-swept-green/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
                File Another Report
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:border-gray-500 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main page
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-swept-dark">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pb-24">
        {/* ----------------------------------------------------------------- */}
        {/* REPORT FORM                                                        */}
        {/* ----------------------------------------------------------------- */}
        <div ref={formRef} className="pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Report Trash</h1>
          <p className="text-gray-400 text-sm mb-6">
            Snap it, pin it, and our crews will handle the rest.
          </p>
        </div>

        <div className="space-y-6">
          {/* --- Step 1: Photo -------------------------------------------- */}
          <FormSection number={1} title="Take a Photo">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileChange}
            />

            {!photo ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`
                  w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-200
                  flex flex-col items-center justify-center gap-3 cursor-pointer
                  ${dragOver
                    ? "border-swept-green bg-swept-green/10 scale-[1.02]"
                    : "border-gray-700 bg-swept-gray/50 hover:border-gray-500 hover:bg-swept-gray"
                  }
                `}
              >
                <div className="w-16 h-16 rounded-2xl bg-swept-gray flex items-center justify-center">
                  <Camera className="w-8 h-8 text-swept-green" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">Tap to take a photo</p>
                  <p className="text-gray-500 text-sm mt-1">or drag &amp; drop an image here</p>
                </div>
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Report photo" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <ImageIcon className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{photoName}</span>
                    </div>
                    <button
                      onClick={() => { setPhoto(null); setPhotoName(""); }}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </FormSection>

          {/* --- Step 2: Location ----------------------------------------- */}
          <FormSection number={2} title="Where Is It?">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setLocationMode("auto")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  locationMode === "auto"
                    ? "bg-swept-green/15 text-swept-green border border-swept-green/30"
                    : "bg-swept-gray text-gray-400 border border-gray-800 hover:border-gray-600"
                }`}
              >
                Auto-detect
              </button>
              <button
                onClick={() => setLocationMode("manual")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  locationMode === "manual"
                    ? "bg-swept-green/15 text-swept-green border border-swept-green/30"
                    : "bg-swept-gray text-gray-400 border border-gray-800 hover:border-gray-600"
                }`}
              >
                Enter Address
              </button>
            </div>

            {locationMode === "auto" ? (
              <>
                {!coords ? (
                  <button
                    onClick={handleLocate}
                    disabled={locating}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-swept-gray border border-gray-800 hover:border-swept-green/30 transition-all disabled:opacity-60"
                  >
                    {locating ? (
                      <Loader2 className="w-5 h-5 text-swept-green animate-spin" />
                    ) : (
                      <Navigation className="w-5 h-5 text-swept-green" />
                    )}
                    <span className="text-white font-medium">
                      {locating ? "Getting your location..." : "Use My Location"}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-swept-green/5 border border-swept-green/20">
                    <MapPin className="w-5 h-5 text-swept-green flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{address}</p>
                      <p className="text-gray-500 text-xs mt-0.5 font-mono">
                        {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={() => { setCoords(null); setAddress(""); }}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. 2700 Main St, Dallas TX"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (!coords && e.target.value.length > 5) {
                      setCoords({ lat: 32.784, lng: -96.783 });
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-swept-gray border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-swept-green/50 transition-colors"
                />
              </div>
            )}
          </FormSection>

          {/* --- Step 3: Severity ----------------------------------------- */}
          <FormSection number={3} title="How Bad Is It?">
            <div className="grid grid-cols-3 gap-3">
              {(["Minor", "Moderate", "Major"] as const).map((level) => {
                const cfg = SEVERITY_CONFIG[level];
                const Icon = cfg.icon;
                const selected = severity === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                      ${selected
                        ? `${cfg.color} scale-[1.03] shadow-lg`
                        : "border-gray-800 bg-swept-gray/50 hover:border-gray-600"
                      }
                    `}
                  >
                    <Icon className={`w-7 h-7 ${selected ? cfg.text : "text-gray-500"}`} />
                    <span className={`text-sm font-bold ${selected ? cfg.text : "text-gray-400"}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight text-center hidden sm:block">
                      {cfg.desc}
                    </span>
                    {selected && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle className={`w-4 h-4 ${cfg.text}`} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </FormSection>

          {/* --- Step 4: Description -------------------------------------- */}
          <FormSection number={4} title="Anything Else?" optional>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details — what kind of trash, how long it's been here, any hazards..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-swept-gray border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-swept-green/50 transition-colors resize-none text-sm"
            />
          </FormSection>

          {/* --- Submit ---------------------------------------------------- */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`
              w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all duration-300
              ${canSubmit && !submitting
                ? "bg-swept-green text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-[1.01] active:scale-[0.99]"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>

          {!canSubmit && !submitting && (
            <p className="text-center text-gray-600 text-xs -mt-2">
              {!photo && "Photo required. "}
              {!address && !coords && "Location required. "}
              {!severity && "Severity required."}
            </p>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* MAP PREVIEW                                                        */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-4">
            <MapPinned className="w-5 h-5 text-swept-green" />
            <h2 className="text-xl font-bold text-white">Report Map</h2>
          </div>

          <div className="relative w-full aspect-[16/10] rounded-2xl bg-swept-gray border border-gray-800 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-500" style={{ top: `${(i + 1) * 11.1}%` }} />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-500" style={{ left: `${(i + 1) * 7.7}%` }} />
              ))}
            </div>

            {/* Road mockups */}
            <div className="absolute top-[40%] left-0 right-0 h-[2px] bg-gray-700/60" />
            <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-gray-700/60" />
            <div className="absolute left-[30%] top-0 bottom-0 w-[2px] bg-gray-700/60" />
            <div className="absolute left-[55%] top-0 bottom-0 w-[2px] bg-gray-700/60" />
            <div className="absolute left-[75%] top-0 bottom-0 w-[2px] bg-gray-700/60" />

            {/* Area labels */}
            <span className="absolute top-[12%] left-[15%] text-[10px] text-gray-600 font-mono">Harry Hines</span>
            <span className="absolute top-[25%] left-[60%] text-[10px] text-gray-600 font-mono">Vickery Meadow</span>
            <span className="absolute top-[38%] left-[62%] text-[10px] text-gray-600 font-mono">Lakewood</span>
            <span className="absolute top-[50%] left-[22%] text-[10px] text-gray-600 font-mono">Arts District</span>
            <span className="absolute top-[48%] left-[50%] text-[10px] text-gray-600 font-mono">Deep Ellum</span>
            <span className="absolute top-[55%] left-[70%] text-[10px] text-gray-600 font-mono">Fair Park</span>
            <span className="absolute top-[68%] left-[28%] text-[10px] text-gray-600 font-mono">Cedars</span>
            <span className="absolute top-[80%] left-[20%] text-[10px] text-gray-600 font-mono">Oak Cliff</span>
            <span className="absolute top-[42%] left-[38%] text-[10px] text-gray-600 font-mono">Lower Greenville</span>
            <span className="absolute top-[52%] left-[36%] text-[10px] text-gray-600 font-mono">East Dallas</span>

            {/* Pins */}
            {MAP_PINS.map((pin) => {
              const clampX = Math.max(5, Math.min(95, pin.x));
              const clampY = Math.max(5, Math.min(95, pin.y));
              const pinColor =
                pin.status === "Swept"
                  ? "bg-swept-green"
                  : pin.severity === "Major"
                  ? "bg-red-500"
                  : pin.severity === "Moderate"
                  ? "bg-orange-500"
                  : "bg-yellow-500";
              return (
                <div
                  key={pin.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${clampX}%`, top: `${clampY}%` }}
                >
                  {pin.status !== "Swept" && (
                    <div className={`absolute inset-0 w-4 h-4 -m-0.5 rounded-full ${pinColor} opacity-30 animate-ping`} />
                  )}
                  <div className={`relative w-3 h-3 rounded-full ${pinColor} border-2 border-swept-dark shadow-lg cursor-pointer`} />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                    <div className="bg-swept-dark border border-gray-700 rounded-lg px-2 py-1 text-[10px] text-gray-300 whitespace-nowrap shadow-xl">
                      #{pin.id} &middot; {pin.severity}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-3 right-3 bg-swept-dark/90 border border-gray-800 rounded-lg p-2 flex gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Minor</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Major</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-swept-green" /> Swept</span>
            </div>

            {/* Label */}
            <div className="absolute top-3 left-3 bg-swept-dark/80 border border-gray-800 rounded-lg px-2 py-1">
              <span className="text-[10px] text-gray-400 font-mono">DALLAS, TX &mdash; LIVE</span>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* LIVE REPORTS FEED                                                   */}
        {/* ----------------------------------------------------------------- */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-swept-green" />
              <h2 className="text-xl font-bold text-white">Live Reports</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-swept-green">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-swept-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-swept-green" />
              </span>
              {MOCK_REPORTS.length} recent
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_REPORTS.map((report) => {
              const statusCfg = STATUS_CONFIG[report.status];
              const StatusIcon = statusCfg.icon;
              const severityCfg = SEVERITY_CONFIG[report.severity];
              return (
                <div
                  key={report.id}
                  className="flex gap-3 p-3 rounded-xl bg-swept-gray/60 border border-gray-800/80 hover:border-gray-700 transition-colors group cursor-pointer"
                >
                  {/* Thumbnail placeholder */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-swept-dark flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-800">
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="w-5 h-5 text-gray-700" />
                      <span className="text-[8px] text-gray-700 font-mono">#{report.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm truncate">{report.location}</p>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${severityCfg.color} ${severityCfg.text}`}>
                            {report.severity}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">{report.neighborhood}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors" />
                    </div>

                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-1">{report.description}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`w-3 h-3 ${statusCfg.textColor}`} />
                        <span className={`text-xs font-medium ${statusCfg.textColor}`}>
                          {report.status === "Swept" ? "Swept \u2713" : report.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        {report.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-swept-dark/90 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-swept-green rounded-md flex items-center justify-center">
              <span className="text-black font-black text-xs">S</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Swept</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <span className="text-swept-green font-medium">Report</span>
        </nav>
      </div>
    </header>
  );
}

function FormSection({ number, title, optional, children }: { number: number; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-swept-green/15 text-swept-green text-xs font-bold flex items-center justify-center">
          {number}
        </span>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {optional && <span className="text-gray-600 text-xs">(optional)</span>}
      </div>
      {children}
    </div>
  );
}
