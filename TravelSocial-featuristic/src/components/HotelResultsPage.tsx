import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, ArrowLeft, ExternalLink, Star, Calendar, Users, TrendingDown } from 'lucide-react';
import { HotelResult, formatPrice, getLowestHotelPrice } from '../utils/metaSearchPricing';

interface HotelSearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  nights: number;
}

const HotelResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<HotelResult[]>([]);
  const [searchParams, setSearchParams] = useState<HotelSearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as { results?: HotelResult[]; searchParams?: HotelSearchParams };
    
    if (state?.results && state?.searchParams) {
      setResults(state.results);
      setSearchParams(state.searchParams);
      setIsLoading(false);
    } else {
      // Redirect back to book if no results
      navigate('/book');
    }
  }, [location.state, navigate]);

  const handleBooking = (hotelName: string, provider: string, bookingUrl: string) => {
    const confirmed = window.confirm(
      `Book "${hotelName}" via ${provider}?\n\nYou will be redirected to their website to complete your booking.`
    );
    
    if (confirmed) {
      window.open(bookingUrl, '_blank');
      setTimeout(() => {
        alert(`🏨 Redirected to ${provider}!\n\nComplete your hotel booking on their website.`);
      }, 500);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400/50" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-600" />);
    }

    return stars;
  };

  if (isLoading || !searchParams) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const lowestPrice = results.length > 0 ? getLowestHotelPrice(results) : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/book')}
            className="flex items-center text-yellow-400 hover:text-yellow-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </button>
          
          <h1 className="text-3xl text-yellow-400 mb-2">
            Hotels in {searchParams.city}
          </h1>
          <div className="flex items-center text-gray-400 space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(searchParams.checkIn)} - {formatDate(searchParams.checkOut)}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {searchParams.nights} {searchParams.nights === 1 ? 'night' : 'nights'}
            </div>
            <span>• {results.length} options found</span>
          </div>

          {/* Dynamic Lowest Price Banner */}
          {results.length > 0 && (
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
                <span className="text-gray-400 ml-1">/night</span>
              </div>
              <div className="text-gray-400 text-sm">
                Live prices • Meta-search across {new Set(results.map(r => r.provider)).size} providers
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results */}
        <div className="space-y-6">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 rounded-xl p-8 border border-zinc-700 text-center"
            >
              <Building2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No hotels found</h3>
              <p className="text-gray-400">Try adjusting your search criteria and try again.</p>
            </motion.div>
          ) : (
            results.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all hover:border-yellow-400 ${
                hotel.isBestDeal ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="text-2xl mr-3">{hotel.logo}</div>
                    <div>
                      <h3 className="text-xl text-white font-semibold">{hotel.hotelName}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center mr-2">
                          {renderStars(hotel.rating)}
                        </div>
                        <span className="text-gray-400 text-sm">({hotel.rating}/5)</span>
                        {hotel.isBestDeal && (
                          <span className="ml-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
                            Best Deal
                          </span>
                        )}
                        <span className="ml-2 bg-zinc-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {hotel.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {hotel.amenities?.slice(0, 4).map((amenity, i) => (
                      <span key={i} className="text-xs bg-zinc-800 text-gray-300 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="text-gray-400 text-sm">
                    via {hotel.provider}
                  </div>
                </div>

                <div className="text-right ml-6 mr-6">
                  <div className="text-2xl text-white font-bold">
                    {formatPrice(hotel.pricePerNight)}
                  </div>
                  <div className="text-gray-400 text-sm">per night</div>
                  <div className="text-gray-300 text-lg font-semibold mt-1">
                    {formatPrice(hotel.totalPrice)} total
                  </div>
                  <div className="text-gray-500 text-xs">
                    for {hotel.nights} {hotel.nights === 1 ? 'night' : 'nights'}
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(hotel.hotelName, hotel.provider, hotel.bookingUrl)}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center"
                >
                  Book Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-700">
                <div className="flex items-center text-gray-400 text-sm">
                  <Building2 className="w-4 h-4 mr-2" />
                  You will be redirected to {hotel.provider} to complete your booking
                </div>
              </div>
            </motion.div>
          ))
          )}
        </div>

        {/* Meta-search disclaimer */}
        {results.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>TravelSocial is a meta-search platform. We compare prices across multiple providers.</p>
            <p>Actual prices may vary. Click "Book Now" to see the final price on the provider's website.</p>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hotels found for this destination</p>
            <button
              onClick={() => navigate('/booking')}
              className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-lg"
            >
              Try Another Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelResultsPage;