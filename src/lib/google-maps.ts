import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialized = false;

export function initMaps() {
  if (!initialized) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return false;
    setOptions({ key: apiKey, v: "weekly" });
    initialized = true;
  }
  return true;
}

export async function loadMapsLibrary() {
  if (!initMaps()) return null;
  return importLibrary("maps");
}

export async function loadMarkerLibrary() {
  if (!initMaps()) return null;
  return importLibrary("marker");
}

export { importLibrary };
