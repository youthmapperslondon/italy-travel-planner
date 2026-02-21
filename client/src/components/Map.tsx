/**
 * GOOGLE MAPS FRONTEND INTEGRATION
 * Uses standard Google Maps JavaScript API with API key from environment variable.
 * Set VITE_GOOGLE_MAPS_API_KEY in your .env or Netlify environment variables.
 * Falls back to Manus proxy if no API key is set (for local development).
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
    _mapsLoading?: Promise<void>;
  }
}

// Use standard Google Maps API key if available, otherwise fall back to Manus proxy
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const FORGE_API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";

function getScriptUrl(): string {
  const libraries = "marker,places,geocoding,geometry";
  if (GOOGLE_MAPS_API_KEY) {
    // Standard Google Maps API — works on any domain
    return `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&libraries=${libraries}`;
  }
  // Fallback to Manus proxy for local development
  const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
  return `${MAPS_PROXY_URL}/maps/api/js?key=${FORGE_API_KEY}&v=weekly&libraries=${libraries}`;
}

function loadMapScript(): Promise<void> {
  // If already loaded, resolve immediately
  if (window.google?.maps) {
    return Promise.resolve();
  }
  // If currently loading, return the existing promise
  if (window._mapsLoading) {
    return window._mapsLoading;
  }
  // Start loading
  window._mapsLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = getScriptUrl();
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      window._mapsLoading = undefined;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
  return window._mapsLoading;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
    } catch (e) {
      console.error("Map script load error:", e);
      return;
    }
    if (!mapContainer.current || map.current) return;
    
    map.current = new window.google!.maps.Map(mapContainer.current, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: false,
      mapId: "DEMO_MAP_ID",
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
    if (onMapReady) {
      onMapReady(map.current);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div ref={mapContainer} className={cn("w-full h-[500px]", className)} />
  );
}
