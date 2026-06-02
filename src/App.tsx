import { useState, useEffect } from "react";
import { 
  Compass, Sparkles, Ticket, ShieldCheck, Star, 
  MapPin, SlidersHorizontal, ArrowLeft, ChevronRight,
  Sparkle, Globe, Coffee, Crown, GraduationCap, Download
} from "lucide-react";

import Navbar from "./components/Navbar";
import EventCard from "./components/EventCard";
import VenueMap from "./components/VenueMap";
import AIChatRecommendations from "./components/AIChatRecommendations";
import BookingDetailsDrawer from "./components/BookingDetailsDrawer";

import { Event, Booking } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"discover" | "ai-concierge" | "my-bookings">("discover");
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "concert" | "festival">("all");
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000);

  // Active detail selection
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Interactive Seating maps state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketType, setTicketType] = useState<"General" | "VIP" | "VVIP Royal Box">("VIP");
  const [badgeType, setBadgeType] = useState<"Standard Access" | "Gold VIP Core" | "Platinum Backstage Passes">("Gold VIP Core");
  const [addonChampagne, setAddonChampagne] = useState(false);
  const [addonVIPLounge, setAddonVIPLounge] = useState(false);

  // Checkout overlay triggers
  const [checkoutTriggered, setCheckoutTriggered] = useState(false);

  // Initial Data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await fetch("/api/events");
        const bookingsRes = await fetch("/api/bookings");
        
        if (eventsRes.ok && bookingsRes.ok) {
          const eventsData = await eventsRes.json();
          const bookingsData = await bookingsRes.json();
          setEvents(eventsData);
          setBookings(bookingsData);
        }
      } catch (err) {
        console.error("Error fetching Events database:", err);
      }
    };
    fetchData();
  }, []);

  // Filter computation
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      ev.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchFilter.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || ev.category === categoryFilter;
    const matchesPrice = ev.priceGeneral <= maxPriceFilter;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Calculate total checkout valuation dynamically
  const calculateTotalValuation = () => {
    if (!selectedEvent || selectedSeats.length === 0) return 0;
    const seatPrice = ticketType === "VVIP Royal Box" 
      ? selectedEvent.priceVIP * 1.5 
      : ticketType === "VIP" 
      ? selectedEvent.priceVIP 
      : selectedEvent.priceGeneral;

    let total = seatPrice * selectedSeats.length;
    if (addonChampagne) total += selectedSeats.length * 150;
    if (addonVIPLounge) total += selectedSeats.length * 250;
    return total;
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedSeats([]);
    setTicketType("VIP");
    setBadgeType("Gold VIP Core");
    setAddonChampagne(false);
    setAddonVIPLounge(false);
    // Smooth scroll to seating section on discovery select
    setTimeout(() => {
      document.getElementById("seating-selection-block")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    // Add to state and clean up active ticket reservation
    setBookings([newBooking, ...bookings]);
    setCheckoutTriggered(false);
    setSelectedSeats([]);
    setSelectedEvent(null);
    setActiveTab("my-bookings");
  };

  const featuredEvent = events.find(e => e.featured) || events[0];

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-pink-500 selection:text-white font-sans pb-24 overflow-x-hidden" id="eventsphere-root-view">
      
      {/* BACKGROUND LUXURY HIGHLIGHT GLOWS */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* STICKY GLASS HERO NAVIGATION */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bookingCount={bookings.length}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-12">

        {/* ======================= TABS 1: DISCOVER EVENTS ======================= */}
        {activeTab === "discover" && (
          <div className="space-y-12" id="tab-discover-panel">
            
            {/* LARGE CLINEMATIC FEATURED HEADLINE CAROUSEL BILLBOARD */}
            {featuredEvent && !selectedEvent && (
              <div 
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c11] shadow-2xl animate-float select-none"
                id="billboard-featured-hero"
              >
                {/* Background image + dark layered gradient block */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={featuredEvent.image} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                  <div className="absolute inset-t-0 bottom-0 bg-gradient-to-t from-[#050507] to-transparent h-1/3" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 p-6 md:p-12 lg:p-16 max-w-2xl flex flex-col justify-center min-h-[440px] space-y-6">
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/15 border border-pink-500/30 rounded-full text-[10px] font-mono tracking-widest text-pink-300 uppercase w-fit">
                    <Sparkle className="w-3.5 h-3.5 text-pink-400 stroke-[3] animate-pulse" />
                    Featured Summit of 2027
                  </div>

                  <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-widest text-gold-gradient leading-tight">
                    {featuredEvent.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans font-light">
                    {featuredEvent.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-white/50 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CalendarIndicator />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="hidden sm:block text-white/20">|</div>
                    <div className="flex items-center gap-1.5">
                      <MapPinIndicator />
                      <span>{featuredEvent.venue}, {featuredEvent.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => handleEventSelect(featuredEvent)}
                      className="px-6 py-3.5 bg-gradient-to-r from-purple-500 via-pink-600 to-purple-500 hover:from-purple-400 hover:to-pink-500 text-white rounded-xl text-xs font-bold tracking-widest uppercase shadow-xl shadow-pink-600/20 transition-all duration-300 transform active:scale-95 cursor-pointer"
                      id="billboard-action-vip"
                    >
                      Establish VVIP Route
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        const listBlock = document.getElementById("registry-explore-title");
                        listBlock?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold hover:border-white/20 border border-white/5 transition-all duration-300"
                    >
                      Browse Registry
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* SEATING MAP BLOCK: ACTIVE SELECTION PRE-SHOW */}
            {selectedEvent && (
              <div 
                className="space-y-6 bg-gradient-to-br from-[#0e0e14] via-[#07070a] to-[#040406] border border-white/10 rounded-3xl p-6 shadow-2xl"
                id="seating-selection-block"
              >
                {/* Back Link */}
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedSeats([]);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-pink-400 transition-colors"
                  id="back-to-registry-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Registry Explore
                </button>

                {/* Grid Split: Info vs Venue Map */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-2">
                  <div className="md:col-span-8 space-y-3">
                    <h2 className="font-display font-medium text-2xl tracking-wide text-white flex items-center gap-2">
                      <span className="text-pink-400">⚜️</span>
                      {selectedEvent.title}
                    </h2>
                    <p className="text-xs text-white/60 font-sans leading-relaxed">
                      {selectedEvent.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/50 pt-1">
                      <span className="flex items-center gap-1.5">
                        <CalendarIndicator />
                        {selectedEvent.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPinIndicator />
                        {selectedEvent.venue}, {selectedEvent.location}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center md:justify-end gap-3 self-center">
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 block font-mono">Box Tier Standard</span>
                      <span className="text-lg font-bold text-white font-mono">${selectedEvent.priceGeneral} USD</span>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-pink-400 block font-mono">Royal VIP Box</span>
                      <span className="text-lg font-bold text-pink-400 font-mono">${selectedEvent.priceVIP} USD</span>
                    </div>
                  </div>
                </div>

                {/* Interactive map */}
                <VenueMap 
                  eventTitle={selectedEvent.title}
                  priceGeneral={selectedEvent.priceGeneral}
                  priceVIP={selectedEvent.priceVIP}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  ticketType={ticketType}
                  setTicketType={setTicketType}
                  badgeType={badgeType}
                  setBadgeType={setBadgeType}
                  addonChampagne={addonChampagne}
                  setAddonChampagne={setAddonChampagne}
                  addonVIPLounge={addonVIPLounge}
                  setAddonVIPLounge={setAddonVIPLounge}
                  totalPaid={calculateTotalValuation()}
                />

                {/* MAP TRIGGER ACTION BAR: BOOK SEATS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#0a0a0d] border border-white/5 rounded-2xl">
                  <div className="text-center sm:text-left">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-pink-400 leading-none mb-1">
                      Active Reservation Cart
                    </div>
                    <div className="text-xs text-white/60">
                      {selectedSeats.length > 0
                        ? `Selected [${selectedSeats.join(", ")}] — Upgrades Configured Successfully.`
                        : "Please select your seat coordinate on the interactive VVIP map to construct ticket."
                      }
                    </div>
                  </div>

                  <button
                    disabled={selectedSeats.length === 0}
                    onClick={() => setCheckoutTriggered(true)}
                    className="w-full sm:w-auto px-8 h-12 bg-gradient-to-r from-purple-500 via-pink-600 to-purple-500 hover:from-purple-400 hover:to-pink-500 text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl shadow-pink-600/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    id="submit-reservation-btn"
                  >
                    Confirm VVIP Suites Reservation
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

              </div>
            )}

            {/* METRICS & BANNER STATISTICS */}
            {!selectedEvent && (
              <div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 bg-gradient-to-r from-[#0d0d12] via-[#07070a] to-[#0d0d12] border border-white/5 rounded-3xl"
                id="metrics-banner"
              >
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-gold-gradient">6</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-white/40 mt-1">Global Sanctuary perimeters</div>
                </div>
                <div className="text-center border-l lg:border-l border-white/5">
                  <div className="text-3xl font-display font-bold text-white">99.98%</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-white/40 mt-1">Acoustic Consistency rating</div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-3xl font-display font-bold text-white">12,980+</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-white/40 mt-1">VVIP Yacht Mooring and cabanas</div>
                </div>
                <div className="text-center border-l border-white/5">
                  <div className="text-3xl font-display font-bold text-gold-gradient">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-white/40 mt-1">Dedicated Concierge channels</div>
                </div>
              </div>
            )}

            {/* PRODUCT CATALOG REGISTRY LIST */}
            {!selectedEvent && (
              <div className="space-y-6">
                
                {/* Header Filter Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2" id="registry-explore-head font-display">
                  <div>
                    <h2 className="font-display font-medium text-xl text-white tracking-widest uppercase" id="registry-explore-title">
                      Elite Events Registry
                    </h2>
                    <p className="text-xs text-white/50">Curated global concerts and festival sanctuaries.</p>
                  </div>

                  {/* Filtering Controls Row */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-xl">
                      {(["all", "concert", "festival"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize select-none ${
                            categoryFilter === cat
                              ? "bg-white/10 text-white"
                              : "text-white/40 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Price Slider Dropdowns */}
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-white/40">Max:</span>
                      <span className="text-pink-400 font-bold">${maxPriceFilter}</span>
                      <input 
                        type="range"
                        min="200"
                        max="5000"
                        step="100"
                        value={maxPriceFilter}
                        onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                        className="w-20 accent-purple-500 h-1 cursor-pointer"
                      />
                    </div>

                  </div>
                </div>

                {/* EVENTS GRID LIST */}
                {filteredEvents.length > 0 ? (
                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    id="events-catalog-grid"
                  >
                    {filteredEvents.map((ev) => (
                      <EventCard 
                        key={ev.id}
                        event={ev}
                        onSelect={handleEventSelect}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-6 bg-black/20 rounded-2xl border border-white/5">
                    <p className="text-xs text-white/40">No premium events matching your specific search filters.</p>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ======================= TABS 2: AI REVIEWS & CONCIERGE ======================= */}
        {activeTab === "ai-concierge" && (
          <div className="space-y-6" id="tab-ai-panel">
            <AIChatRecommendations 
              events={events}
              onSelectEvent={handleEventSelect}
            />
          </div>
        )}

        {/* ======================= TABS 3: MY BOARDING PASSES ======================= */}
        {activeTab === "my-bookings" && (
          <div className="space-y-6" id="tab-boarding-passes-panel">
            
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-display font-medium text-xl text-white tracking-widest uppercase">
                VVIP Boarding Passes Cache
              </h2>
              <p className="text-xs text-white/50">Vaulted transaction details, biometric entry codes and credentials lanyards.</p>
            </div>

            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="bookings-history-grid">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="bg-[#0b0b0e] border border-white/5 hover:border-pink-500/20 rounded-2xl p-5 md:p-6 space-y-6 relative overflow-hidden transition-all shadow-xl select-none group"
                    id={`saved-ticket-${booking.id}`}
                  >
                    
                    {/* Top highlights */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500" />
                    
                    {/* Event Banner Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                      <div>
                        <span className="text-[8px] font-mono text-pink-400 tracking-wider uppercase block">
                          SOVEREIGN BOARDING CREDENTIALS
                        </span>
                        <h4 className="font-display font-semibold text-white leading-normal tracking-wide text-sm truncate max-w-xs md:max-w-md">
                          {booking.eventTitle}
                        </h4>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-[9px] text-white/30 block">ID: {booking.id}</span>
                        <span className="text-[10px] text-pink-400 font-bold tracking-wider">{booking.ticketType} TIER</span>
                      </div>
                    </div>

                    {/* Ticket core metadata */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 text-xs font-mono">
                      <div>
                        <div className="text-[8px] text-white/30 uppercase">Lanyard Tag</div>
                        <div className="text-white/80 font-sans font-medium mt-1 uppercase truncate">{booking.userName}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/30 uppercase">Date departure</div>
                        <div className="text-white/80 mt-1 truncate">{booking.eventDate}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/30 uppercase">Vault Area</div>
                        <div className="text-white/80 mt-1 truncate">{booking.eventLocation}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-white/30 uppercase">Suites Moored</div>
                        <div className="text-pink-400 font-bold mt-1 text-xs truncate">{booking.selectedSeats.join(", ")}</div>
                      </div>
                    </div>

                    {/* QR code and scan checks */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      <div className="text-center sm:text-left text-xs font-mono space-y-1">
                        <div className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          BIOMETRIC PASS LEVEL ACTIVE
                        </div>
                        <div className="text-[10px] text-white/50">{booking.badgeType}</div>
                        <div className="text-[9px] text-white/30 truncate max-w-[200px] block">PAYMENT ID: {booking.paymentId}</div>
                      </div>

                      <div className="p-1.5 bg-white rounded-lg">
                        <img 
                          src={booking.qrCodeUrl}
                          alt="QR validation"
                          className="w-14 h-14 border-0"
                        />
                      </div>

                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono border-t border-white/5">
                      <span className="text-white/40">Order Booked: {new Date(booking.dateBooked).toLocaleDateString()}</span>
                      <button
                        onClick={() => alert("Simulated print download triggered successfully.")}
                        className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 leading-none cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-black/20 border border-white/5 rounded-2xl max-w-sm mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-medium text-white tracking-widest">
                    NO ACTIVE PASSES VAULTED
                  </h4>
                  <p className="text-xs text-white/40 mt-1">
                    Book an exclusive seat coordinate inside the Explore Registry to generate customized boarding credentials.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold"
                >
                  Browse Registry
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* OVERLAY PORTAL DRAWER: BOOKING OVERLAY PORTAL CHECKOUT */}
      {checkoutTriggered && selectedEvent && (
        <BookingDetailsDrawer 
          event={selectedEvent}
          selectedSeats={selectedSeats}
          ticketType={ticketType}
          badgeType={badgeType}
          addonChampagne={addonChampagne}
          addonVIPLounge={addonVIPLounge}
          totalPaid={calculateTotalValuation()}
          onClose={() => setCheckoutTriggered(false)}
          onBookingSuccess={handleBookingCompleted}
        />
      )}

    </div>
  );
}

// Indicator helper components to keep modules clean
function CalendarIndicator() {
  return (
    <svg className="w-3.5 h-3.5 text-pink-500/75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MapPinIndicator() {
  return (
    <svg className="w-3.5 h-3.5 text-pink-500/75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
