import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, ArrowLeft, ExternalLink, Star } from 'lucide-react';

interface FlightResult {
  provider: string;
  price: number;
  currency: string;
  bookUrl: string;
}

interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
}

const FlightResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<FlightResult[]>([]);
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = location.state as { results?: FlightResult[]; searchParams?: FlightSearchParams };
    
    if (state?.results && state?.searchParams) {
      setResults(state.results);
      setSearchParams(state.searchParams);
      setIsLoading(false);
    } else {
      // Redirect back to book if no results
      navigate('/book');
    }
  }, [location.state, navigate]);

  const handleBooking = (provider: string, bookUrl: string) => {
    const confirmed = window.confirm(
      `You are being redirected to ${provider} to complete your booking. Continue?`
    );
    
    if (confirmed) {
      window.open(bookUrl, '_blank');
      setTimeout(() => {
        alert(`✈️ Redirected to ${provider}!\n\nComplete your flight booking on their website.`);
      }, 500);
    }
  };

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

  if (isLoading || !searchParams) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

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
            Flight Results: {searchParams.from} → {searchParams.to}
          </h1>
          <p className="text-gray-400">
            Departure: {formatDate(searchParams.date)} • {results.length} options found
          </p>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-zinc-900 rounded-xl p-8 border border-zinc-700 text-center"
            >
              <Plane className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No flights found</h3>
              <p className="text-gray-400">Try adjusting your search criteria and try again.</p>
            </motion.div>
          ) : (
            results.map((flight, index) => (
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
                    <h3 className="text-xl text-white font-semibold">{flight.provider}</h3>
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
                  onClick={() => handleBooking(flight.provider, flight.bookUrl)}
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
          ))
          )}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No flights found for this route</p>
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

export default FlightResultsPage;