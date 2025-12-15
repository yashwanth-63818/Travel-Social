import { motion } from 'motion/react';
import { useState } from 'react';
import { Bike, MapPin, Calendar, Users, Search, Star, TrendingUp, Navigation, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function BikeRiding() {
  const [activeTab, setActiveTab] = useState<'rides' | 'clubs' | 'memories'>('rides');

  const upcomingRides = [
    {
      id: 1,
      title: "Coastal Highway Sunset Ride",
      location: "Pacific Coast Highway, California",
      date: "December 5, 2025",
      time: "5:00 PM",
      distance: "120 km",
      difficulty: "Intermediate",
      participants: 24,
      maxParticipants: 30,
      organizer: "Alex Rider",
      image: "https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Join us for a scenic sunset ride along the iconic Pacific Coast Highway."
    },
    {
      id: 2,
      title: "Mountain Pass Adventure",
      location: "Rocky Mountains, Colorado",
      date: "December 10, 2025",
      time: "8:00 AM",
      distance: "200 km",
      difficulty: "Advanced",
      participants: 15,
      maxParticipants: 20,
      organizer: "Mountain Mike",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Challenge yourself with winding mountain roads and breathtaking views."
    },
    {
      id: 3,
      title: "City Lights Night Cruise",
      location: "Downtown Tokyo, Japan",
      date: "December 15, 2025",
      time: "8:00 PM",
      distance: "80 km",
      difficulty: "Beginner",
      participants: 32,
      maxParticipants: 40,
      organizer: "Tokyo Riders",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Experience the neon-lit streets of Tokyo on two wheels."
    }
  ];

  const ridersClubs = [
    {
      id: 1,
      name: "Coastal Cruisers",
      members: 1234,
      location: "California, USA",
      founded: "2018",
      image: "https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Weekend warriors riding the Pacific Coast",
      specialties: ["Coastal Rides", "Sunset Tours", "Beach Meetups"]
    },
    {
      id: 2,
      name: "Mountain Mavericks",
      members: 856,
      location: "Colorado, USA",
      founded: "2015",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Alpine adventures and mountain passes",
      specialties: ["Mountain Roads", "Technical Rides", "Adventure Tours"]
    },
    {
      id: 3,
      name: "Urban Velocity",
      members: 2103,
      location: "Tokyo, Japan",
      founded: "2020",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "City rides and night cruises",
      specialties: ["Night Rides", "City Tours", "Café Meetups"]
    }
  ];

  const memories = [
    {
      id: 1,
      title: "Epic Mountain Summit",
      rider: "Sarah Chen",
      location: "Swiss Alps",
      date: "October 2025",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 892,
      story: "Conquered the highest pass in the Alps. What a view!"
    },
    {
      id: 2,
      title: "Desert Sunrise Adventure",
      rider: "Mike Johnson",
      location: "Sahara Desert",
      date: "September 2025",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 1234,
      story: "Riding through endless dunes as the sun rises. Unforgettable!"
    },
    {
      id: 3,
      title: "Coastal Highway Memories",
      rider: "Emma Wilson",
      location: "Pacific Coast",
      date: "August 2025",
      image: "https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 567,
      story: "Perfect weather, perfect road, perfect ride!"
    },
    {
      id: 4,
      title: "City Lights Journey",
      rider: "Yuki Tanaka",
      location: "Tokyo",
      date: "November 2025",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 423,
      story: "The neon jungle never looked so good from a bike!"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Bike className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl text-yellow-400">Bike Riding Community</h1>
          </div>
          <p className="text-gray-400">Connect with riders, join adventures, share memories</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-8 bg-zinc-900 rounded-xl p-2 border-2 border-yellow-400"
        >
          {[
            { id: 'rides', label: 'Upcoming Rides', icon: Calendar },
            { id: 'clubs', label: 'Riders Clubs', icon: Users },
            { id: 'memories', label: 'Riders Memories', icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-zinc-800 text-white hover:bg-yellow-400 hover:text-black'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Upcoming Rides Tab */}
        {activeTab === 'rides' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Search Bar */}
            <div className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rides by location or date..."
                    className="flex-1 bg-transparent text-white outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </motion.button>
              </div>
            </div>

            {/* Rides List */}
            <div className="space-y-6">
              {upcomingRides.map((ride, index) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-64 md:h-auto relative">
                      <ImageWithFallback
                        src={ride.image}
                        alt={ride.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(ride.difficulty)}`}>
                          {ride.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl text-white mb-2">{ride.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{ride.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.date} at {ride.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Navigation className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.participants}/{ride.maxParticipants} riders</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback
                            src="https://i.pravatar.cc/150?img=2"
                            alt={ride.organizer}
                            className="w-8 h-8 rounded-full border-2 border-yellow-400"
                          />
                          <div>
                            <p className="text-sm text-gray-400">Organized by</p>
                            <p className="text-white text-sm">{ride.organizer}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-yellow-400 text-black px-6 py-2 rounded-lg"
                          >
                            Join Ride
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border-2 border-yellow-400"
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Riders Clubs Tab */}
        {activeTab === 'clubs' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ridersClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all"
                >
                  <div className="h-48 relative">
                    <ImageWithFallback
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-lg flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {club.members}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl text-white mb-2">{club.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{club.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        {club.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        Founded in {club.founded}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {club.specialties.map((specialty, i) => (
                          <span
                            key={i}
                            className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-yellow-400 text-black py-2 rounded-lg"
                    >
                      Join Club
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Riders Memories Tab */}
        {activeTab === 'memories' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer"
                >
                  <div className="relative h-64">
                    <ImageWithFallback
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl text-white mb-1">{memory.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-3 h-3 text-yellow-400" />
                        {memory.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <ImageWithFallback
                        src="https://i.pravatar.cc/150?img=4"
                        alt={memory.rider}
                        className="w-10 h-10 rounded-full border-2 border-yellow-400"
                      />
                      <div>
                        <p className="text-white">{memory.rider}</p>
                        <p className="text-sm text-gray-400">{memory.date}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{memory.story}</p>
                    
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 text-yellow-400"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{memory.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm"
                      >
                        View Full Story
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
