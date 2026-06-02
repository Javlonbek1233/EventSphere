import { Calendar, MapPin, Stars, Ticket, ShieldAlert } from "lucide-react";
import { Event } from "../types";
import LiveCountdown from "./LiveCountdown";

interface EventCardProps {
  key?: string | number;
  event: Event;
  onSelect: (event: Event) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  const isVVIP = event.priceVIP > 2000;
  const isAlmostSoldOut = event.remainingTickets <= 15;

  return (
    <div 
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f14]/80 backdrop-blur-md transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 select-none"
      id={`event-card-${event.id}`}
    >
      {/* CARD IMAGE & GRADIENT HOVER EFFECTS */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Cinematic dark vignette layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-[#0f0f14]/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-start justify-between">
          <span 
            className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider ${
              event.category === "festival" 
                ? "bg-purple-950/80 border border-purple-500/30 text-purple-300"
                : "bg-pink-950/80 border border-pink-500/30 text-pink-300"
            }`}
          >
            ✦ {event.category}
          </span>

          <div className="flex flex-col items-end gap-1.5">
            {isVVIP && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] font-bold tracking-widest px-2 py-0.5 rounded uppercase shadow-md shadow-purple-500/25">
                VVIP SPECIALTY
              </span>
            )}
            {isAlmostSoldOut && (
              <span className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[8px] font-mono tracking-widest px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <ShieldAlert className="w-2.5 h-2.5" />
                LIMITED ACCESS
              </span>
            )}
          </div>
        </div>

        {/* Live Ticker overlay */}
        <div className="absolute bottom-3 left-4">
          <LiveCountdown targetDate={event.countdownDate} />
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-medium text-lg leading-tight tracking-wide text-white group-hover:text-pink-300 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-pink-400">
            <Stars className="w-3 h-3 fill-pink-400 text-pink-400" />
            {event.rating.toFixed(2)}
          </div>
        </div>

        <p className="text-xs text-white/60 mb-4 line-clamp-2 leading-relaxed font-light">
          {event.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-white/50 font-sans mb-4 border-y border-white/5 py-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400/80" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <MapPin className="w-3.5 h-3.5 text-purple-400/80" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Line up headliners */}
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5 font-mono">
            HEADLININGS & ENSEMBLE
          </div>
          <div className="flex flex-wrap gap-1">
            {event.lineUp.slice(0, 3).map((artist, i) => (
              <span 
                key={i} 
                className="bg-black/40 border border-white/5 text-[9px] px-2 py-0.5 rounded text-white/80"
              >
                {artist}
              </span>
            ))}
            {event.lineUp.length > 3 && (
              <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[8px] px-1.5 py-0.5 rounded font-bold">
                +{event.lineUp.length - 3} MORE
              </span>
            )}
          </div>
        </div>

        {/* FOOTER VALUES & ACTIONS */}
        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[8px] tracking-widest font-mono text-white/40 uppercase">
              Entry starting at
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-white/40 font-mono">$</span>
              <span className="text-xl font-bold text-white font-mono">{event.priceGeneral}</span>
              <span className="text-[10px] text-white/50 ml-1">USD</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(event)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:to-pink-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-lg shadow-purple-500/15 group-hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
            id={`book-btn-${event.id}`}
          >
            <Ticket className="w-4 h-4 text-white stroke-[2.5]" />
            Request VIP
          </button>
        </div>

      </div>
    </div>
  );
}
