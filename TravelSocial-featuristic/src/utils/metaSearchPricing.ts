/**
 * Meta-Search Dynamic Pricing Engine
 * 
 * This module generates realistic dynamic prices for flights and hotels
 * without using any external APIs. Prices are calculated based on:
 * - Distance between cities
 * - Travel type (flight/hotel)
 * - Random demand multiplier
 * - Daily price variation (date-based seed)
 * 
 * All prices are in INR (₹)
 */

// Major city coordinates for distance calculation
interface CityCoordinates {
  [key: string]: { lat: number; lon: number; tier: number };
}

const CITY_COORDINATES: CityCoordinates = {
  // India
  'delhi': { lat: 28.6139, lon: 77.2090, tier: 1 },
  'mumbai': { lat: 19.0760, lon: 72.8777, tier: 1 },
  'bangalore': { lat: 12.9716, lon: 77.5946, tier: 1 },
  'bengaluru': { lat: 12.9716, lon: 77.5946, tier: 1 },
  'chennai': { lat: 13.0827, lon: 80.2707, tier: 1 },
  'kolkata': { lat: 22.5726, lon: 88.3639, tier: 1 },
  'hyderabad': { lat: 17.3850, lon: 78.4867, tier: 1 },
  'pune': { lat: 18.5204, lon: 73.8567, tier: 2 },
  'ahmedabad': { lat: 23.0225, lon: 72.5714, tier: 2 },
  'jaipur': { lat: 26.9124, lon: 75.7873, tier: 2 },
  'goa': { lat: 15.2993, lon: 74.1240, tier: 2 },
  'kochi': { lat: 9.9312, lon: 76.2673, tier: 2 },
  'lucknow': { lat: 26.8467, lon: 80.9462, tier: 2 },
  'chandigarh': { lat: 30.7333, lon: 76.7794, tier: 2 },
  'varanasi': { lat: 25.3176, lon: 82.9739, tier: 3 },
  'agra': { lat: 27.1767, lon: 78.0081, tier: 3 },
  'udaipur': { lat: 24.5854, lon: 73.7125, tier: 3 },
  'shimla': { lat: 31.1048, lon: 77.1734, tier: 3 },
  'manali': { lat: 32.2432, lon: 77.1892, tier: 3 },
  'darjeeling': { lat: 27.0410, lon: 88.2663, tier: 3 },
  'rishikesh': { lat: 30.0869, lon: 78.2676, tier: 3 },
  
  // International
  'london': { lat: 51.5074, lon: -0.1278, tier: 1 },
  'paris': { lat: 48.8566, lon: 2.3522, tier: 1 },
  'new york': { lat: 40.7128, lon: -74.0060, tier: 1 },
  'dubai': { lat: 25.2048, lon: 55.2708, tier: 1 },
  'singapore': { lat: 1.3521, lon: 103.8198, tier: 1 },
  'bangkok': { lat: 13.7563, lon: 100.5018, tier: 2 },
  'tokyo': { lat: 35.6762, lon: 139.6503, tier: 1 },
  'sydney': { lat: -33.8688, lon: 151.2093, tier: 1 },
  'bali': { lat: -8.3405, lon: 115.0920, tier: 2 },
  'maldives': { lat: 3.2028, lon: 73.2207, tier: 2 },
  'phuket': { lat: 7.8804, lon: 98.3923, tier: 2 },
  'hong kong': { lat: 22.3193, lon: 114.1694, tier: 1 },
  'amsterdam': { lat: 52.3676, lon: 4.9041, tier: 1 },
  'rome': { lat: 41.9028, lon: 12.4964, tier: 1 },
  'barcelona': { lat: 41.3851, lon: 2.1734, tier: 1 },
  'los angeles': { lat: 34.0522, lon: -118.2437, tier: 1 },
  'san francisco': { lat: 37.7749, lon: -122.4194, tier: 1 },
  'toronto': { lat: 43.6532, lon: -79.3832, tier: 1 },
  'melbourne': { lat: -37.8136, lon: 144.9631, tier: 1 },
  'kuala lumpur': { lat: 3.1390, lon: 101.6869, tier: 2 },
  'seoul': { lat: 37.5665, lon: 126.9780, tier: 1 },
  'istanbul': { lat: 41.0082, lon: 28.9784, tier: 1 },
  'cairo': { lat: 30.0444, lon: 31.2357, tier: 2 },
  'mauritius': { lat: -20.3484, lon: 57.5522, tier: 2 },
  'kathmandu': { lat: 27.7172, lon: 85.3240, tier: 3 },
  'colombo': { lat: 6.9271, lon: 79.8612, tier: 2 },
  'dhaka': { lat: 23.8103, lon: 90.4125, tier: 2 },
};

// Flight providers with their base multipliers and booking URLs
export interface FlightProvider {
  name: string;
  baseMultiplier: number;
  getBookingUrl: (from: string, to: string, date: string) => string;
  logo: string;
}

export const FLIGHT_PROVIDERS: FlightProvider[] = [
  {
    name: 'Skyscanner',
    baseMultiplier: 1.0,
    getBookingUrl: (from, to, date) => 
      `https://www.skyscanner.co.in/transport/flights/${encodeURIComponent(from.toLowerCase())}/${encodeURIComponent(to.toLowerCase())}/${date.replace(/-/g, '').slice(2)}/?adults=1&adultsv2=1&cabinclass=economy&childrenv2=&ref=home&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`,
    logo: '🔍'
  },
  {
    name: 'Google Flights',
    baseMultiplier: 0.98,
    getBookingUrl: (from, to, date) => 
      `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(to)}%20from%20${encodeURIComponent(from)}%20on%20${date}`,
    logo: '🌐'
  },
  {
    name: 'Kayak',
    baseMultiplier: 1.02,
    getBookingUrl: (from, to, date) => 
      `https://www.kayak.co.in/flights/${encodeURIComponent(from)}-${encodeURIComponent(to)}/${date}?sort=bestflight_a`,
    logo: '🛫'
  },
  {
    name: 'Ixigo',
    baseMultiplier: 0.95,
    getBookingUrl: (from, to, date) => 
      `https://www.ixigo.com/search/result/flight?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}&adults=1&children=0&infants=0&class=e&source=Search%20Form`,
    logo: '🎯'
  },
  {
    name: 'Cleartrip',
    baseMultiplier: 1.03,
    getBookingUrl: (from, to, date) => 
      `https://www.cleartrip.com/flights/results?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&depart_date=${date}&adults=1`,
    logo: '✈️'
  }
];

// Hotel providers with their base multipliers and booking URLs
export interface HotelProvider {
  name: string;
  baseMultiplier: number;
  getBookingUrl: (city: string, checkIn: string, checkOut: string) => string;
  logo: string;
  type: 'hotel' | 'hostel' | 'all';
}

export const HOTEL_PROVIDERS: HotelProvider[] = [
  {
    name: 'Booking.com',
    baseMultiplier: 1.0,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&no_rooms=1`,
    logo: '🏨',
    type: 'hotel'
  },
  {
    name: 'Hostelworld',
    baseMultiplier: 0.65,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.hostelworld.com/s?q=${encodeURIComponent(city)}&dateFrom=${checkIn}&dateTo=${checkOut}&guests=1`,
    logo: '🎒',
    type: 'hostel'
  },
  {
    name: 'Agoda',
    baseMultiplier: 0.95,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.agoda.com/search?city=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=2`,
    logo: '🌟',
    type: 'hotel'
  },
  {
    name: 'Trivago',
    baseMultiplier: 0.92,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.trivago.in/en-IN/srl/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}?search=${encodeURIComponent(city)}&sdate=${checkIn}&edate=${checkOut}&adults=2&rooms=1`,
    logo: '🔎',
    type: 'all'
  },
  {
    name: 'Hotels.com',
    baseMultiplier: 1.05,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.hotels.com/search.do?destination=${encodeURIComponent(city)}&startDate=${checkIn}&endDate=${checkOut}&rooms=1&adults=2`,
    logo: '🏠',
    type: 'hotel'
  },
  {
    name: 'Goibibo',
    baseMultiplier: 0.88,
    getBookingUrl: (city, checkIn, checkOut) => 
      `https://www.goibibo.com/hotels/search/?dest=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&rooms=1&adults=2`,
    logo: '🛎️',
    type: 'hotel'
  }
];

/**
 * Seeded random number generator for consistent daily prices
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate a seed based on date, route, and provider
 */
function generateSeed(date: string, ...factors: string[]): number {
  const today = new Date().toISOString().split('T')[0];
  const combinedString = `${today}-${date}-${factors.join('-')}`;
  
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculate distance between two cities using Haversine formula
 */
function calculateDistance(city1: string, city2: string): number {
  const normalizedCity1 = city1.toLowerCase().split(',')[0].trim();
  const normalizedCity2 = city2.toLowerCase().split(',')[0].trim();
  
  const coords1 = CITY_COORDINATES[normalizedCity1];
  const coords2 = CITY_COORDINATES[normalizedCity2];
  
  if (!coords1 || !coords2) {
    // Default distance for unknown cities (medium-haul)
    return 1500;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
  const dLon = (coords2.lon - coords1.lon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
}

/**
 * Get city tier for pricing adjustments
 */
function getCityTier(city: string): number {
  const normalizedCity = city.toLowerCase().split(',')[0].trim();
  return CITY_COORDINATES[normalizedCity]?.tier || 2;
}

/**
 * Calculate demand multiplier based on date and season
 */
function calculateDemandMultiplier(date: string, seed: number): number {
  const travelDate = new Date(date);
  const month = travelDate.getMonth();
  const dayOfWeek = travelDate.getDay();
  
  // Base seasonal multiplier
  let seasonalMultiplier = 1.0;
  
  // Peak season (Dec-Jan, Apr-May for India)
  if (month === 11 || month === 0 || month === 3 || month === 4) {
    seasonalMultiplier = 1.3;
  }
  // Off-season (July-August monsoon)
  else if (month === 6 || month === 7) {
    seasonalMultiplier = 0.85;
  }
  // Shoulder season
  else {
    seasonalMultiplier = 1.0;
  }
  
  // Weekend premium
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    seasonalMultiplier *= 1.15;
  }
  
  // Days until travel (last-minute vs advance booking)
  const today = new Date();
  const daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let bookingMultiplier = 1.0;
  if (daysUntilTravel <= 3) {
    bookingMultiplier = 1.4; // Last minute premium
  } else if (daysUntilTravel <= 7) {
    bookingMultiplier = 1.2;
  } else if (daysUntilTravel <= 14) {
    bookingMultiplier = 1.05;
  } else if (daysUntilTravel >= 60) {
    bookingMultiplier = 0.9; // Early bird discount
  }
  
  // Random demand fluctuation (±15%)
  const randomFactor = 0.85 + (seededRandom(seed) * 0.3);
  
  return seasonalMultiplier * bookingMultiplier * randomFactor;
}

/**
 * Flight Result Interface
 */
export interface FlightResult {
  id: string;
  provider: string;
  price: number;
  currency: string;
  duration: string;
  departure: string;
  arrival: string;
  stops: string;
  bookingUrl: string;
  logo: string;
  isBestDeal: boolean;
}

/**
 * Generate dynamic flight prices
 */
export function generateFlightPrices(
  from: string,
  to: string,
  date: string
): FlightResult[] {
  const distance = calculateDistance(from, to);
  const fromTier = getCityTier(from);
  const toTier = getCityTier(to);
  
  // Base price calculation (INR per km with diminishing rate for long distances)
  let basePrice: number;
  if (distance < 500) {
    // Short haul
    basePrice = 2500 + (distance * 3);
  } else if (distance < 2000) {
    // Medium haul
    basePrice = 4000 + (distance * 2.5);
  } else if (distance < 5000) {
    // Long haul
    basePrice = 8000 + (distance * 2);
  } else {
    // Ultra long haul
    basePrice = 15000 + (distance * 1.5);
  }
  
  // Tier adjustment
  const tierMultiplier = 1 + ((fromTier + toTier - 2) * 0.05);
  basePrice *= tierMultiplier;
  
  const results: FlightResult[] = FLIGHT_PROVIDERS.map((provider, index) => {
    const seed = generateSeed(date, from, to, provider.name);
    const demandMultiplier = calculateDemandMultiplier(date, seed);
    
    // Provider-specific price
    const providerPrice = basePrice * provider.baseMultiplier * demandMultiplier;
    
    // Add small random variation (±5%)
    const variation = 0.95 + (seededRandom(seed + index) * 0.1);
    const finalPrice = Math.round(providerPrice * variation);
    
    // Generate realistic flight times
    const durationHours = Math.floor(distance / 800) + 1;
    const durationMinutes = Math.floor(seededRandom(seed + 1) * 50) + 10;
    
    const departureHour = Math.floor(seededRandom(seed + 2) * 14) + 6;
    const departureMinute = Math.floor(seededRandom(seed + 3) * 4) * 15;
    
    const arrivalTime = new Date();
    arrivalTime.setHours(departureHour + durationHours);
    arrivalTime.setMinutes(departureMinute + durationMinutes);
    
    // Determine stops
    let stops = 'Direct';
    if (distance > 3000 && seededRandom(seed + 4) > 0.5) {
      stops = '1 Stop';
    } else if (distance > 6000 && seededRandom(seed + 5) > 0.3) {
      stops = '2 Stops';
    }
    
    return {
      id: `flight-${provider.name.toLowerCase().replace(/\s+/g, '-')}-${seed}`,
      provider: provider.name,
      price: finalPrice,
      currency: 'INR',
      duration: `${durationHours}h ${durationMinutes}m`,
      departure: `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`,
      arrival: `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
      stops,
      bookingUrl: provider.getBookingUrl(from, to, date),
      logo: provider.logo,
      isBestDeal: false
    };
  });
  
  // Sort by price and mark best deal
  results.sort((a, b) => a.price - b.price);
  if (results.length > 0) {
    results[0].isBestDeal = true;
  }
  
  return results;
}

/**
 * Hotel Result Interface
 */
export interface HotelResult {
  id: string;
  hotelName: string;
  rating: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  provider: string;
  nights: number;
  bookingUrl: string;
  logo: string;
  type: string;
  isBestDeal: boolean;
  amenities: string[];
}

// Hotel name templates for generating realistic hotel names
const HOTEL_PREFIXES = ['The', 'Grand', 'Royal', 'Hotel', '', 'Taj', 'ITC', 'Oberoi', 'Lemon Tree', 'OYO', 'FabHotel', 'Treebo'];
const HOTEL_NAMES = ['Palace', 'Residency', 'Inn', 'Suites', 'Plaza', 'Gardens', 'Heights', 'View', 'Court', 'House', 'Comfort', 'Stay'];
const HOSTEL_NAMES = ['Backpackers', 'Hostel', 'Zostel', 'Hosteller', 'Bunk', 'Pod'];

/**
 * Generate dynamic hotel prices
 */
export function generateHotelPrices(
  city: string,
  checkIn: string,
  checkOut: string
): HotelResult[] {
  const cityTier = getCityTier(city);
  
  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Base price by city tier (INR per night)
  const basePriceByTier: { [key: number]: number } = {
    1: 5500, // Metro cities
    2: 3500, // Tier 2 cities
    3: 2200  // Smaller cities
  };
  
  const basePrice = basePriceByTier[cityTier] || 3500;
  
  const results: HotelResult[] = [];
  
  HOTEL_PROVIDERS.forEach((provider, providerIndex) => {
    // Generate 2-3 options per provider
    const numOptions = Math.floor(seededRandom(generateSeed(checkIn, city, provider.name)) * 2) + 2;
    
    for (let i = 0; i < numOptions; i++) {
      const seed = generateSeed(checkIn, city, provider.name, i.toString());
      const demandMultiplier = calculateDemandMultiplier(checkIn, seed);
      
      // Provider and type specific adjustments
      let priceMultiplier = provider.baseMultiplier;
      
      // Generate hotel name
      let hotelName: string;
      let hotelType: string;
      let rating: number;
      
      if (provider.type === 'hostel') {
        hotelName = `${HOSTEL_NAMES[Math.floor(seededRandom(seed + 1) * HOSTEL_NAMES.length)]} ${city.split(',')[0]}`;
        hotelType = 'Hostel';
        rating = 3.5 + seededRandom(seed + 2) * 1.5;
        priceMultiplier *= 0.4; // Hostels are cheaper
      } else {
        const prefix = HOTEL_PREFIXES[Math.floor(seededRandom(seed + 3) * HOTEL_PREFIXES.length)];
        const name = HOTEL_NAMES[Math.floor(seededRandom(seed + 4) * HOTEL_NAMES.length)];
        hotelName = `${prefix} ${name} ${city.split(',')[0]}`.trim();
        hotelType = 'Hotel';
        rating = 3.0 + seededRandom(seed + 5) * 2.0;
        
        // Price varies with rating
        priceMultiplier *= (0.6 + (rating / 5) * 0.8);
      }
      
      // Calculate final price
      const pricePerNight = Math.round(
        basePrice * priceMultiplier * demandMultiplier * (0.9 + seededRandom(seed + 6) * 0.2)
      );
      
      // Generate amenities based on rating
      const allAmenities = ['WiFi', 'AC', 'TV', 'Breakfast', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking'];
      const numAmenities = Math.floor(rating) + 2;
      const amenities = allAmenities.slice(0, numAmenities);
      
      results.push({
        id: `hotel-${provider.name.toLowerCase().replace(/[\s.]+/g, '-')}-${i}-${seed}`,
        hotelName,
        rating: Math.round(rating * 10) / 10,
        pricePerNight,
        totalPrice: pricePerNight * nights,
        currency: 'INR',
        provider: provider.name,
        nights,
        bookingUrl: provider.getBookingUrl(city, checkIn, checkOut),
        logo: provider.logo,
        type: hotelType,
        isBestDeal: false,
        amenities
      });
    }
  });
  
  // Sort by total price and mark best deal
  results.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (results.length > 0) {
    results[0].isBestDeal = true;
  }
  
  return results;
}

/**
 * Get the lowest flight price for display
 */
export function getLowestFlightPrice(results: FlightResult[]): number {
  if (results.length === 0) return 0;
  return Math.min(...results.map(r => r.price));
}

/**
 * Get the lowest hotel price per night for display
 */
export function getLowestHotelPrice(results: HotelResult[]): number {
  if (results.length === 0) return 0;
  return Math.min(...results.map(r => r.pricePerNight));
}

/**
 * Format price in INR
 */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
