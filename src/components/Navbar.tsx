import { Compass, Sparkles, Ticket, ShieldCheck, User, Search } from "lucide-react";

interface NavbarProps {
  activeTab: "discover" | "ai-concierge" | "my-bookings";
  setActiveTab: (tab: "discover" | "ai-concierge" | "my-bookings") => void;
  bookingCount: number;
  searchFilter: string;
  setSearchFilter: (search: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  bookingCount,
  searchFilter,
  setSearchFilter,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full pt-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto glass-elite rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-black/80">
        
        {/* LOGO */}
        <div 
          onClick={() => setActiveTab("discover")} 
          className="flex items-center gap-3 cursor-pointer group"
          id="navbar-logo"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-purple-600 to-pink-500 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-5 h-5 text-white stroke-[2]" />
            <div className="absolute inset-0 rounded-xl border border-white/20 animate-pulse" />
          </div>
          <div>
            <span className="font-display font-semibold text-xl tracking-widest text-gold-gradient group-hover:opacity-90">
              EVENTSPHERE
            </span>
            <div className="text-[9px] tracking-widest text-white/50 font-mono -mt-1 uppercase">
              ULTIMATE GLOBAL FESTIVALS
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER (only shown or used inside discover, but can stay in navbar) */}
        <div className="relative w-full md:w-80" id="navbar-search-container">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search elite concerts & festivals..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-10 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 font-sans transition-all duration-300"
            id="navbar-search-input"
          />
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1 sm:gap-2 w-full md:w-auto overflow-x-auto no-scrollbar scroll-smooth" id="navbar-tabs-container">
          
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "discover"
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-500/40 text-purple-100 shadow-lg shadow-purple-500/5"
                : "border border-transparent text-white/60 hover:text-white hover:bg-white/5"
            }`}
            id="tab-discover"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            Explore Registry
          </button>

          <button
            onClick={() => setActiveTab("ai-concierge")}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "ai-concierge"
                ? "bg-gradient-to-r from-purple-505/20 to-pink-500/10 border border-purple-500/40 text-purple-100 shadow-lg shadow-purple-500/5"
                : "border border-transparent text-white/60 hover:text-white hover:bg-white/5"
            }`}
            id="tab-ai-concierge"
          >
            <Sparkles className="w-4 h-4 text-pink-400 stroke-[2] animate-pulse" />
            AI VVIP Concierge
          </button>

          <button
            onClick={() => setActiveTab("my-bookings")}
            className={`relative flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all duration-300 whitespace-nowrap ${
              activeTab === "my-bookings"
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-600/10 border border-emerald-500/40 text-emerald-100 shadow-lg shadow-emerald-500/5"
                : "border border-transparent text-white/60 hover:text-white hover:bg-white/5"
            }`}
            id="tab-bookings"
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            My Boarding Passes
            {bookingCount > 0 && (
              <span className="absolute -top-1.5 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-pink-500 px-1 text-[8px] font-bold text-white ring-2 ring-[#0a0a0c]">
                {bookingCount}
              </span>
            )}
          </button>

        </div>

        {/* PROFILE BADGE */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10" id="navbar-profile">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-white/70" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-semibold text-white/80 leading-none">Javlon Xaydar</div>
            <div className="text-[8px] font-mono text-purple-400 leading-none mt-1">Sovereign Circle VIP</div>
          </div>
        </div>

      </div>
    </header>
  );
}
