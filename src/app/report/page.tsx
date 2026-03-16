"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  MapPin,
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
import { supabase, DbReport } from "@/lib/supabase";
import GoogleMap from "@/components/GoogleMap";

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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>("");
  const [locationMode, setLocationMode] = useState<"auto" | "manual" | "map">("auto");
  const [locating, setLocating] = useState(false);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [severity, setSeverity] = useState<"Minor" | "Moderate" | "Major" | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);

  // Live reports from database
  const [reports, setReports] = useState<DbReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch reports from Supabase
  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data && !error) {
        setReports(data);
      }
      setLoadingReports(false);
    }
    fetchReports();

    // Real-time subscription
    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, (payload) => {
        setReports((prev) => [payload.new as DbReport, ...prev].slice(0, 20));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "reports" }, (payload) => {
        setReports((prev) => prev.map((r) => (r.id === (payload.new as DbReport).id ? (payload.new as DbReport) : r)));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Photo handling
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPhotoFile(file);
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
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          // Try reverse geocoding
          try {
            const resp = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
            );
            const data = await resp.json();
            if (data.results?.[0]) {
              setAddress(data.results[0].formatted_address);
            } else {
              setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          } catch {
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
          setLocating(false);
        },
        () => {
          // Fallback to Dallas center
          setCoords({ lat: 32.7767, lng: -96.7970 });
          setAddress("Dallas, TX (approximate)");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setCoords({ lat: 32.7767, lng: -96.7970 });
      setAddress("Dallas, TX (approximate)");
      setLocating(false);
    }
  }, []);

  // Handle pin drop on map
  const handlePinDrop = useCallback(async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await resp.json();
      if (data.results?.[0]) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, []);

  // Submit to Supabase
  const handleSubmit = useCallback(async () => {
    if (!coords || !severity) return;
    setSubmitting(true);

    try {
      let photoUrl: string | null = null;

      // Upload photo if we have one
      if (photoFile) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${photoFile.name.split(".").pop()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("report-photos")
          .upload(fileName, photoFile, { contentType: photoFile.type });

        if (uploadData && !uploadError) {
          const { data: urlData } = supabase.storage.from("report-photos").getPublicUrl(fileName);
          photoUrl = urlData.publicUrl;
        }
      }

      // Insert report
      const { data, error } = await supabase
        .from("reports")
        .insert({
          photo_url: photoUrl,
          latitude: coords.lat,
          longitude: coords.lng,
          address: address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          severity,
          description: description || "",
          status: "Reported",
          neighborhood: "",
        })
        .select()
        .single();

      if (data && !error) {
        setReportId(data.id);
        setSubmitted(true);
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch {
      alert("Failed to submit report. Please try again.");
    }

    setSubmitting(false);
  }, [coords, severity, photoFile, address, description]);

  // Reset form
  const handleNewReport = useCallback(() => {
    setPhoto(null);
    setPhotoFile(null);
    setPhotoName("");
    setAddress("");
    setCoords(null);
    setSeverity(null);
    setDescription("");
    setSubmitted(false);
    setReportId("");
    setLocationMode("auto");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const canSubmit = photo && (address || coords) && severity;

  // Map markers from live reports
  const mapMarkers = reports.map((r) => ({
    id: r.id,
    lat: r.latitude,
    lng: r.longitude,
    severity: r.severity,
    status: r.status,
  }));

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
            <p className="text-lg text-swept-green font-mono mb-1">Report #{reportId.slice(0, 8)}</p>
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
        {/* REPORT FORM */}
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
                      onClick={() => { setPhoto(null); setPhotoFile(null); setPhotoName(""); }}
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
              {(["auto", "map", "manual"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLocationMode(mode)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    locationMode === mode
                      ? "bg-swept-green/15 text-swept-green border border-swept-green/30"
                      : "bg-swept-gray text-gray-400 border border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {mode === "auto" ? "Auto-detect" : mode === "map" ? "Drop Pin" : "Enter Address"}
                </button>
              ))}
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
                  <LocationResult address={address} coords={coords} onClear={() => { setCoords(null); setAddress(""); }} />
                )}
              </>
            ) : locationMode === "map" ? (
              <div className="space-y-3">
                <p className="text-gray-500 text-xs">Tap the map to drop a pin at the trash location.</p>
                <GoogleMap
                  center={{ lat: 32.7767, lng: -96.7970 }}
                  zoom={12}
                  markers={mapMarkers}
                  droppedPin={coords}
                  onPinDrop={handlePinDrop}
                  className="w-full aspect-[4/3]"
                  interactive
                />
                {coords && (
                  <LocationResult address={address} coords={coords} onClear={() => { setCoords(null); setAddress(""); }} />
                )}
              </div>
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
            <span className="ml-auto flex items-center gap-1.5 text-xs text-swept-green">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-swept-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-swept-green" />
              </span>
              Live
            </span>
          </div>

          <GoogleMap
            center={{ lat: 32.7767, lng: -96.7970 }}
            zoom={11}
            markers={mapMarkers}
            className="w-full aspect-[16/10]"
            interactive={false}
          />
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
              {loadingReports ? "Loading..." : `${reports.length} recent`}
            </div>
          </div>

          {loadingReports ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-swept-green animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trash2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No reports yet. Be the first to report!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const statusCfg = STATUS_CONFIG[report.status];
                const StatusIcon = statusCfg.icon;
                const severityCfg = SEVERITY_CONFIG[report.severity];
                const timeAgo = getTimeAgo(report.created_at);
                return (
                  <div
                    key={report.id}
                    className="flex gap-3 p-3 rounded-xl bg-swept-gray/60 border border-gray-800/80 hover:border-gray-700 transition-colors group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-swept-dark flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-800">
                      {report.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={report.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="w-5 h-5 text-gray-700" />
                          <span className="text-[8px] text-gray-700 font-mono">#{report.id.slice(0, 6)}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm truncate">{report.address}</p>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${severityCfg.color} ${severityCfg.text}`}>
                              {report.severity}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">{report.neighborhood || "Dallas, TX"}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors" />
                      </div>

                      {report.description && (
                        <p className="text-gray-400 text-xs mt-1.5 line-clamp-1">{report.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`w-3 h-3 ${statusCfg.textColor}`} />
                          <span className={`text-xs font-medium ${statusCfg.textColor}`}>
                            {report.status === "Swept" ? "Swept \u2713" : report.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <Clock className="w-3 h-3" />
                          {timeAgo}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

function LocationResult({ address, coords, onClear }: { address: string; coords: { lat: number; lng: number }; onClear: () => void }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-swept-green/5 border border-swept-green/20">
      <MapPin className="w-5 h-5 text-swept-green flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">{address}</p>
        <p className="text-gray-500 text-xs mt-0.5 font-mono">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </p>
      </div>
      <button onClick={onClear} className="text-gray-500 hover:text-gray-300 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
