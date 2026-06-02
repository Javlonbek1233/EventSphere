import { useState } from "react";
import { X, CreditCard, ShieldCheck, Download, Sparkles, CheckCircle2, QrCode, ArrowRight } from "lucide-react";
import { Event, Booking } from "../types";

interface BookingDetailsDrawerProps {
  event: Event;
  selectedSeats: string[];
  ticketType: "General" | "VIP" | "VVIP Royal Box";
  badgeType: "Standard Access" | "Gold VIP Core" | "Platinum Backstage Passes";
  addonChampagne: boolean;
  addonVIPLounge: boolean;
  totalPaid: number;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export default function BookingDetailsDrawer({
  event,
  selectedSeats,
  ticketType,
  badgeType,
  addonChampagne,
  addonVIPLounge,
  totalPaid,
  onClose,
  onBookingSuccess,
}: BookingDetailsDrawerProps) {
  
  const [userName, setUserName] = useState("Javlon Xaydar");
  const [userEmail, setUserEmail] = useState("javlonxayit@gmail.com");
  
  // Card elements
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCVC, setCardCVC] = useState("379");

  const [checkoutState, setCheckoutState] = useState<"idle" | "processing" | "completed">("idle");
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const handleCheckoutCommit = async () => {
    if (!userName || !userEmail) {
      alert("Please provide a name and email for the credentials.");
      return;
    }
    
    setCheckoutState("processing");

    try {
      // Post to our custom Stripe-simulation API endpoint in the server.ts
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          userName,
          userEmail,
          selectedSeats,
          ticketType,
          badgeType,
          addonChampagne,
          addonVIPLounge,
          totalPaid,
          paymentMethodId: "pm_sim_stripe_exclusive_sphere"
        }),
      });

      if (!response.ok) {
        throw new Error("Simulated Stripe gateway returned an error.");
      }

      const outcome = await response.json();
      if (outcome.success) {
        // Successful simulation!
        setTimeout(() => {
          setCreatedBooking(outcome.booking);
          setCheckoutState("completed");
          onBookingSuccess(outcome.booking);
        }, 1500); // graceful loading sequence
      }

    } catch (err) {
      console.error(err);
      setCheckoutState("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="booking-drawer-scaffolding">
      
      {/* DRAWER LAYER */}
      <div 
        className="relative w-full max-w-2xl bg-[#0a0a0d] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
        id="booking-drawer-inner"
      >
        
        {/* TOP GLOW DECORATIONS */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-600" />

        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-pink-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              SOVEREIGN TRANSACTIONS CORE
            </span>
            <h3 className="font-display font-medium text-lg text-white">
              {checkoutState === "completed" ? "Boarding Pass Generated" : "Enter Secure VIP Gateway"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white"
            id="close-drawer-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SCROLLABLE INTERIOR */}
        <div className="p-6 max-h-[75vh] overflow-y-auto no-scrollbar" id="drawer-body">

          {/* STATE 1: SECURE CHECKOUT INTERFACE */}
          {checkoutState === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="checkout-form">
              
              {/* Left Column: Summary and credentials name */}
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={event.image} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded-lg border border-white/10"
                    />
                    <div>
                      <h4 className="font-display font-semibold text-xs text-white leading-snug">
                        {event.title}
                      </h4>
                      <div className="text-[9px] text-white/40 block mt-0.5">{event.location}</div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-white/50">
                      <span>Tier Class:</span>
                      <span className="text-purple-300">{ticketType}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Lanyard Badge:</span>
                      <span className="text-white/80">{badgeType}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Selected Suites ({selectedSeats.length}):</span>
                      <span className="text-white/80">{selectedSeats.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Name on Lanyard Form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-1">
                      Credentials Owner Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      id="owner-name-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-1">
                      VIP Notification Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      id="owner-email-input"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Simulated Stripe Credit Card Module */}
              <div className="space-y-4">
                <div className="bg-gradient-to-tr from-[#121118] via-[#1a1924] to-[#252233] border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between aspect-[1.58/1] shadow-xl">
                  {/* Decorative Elements */}
                  <div className="absolute top-5 right-5 text-lg font-bold text-purple-500/20 italic font-display">EVENTSPHERE</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-7 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-pink-400" />
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-900/20 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Stripe Verified
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-white/90 font-mono tracking-widest">{cardNumber}</div>
                    <div className="flex justify-between items-center font-mono">
                      <div>
                        <div className="text-[7px] text-white/30 uppercase">Holder</div>
                        <div className="text-[9px] text-white/80 font-sans tracking-wide uppercase">{userName || "VIP CUSTODIAN"}</div>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <div className="text-[7px] text-white/30 uppercase">Expiry</div>
                          <div className="text-[9px] text-white/80">{cardExpiry}</div>
                        </div>
                        <div>
                          <div className="text-[7px] text-white/30 uppercase">CVC</div>
                          <div className="text-[9px] text-white/80">{cardCVC}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form fields for Credit Card Mock Input */}
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                      placeholder="4111 2222 3333 4444"
                      id="card-num-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                        placeholder="MM/YY"
                        id="card-exp-input"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                        placeholder="3-digit"
                        id="card-cvc-input"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STATE 2: STRIPE NETWORK PROCESSING */}
          {checkoutState === "processing" && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-4" id="processing-checkout">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
                <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center text-pink-500 font-bold">
                  $
                </div>
              </div>
              <div>
                <h4 className="font-display font-medium text-white tracking-widest animate-pulse">
                  ESTABLISHING SECURE PORTAL
                </h4>
                <p className="text-[9px] text-white/40 font-mono tracking-wider mt-1 uppercase">
                  Routing biometric ticket sequence via Stripe API...
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: BOARDING PASS OUTCOME */}
          {checkoutState === "completed" && createdBooking && (
            <div className="space-y-6" id="completed-boarding-pass">
              
              <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-2 mb-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-medium text-white tracking-widest">
                  ACCESS GENERATED SECURELY
                </h4>
                <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/20">
                  Sovereign Badge Level: {badgeType}
                </p>
              </div>

              {/* EXPERIMENTAL EXQUISITE GRAPHICAL VIP BOARDING TICKET */}
              <div className="bg-gradient-to-b from-[#181822] to-[#0c0c11] border border-purple-500/30 rounded-2xl overflow-hidden relative shadow-2xl animate-float">
                {/* Gold/Purple Fringe lines */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600" />
                
                {/* Left/Right mock serrated ticket holes */}
                <div className="absolute left-0 top-[60%] -translate-y-1/2 w-4 h-8 bg-[#0a0a0d] border-r border-[#0a0a0d] rounded-r-full" />
                <div className="absolute right-0 top-[60%] -translate-y-1/2 w-4 h-8 bg-[#0a0a0d] border-l border-[#0a0a0d] rounded-l-full" />

                {/* Main section */}
                <div className="p-5 md:p-6 space-y-6">
                  
                  {/* Event, Logo & Status */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                    <div>
                      <span className="text-[8px] font-mono text-pink-400 tracking-wider uppercase block">
                        VIP CONCERT ACCESS CREDENTIALS
                      </span>
                      <h4 className="font-display font-bold text-white tracking-wide text-base leading-snug">
                        {createdBooking.eventTitle}
                      </h4>
                    </div>
                    <div className="text-right sm:text-right font-mono self-start sm:self-auto">
                      <div className="text-[9px] text-pink-400 font-semibold tracking-widest">EVENTSPHERE</div>
                      <div className="text-[8px] text-white/30 uppercase mt-0.5">Sovereign No: {createdBooking.id}</div>
                    </div>
                  </div>

                  {/* Ticket core metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-1 text-xs font-mono">
                    <div>
                      <div className="text-[8px] text-white/30 uppercase">Lanyard Holder</div>
                      <div className="text-white/80 font-sans tracking-wide font-medium mt-1 truncate">{createdBooking.userName}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/30 uppercase">Date of Departure</div>
                      <div className="text-white/80 mt-1 truncate">{createdBooking.eventDate}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/30 uppercase">Venue Destination</div>
                      <div className="text-white/80 mt-1 truncate">{createdBooking.eventLocation}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/30 uppercase">Assigned Suites</div>
                      <div className="text-pink-400 font-bold mt-1 text-xs truncate">{createdBooking.selectedSeats.join(", ")}</div>
                    </div>
                  </div>

                  {/* VIP Perks */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3 py-4 text-xs font-serif text-white/70 italic relative overflow-hidden">
                    <div className="text-[8px] font-mono uppercase tracking-widest text-pink-400 not-italic mb-1.5 label">
                      Exclusive Perks Active Inside Suite
                    </div>
                    ✦ Premium Fast-Track Biometric Ingress Corridor cleared.<br />
                    {createdBooking.addonChampagne && "✦ Dom Pérignon celebratory ice bottle awaiting in suite.\n"}
                    {createdBooking.addonVIPLounge && "✦ Fully unlocked access to 3-Michelin Culinary parlor bars.\n"}
                    ✦ Fully customized commemorative glass token.
                  </div>

                  {/* QR Core segment */}
                  <div className="pt-4 border-t border-dashed border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="text-center sm:text-left space-y-1">
                      <div className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        SECURE STRIPE TRANSACTION SYNCED
                      </div>
                      <div className="text-[10px] text-white/50 font-mono">ID: {createdBooking.paymentId.slice(0, 18)}</div>
                      <div className="text-[9px] text-white/30 uppercase leading-none font-mono">
                        Verification Code: {createdBooking.barcode}
                      </div>
                    </div>

                    {/* QR Code container */}
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl">
                      <img 
                        src={createdBooking.qrCodeUrl}
                        alt="Security QR Code"
                        className="w-16 h-16 border-0 select-none pointer-events-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Footer simulation check */}
                <div className="bg-[#101017] p-3 text-center border-t border-white/5">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block">
                    * Present at verification nodes for boarding confirmation. Powered by Stripe simulation layer.
                  </span>
                </div>

              </div>

              {/* DOWNLOAD & PRINT CONTROLS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert("Simulation Utility: Premium Ticket credentials PDF exported successfully.")}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-500/15"
                  id="download-btn"
                >
                  <Download className="w-4 h-4 text-white stroke-[2.5]" />
                  Save Credentials PDF
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                  id="checkout-all-finish-btn"
                >
                  Finish
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER PRICES (Only shown during state 1) */}
        {checkoutState === "idle" && (
          <div className="p-5 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left font-mono">
              <span className="text-[8px] text-white/40 uppercase tracking-wider block">Total Payment amount</span>
              <div className="text-lg font-bold text-pink-400">${totalPaid} USD</div>
            </div>

            <button
              onClick={handleCheckoutCommit}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
              id="confirm-checkout"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
              Secure Payment via Stripe
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
