import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, User, Phone, Mail, Download, Share2, Navigation, Plane, Hotel, Bike, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function Bookings() {
  const bookings = [
    {
      id: 1,
      type: 'flight',
      status: 'confirmed',
      title: 'Flight to Tokyo',
      airline: 'ANA Airways',
      bookingRef: 'TK-2934857',
      from: 'Los Angeles (LAX)',
      to: 'Tokyo (NRT)',
      date: 'Dec 10, 2025',
      time: '10:30 AM',
      duration: '11h 30m',
      passengers: 2,
      price: '$1,198',
      image: 'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      type: 'hotel',
      status: 'confirmed',
      title: 'Mandarin Oriental Tokyo',
      bookingRef: 'HT-9845123',
      location: 'Chiyoda, Tokyo',
      checkIn: 'Dec 10, 2025',
      checkOut: 'Dec 15, 2025',
      nights: 5,
      rooms: 1,
      guests: 2,
      price: '$1,495',
      image: 'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      type: 'ride',
      status: 'upcoming',
      title: 'Coastal Highway Sunset Ride',
      bookingRef: 'RD-4567890',
      location: 'Pacific Coast Highway, California',
      date: 'Dec 5, 2025',
      time: '5:00 PM',
      distance: '120 km',
      organizer: 'Alex Rider',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'pending': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'ride': return Bike;
      default: return Calendar;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl text-yellow-400 mb-2">My Bookings</h2>
          <p className="text-gray-400">Manage all your travel and ride bookings</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export All
        </motion.button>
      </motion.div>

      {/* Bookings List */}
      {bookings.map((booking, index) => {
        const TypeIcon = getTypeIcon(booking.type);
        
        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
            className="bg-zinc-900 rounded-xl border-2 border-yellow-400 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <ImageWithFallback
                  src={booking.image}
                  alt={booking.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2">
                  <TypeIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-white capitalize">{booking.type}</span>
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="capitalize">{booking.status}</span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl text-white mb-1">{booking.title}</h3>
                    <p className="text-gray-400">Booking Ref: {booking.bookingRef}</p>
                  </div>
                  <p className="text-2xl text-yellow-400">{booking.price}</p>
                </div>

                {/* Type-specific details */}
                {booking.type === 'flight' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">From</p>
                        <p className="text-white">{booking.from}</p>
                      </div>
                      <Plane className="w-6 h-6 text-yellow-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">To</p>
                        <p className="text-white">{booking.to}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="text-white">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Time</p>
                        <p className="text-white">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="text-white">{booking.duration}</p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.type === 'hotel' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      {booking.location}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Check-in</p>
                        <p className="text-white">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Check-out</p>
                        <p className="text-white">{booking.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="text-white">{booking.nights} nights</p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.type === 'ride' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      {booking.location}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="text-white">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Time</p>
                        <p className="text-white">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Distance</p>
                        <p className="text-white">{booking.distance}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-800">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-yellow-400 text-black py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-zinc-800 text-white px-4 py-2 rounded-lg border-2 border-yellow-400"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-zinc-800 text-white px-4 py-2 rounded-lg border-2 border-yellow-400"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
