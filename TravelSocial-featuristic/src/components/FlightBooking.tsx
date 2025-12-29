import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plane, Calendar, Users, Search, ArrowRightLeft, Loader2, ExternalLink, Clock, Star, TrendingDown } from 'lucide-react';
import LocationAutocomplete, { Location } from './LocationAutocomplete';
import { generateFlightPrices, FlightResult, formatPrice, getLowestFlightPrice } from '../utils/metaSearchPricing';

interface FlightSearchData {
  from: Location | null;
  to: Location | null;
  date: string;
  passengers: number;
  tripType: 'roundtrip' | 'oneway';
}

const FlightBooking: React.FC = () => {
  const [searchData, setSearchData] = useState<FlightSearchData>({
    from: null,
    to: null,
    date: '',
    passengers: 1,
    tripType: 'roundtrip'
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleLocationSelect = (field: 'from' | 'to') => (location: Location) => {
    setSearchData(prev => ({
      ...prev,
      [field]: location
    }));
  };

  const handleSwapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!searchData.from || !searchData.to) {
      alert('Please select both departure and destination locations');
      return;
    }
    
    if (!searchData.date) {
      alert('Please select a departure date');
      return;
    }

    setIsSearching(true);
    setHasSearched(false);

    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const fromCity = searchData.from.name.split(',')[0];
    const toCity = searchData.to.name.split(',')[0];

    // Generate dynamic flight prices using meta-search engine
    const results = generateFlightPrices(fromCity, toCity, searchData.date);
    setSearchResults(results);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleBookNow = (flight: FlightResult) => {
    const confirmed = window.confirm(
      `Book with ${flight.provider}?\n\nPrice: ${formatPrice(flight.price)}\nYou will be redirected to ${flight.provider} to complete your booking.`
    );
    
    if (confirmed) {
      window.open(flight.bookingUrl, '_blank');
    }
  };

  const lowestPrice = searchResults.length > 0 ? getLowestFlightPrice(searchResults) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
    >
      <div className="flex items-center mb-6">
        <Plane className="w-6 h-6 text-yellow-400 mr-3" />
        <h2 className="text-2xl text-white font-semibold">Search Flights</h2>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Trip Type Selection */}
        <div className="flex">
          <button
            onClick={() => setSearchData(prev => ({ ...prev, tripType: 'roundtrip' }))}
            className={`px-4 py-2 rounded-l-lg border transition-colors ${
              searchData.tripType === 'roundtrip' 
                ? 'bg-yellow-400 text-black border-yellow-400' 
                : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setSearchData(prev => ({ ...prev, tripType: 'oneway' }))}
            className={`px-4 py-2 rounded-r-lg border transition-colors ${
              searchData.tripType === 'oneway' 
                ? 'bg-yellow-400 text-black border-yellow-400' 
                : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            One Way
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Location */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">From</label>
            <LocationAutocomplete
              placeholder="Departure city"
              onLocationSelect={handleLocationSelect('from')}
              value={searchData.from?.name || ''}
            />
          </div>

          {/* To Location */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-2">To</label>
            <LocationAutocomplete
              placeholder="Destination city"
              onLocationSelect={handleLocationSelect('to')}
              value={searchData.to?.name || ''}
            />
            <button
              onClick={handleSwapLocations}
              className="absolute -left-6 top-8 bg-yellow-400 text-black p-2 rounded-full hover:bg-yellow-500 transition-colors z-20"
              title="Swap locations"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Departure Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Departure Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="date"
                value={searchData.date}
                onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                value={searchData.passengers}
                onChange={(e) => setSearchData(prev => ({ ...prev, passengers: Number(e.target.value) }))}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={isSearching}
          className="w-full bg-yellow-400 text-black py-4 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Searching Flights...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search Flights
            </>
          )}
        </button>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="mb-6">
            <h3 className="text-2xl text-white font-semibold mb-2">
              Flight Results: {searchData.from?.name.split(',')[0]} → {searchData.to?.name.split(',')[0]}
            </h3>
            <p className="text-gray-400">
              {new Date(searchData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {searchResults.length} options found
            </p>

            {/* Dynamic Lowest Price Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 bg-gradient-to-r from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <TrendingDown className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white">Prices from</span>
                <span className="text-yellow-400 font-bold text-xl ml-2">
                  {formatPrice(lowestPrice)}
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                Live prices • Meta-search across {new Set(searchResults.map(r => r.provider)).size} providers
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            {searchResults.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-zinc-800 rounded-xl p-6 border-2 transition-all hover:border-yellow-400 ${
                  flight.isBestDeal ? 'border-yellow-400 shadow-lg shadow-yellow-400/10' : 'border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{flight.logo}</div>
                    <div>
                      <h4 className="text-lg text-white font-semibold">{flight.provider}</h4>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {flight.departure} - {flight.arrival} • {flight.duration}
                      </div>
                      <div className="text-sm text-gray-400">{flight.stops}</div>
                      {flight.isBestDeal && (
                        <div className="flex items-center text-yellow-400 text-sm mt-1">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                          Best Deal
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl text-white font-bold mb-2">
                      {formatPrice(flight.price)}
                    </div>
                    <button
                      onClick={() => handleBookNow(flight)}
                      className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center"
                    >
                      Book Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Meta-search disclaimer */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>TravelSocial is a meta-search platform. We compare prices across multiple providers.</p>
            <p>Actual prices may vary. Click "Book Now" to see the final price on the provider's website.</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlightBooking;