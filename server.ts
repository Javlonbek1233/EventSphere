import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized GoogleGenAI with API key.");
  } catch (err) {
    console.error("Error initializing GoogleGenAI:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found, running in premium simulated AI mode.");
}

// JSON parsing and URL encoding middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core Events database
const EVENTS = [
  {
    id: "aurora-symphony",
    title: "Astral Symphony under the Auroras",
    description: "An awe-inspiring orchestral fusion inside structured geothermal domes under Tromsø's pristine dancing lights. Witness world-class harpists and ambient composers synchronize celestial movements with physical sound waves.",
    category: "concert",
    date: "March 12, 2027",
    time: "21:00 - 02:00 UTC",
    venue: "Solstice Geothermal Ring",
    location: "Tromsø, Norway",
    priceGeneral: 350,
    priceVIP: 1200,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200",
    rating: 4.95,
    lineUp: ["Ludovico Einaudi Ensemble", "Olafur Arnalds", "Max Richter"],
    vipPrivileges: [
      "VVIP Glass-Dome Suite Access",
      "Private Geothermal Hot-Spring pool service",
      "Gourmet Arctic infusion tasting menu curated by 3-Michelin-star chefs",
      "Polar Flight VIP Concierge Transfers",
      "Signed score archive and private meet"
    ],
    latitude: 69.6492,
    longitude: 18.9553,
    remainingTickets: 24,
    featured: true,
    countdownDate: "2027-03-12T21:00:00.000Z"
  },
  {
    id: "cyberdome-tokyo",
    title: "Neon Horizon: Tokyo Cyberdome",
    description: "Multi-sensory cybernetic electronic odyssey bridging high-latitude techno with neo-Tokyo visual projections. Fully haptic dome with floor-to-ceiling 24K spatial simulation mapping.",
    category: "concert",
    date: "September 18, 2026",
    time: "22:00 - 06:00 JST",
    venue: "Shinjuku Quantum Dome",
    location: "Tokyo, Japan",
    priceGeneral: 200,
    priceVIP: 750,
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200",
    rating: 4.88,
    lineUp: ["Charlotte de Witte", "Kolsch", "Tale of Us", "Steve Aoki Special Live set"],
    vipPrivileges: [
      "Sub-Vocal Audio Suite and private sound bar",
      "Neural-Haptic bodysuit Rental included",
      "Direct Backstage access overlooking DJ booths",
      "Complementary Sake flight selection & luxury Wagyu catering",
      "Private drone shuttle directly to Heliport"
    ],
    latitude: 35.6895,
    longitude: 139.6917,
    remainingTickets: 42,
    featured: true,
    countdownDate: "2026-09-18T22:00:00.000Z"
  },
  {
    id: "sahara-mirage",
    title: "Sahara Mirage: Golden Sands Festival",
    description: "An ultra-exclusive 3-day wellness and deep house pilgrimage nestled deep in the dunes of Merzouga. Fully climate-controlled luxury desert tents, modular dune stages, and twilight meditative soundscapes.",
    category: "festival",
    date: "May 5, 2026",
    time: "16:00 Friday - 10:00 Monday CEST",
    venue: "Imperial Golden Dunes Outpost",
    location: "Merzouga, Morocco",
    priceGeneral: 500,
    priceVIP: 2200,
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200",
    rating: 4.97,
    lineUp: ["Rufus Du Sol (Live)", "Black Coffee", "Ameme", "DJ Tennis", "Monolink"],
    vipPrivileges: [
      "Ultra-Luxe climate-controlled Bedouin Suite",
      "Private Helicopter airport-to-dune transfers from Marrakech",
      "24/7 dedicated personal butler service",
      "Exclusive Sunrise dune-back champagne breakfast",
      "Private wellness concierge & custom oil massage therapy"
    ],
    latitude: 31.0970,
    longitude: -4.0040,
    remainingTickets: 15,
    featured: true,
    countdownDate: "2026-05-05T16:00:00.000Z"
  },
  {
    id: "sovereign-ball",
    title: "Metropolis Opera: Sovereign VVIP Ball",
    description: "The crown jewel of absolute classical elegance. The annual Sovereign Gala inside Vienna's historic opera house, featuring premium orchestra acoustics, royal ballroom waltzing, and customized gourmet menus.",
    category: "concert",
    date: "December 31, 2026",
    time: "20:00 - 04:00 CET",
    venue: "Vienna State Opera House",
    location: "Vienna, Austria",
    priceGeneral: 600,
    priceVIP: 3500,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    rating: 4.99,
    lineUp: ["Vienna Philharmonic Orchestra", "Andrea Bocelli (Special Guest)", "Lang Lang"],
    vipPrivileges: [
      "Royal Sovereign Box seating (8-seat imperial private tier)",
      "9-Course luxury black-truffle degustation menu with Crystal Rose",
      "Private classical lounge & champagne caviar parlor",
      "Personalized white-glove chauffeur in Rolls Royce Phantom",
      "Exclusive backstage private meeting with lead performers"
    ],
    latitude: 48.2030,
    longitude: 16.3691,
    remainingTickets: 8,
    featured: false,
    countdownDate: "2026-12-31T20:00:00.000Z"
  },
  {
    id: "solstice-elysium",
    title: "Solstice Elysium: Greek Isle Sanctuary",
    description: "A private-estate sun-kissed musical sanctuary suspended over the Mykonian cliffs. Designed purely for elite travelers seeking acoustic perfection and yacht-side deep house sets.",
    category: "festival",
    date: "June 21, 2026",
    time: "15:00 - 05:00 EEST",
    venue: "Aethel Cliffside Private Estate",
    location: "Mykonos, Greece",
    priceGeneral: 400,
    priceVIP: 1800,
    image: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?q=80&w=1200",
    rating: 4.91,
    lineUp: ["Ben Bohmer", "Lane 8", "Nora En Pure", "Yotto", "Sasha"],
    vipPrivileges: [
      "VVIP Yacht Mooring and Tender shuttling",
      "Cliffside infinity-pool cabana access with dedicated bartender",
      "Complimentary top-tier organic Aegean raw-bar catalog",
      "Fast-track helicopter air corridors",
      "Post-festival wellness recovery IV-drip session guide"
    ],
    latitude: 37.4467,
    longitude: 25.3289,
    featured: false,
    remainingTickets: 19,
    countdownDate: "2026-06-21T15:00:00.000Z"
  },
  {
    id: "amazonian-echoes",
    title: "Savage Horizon: Amazonian Echoes",
    description: "Deep jungle ethno-melodic celebration. Experience live deep rhythms echoing off the canopy from state-of-the-art floating island stages tethered inside the Amazon river basin.",
    category: "festival",
    date: "October 2, 2026",
    time: "17:00 Friday - 23:00 Sunday ACT",
    venue: "Rio Negro Biodiversity Basin",
    location: "Manaus, Brazil",
    priceGeneral: 450,
    priceVIP: 1950,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    rating: 4.93,
    lineUp: ["Blond:ish", "Kelela", "Bedouin", "Sven Vath", "Nicola Cruz"],
    vipPrivileges: [
      "Eco-Luxury glass suspended treehouse suite overlook",
      "Private river speedboat chauffeur and day captain",
      "Rare Amazonian ingredient infusions & biological gourmet kitchen",
      "Guided canopy night expeditions & wellness shamanic rituals",
      "Charity rainforest conservation badge (10% proceeds matched)"
    ],
    latitude: -3.1019,
    longitude: -60.0250,
    featured: false,
    remainingTickets: 12,
    countdownDate: "2026-10-02T17:00:00.000Z"
  }
];

// Initial pre-booked mock ticket to populate dashboard on first load
let BOOKINGS = [
  {
    id: "b-9081231",
    eventId: "aurora-symphony",
    eventTitle: "Astral Symphony under the Auroras",
    eventDate: "March 12, 2027",
    eventLocation: "Tromsø, Norway",
    eventImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200",
    userName: "Royal Custodian VIP",
    userEmail: "vip@eventsphere.com",
    selectedSeats: ["Dome-A4", "Dome-A5"],
    ticketType: "VIP",
    badgeType: "Platinum Backstage Passes",
    addonChampagne: true,
    addonVIPLounge: true,
    totalPaid: 2470,
    barcode: "TICKET-AURA-VIP-901812389",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EventSphere-aurora-symphony-B-9081231",
    dateBooked: "2026-05-24T10:14:12.000Z",
    paymentId: "ch_sim_389271a0fd182f"
  }
];

// --- 1. ENDPOINTS ---

// Fetch all events
app.get("/api/events", (req, res) => {
  res.json(EVENTS);
});

// Fetch all bookings
app.get("/api/bookings", (req, res) => {
  res.json(BOOKINGS);
});

// Submit a booking (Simulated Stripe checkout flow)
app.post("/api/checkout", (req, res) => {
  const {
    eventId,
    userName,
    userEmail,
    selectedSeats,
    ticketType,
    badgeType,
    addonChampagne,
    addonVIPLounge,
    totalPaid,
    paymentMethodId // Simulated card details
  } = req.body;

  // Basic validation
  if (!eventId || !userName || !userEmail || !selectedSeats || !selectedSeats.length) {
    return res.status(400).json({ error: "Missing required checkout parameters." });
  }

  const foundEvent = EVENTS.find(e => e.id === eventId);
  if (!foundEvent) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Update original event state (decrement remaining tickets)
  foundEvent.remainingTickets = Math.max(0, foundEvent.remainingTickets - selectedSeats.length);

  const randId = Math.floor(1000000 + Math.random() * 9000000);
  const newBooking = {
    id: `b-${randId}`,
    eventId,
    eventTitle: foundEvent.title,
    eventDate: foundEvent.date,
    eventLocation: foundEvent.location,
    eventImage: foundEvent.image,
    userName,
    userEmail,
    selectedSeats,
    ticketType,
    badgeType,
    addonChampagne: !!addonChampagne,
    addonVIPLounge: !!addonVIPLounge,
    totalPaid,
    barcode: `TICKET-${eventId.slice(0, 4).toUpperCase()}-${ticketType.toUpperCase()}-${randId}`,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EventSphere-${eventId}-${randId}`,
    dateBooked: new Date().toISOString(),
    paymentId: `ch_stripe_sim_${Math.random().toString(36).substring(2, 16)}`
  };

  BOOKINGS.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: "VIP Secure Stripe Transaction Completed Successfully",
    booking: newBooking
  });
});

// Gemini AI Recommendations Endpoint
app.post("/api/recommendations", async (req, res) => {
  const { vibe, preferredGenres, maxPrice, locationPreference } = req.body;

  const genresStr = Array.isArray(preferredGenres) ? preferredGenres.join(", ") : "Any music genre";

  const prompt = `
  You are an ultra-exclusive luxury VIP Events Concierge for "EventSphere", the world's most premium platform for concerts and festivals.
  The client is seeking customized experiences. Here is their profile:
  - Vibe Sought: "${vibe || "luxurious, high-energy, memorable"}"
  - Preferred Music/Art Genres: "${genresStr}"
  - Maximum Budget (Per Ticket): $${maxPrice || "Unlimited"}
  - Preferred Region / Location: "${locationPreference || "Global / Anywhere"}"

  We have exactly the following exclusive EventSphere events currently listed in our high-end registry:
  ${JSON.stringify(EVENTS.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    date: e.date,
    location: e.location,
    priceGeneral: e.priceGeneral,
    priceVIP: e.priceVIP,
    lineUp: e.lineUp,
    vipPrivileges: e.vipPrivileges
  })), null, 2)}

  Recommend 1 to 3 events from our registry that match their preferences. If there is a budget restriction, only suggest events whose prices (either GP or VIP) would fit.
  
  Write a beautiful, personalized, high-society elite message addressed directly to them (concierge style), select the recommended event IDs, and build a suggested premium luxury itinerary (including attire suggestions, timing tips, pre-event dining recommendations).

  You must return your reply ONLY as a valid JSON object matching the following Schema:
  {
    "customMessage": string (elegant, high-end VIP message),
    "recommendedEventIds": string[] (array of IDs from the provided registry),
    "suggestedItinerary": string (detailed luxury hour-by-hour itinerary of their trip, pre-event prep, attire, and VIP privileges optimization tips in Markdown format)
  }
  `;

  if (ai) {
    try {
      console.log("Calling Gemini API for VIP Concierge recommendation...");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              customMessage: {
                type: Type.STRING,
                description: "Personalized, luxury-tone welcome message explaining why these events match."
              },
              recommendedEventIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Matches from the listed ids."
              },
              suggestedItinerary: {
                type: Type.STRING,
                description: "Luxury preparation and event itinerary in markdown format."
              }
            },
            required: ["customMessage", "recommendedEventIds", "suggestedItinerary"]
          }
        }
      });

      const responseText = response.text ? response.text.trim() : "";
      const resultObj = JSON.parse(responseText);
      return res.json(resultObj);

    } catch (err) {
      console.error("Gemini API Error, falling back to smart luxury rules:", err);
      // Fall through to simulated fallback
    }
  }

  // --- Premium Local Simulation Rule (Fallback or Offline fallback) ---
  console.log("Executing high-fidelity simulated luxury recommender...");

  // Match based on genres and location
  let scores = EVENTS.map(ev => {
    let score = 0;
    const descLower = ev.description.toLowerCase() + " " + ev.title.toLowerCase();

    // Check budget
    if (maxPrice && ev.priceGeneral > maxPrice) {
      score -= 50; // heavily penalize beyond budget
    } else if (maxPrice && ev.priceVIP <= maxPrice) {
      score += 5; // can afford VIP
    }

    // Genre scoring
    if (Array.isArray(preferredGenres)) {
      preferredGenres.forEach(g => {
        if (descLower.includes(g.toLowerCase())) score += 15;
      });
    }

    // Location scoring
    if (locationPreference && locationPreference !== "Global / Anywhere") {
      if (ev.location.toLowerCase().includes(locationPreference.toLowerCase())) {
        score += 30;
      }
    }

    // Vibe scoring
    if (vibe) {
      const vWords = vibe.toLowerCase().split(/[ ,]+/);
      vWords.forEach(w => {
        if (w.length > 3 && descLower.includes(w)) score += 5;
      });
    }

    return { id: ev.id, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const matchedIds = scores.filter(s => s.score > -20).slice(0, 2).map(s => s.id);
  const finalMatches = matchedIds.length > 0 ? matchedIds : ["aurora-symphony", "sahara-mirage"];

  // Generate customized luxury wording
  const chosenEvent = EVENTS.find(e => e.id === finalMatches[0]) || EVENTS[0];
  const customMessage = `Welcome to EventSphere Elite Concierge. Based on your desire for a ${vibe || "masterfully curated"} experience featuring ${genresStr}, we have hand-picked the absolute peak of global luxury events: ${chosenEvent.title}. This represents our finest VIP accommodation, bespoke high-level sound engineering, and incomparable high-society guest circles. Here is your tailored invitation.`;

  const suggestedItinerary = `
### 👑 Your Sovereign Concierge Itinerary: ${chosenEvent.title}

#### **Pre-Departure & Tailoring**
*   **Aesthetic & Dress Code**: High elegance and luxury wear. For geothermal/desert locations, prepare layered elite cashmere, organic silks, and refined adventure-tech footwear.
*   **VIP Transport**: Our dedicated booking agents will clear the heliport corridors and queue your private Mercedes Maybach or custom aircraft directly to ${chosenEvent.location}.

#### **Day of Event Schedule**
-   **16:00**: Board your private flight/shuttle to the exclusive ${chosenEvent.venue} perimeter. Fast-track entry cleared via custom haptic biometric token.
-   **18:30**: Enjoy an elite 9-course gourmet degustation dinner paired with reserve estate champagnes, completely hosted inside the private EventSphere Glass Pavilion.
-   **20:30**: Absolute priority escort to the **VVIP Royal Viewing Deck** — directly interfacing the main stage with optimized acoustic angles. Meet key performers and curators backstage.
-   **23:00**: Experience bespoke performance alongside complimentary premium caviar, molecular mixology, and dynamic high-fidelity seating.
-   **Post-Event**: Rest assured, luxury private transfers will hold on standby to return you safely to your high-end suites or yacht decks.
  `;

  res.json({
    customMessage,
    recommendedEventIds: finalMatches,
    suggestedItinerary
  });
});

// --- 2. VITE DEPLOYMENT MIDDLEWARE ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server running in middleware mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EventSphere Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
