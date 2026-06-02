import { useState } from "react";
import { Sparkles, Compass, Send, ShieldCheck, DollarSign, Music, MapPin, Check } from "lucide-react";
import { Event, RecommendationResult } from "../types";

interface AIChatRecommendationsProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export default function AIChatRecommendations({ events, onSelectEvent }: AIChatRecommendationsProps) {
  const [vibe, setVibe] = useState("luxurious, energetic, acoustic perfection");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(["Deep House", "Classical"]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [locationPreference, setLocationPreference] = useState("Global / Anywhere");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const GENRES_LIST = ["Deep House", "Classical", "Techno", "Electro", "Opera", "Acoustic", "Ambient", "Jazz"];
  const LOCATIONS_LIST = ["Global / Anywhere", "Tromsø", "Tokyo", "Vienna", "Morocco", "Mykonos", "Brazil"];

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSearchCommit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vibe,
          preferredGenres: selectedGenres,
          maxPrice,
          locationPreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Elite API server returned an issue.");
      }

      const data: RecommendationResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render markdown text dynamically using lightweight element conversions for speed & security
  const renderItineraryLines = (itinerary: string) => {
    return itinerary.split("\n").map((line, idx) => {
      const cleaned = line.trim();
      if (!cleaned) return <div key={idx} className="h-2" />;
      
      if (cleaned.startsWith("###")) {
        return (
          <h4 key={idx} className="font-display text-white border-b border-white/5 pb-1 text-sm tracking-widest mt-4 mb-2 uppercase text-pink-400">
            {cleaned.replace(/###|[*]/g, "").trim()}
          </h4>
        );
      }
      if (cleaned.startsWith("####")) {
        return (
          <h5 key={idx} className="font-sans font-semibold text-white text-xs mt-3 mb-1 text-purple-300">
            {cleaned.replace(/####|[*]/g, "").trim()}
          </h5>
        );
      }
      if (cleaned.startsWith("-") || cleaned.startsWith("*")) {
        return (
          <li key={idx} className="text-xs text-white/70 list-none flex items-start gap-2 pl-2 mb-1">
            <span className="text-purple-400 mt-1">✦</span>
            <span>{cleaned.replace(/^[-*]\s*/, "").replace(/[*]/g, "")}</span>
          </li>
        );
      }
      return (
        <p key={idx} className="text-xs text-white/70 mb-2 leading-relaxed font-sans">
          {cleaned.replace(/[*]/g, "")}
        </p>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai-recommender-dashboard">
      
      {/* 1. INPUT CRITERIA DRAWER */}
      <div className="lg:col-span-4 bg-[#0c0c10]/95 border border-white/5 rounded-2xl p-5 space-y-5 h-fit shadow-2xl">
        
        <div>
          <span className="text-[9px] uppercase tracking-widest text-[#F5F5F5] font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            AI Global Concierge Despatch
          </span>
          <h3 className="font-display font-medium text-lg text-white mt-1">
            Bespoke Event Customizer
          </h3>
          <p className="text-[11px] text-white/50 leading-relaxed mt-1">
            Specify your aesthetic mood and acoustic preferences. EventSphere Concierge will interface with Gemini to sculpt your customized global luxury itinerary.
          </p>
        </div>

        {/* VIBE INPUT */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-mono">
            Aesthetic Vibe / Atmosphere
          </label>
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
            placeholder="e.g. cyber, geometric dome, mountain sunset"
            id="vibe-input"
          />
        </div>

        {/* GENRE MULTI-CHOICE */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-mono">
            Preferred Genres
          </label>
          <div className="flex flex-wrap gap-1.5">
            {GENRES_LIST.map((genre) => {
              const active = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-2.5 py-1 text-[10px] rounded-lg border font-medium flex items-center gap-1 transition-all duration-300 ${
                    active
                      ? "bg-purple-950/40 border-purple-500/50 text-purple-100"
                      : "bg-black/40 border-white/5 text-white/50 hover:border-white/20"
                  }`}
                  id={`genre-${genre.toLowerCase()}`}
                >
                  <Music className="w-3 h-3 text-purple-400" />
                  {genre}
                  {active && <Check className="w-2.5 h-2.5 stroke-[3] text-purple-300 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* BUDGET SELECTOR */}
        <div>
          <div className="flex justify-between items-center mb-1.5 font-mono">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Max Budget per ticket
            </span>
            <span className="text-xs font-semibold text-pink-400 flex items-center">
              <DollarSign className="w-3 h-3" />
              {maxPrice >= 5000 ? "Unlimited" : `${maxPrice} USD`}
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
            id="budget-slider"
          />
        </div>

        {/* LOCATION SELECTOR */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1.5 font-mono">
            Destination / City
          </label>
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS_LIST.map((loc) => {
              const active = locationPreference === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setLocationPreference(loc)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium flex items-center gap-1.5 transition-all duration-300 ${
                    active
                      ? "bg-purple-950/40 border-purple-500/50 text-purple-100"
                      : "bg-black/40 border-white/5 text-white/50 hover:border-white/20"
                  }`}
                  id={`loc-${loc.toLowerCase().replace(/ \/ /g, "-")}`}
                >
                  <MapPin className="w-3 h-3 text-pink-400" />
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* COMMIT BUTTON */}
        <button
          onClick={handleSearchCommit}
          disabled={loading}
          className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50"
          id="engage-concierge-btn"
        >
          <Send className="w-4 h-4 stroke-[2]" />
          Engage VIP Concierge Core
        </button>

      </div>

      {/* 2. RESULTS EXHIBIT */}
      <div className="lg:col-span-8 bg-[#0c0c10]/40 border border-white/5 rounded-2xl h-[530px] overflow-y-auto no-scrollbar scroll-smooth relative p-5 lg:p-6" id="ai-recommender-response">
        
        {/* DEFAULT MOCK OR ACTIVE EMPTY STATE */}
        {!loading && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-display font-medium text-white tracking-widest">
                CONCIERGE ON STANDBY
              </h4>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">
                Awaiting your bespoke directives. Click the button on the left to activate Gemini intelligence.
              </p>
            </div>
          </div>
        )}

        {/* LOADING STATE ANIMATION */}
        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto space-y-4" id="ai-loading">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/10 border-t-purple-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border border-pink-500/10 border-b-pink-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-pink-400">
                ✨
              </div>
            </div>
            <div>
              <h4 className="font-display font-medium text-white tracking-widest animate-pulse">
                ORCHESTRATING RETRIEVAL
              </h4>
              <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest mt-1.5 animate-pulse">
                Modeling elite acoustic matches...
              </p>
            </div>
          </div>
        )}

        {/* OUTCOME CONTENT SHOWCASE */}
        {result && (
          <div className="space-y-6" id="ai-results-content">
            
            {/* Concierge Message Block */}
            <div className="bg-gradient-to-tr from-purple-950/20 to-pink-950/10 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-xs opacity-25">👑</div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-pink-400 mb-2">
                ⚜️ Concierge Dispatch Core Message
              </h4>
              <p className="text-sm font-display text-white italic leading-relaxed">
                "{result.customMessage}"
              </p>
            </div>

            {/* Match Event Showcase cards */}
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-purple-400 mb-3">
                Matched Event Sphere Registry Entries
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events
                  .filter((ev) => result.recommendedEventIds.includes(ev.id))
                  .map((ev) => (
                    <div 
                      key={ev.id} 
                      className="bg-[#0f0f15]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={ev.image} 
                          alt={ev.title} 
                          className="w-12 h-12 object-cover rounded-xl border border-white/10"
                        />
                        <div className="overflow-hidden">
                          <h5 className="font-display font-semibold text-xs text-white truncate group-hover:text-pink-300">
                            {ev.title}
                          </h5>
                          <span className="text-[9px] text-white/40 block mt-0.5">{ev.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-pink-400">${ev.priceGeneral} - ${ev.priceVIP}</span>
                        <button
                          onClick={() => onSelectEvent(ev)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Compass className="w-3 h-3" />
                          View Box Seating
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Itinerary Block */}
            <div className="bg-black/50 border border-white/5 rounded-2xl p-5 lg:p-6">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Sovereign Itinerary Plan
              </h4>
              <div className="space-y-1 prose prose-invert prose-xs">
                {renderItineraryLines(result.suggestedItinerary)}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
