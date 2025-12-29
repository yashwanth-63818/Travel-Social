import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, Calendar, Users, Search, Star, Loader2 } from 'lucide-react';
import LocationAutocomplete, { Location } from './LocationAutocomplete';
import { generateHotelPrices } from '../utils/metaSearchPricing';

interface HotelSearchData {
  city: Location | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

const HotelBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<HotelSearchData>({
    city: null,
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = (location: Location) => {
    setSearchData(prev => ({
      ...prev,
      city: location
    }));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!searchData.city) {
      alert('Please select a destination');
      return;
    }
    
    if (!searchData.checkIn || !searchData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setIsSearching(true);

    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const cityName = searchData.city.name.split(',')[0];
    const checkInDate = new Date(searchData.checkIn);
    const checkOutDate = new Date(searchData.checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Generate dynamic hotel prices using meta-search engine
    const hotelResults = generateHotelPrices(cityName, searchData.checkIn, searchData.checkOut);

    navigate('/hotels/results', {
      state: {
        results: hotelResults,
        searchParams: {
          city: cityName,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          nights: nights
        }
      }
    });

    setIsSearching(false);
  };

  // Calculate minimum check-out date (day after check-in)
  const getMinCheckOutDate = () => {
    if (!searchData.checkIn) return new Date().toISOString().split('T')[0];
    const checkInDate = new Date(searchData.checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split('T')[0];
  };

  const handlePopularDestination = (cityName: string) => {
    setSearchData(prev => ({
      ...prev,
      city: {
        name: cityName,
        lat: 0,
        lon: 0,
        type: 'city'
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-xl p-6 border border-zinc-800"
    >
      <div className="flex items-center mb-6">
        <Building2 className="w-6 h-6 text-yellow-400 mr-3" />
        <h2 className="text-2xl text-white font-semibold">Search Hotels</h2>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Destination */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Destination</label>
          <LocationAutocomplete
            placeholder="Where are you going?"
            onLocationSelect={handleLocationSelect}
            value={searchData.city?.name || ''}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check-in Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Check-in</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="date"
                value={searchData.checkOut}
                onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                min={getMinCheckOutDate()}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guests */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rooms</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                value={searchData.rooms}
                onChange={(e) => setSearchData(prev => ({ ...prev, rooms: Number(e.target.value) }))}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-yellow-400 focus:outline-none text-white appearance-none"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div>
          <h3 className="text-lg text-white mb-3">Popular Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Paris, France',
              'Tokyo, Japan',
              'New York, USA',
              'London, UK',
              'Dubai, UAE',
              'Sydney, Australia'
            ].map((city) => (
              <button
                key={city}
                onClick={() => handlePopularDestination(city)}
                className="px-3 py-1 bg-zinc-800 text-gray-300 text-sm rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {city.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Features */}
        <div>
          <h3 className="text-lg text-white mb-3">What we offer</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              Best Price Guarantee
            </div>
            <div className="flex items-center">
              <Building2 className="w-4 h-4 text-yellow-400 mr-2" />
              Quality Hotels
            </div>
            <div className="flex items-center">
              <Search className="w-4 h-4 text-yellow-400 mr-2" />
              Easy Booking
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-yellow-400 mr-2" />
              24/7 Support
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
              Searching Hotels...
            </>
          ) : (
            <>
              <Search className="w-5 h-5 mr-2" />
              Search Hotels
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default HotelBooking;