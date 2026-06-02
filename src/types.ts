/**
 * Shared Type Definitions for EventSphere Platform
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  category: "concert" | "festival";
  date: string; // ISO format or detailed human label
  time: string;
  venue: string;
  location: string;
  priceGeneral: number;
  priceVIP: number;
  image: string;
  rating: number;
  lineUp: string[];
  vipPrivileges: string[];
  latitude: number;
  longitude: number;
  remainingTickets: number;
  featured: boolean;
  countdownDate: string; // ISO 8601 for live countdowns
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  userName: string;
  userEmail: string;
  selectedSeats: string[];
  ticketType: "General" | "VIP" | "VVIP Royal Box";
  badgeType: "Standard Access" | "Gold VIP Core" | "Platinum Backstage Passes";
  addonChampagne: boolean;
  addonVIPLounge: boolean;
  totalPaid: number;
  barcode: string;
  qrCodeUrl: string;
  dateBooked: string;
  paymentId: string;
}

export interface RecommendationRequest {
  vibe: string;
  preferredGenres: string[];
  maxPrice: number;
  locationPreference: string;
}

export interface RecommendationResult {
  customMessage: string;
  recommendedEventIds: string[];
  suggestedItinerary: string;
}
