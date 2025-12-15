import { motion } from 'motion/react';
import { useState } from 'react';
import { MapPin, Hotel, Utensils, Plane, Train, Bus, Navigation, Map as MapIcon } from 'lucide-react';

export default function MapView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All', icon: MapIcon, color: 'text-yellow-400' },
    { id: 'hidden', label: 'Hidden Spots', icon: MapPin, color: 'text-purple-400' },
    { id: 'hotels', label: 'Hotels', icon: Hotel, color: 'text-blue-400' },
    { id: 'food', label: 'Food', icon: Utensils, color: 'text-red-400' },
    { id: 'airports', label: 'Airports', icon: Plane, color: 'text-green-400' },
    { id: 'trains', label: 'Trains', icon: Train, color: 'text-cyan-400' },
    { id: 'buses', label: 'Buses', icon: Bus, color: 'text-orange-400' },
  ];

  const locations = [
    { id: 1, name: 'Secret Beach Cove', category: 'hidden', lat: 35, lng: 45, rating: 4.9, description: 'Hidden gem with crystal clear waters' },
    { id: 2, name: 'Mountain View Hotel', category: 'hotels', lat: 30, lng: 50, rating: 4.7, description: 'Luxury hotel with panoramic views' },
    { id: 3, name: 'Local Street Food Market', category: 'food', lat: 40, lng: 35, rating: 4.8, description: 'Authentic local cuisine' },
    { id: 4, name: 'Ancient Temple Ruins', category: 'hidden', lat: 25, lng: 55, rating: 4.9, description: 'Unexplored historical site' },
    { id: 5, name: 'International Airport', category: 'airports', lat: 50, lng: 40, rating: 4.5, description: 'Main airport hub' },
    { id: 6, name: 'Central Train Station', category: 'trains', lat: 45, lng: 30, rating: 4.6, description: 'High-speed rail connection' },
    { id: 7, name: "Grandma's Kitchen", category: 'food', lat: 35, lng: 60, rating: 5.0, description: 'Family-run restaurant since 1950' },
    { id: 8, name: 'Boutique Eco Resort', category: 'hotels', lat: 20, lng: 45, rating: 4.8, description: 'Sustainable luxury accommodation' },
    { id: 9, name: 'Waterfall Lookout', category: 'hidden', lat: 55, lng: 25, rating: 4.9, description: 'Spectacular hidden waterfall' },
    { id: 10, name: 'Bus Terminal', category: 'buses', lat: 42, lng: 52, rating: 4.3, description: 'Main bus depot' },
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(loc => loc.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : MapPin;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl mb-2 text-yellow-400">Interactive Travel Map</h1>
          <p className="text-gray-400">Discover hidden places, hotels, food spots, and transportation</p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-zinc-900 text-white border-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 h-[600px] relative overflow-hidden"
          >
            {/* Simple Map Visualization */}
            <div className="relative w-full h-full bg-zinc-800 rounded-lg overflow-hidden">
              {/* Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Current Location Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-6 h-6 bg-yellow-400 rounded-full border-4 border-black shadow-lg"
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-xs text-yellow-400">
                  You are here
                </div>
              </motion.div>

              {/* Location Pins */}
              {filteredLocations.map((location, index) => {
                const Icon = getCategoryIcon(location.category);
                const colorClass = getCategoryColor(location.category);
                
                return (
                  <motion.div
                    key={location.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      position: 'absolute',
                      left: `${location.lng}%`,
                      top: `${location.lat}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedLocation(location)}
                    className="cursor-pointer group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      {/* Ping animation */}
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
                        className={`absolute inset-0 rounded-full ${colorClass.replace('text', 'bg')} opacity-30`}
                      />
                      
                      {/* Pin Icon */}
                      <div className={`relative w-10 h-10 ${colorClass.replace('text', 'bg')} rounded-full flex items-center justify-center border-2 border-black shadow-lg`}>
                        <Icon className="w-5 h-5 text-black" />
                      </div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none border border-yellow-400"
                      >
                        {location.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-yellow-400" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Route Line (example from center to selected location) */}
              {selectedLocation && (
                <motion.svg
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <motion.path
                    d={`M 50% 50% L ${selectedLocation.lng}% ${selectedLocation.lat}%`}
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                </motion.svg>
              )}
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-yellow-400 text-black p-3 rounded-lg shadow-lg"
                title="Get Directions"
              >
                <Navigation className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Location Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 h-[600px] overflow-y-auto"
          >
            <h2 className="text-2xl mb-4 text-yellow-400">
              {selectedLocation ? selectedLocation.name : 'Select a Location'}
            </h2>

            {selectedLocation ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = getCategoryIcon(selectedLocation.category);
                    const colorClass = getCategoryColor(selectedLocation.category);
                    return <Icon className={`w-5 h-5 ${colorClass}`} />;
                  })()}
                  <span className="text-gray-400 capitalize">{selectedLocation.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">★ {selectedLocation.rating}</span>
                </div>

                <p className="text-white">{selectedLocation.description}</p>

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg mb-3 text-yellow-400">Quick Actions</h3>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-yellow-400 text-black py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-zinc-800 text-white py-2 rounded-lg border border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                      Save Location
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">
                  Click on any marker on the map to view details and get directions.
                </p>

                <div>
                  <h3 className="text-lg mb-3 text-yellow-400">Nearby Locations</h3>
                  <div className="space-y-3">
                    {filteredLocations.slice(0, 5).map((location) => {
                      const Icon = getCategoryIcon(location.category);
                      const colorClass = getCategoryColor(location.category);
                      
                      return (
                        <motion.div
                          key={location.id}
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => setSelectedLocation(location)}
                          className="bg-zinc-800 p-3 rounded-lg cursor-pointer border border-transparent hover:border-yellow-400 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`${colorClass.replace('text', 'bg')} p-2 rounded-lg`}>
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{location.name}</p>
                              <p className="text-sm text-gray-400 capitalize">{location.category}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-yellow-400 text-sm">★ {location.rating}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4"
        >
          <h3 className="text-lg mb-3 text-yellow-400">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.filter(c => c.id !== 'all').map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="flex items-center gap-2">
                  <div className={`${category.color.replace('text', 'bg')} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm text-white">{category.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
