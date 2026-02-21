/*
 * VIAGGIO MODERNO — Contemporary Italian Editorial
 * Home: Main page with hero, city navigation, and city sections
 * Design: Near-black + warm white, terracotta accent, DM Serif Display + DM Sans
 */

import { useState, useEffect } from "react";
import { cities } from "@/data/travelData";
import { CitySection } from "@/components/CitySection";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plane, Calendar, MapPin } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCity, setActiveCity] = useState("milan");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active city based on scroll position
      const sections = cities.map(c => ({
        id: c.id,
        el: document.getElementById(c.id),
      }));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveCity(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCity = (cityId: string) => {
    const el = document.getElementById(cityId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className={`font-serif text-lg tracking-tight transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
              Viaggio
            </span>
          </a>
          
          <div className="hidden md:flex items-center gap-1">
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => scrollToCity(city.id)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-widest transition-all rounded-sm
                  ${activeCity === city.id
                    ? scrolled ? "bg-foreground text-background" : "bg-white/20 text-white"
                    : scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/60 hover:text-white"
                  }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          {/* Mobile city selector */}
          <div className="md:hidden">
            <select
              value={activeCity}
              onChange={(e) => scrollToCity(e.target.value)}
              className={`text-xs font-medium uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer
                ${scrolled ? 'text-foreground' : 'text-white'}`}
            >
              {cities.map(city => (
                <option key={city.id} value={city.id} className="text-foreground bg-background">
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-charcoal">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <img
            src={cities[0].heroImage}
            alt="Italy"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-white/40 text-xs uppercase tracking-[0.4em] font-medium mb-4">
              A Curated Travel Guide
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-[6rem] text-white font-serif leading-[0.95] tracking-tight mb-6">
              Alper & Seyda's<br />
              <span className="text-terracotta-light">Italy Adventure</span>
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              A personally curated 10-day journey through Milan, Florence, Bologna, and Rome — with insider restaurant picks, local tips, and must-see attractions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-6 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>10 Days</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>4 Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              <span>Milano → Firenze → Bologna → Roma</span>
            </div>
          </motion.div>

          {/* City quick links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex gap-3 mt-10 overflow-x-auto pb-2"
          >
            {cities.map((city, i) => (
              <button
                key={city.id}
                onClick={() => scrollToCity(city.id)}
                className="group flex items-center gap-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-sm px-4 py-3 transition-all shrink-0"
              >
                <span className="text-white/30 text-xs font-mono">0{i + 1}</span>
                <span className="text-white text-sm font-medium">{city.name}</span>
                <span className="text-white/30 text-xs hidden sm:inline">{city.places.length} places</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-white/30" />
          </motion.div>
        </motion.div>
      </header>

      {/* Route Overview */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
                The Route
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-tight mb-4">
                Four cities,<br />ten unforgettable days
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                From Milan's fashion-forward aperitivo bars to Florence's legendary steak houses, 
                through Bologna's portico-lined streets to Rome's eternal wonders — every recommendation 
                here comes from personal experience and local friends.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {cities.map((city, i) => (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollToCity(city.id)}
                  className="text-left group"
                >
                  <div className="aspect-[4/3] rounded-sm overflow-hidden mb-3 border border-border">
                    <img
                      src={city.heroImage}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">0{i + 1}</p>
                  <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {city.places.filter(p => !["attraction", "park", "neighborhood", "church", "daytrip"].includes(p.category)).length} food spots · {city.places.filter(p => ["attraction", "park", "neighborhood", "church", "daytrip"].includes(p.category)).length} things to do
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* City Sections */}
      {cities.map(city => (
        <CitySection key={city.id} city={city} />
      ))}

      {/* Footer */}
      <footer className="bg-charcoal text-white/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h3 className="font-serif text-2xl text-white mb-2">Buon Viaggio!</h3>
              <p className="text-sm max-w-md leading-relaxed">
                This travel guide was curated with love for Alper & Seyda. 
                All restaurant recommendations are from personal experience and local friends. Enjoy every bite!
              </p>
            </div>
            <div className="flex gap-8">
              {cities.map(city => (
                <button
                  key={city.id}
                  onClick={() => scrollToCity(city.id)}
                  className="text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 text-xs">
            Made with care · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
