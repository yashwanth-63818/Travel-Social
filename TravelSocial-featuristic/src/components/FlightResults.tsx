import React from 'react';
import { motion } from 'motion/react';
import { Plane, ExternalLink, Star } from 'lucide-react';

interface FlightResult {
  provider: string;
  price: number;
  currency: string;
  bookUrl: string;
}

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

  const getProviderLogo = (provider: string) => {
    const logos: { [key: string]: string } = {
      'Skyscanner': '🔍',
      'AirAsia': '✈️',
      'MakeMyTrip': '🧳'
    };
    return logos[provider] || '✈️';
  };

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
      </motion.div>

      <div className="space-y-4">
        {results.map((flight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-zinc-900 rounded-xl p-6 border-2 transition-all hover:border-yellow-400 ${
              index === 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getProviderLogo(flight.provider)}</div>
                <div>
                  <h4 className="text-xl text-white font-semibold">{flight.provider}</h4>
                  {index === 0 && (
                    <div className="flex items-center text-yellow-400 text-sm mt-1">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                      Lowest Fare
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl text-white font-bold">
                  ₹{flight.price.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">{flight.currency}</div>
              </div>

              <button
                onClick={() => onBook(flight.provider, flight.bookUrl)}
                className="ml-6 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center"
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
    </div>
  );
};

export default FlightResults;