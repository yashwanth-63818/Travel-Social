import React from 'react';
import { motion } from 'motion/react';
import { Building2, Star, ExternalLink, Calendar, Users } from 'lucide-react';

interface HotelResult {
  hotelName: string;
  rating: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
  provider: string;
  nights: number;
  bookUrl: string;
}

interface HotelResultsProps {
  results: HotelResult[];
  searchParams: {
    city: string;
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  onBook: (hotelName: string, provider: string, bookUrl: string) => void;
}

const HotelResults: React.FC<HotelResultsProps> = ({ results, searchParams, onBook }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getProviderLogo = (provider: string) => {
    const logos: { [key: string]: string } = {
      'Booking.com': '🏨',
      'Hostelworld': '🎒',
      'Agoda': '🌟'
    };
    return logos[provider] || '🏨';
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

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className="text-2xl text-yellow-400 mb-2">
          Hotels in {searchParams.city}
        </h3>
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
      </motion.div>

      <div className="grid gap-6">
        {results.map((hotel, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all hover:border-yellow-400 ${
              index === 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="text-2xl mr-3">{getProviderLogo(hotel.provider)}</div>
                  <div>
                    <h4 className="text-xl text-white font-semibold">{hotel.hotelName}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center mr-2">
                        {renderStars(hotel.rating)}
                      </div>
                      <span className="text-gray-400 text-sm">({hotel.rating}/5)</span>
                      {index === 0 && (
                        <span className="ml-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
                          Best Deal
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-gray-400 text-sm mb-4">
                  via {hotel.provider}
                </div>
              </div>

              <div className="text-right ml-6">
                <div className="text-2xl text-white font-bold">
                  ₹{hotel.pricePerNight.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">per night</div>
                <div className="text-gray-300 text-lg font-semibold mt-1">
                  ₹{hotel.totalPrice.toLocaleString()} total
                </div>
                <div className="text-gray-500 text-xs">
                  for {hotel.nights} {hotel.nights === 1 ? 'night' : 'nights'}
                </div>
              </div>

              <button
                onClick={() => onBook(hotel.hotelName, hotel.provider, hotel.bookUrl)}
                className="ml-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center"
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
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No hotels found for this destination</p>
        </div>
      )}
    </div>
  );
};

export default HotelResults;