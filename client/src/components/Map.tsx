/**
 * LEAFLET MAP INTEGRATION
 * Uses Leaflet + Carto basemap tiles (free, no API key required).
 * Works on any domain including Netlify.
 */

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Fix default marker icon issue in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LeafletMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
}

export function LeafletMap({
  className,
  initialCenter = [45.4642, 9.1900],
  initialZoom = 12,
  onMapReady,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const init = useCallback(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: true,
    });

    // Carto Voyager basemap — clean, modern, free
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Fix tile rendering after container becomes visible
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (onMapReady) {
      onMapReady(map);
    }
  }, [initialCenter, initialZoom, onMapReady]);

  useEffect(() => {
    init();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full h-[500px]", className)} />
  );
}
