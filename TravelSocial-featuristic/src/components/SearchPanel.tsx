import { motion } from 'motion/react';
import { useState } from 'react';
import { Plane, Hotel, Calendar, MapPin, Users, Search, ExternalLink, TrendingDown, Star, Loader2, Info } from 'lucide-react';

export default function SearchPanel() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [flightSearch, setFlightSearch] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });

  const [hotelSearch, setHotelSearch] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [dynamicFlightResults, setDynamicFlightResults] = useState<any[]>([]);
  const [dynamicHotelResults, setDynamicHotelResults] = useState<any[]>([]);

  // Generate mock flight results with realistic INR pricing
  const generateFlightResults = (from: string, to: string) => {
    const airlines = [
      { name: 'IndiGo', type: 'low-cost', link: 'https://www.goindigo.in' },
      { name: 'AirAsia India', type: 'low-cost', link: 'https://www.airasia.com' },
      { name: 'SpiceJet', type: 'low-cost', link: 'https://www.spicejet.com' },
      { name: 'Vistara', type: 'full-service', link: 'https://www.airvistara.com' },
      { name: 'Air India', type: 'full-service', link: 'https://www.airindia.in' },
      { name: 'Jet Airways', type: 'full-service', link: 'https://www.jetairways.com' }
    ];
    
    const results = [];
    const usedAirlines = [];
    
    for (let i = 0; i < 4; i++) {
      // Select unique airline for each result
      let airline;
      do {
        airline = airlines[Math.floor(Math.random() * airlines.length)];
      } while (usedAirlines.includes(airline.name) && usedAirlines.length < airlines.length);
      usedAirlines.push(airline.name);
      
      // Realistic INR pricing based on domestic routes
      const baseFare = 3500; // Starting from ₹3,500
      const variability = Math.floor(Math.random() * 3000); // Up to ₹3,000 variation
      let finalPrice = baseFare + variability;
      
      // Airline type adjustment
      if (airline.type === 'low-cost') {
        finalPrice = finalPrice - Math.floor(Math.random() * 800); // Slightly cheaper
      } else {
        finalPrice = finalPrice + Math.floor(Math.random() * 1200); // Slightly more expensive
      }
      
      // Ensure price stays within realistic range
      finalPrice = Math.max(3500, Math.min(finalPrice, 18000));
      
      const departureHour = Math.floor(Math.random() * 12) + 6;
      const arrivalHour = (departureHour + Math.floor(Math.random() * 8) + 4) % 24;
      
      // Provider links for booking
      const providerLinks = [
        'https://www.skyscanner.co.in',
        'https://www.makemytrip.com',
        airline.link
      ];
      
      results.push({
        id: i + 1,
        airline: airline.name,
        from: from || "Chennai",
        to: to || "Mumbai",
        departure: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 6) * 10}0`,
        arrival: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 6) * 10}0`,
        duration: `${Math.floor(Math.random() * 4) + 1}h ${Math.floor(Math.random() * 60)}m`,
        price: `₹${finalPrice.toLocaleString('en-IN')}`,
        type: Math.random() > 0.6 ? "Direct" : "1 Stop",
        link: providerLinks[Math.floor(Math.random() * providerLinks.length)],
        savings: i === 0 ? "Best Deal" : `Save ${Math.floor(Math.random() * 20) + 5}%`
      });
    }
    
    return results.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/₹|,/g, ''));
      const priceB = parseInt(b.price.replace(/₹|,/g, ''));
      return priceA - priceB;
    });
  };

  // Generate mock hotel results
  const generateHotelResults = (location: string) => {
    const hotelNames = ['Grand Hyatt', 'Marriott', 'Hilton', 'Westin', 'Sheraton', 'Radisson'];
    const results = [];
    
    for (let i = 0; i < 4; i++) {
      const hotelName = `${hotelNames[Math.floor(Math.random() * hotelNames.length)]} ${location || "Downtown"}`;
      const basePrice = Math.floor(Math.random() * 200) + 80;
      
      results.push({
        id: i + 1,
        name: hotelName,
        location: location || "City Center",
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 2000) + 500,
        price: `$${basePrice + (i * 30)}`,
        originalPrice: `$${basePrice + (i * 30) + 50}`,
        image: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop`,
        features: ["WiFi", "Pool", "Gym", "Restaurant"],
        link: "https://www.booking.com",
        discount: `${Math.floor(Math.random() * 20) + 15}% OFF`
      });
    }
    
    return results.sort((a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)));
  };

  const handleFlightSearch = async () => {
    if (!flightSearch.from || !flightSearch.to) {
      alert('Please enter departure and destination cities');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    // Simulate API call delay
    setTimeout(() => {
      const results = generateFlightResults(flightSearch.from, flightSearch.to);
      setDynamicFlightResults(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 1500);
  };

  const handleHotelSearch = async () => {
    if (!hotelSearch.location) {
      alert('Please enter a destination');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    // Simulate API call delay
    setTimeout(() => {
      const results = generateHotelResults(hotelSearch.location);
      setDynamicHotelResults(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 1500);
  };

  const flightResults = [
    {
      id: 1,
      airline: "AirAsia",
      from: "New York",
      to: "Tokyo",
      departure: "08:00 AM",
      arrival: "02:00 PM +1",
      duration: "14h",
      price: "$599",
      type: "Direct",
      link: "https://www.airasia.com",
      savings: "Save 25%"
    },
    {
      id: 2,
      airline: "Singapore Airlines",
      from: "Los Angeles",
      to: "Singapore",
      departure: "11:30 PM",
      arrival: "06:00 AM +2",
      duration: "17h 30m",
      price: "$789",
      type: "1 Stop",
      link: "https://www.singaporeair.com",
      savings: "Best Value"
    },
    {
      id: 3,
      airline: "Emirates",
      from: "London",
      to: "Dubai",
      departure: "03:45 PM",
      arrival: "11:55 PM",
      duration: "7h 10m",
      price: "$445",
      type: "Direct",
      link: "https://www.emirates.com",
      savings: "Save 30%"
    },
    {
      id: 4,
      airline: "Qatar Airways",
      from: "Paris",
      to: "Bangkok",
      departure: "10:20 AM",
      arrival: "05:40 AM +1",
      duration: "11h 20m",
      price: "$699",
      type: "Direct",
      link: "https://www.qatarairways.com",
      savings: "Premium Deal"
    }
  ];

  const hotelResults = [
    {
      id: 1,
      name: "Grand Hyatt Bali",
      location: "Nusa Dua, Bali",
      rating: 4.8,
      reviews: 2341,
      price: "$149",
      originalPrice: "$249",
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Beach Front", "Pool", "Spa", "Restaurant"],
      link: "https://www.booking.com",
      discount: "40% OFF"
    },
    {
      id: 2,
      name: "Mandarin Oriental Tokyo",
      location: "Chiyoda, Tokyo",
      rating: 4.9,
      reviews: 1876,
      price: "$299",
      originalPrice: "$399",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["City View", "Spa", "Michelin Restaurant", "Bar"],
      link: "https://www.booking.com",
      discount: "25% OFF"
    },
    {
      id: 3,
      name: "The Ritz-Carlton Alps",
      location: "Swiss Alps",
      rating: 4.9,
      reviews: 1234,
      price: "$399",
      originalPrice: "$599",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Mountain View", "Ski Access", "Spa", "Fine Dining"],
      link: "https://www.booking.com",
      discount: "33% OFF"
    },
    {
      id: 4,
      name: "Four Seasons Marrakech",
      location: "Marrakech, Morocco",
      rating: 4.7,
      reviews: 987,
      price: "$199",
      originalPrice: "$299",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      features: ["Garden View", "Pool", "Spa", "Moroccan Cuisine"],
      link: "https://www.booking.com",
      discount: "33% OFF"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4">
        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('flights')}
            className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'flights'
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-zinc-900 text-white border-yellow-400 hover:bg-yellow-400 hover:text-black'
            }`}
          >
            <Plane className="w-5 h-5" />
            Flights
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('hotels')}
            className={`flex-1 py-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
              activeTab === 'hotels'
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-zinc-900 text-white border-yellow-400 hover:bg-yellow-400 hover:text-black'
            }`}
          >
            <Hotel className="w-5 h-5" />
            Hotels
          </motion.button>
        </motion.div>

        {/* Flight Search */}
        {activeTab === 'flights' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> From
                  </label>
                  <input
                    type="text"
                    value={flightSearch.from}
                    onChange={(e) => setFlightSearch({...flightSearch, from: e.target.value})}
                    placeholder="Departure city"
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> To
                  </label>
                  <input
                    type="text"
                    value={flightSearch.to}
                    onChange={(e) => setFlightSearch({...flightSearch, to: e.target.value})}
                    placeholder="Destination city"
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Date
                  </label>
                  <input
                    type="date"
                    value={flightSearch.date}
                    onChange={(e) => setFlightSearch({...flightSearch, date: e.target.value})}
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Passengers
                  </label>
                  <input
                    type="number"
                    value={flightSearch.passengers}
                    onChange={(e) => setFlightSearch({...flightSearch, passengers: parseInt(e.target.value)})}
                    min="1"
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg flex items-center justify-center gap-2"
                onClick={handleFlightSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching Flights...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Flights
                  </>
                )}
              </motion.button>
            </div>

            {/* Flight Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-yellow-400">Lowest Fares Available</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <TrendingDown className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Showing best prices</span>
                </div>
              </div>
              
              {/* Price Disclaimer */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-blue-300 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Prices are indicative. Booking happens on provider site.
                </p>
              </div>
              {(hasSearched ? dynamicFlightResults : flightResults).map((flight, index) => (
                <motion.div
                  key={flight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl border-2 border-transparent hover:border-yellow-400 p-5 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg">
                          {flight.airline}
                        </div>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                          {flight.savings}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                          {flight.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-white">{flight.departure}</p>
                          <p className="text-sm text-gray-400">{flight.from}</p>
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-0.5 bg-yellow-400/30 relative">
                            <Plane className="w-5 h-5 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90" />
                          </div>
                          <p className="text-center text-xs text-gray-400 mt-1">{flight.duration}</p>
                        </div>
                        <div>
                          <p className="text-white">{flight.arrival}</p>
                          <p className="text-sm text-gray-400">{flight.to}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-3xl text-yellow-400">{flight.price}</p>
                        <p className="text-sm text-gray-400">per person</p>
                      </div>
                      <motion.a
                        href={flight.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2 whitespace-nowrap"
                      >
                        Book Now
                        <ExternalLink className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hotel Search */}
        {activeTab === 'hotels' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    type="text"
                    value={hotelSearch.location}
                    onChange={(e) => setHotelSearch({...hotelSearch, location: e.target.value})}
                    placeholder="City or hotel name"
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-in
                  </label>
                  <input
                    type="date"
                    value={hotelSearch.checkIn}
                    onChange={(e) => setHotelSearch({...hotelSearch, checkIn: e.target.value})}
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-out
                  </label>
                  <input
                    type="date"
                    value={hotelSearch.checkOut}
                    onChange={(e) => setHotelSearch({...hotelSearch, checkOut: e.target.value})}
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Guests
                  </label>
                  <input
                    type="number"
                    value={hotelSearch.guests}
                    onChange={(e) => setHotelSearch({...hotelSearch, guests: parseInt(e.target.value)})}
                    min="1"
                    className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg flex items-center justify-center gap-2"
                onClick={handleHotelSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching Hotels...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Hotels
                  </>
                )}
              </motion.button>
            </div>

            {/* Hotel Results */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-yellow-400">Best Room Deals</h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">Top rated properties</span>
                </div>
              </div>
              {(hasSearched ? dynamicHotelResults : hotelResults).map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl border-2 border-transparent hover:border-yellow-400 overflow-hidden transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative h-64 md:h-auto">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg z-20">
                        {hotel.discount}
                      </div>
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl text-white mb-1">{hotel.name}</h3>
                          <p className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hotel.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-xl">{hotel.rating}</span>
                          </div>
                          <p className="text-sm text-gray-400">({hotel.reviews} reviews)</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.features.map((feature, i) => (
                          <span
                            key={i}
                            className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="text-3xl text-yellow-400">{hotel.price}</p>
                          <div>
                            <p className="text-sm text-gray-400 line-through">{hotel.originalPrice}</p>
                            <p className="text-sm text-gray-400">per night</p>
                          </div>
                        </div>
                        <motion.a
                          href={hotel.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2"
                        >
                          View Deal
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
