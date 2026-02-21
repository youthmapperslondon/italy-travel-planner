/*
 * VIAGGIO MODERNO — Contemporary Italian Editorial
 * PlaceCard: Displays a single place recommendation with editorial styling
 */

import { useState } from "react";
import { type Place, categoryIcons } from "@/data/travelData";
import { ExternalLink, Heart, MapPin, Star, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlaceCardProps {
  place: Place;
  isActive?: boolean;
  onClick?: () => void;
}

export function PlaceCard({ place, isActive, onClick }: PlaceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const icon = categoryIcons[place.category] || "📍";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative border-b border-border/60 py-5 px-4 transition-all duration-200 cursor-pointer
        ${isActive ? "bg-primary/[0.04] border-l-2 border-l-primary" : "hover:bg-muted/40 border-l-2 border-l-transparent"}
      `}
      onClick={() => {
        setIsExpanded(!isExpanded);
        onClick?.();
      }}
    >
      {/* Top row: icon, name, badges */}
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5 shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-semibold text-foreground leading-tight font-sans">
              {place.name}
            </h4>
            {place.isPersonalFavorite && (
              <Heart className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
            )}
            {place.isLocalRecommendation && (
              <span className="text-[10px] uppercase tracking-widest text-sage font-semibold bg-sage/10 px-1.5 py-0.5 rounded-sm">
                Local Pick
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium tracking-wide uppercase">
            {place.categoryLabel}
          </p>
        </div>
        {place.rating && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{place.rating}</span>
          </div>
        )}
      </div>

      {/* Address */}
      <div className="flex items-center gap-1.5 mt-2 ml-8">
        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground truncate">{place.address}</span>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-3 space-y-2">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {place.description}
              </p>
              
              {place.tip && (
                <div className="flex items-start gap-2 bg-primary/[0.05] rounded-sm p-2.5 border border-primary/10">
                  <MessageCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground/70 italic leading-relaxed">
                    "{place.tip}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1 flex-wrap">
                {place.priceRange && (
                  <span className="text-xs text-muted-foreground">
                    {place.priceRange}
                  </span>
                )}
                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
