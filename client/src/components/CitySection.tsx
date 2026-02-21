/*
 * VIAGGIO MODERNO — Contemporary Italian Editorial
 * CitySection: Full city section with hero, map, and categorized places
 */

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { type CityData, type Place, type PlaceCategory, categoryIcons } from "@/data/travelData";
import { PlaceCard } from "./PlaceCard";
import { MapView } from "./Map";
import { motion } from "framer-motion";
import { MapPin, Filter, X } from "lucide-react";

interface CitySectionProps {
  city: CityData;
}

const FILTER_GROUPS = [
  { label: "All", value: "all" as const },
  { label: "Restaurants", values: ["restaurant", "steak", "seafood", "pasta", "pizza", "truffle", "risotto", "panzerotti"] },
  { label: "Drinks & Sweets", values: ["gelato", "pastry", "aperitivo", "cocktail", "coffee", "chocolate"] },
  { label: "Explore", values: ["attraction", "park", "neighborhood"] },
];

export function CitySection({ city }: CitySectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const filteredPlaces = useMemo(() => {
    if (activeFilter === "all") return city.places;
    const group = FILTER_GROUPS.find(g => g.label === activeFilter);
    if (!group || !("values" in group) || !group.values) return city.places;
    const vals = group.values;
    return city.places.filter(p => vals.includes(p.category));
  }, [city.places, activeFilter]);

  const categories = useMemo(() => {
    const cats = new Set(filteredPlaces.map(p => p.category));
    return Array.from(cats);
  }, [filteredPlaces]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => { m.map = null; });
    markersRef.current = [];
  }, []);

  const addMarkers = useCallback((map: google.maps.Map, places: Place[]) => {
    clearMarkers();
    places.forEach(place => {
      const icon = categoryIcons[place.category] || "📍";
      const pinEl = document.createElement("div");
      pinEl.innerHTML = `<div style="
        background: ${place.id === activePlace ? '#c75c2a' : '#1a1a1a'};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        font-family: 'DM Sans', sans-serif;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s;
      "><span>${icon}</span><span>${place.name}</span></div>`;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: place.lat, lng: place.lng },
        content: pinEl,
        title: place.name,
      });

      marker.addListener("click", () => {
        setActivePlace(place.id);
        const el = document.getElementById(`place-${place.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      markersRef.current.push(marker);
    });
  }, [activePlace, clearMarkers]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    addMarkers(map, filteredPlaces);
  }, [addMarkers, filteredPlaces]);

  // Update markers when filter changes
  useEffect(() => {
    if (mapRef.current) {
      addMarkers(mapRef.current, filteredPlaces);
    }
  }, [filteredPlaces, addMarkers]);

  const handlePlaceClick = useCallback((place: Place) => {
    setActivePlace(place.id);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: place.lat, lng: place.lng });
      mapRef.current.setZoom(16);
    }
  }, []);

  return (
    <section id={city.id} className="scroll-mt-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={city.heroImage}
          alt={city.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Oversized watermark name */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-white/60 text-xs uppercase tracking-[0.3em] font-medium mb-2">
              {city.subtitle}
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-none tracking-tight">
              {city.name}
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-3xl py-8 md:py-12 border-b border-border"
        >
          {city.description}
        </motion.p>

        {/* Filter Bar */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border py-3 -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {FILTER_GROUPS.map(group => (
              <button
                key={group.label}
                onClick={() => setActiveFilter(activeFilter === group.label ? "all" : group.label)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm whitespace-nowrap transition-all
                  ${activeFilter === group.label 
                    ? "bg-foreground text-background" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
              >
                {group.label}
                {activeFilter === group.label && group.label !== "All" && (
                  <X className="w-3 h-3 ml-1 inline" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Map + Places Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 py-8">
          {/* Map */}
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="sticky top-32 rounded-sm overflow-hidden border border-border shadow-sm">
              <MapView
                initialCenter={city.mapCenter}
                initialZoom={city.mapZoom}
                onMapReady={handleMapReady}
                className="h-[400px] lg:h-[600px]"
              />
            </div>
          </div>

          {/* Places List */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                {filteredPlaces.length} Places
              </span>
            </div>
            <div className="border-t border-border">
              {filteredPlaces.map(place => (
                <div key={place.id} id={`place-${place.id}`}>
                  <PlaceCard
                    place={place}
                    isActive={activePlace === place.id}
                    onClick={() => handlePlaceClick(place)}
                  />
                </div>
              ))}
            </div>
            {filteredPlaces.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No places match this filter for {city.name}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section divider */}
      <div className="h-px bg-border" />
    </section>
  );
}
