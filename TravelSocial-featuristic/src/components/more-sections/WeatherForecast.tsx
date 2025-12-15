import { motion } from 'motion/react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Thermometer, MapPin, Calendar } from 'lucide-react';

export default function WeatherForecast() {
  const savedDestinations = [
    {
      id: 1,
      name: 'Tokyo, Japan',
      current: {
        temp: 18,
        condition: 'Partly Cloudy',
        icon: Cloud,
        humidity: 65,
        windSpeed: 12,
        visibility: 10
      },
      forecast: [
        { day: 'Mon', high: 20, low: 15, icon: Sun, condition: 'Sunny' },
        { day: 'Tue', high: 19, low: 14, icon: Cloud, condition: 'Cloudy' },
        { day: 'Wed', high: 17, low: 13, icon: CloudRain, condition: 'Rainy' },
        { day: 'Thu', high: 18, low: 14, icon: Cloud, condition: 'Cloudy' },
        { day: 'Fri', high: 21, low: 16, icon: Sun, condition: 'Sunny' },
      ]
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      current: {
        temp: 28,
        condition: 'Sunny',
        icon: Sun,
        humidity: 80,
        windSpeed: 8,
        visibility: 15
      },
      forecast: [
        { day: 'Mon', high: 30, low: 24, icon: Sun, condition: 'Sunny' },
        { day: 'Tue', high: 29, low: 24, icon: Sun, condition: 'Sunny' },
        { day: 'Wed', high: 28, low: 23, icon: CloudRain, condition: 'Rainy' },
        { day: 'Thu', high: 29, low: 24, icon: Cloud, condition: 'Cloudy' },
        { day: 'Fri', high: 30, low: 25, icon: Sun, condition: 'Sunny' },
      ]
    },
    {
      id: 3,
      name: 'Swiss Alps, Switzerland',
      current: {
        temp: 5,
        condition: 'Cloudy',
        icon: Cloud,
        humidity: 70,
        windSpeed: 15,
        visibility: 8
      },
      forecast: [
        { day: 'Mon', high: 7, low: 2, icon: Cloud, condition: 'Cloudy' },
        { day: 'Tue', high: 6, low: 1, icon: CloudRain, condition: 'Snow' },
        { day: 'Wed', high: 4, low: -1, icon: CloudRain, condition: 'Snow' },
        { day: 'Thu', high: 5, low: 0, icon: Cloud, condition: 'Cloudy' },
        { day: 'Fri', high: 8, low: 3, icon: Sun, condition: 'Sunny' },
      ]
    }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'from-yellow-400 to-orange-400';
      case 'cloudy':
      case 'partly cloudy': return 'from-gray-400 to-gray-500';
      case 'rainy':
      case 'snow': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl text-yellow-400 mb-2">Weather Forecast</h2>
        <p className="text-gray-400">Check weather for your saved destinations</p>
      </motion.div>

      {/* Destinations */}
      {savedDestinations.map((destination, index) => {
        const CurrentIcon = destination.current.icon;
        
        return (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900 rounded-xl border-2 border-yellow-400 overflow-hidden"
          >
            {/* Current Weather */}
            <div className={`bg-gradient-to-r ${getConditionColor(destination.current.condition)} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-black" />
                  <div>
                    <h3 className="text-2xl text-black mb-1">{destination.name}</h3>
                    <p className="text-black/80">{destination.current.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <CurrentIcon className="w-16 h-16 text-black" />
                    <span className="text-6xl text-black">{destination.current.temp}°</span>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-black/20">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-xs text-black/70">Humidity</p>
                    <p className="text-black">{destination.current.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-xs text-black/70">Wind</p>
                    <p className="text-black">{destination.current.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-black" />
                  <div>
                    <p className="text-xs text-black/70">Visibility</p>
                    <p className="text-black">{destination.current.visibility} km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="p-4">
              <h4 className="text-lg text-yellow-400 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                5-Day Forecast
              </h4>
              <div className="grid grid-cols-5 gap-3">
                {destination.forecast.map((day, dayIndex) => {
                  const DayIcon = day.icon;
                  return (
                    <motion.div
                      key={dayIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + dayIndex * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-zinc-800 rounded-lg p-3 text-center border border-yellow-400/30 hover:border-yellow-400 transition-all"
                    >
                      <p className="text-gray-400 text-sm mb-2">{day.day}</p>
                      <DayIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-white mb-1">{day.high}°</p>
                      <p className="text-gray-500 text-sm">{day.low}°</p>
                      <p className="text-xs text-gray-400 mt-2">{day.condition}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Weather Travel Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Sun className="w-5 h-5 text-yellow-400 mt-1" />
            <div>
              <p className="text-white mb-1">Sunny Days</p>
              <p className="text-sm text-gray-400">Don't forget sunscreen, hat, and sunglasses</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CloudRain className="w-5 h-5 text-blue-400 mt-1" />
            <div>
              <p className="text-white mb-1">Rainy Weather</p>
              <p className="text-sm text-gray-400">Pack waterproof jacket and umbrella</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Cloud className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-white mb-1">Cloudy Days</p>
              <p className="text-sm text-gray-400">Perfect for outdoor activities and sightseeing</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wind className="w-5 h-5 text-cyan-400 mt-1" />
            <div>
              <p className="text-white mb-1">Windy Conditions</p>
              <p className="text-sm text-gray-400">Wear layers and secure loose items</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
