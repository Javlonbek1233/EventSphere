import { useState } from "react";
import { Armchair, Sparkles, Check, Flame, ShieldCheck } from "lucide-react";

interface VenueMapProps {
  eventTitle: string;
  priceGeneral: number;
  priceVIP: number;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  ticketType: "General" | "VIP" | "VVIP Royal Box";
  setTicketType: (type: "General" | "VIP" | "VVIP Royal Box") => void;
  badgeType: "Standard Access" | "Gold VIP Core" | "Platinum Backstage Passes";
  setBadgeType: (badge: "Standard Access" | "Gold VIP Core" | "Platinum Backstage Passes") => void;
  addonChampagne: boolean;
  setAddonChampagne: (add: boolean) => void;
  addonVIPLounge: boolean;
  setAddonVIPLounge: (add: boolean) => void;
  totalPaid: number;
}

export default function VenueMap({
  eventTitle,
  priceGeneral,
  priceVIP,
  selectedSeats,
  setSelectedSeats,
  ticketType,
  setTicketType,
  badgeType,
  setBadgeType,
  addonChampagne,
  setAddonChampagne,
  addonVIPLounge,
  setAddonVIPLounge,
  totalPaid,
}: VenueMapProps) {
  
  // Define our interactive seats. Let's place 18 premium seats in a digital grid representing the stage front!
  const SEATS = [
    { id: "A1", row: "A", tier: "VVIP Royal Box", price: priceVIP * 1.5, status: "available" },
    { id: "A2", row: "A", tier: "VVIP Royal Box", price: priceVIP * 1.5, status: "available" },
    { id: "A3", row: "A", tier: "VVIP Royal Box", price: priceVIP * 1.5, status: "reserved" },
    { id: "A4", row: "A", tier: "VVIP Royal Box", price: priceVIP * 1.5, status: "available" },
    
    { id: "B1", row: "B", tier: "VIP", price: priceVIP, status: "available" },
    { id: "B2", row: "B", tier: "VIP", price: priceVIP, status: "available" },
    { id: "B3", row: "B", tier: "VIP", price: priceVIP, status: "reserved" },
    { id: "B4", row: "B", tier: "VIP", price: priceVIP, status: "available" },
    { id: "B5", row: "B", tier: "VIP", price: priceVIP, status: "available" },
    { id: "B6", row: "B", tier: "VIP", price: priceVIP, status: "available" },
    
    { id: "C1", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C2", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C3", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C4", row: "C", tier: "General", price: priceGeneral, status: "reserved" },
    { id: "C5", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C6", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C7", row: "C", tier: "General", price: priceGeneral, status: "available" },
    { id: "C8", row: "C", tier: "General", price: priceGeneral, status: "available" },
  ];

  const handleSeatClick = (seatId: string, seatTier: "General" | "VIP" | "VVIP Royal Box") => {
    // If already selected, remove it
    if (selectedSeats.includes(seatId)) {
      const filtered = selectedSeats.filter(s => s !== seatId);
      setSelectedSeats(filtered);
    } else {
      // Set the active configuration based on the first selected seat tier for uniformity
      if (selectedSeats.length === 0) {
        setTicketType(seatTier);
        if (seatTier === "VVIP Royal Box") {
          setBadgeType("Platinum Backstage Passes");
        } else if (seatTier === "VIP") {
          setBadgeType("Gold VIP Core");
        } else {
          setBadgeType("Standard Access");
        }
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div className="bg-[#0c0c10]/90 border border-white/5 rounded-2xl p-5 lg:p-6" id="venue-map-container">
      {/* HEADER SUMMARY */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-pink-400 font-mono flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            3D SPATIAL VENUE MANAGER
          </span>
          <h2 className="font-display font-medium text-lg text-white">
            Secure VVIP Seating Layout
          </h2>
          <p className="text-xs text-white/50">{eventTitle}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-pink-400">
            <span className="w-2.5 h-2.5 rounded bg-pink-500 shadow-md shadow-pink-500/20" />
            VVIP Royal Box
          </div>
          <div className="flex items-center gap-1 text-purple-400">
            <span className="w-2.5 h-2.5 rounded bg-purple-600" />
            VVIP Floor
          </div>
          <div className="flex items-center gap-1 text-teal-400">
            <span className="w-2.5 h-2.5 rounded bg-teal-600" />
            General Floor
          </div>
          <div className="flex items-center gap-1 text-white/40">
            <span className="w-2.5 h-2.5 rounded bg-white/10" />
            Reserved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INTERACTIVE COMPASS ARENA MAP */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-black/60 border border-white/5 rounded-2xl text-center relative overflow-hidden">
          
          {/* Neon Grid Backing */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />

          {/* SIMULATED STAGE LIGHT SHINE */}
          <div className="w-full max-w-sm h-6 bg-gradient-to-r from-purple-505 via-pink-500 to-purple-500 rounded-b-xl shadow-2xl shadow-pink-500/30 mb-1 border-b border-pink-200/20 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white tracking-widest uppercase">
              MAIN STAGE PROJECTION BOUND
            </span>
          </div>
          <div className="w-32 h-16 bg-gradient-to-t from-pink-500/10 to-transparent blur-md pointer-events-none mb-4" />

          {/* SEATING GRID ROW-BY-ROW */}
          <div className="relative z-10 w-full max-w-md mx-auto space-y-4 mb-4">
            
            {/* Row A (VVIP Royal Box) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase text-pink-400/80 tracking-wider">
                VVIP Royal Boxes (Front Row)
              </div>
              <div className="flex justify-center gap-2">
                {SEATS.filter(s => s.row === "A").map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isReserved = seat.status === "reserved";
                  return (
                    <button
                      key={seat.id}
                      disabled={isReserved}
                      onClick={() => handleSeatClick(seat.id, seat.tier as any)}
                      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl font-mono text-center transition-all duration-300 border ${
                        isReserved
                          ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                          : isSelected
                          ? "bg-pink-500 border-pink-300 text-white shadow-lg shadow-pink-500/40 font-bold scale-105"
                          : "bg-pink-500/10 hover:bg-pink-500/30 border-pink-500/30 text-pink-300"
                      }`}
                      title={`${seat.tier}: Unit ${seat.id} - $${seat.price}`}
                      id={`seat-${seat.id}`}
                    >
                      <Armchair className={`w-4 h-4 mb-0.5 ${isSelected ? "text-white" : "text-pink-400"}`} />
                      <span className="text-[9px]">{seat.id}</span>
                      <span className="text-[8px] opacity-70">${Math.round(seat.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row B (VIP) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase text-purple-400/60 tracking-wider">
                Platinum Center Seats
              </div>
              <div className="flex justify-center gap-2">
                {SEATS.filter(s => s.row === "B").map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isReserved = seat.status === "reserved";
                  return (
                    <button
                      key={seat.id}
                      disabled={isReserved}
                      onClick={() => handleSeatClick(seat.id, seat.tier as any)}
                      className={`relative flex flex-col items-center justify-center w-11 h-12 rounded-lg font-mono text-center transition-all duration-300 border ${
                        isReserved
                          ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                          : isSelected
                          ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/40 font-bold scale-105"
                          : "bg-purple-500/10 hover:bg-purple-500/30 border-purple-500/30 text-purple-300"
                      }`}
                      title={`${seat.tier}: Seat ${seat.id} - $${seat.price}`}
                      id={`seat-${seat.id}`}
                    >
                      <span className="text-[9px] font-semibold">{seat.id}</span>
                      <span className="text-[8px] opacity-70">${Math.round(seat.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row C (General Seats) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase text-teal-400/60 tracking-wider">
                Auditorium / General Access (Rows C)
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 justify-center">
                {SEATS.filter(s => s.row === "C").map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isReserved = seat.status === "reserved";
                  return (
                    <button
                      key={seat.id}
                      disabled={isReserved}
                      onClick={() => handleSeatClick(seat.id, seat.tier as any)}
                      className={`relative flex flex-col items-center justify-center h-10 rounded-md font-mono text-center transition-all duration-300 border ${
                        isReserved
                          ? "bg-white/3 border-transparent text-white/10 cursor-not-allowed"
                          : isSelected
                          ? "bg-teal-600 border-teal-400 text-white shadow-lg shadow-teal-500/30 font-bold"
                          : "bg-teal-500/10 hover:bg-teal-500/30 border-teal-500/20 text-teal-300"
                      }`}
                      title={`${seat.tier}: Seat ${seat.id} - $${seat.price}`}
                      id={`seat-${seat.id}`}
                    >
                      <span className="text-[9px] font-semibold">{seat.id}</span>
                      <span className="text-[8px] opacity-70">${Math.round(seat.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="text-[9px] text-white/30 tracking-widest font-mono uppercase bg-white/5 px-3 py-1 rounded-full">
            ✦ ACOUSTIC SOUNDSTAGE CONVERGENCE CONTOURS ACTIVE ✦
          </div>

        </div>

        {/* TIER CUSTOMIZER & SPECIAL LUXURY UPGRADES */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* TICKET TYPE TIER DESCRIPTION */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-mono">
              Selected Ticket tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["General", "VIP", "VVIP Royal Box"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    setTicketType(tier);
                    if (tier === "VVIP Royal Box") {
                      setBadgeType("Platinum Backstage Passes");
                    } else if (tier === "VIP") {
                      setBadgeType("Gold VIP Core");
                    } else {
                      setBadgeType("Standard Access");
                    }
                  }}
                  className={`py-2 px-1 text-center rounded-xl border text-[10px] font-medium transition-all duration-300 cursor-pointer ${
                    ticketType === tier
                      ? "bg-pink-500/20 border-pink-500/50 text-pink-200"
                      : "bg-black/40 border-white/5 text-white/60 hover:text-white"
                  }`}
                  id={`tier-select-${tier.toLowerCase().replace(/ /g, "-")}`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* VIP PASS TYPE SELECTION */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-mono">
              Lanyard Credentials
            </label>
            <div className="space-y-2">
              {[
                { name: "Standard Access", desc: "General Venue grounds & standard lounge entry." },
                { name: "Gold VIP Core", desc: "Private VIP Bar access & custom fast-track ingress." },
                { name: "Platinum Backstage Passes", desc: "Full backstage corridor clearance & custom dining suite." },
              ].map((badge) => (
                <div
                  key={badge.name}
                  onClick={() => setBadgeType(badge.name as any)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    badgeType === badge.name
                      ? "bg-purple-950/20 border-purple-500/50 text-purple-200"
                      : "bg-black/30 border-white/5 text-white/50 hover:bg-white/5"
                  }`}
                  id={`badge-select-${badge.name.toLowerCase().replace(/ /g, "-")}`}
                >
                  <div>
                    <div className="text-[11px] font-semibold text-white">{badge.name}</div>
                    <div className="text-[9px] text-white/50 leading-tight mt-0.5">{badge.desc}</div>
                  </div>
                  {badgeType === badge.name && (
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-purple-300" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* LUXURY ADDONS */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2 font-mono">
              Curated VIP Upgrades
            </label>
            <div className="space-y-2">
              
              {/* Dom Perignon */}
              <div 
                onClick={() => setAddonChampagne(!addonChampagne)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 select-none ${
                  addonChampagne 
                    ? "bg-purple-900/20 border-purple-500/30 text-purple-100"
                    : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5"
                }`}
                id="upgrade-champagne"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-pink-400">
                    🍾
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Dom Pérignon Celebration Service</div>
                    <div className="text-[9px] text-white/40 mt-0.5">Complementary table service & chilled glass on entry (+$150)</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  addonChampagne ? "bg-purple-500 border-purple-500 text-white" : "border-white/20"
                }`}>
                  {addonChampagne && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Helicopter Service */}
              <div 
                onClick={() => setAddonVIPLounge(!addonVIPLounge)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 select-none ${
                  addonVIPLounge 
                    ? "bg-purple-900/20 border-purple-500/30 text-purple-100"
                    : "bg-black/20 border-white/5 text-white/60 hover:bg-white/5"
                }`}
                id="upgrade-lounge"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-pink-400">
                    🍱
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">3-Michelin Gastronomy Lounge Access</div>
                    <div className="text-[9px] text-white/40 mt-0.5">Access to executive caviar & dining parlor bars (+$250)</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  addonVIPLounge ? "bg-purple-500 border-purple-500 text-white" : "border-white/20"
                }`}>
                  {addonVIPLounge && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

            </div>
          </div>

          {/* Real-time price breakdown */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-mono space-y-1.5">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Pricing Audit</div>
            <div className="flex justify-between text-white/70">
              <span>Selected Seats ({selectedSeats.length || "0"}):</span>
              <span>
                ${selectedSeats.length * (ticketType === "VVIP Royal Box" ? priceVIP * 1.5 : ticketType === "VIP" ? priceVIP : priceGeneral)}
              </span>
            </div>
            {addonChampagne && selectedSeats.length > 0 && (
              <div className="flex justify-between text-pink-400">
                <span>🍾 Dom Pérignon upgrade:</span>
                <span>+${selectedSeats.length * 150}</span>
              </div>
            )}
            {addonVIPLounge && selectedSeats.length > 0 && (
              <div className="flex justify-between text-pink-400">
                <span>🍱 3-star Gastronomy Lounge:</span>
                <span>+${selectedSeats.length * 250}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-sm">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                TOTAL VVIP VALUATION:
              </span>
              <span className="text-pink-400">${totalPaid}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
