"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { loadMapsLibrary, loadMarkerLibrary } from "@/lib/google-maps";

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    severity?: string;
    status?: string;
  }>;
  droppedPin?: { lat: number; lng: number } | null;
  onPinDrop?: (lat: number, lng: number) => void;
  className?: string;
  interactive?: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  Minor: "#EAB308",
  Moderate: "#F97316",
  Major: "#EF4444",
};

const STATUS_COLORS: Record<string, string> = {
  Reported: "#EAB308",
  Assigned: "#3B82F6",
  "In Progress": "#F97316",
  Swept: "#39FF14",
};

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#555555" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050505" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#111111" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#222222" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1f1f1f" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#292929" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#0d0d0d" }] },
];

export default function GoogleMap({
  center = { lat: 32.7767, lng: -96.7970 },
  zoom = 12,
  markers = [],
  droppedPin = null,
  onPinDrop,
  className = "",
  interactive = true,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const pinMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    loadMapsLibrary()
      .then((mapsLib) => {
        if (!mapsLib || !mapRef.current) {
          setError(true);
          return;
        }
        const { Map } = mapsLib;
        const map = new Map(mapRef.current, {
          center,
          zoom,
          styles: DARK_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: "swept-dark-map",
          clickableIcons: false,
          gestureHandling: interactive ? "greedy" : "cooperative",
        });
        mapInstanceRef.current = map;

        if (onPinDrop && interactive) {
          map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              onPinDrop(e.latLng.lat(), e.latLng.lng());
            }
          });
        }

        setLoaded(true);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  // Update report markers
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    loadMarkerLibrary().then((markerLib) => {
      if (!markerLib || !mapInstanceRef.current) return;
      const { AdvancedMarkerElement } = markerLib;

      markers.forEach((m) => {
        const color = m.status ? STATUS_COLORS[m.status] || "#39FF14" : SEVERITY_COLORS[m.severity || "Minor"] || "#EAB308";
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="
            width: 14px; height: 14px; border-radius: 50%;
            background: ${color}; border: 2px solid #0a0a0a;
            box-shadow: 0 0 8px ${color}60;
            cursor: pointer;
          "></div>
        `;

        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: { lat: m.lat, lng: m.lng },
          content: el,
        });
        markersRef.current.push(marker);
      });
    });
  }, [loaded, markers]);

  // Update dropped pin
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return;

    if (pinMarkerRef.current) {
      pinMarkerRef.current.map = null;
      pinMarkerRef.current = null;
    }

    if (droppedPin) {
      loadMarkerLibrary().then((markerLib) => {
        if (!markerLib || !mapInstanceRef.current) return;
        const { AdvancedMarkerElement } = markerLib;
        const el = document.createElement("div");
        el.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="
              width: 24px; height: 24px; border-radius: 50%;
              background: #39FF14; border: 3px solid #0a0a0a;
              box-shadow: 0 0 20px #39FF1480;
              animation: pulse 2s infinite;
            "></div>
            <div style="
              width: 2px; height: 8px; background: #39FF14;
              margin-top: -2px;
            "></div>
          </div>
        `;
        const marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: droppedPin,
          content: el,
        });
        pinMarkerRef.current = marker;
        mapInstanceRef.current!.panTo(droppedPin);
        mapInstanceRef.current!.setZoom(15);
      });
    }
  }, [loaded, droppedPin]);

  // Fallback if no API key
  if (error) {
    return (
      <div className={`bg-swept-gray border border-gray-800 rounded-2xl flex items-center justify-center ${className}`}>
        <FallbackMap markers={markers} droppedPin={droppedPin} />
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-gray-800 ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 bg-swept-gray flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-swept-green border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Fallback map when no Google Maps API key is set
function FallbackMap({
  markers = [],
  droppedPin,
}: {
  markers?: GoogleMapProps["markers"];
  droppedPin?: { lat: number; lng: number } | null;
}) {
  return (
    <div className="relative w-full h-full bg-swept-gray overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-gray-500" style={{ top: `${(i + 1) * 11.1}%` }} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-gray-500" style={{ left: `${(i + 1) * 7.7}%` }} />
        ))}
      </div>

      {/* Roads */}
      <div className="absolute top-[40%] left-0 right-0 h-[2px] bg-gray-700/60" />
      <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-gray-700/60" />
      <div className="absolute left-[30%] top-0 bottom-0 w-[2px] bg-gray-700/60" />
      <div className="absolute left-[55%] top-0 bottom-0 w-[2px] bg-gray-700/60" />

      {/* Labels */}
      <span className="absolute top-[12%] left-[15%] text-[10px] text-gray-600 font-mono">Harry Hines</span>
      <span className="absolute top-[38%] left-[62%] text-[10px] text-gray-600 font-mono">Lakewood</span>
      <span className="absolute top-[48%] left-[50%] text-[10px] text-gray-600 font-mono">Deep Ellum</span>
      <span className="absolute top-[68%] left-[28%] text-[10px] text-gray-600 font-mono">Cedars</span>
      <span className="absolute top-[80%] left-[20%] text-[10px] text-gray-600 font-mono">Oak Cliff</span>

      {/* Markers */}
      {markers?.map((m) => {
        const x = ((m.lng + 96.9) / 0.2) * 100;
        const y = ((32.9 - m.lat) / 0.2) * 100;
        const color = m.status === "Swept" ? "bg-swept-green" : m.severity === "Major" ? "bg-red-500" : m.severity === "Moderate" ? "bg-orange-500" : "bg-yellow-500";
        return (
          <div key={m.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}>
            <div className={`w-3 h-3 rounded-full ${color} border-2 border-swept-dark shadow-lg`} />
          </div>
        );
      })}

      {/* Dropped pin */}
      {droppedPin && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{
          left: `${Math.max(5, Math.min(95, ((droppedPin.lng + 96.9) / 0.2) * 100))}%`,
          top: `${Math.max(5, Math.min(95, ((32.9 - droppedPin.lat) / 0.2) * 100))}%`,
        }}>
          <div className="w-5 h-5 rounded-full bg-swept-green border-3 border-swept-dark shadow-[0_0_20px_rgba(57,255,20,0.5)] animate-pulse" />
        </div>
      )}

      {/* Label */}
      <div className="absolute top-3 left-3 bg-swept-dark/80 border border-gray-800 rounded-lg px-2 py-1">
        <span className="text-[10px] text-gray-400 font-mono">DALLAS, TX — LIVE</span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-swept-dark/90 border border-gray-800 rounded-lg p-2 flex gap-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Minor</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Major</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-swept-green" /> Swept</span>
      </div>
    </div>
  );
}
