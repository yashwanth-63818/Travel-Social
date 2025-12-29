import React from 'react';
import { motion } from 'motion/react';
import { Plane, ExternalLink, Star, Clock, TrendingDown } from 'lucide-react';
import { FlightResult, formatPrice, getLowestFlightPrice } from '../utils/metaSearchPricing';

interface FlightResultsProps {
  results: FlightResult[];
  searchParams: {
    from: string;
    to: string;
    date: string;
  };
  onBook: (provider: string, bookUrl: string) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({ results, searchParams, onBook }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const lowestPrice = getLowestFlightPrice(results);

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h3 className="text-2xl text-yellow-400 mb-2">
          Flight Results: {searchParams.from} → {searchParams.to}
        </h3>
        <p className="text-gray-400">
          Departure: {formatDate(searchParams.date)} • {results.length} options found
        </p>
        
        {/* Dynamic Lowest Price Banner */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-gradient-to-r from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <TrendingDown className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-white">Lowest fare from</span>
              <span className="text-yellow-400 font-bold text-xl ml-2">
                {formatPrice(lowestPrice)}
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              Prices update in real-time • Meta-search across {results.length} providers
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="space-y-4">
        {results.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all hover:border-yellow-400 ${
              flight.isBestDeal ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{flight.logo}</div>
                <div>
                  <h4 className="text-xl text-white font-semibold">{flight.provider}</h4>
                  {flight.isBestDeal && (
                    <div className="flex items-center text-yellow-400 text-sm mt-1">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                      Best Deal
                    </div>
                  )}
                </div>
              </div>
              
              {/* Flight Details */}
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="text-center">
                  <div className="text-white font-semibold">{flight.departure}</div>
                  <div className="text-xs">{searchParams.from.split(',')[0]}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {flight.duration}
                  </div>
                  <div className="w-24 h-px bg-zinc-600 my-1 relative">
                    <Plane className="w-3 h-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400" />
                  </div>
                  <div className="text-xs">{flight.stops}</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{flight.arrival}</div>
                  <div className="text-xs">{searchParams.to.split(',')[0]}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl text-white font-bold">
                  {formatPrice(flight.price)}
                </div>
                <div className="text-gray-400 text-sm">per person</div>
              </div>

              <button
                onClick={() => onBook(flight.provider, flight.bookingUrl)}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center"
              >
                Book Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-700">
              <div className="flex items-center text-gray-400 text-sm">
                <Plane className="w-4 h-4 mr-2" />
                You will be redirected to {flight.provider} to complete your booking
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12">
          <Plane className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No flights found for this route</p>
        </div>
      )}

      {/* Meta-search disclaimer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>TravelSocial is a meta-search platform. We compare prices across multiple providers.</p>
        <p>Actual prices may vary. Click "Book Now" to see the final price on the provider's website.</p>
      </div>
    </div>
  );
};

export default FlightResults;