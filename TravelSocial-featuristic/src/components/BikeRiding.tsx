import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Bike, MapPin, Calendar, Clock, Users, Search, Star, TrendingUp, Navigation, Heart, Plus, Loader } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { bikeRidesAPI, getCurrentUserId } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import indiaLocationData from '../data/indiaLocations.json';

interface BikeRide {
  _id: string;
  title: string;
  location: string;
  description: string;
  date: Date;
  time: string;
  distance: string;
  difficulty: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar?: string;
  }>;
  maxParticipants: number;
  organizer: string;
  images: Array<{ url: string; publicId: string }>;
  createdBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  status: string;
}

export default function BikeRiding() {
  const [activeTab, setActiveTab] = useState<'rides' | 'clubs' | 'memories'>('rides');
  const [bikeRides, setBikeRides] = useState<BikeRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [joiningRides, setJoiningRides] = useState<Set<string>>(new Set());
  
  // Location management state
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availablePlaces, setAvailablePlaces] = useState<string[]>([]);
  const [allRides, setAllRides] = useState<BikeRide[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const navigate = useNavigate();

  // Form state for creating new bike ride
  const [newRide, setNewRide] = useState({
    title: '',
    location: '',
    state: '',
    district: '',
    touristPlace: '',
    description: '',
    date: '',
    time: '',
    distance: '',
    difficulty: 'Beginner',
    maxParticipants: 10,
    organizer: '',
    images: [] as File[]
  });

  const currentUserId = getCurrentUserId();

  // Location management functions
  const handleStateChange = (selectedState: string) => {
    setNewRide(prev => ({
      ...prev,
      state: selectedState,
      district: '',
      touristPlace: '',
      location: selectedState
    }));
    
    if (selectedState && indiaLocationData[selectedState as keyof typeof indiaLocationData]) {
      const stateData = indiaLocationData[selectedState as keyof typeof indiaLocationData];
      setAvailableDistricts(Object.keys(stateData));
    } else {
      setAvailableDistricts([]);
    }
    setAvailablePlaces([]);
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    setNewRide(prev => ({
      ...prev,
      district: selectedDistrict,
      touristPlace: '',
      location: `${selectedDistrict}, ${prev.state}`
    }));
    
    if (selectedDistrict && newRide.state && indiaLocationData[newRide.state as keyof typeof indiaLocationData]) {
      const stateData = indiaLocationData[newRide.state as keyof typeof indiaLocationData];
      const districtData = stateData[selectedDistrict as keyof typeof stateData];
      if (Array.isArray(districtData)) {
        setAvailablePlaces(districtData);
      } else {
        setAvailablePlaces([]);
      }
    } else {
      setAvailablePlaces([]);
    }
  };

  const handleTouristPlaceChange = (selectedPlace: string) => {
    setNewRide(prev => ({
      ...prev,
      touristPlace: selectedPlace,
      location: selectedPlace ? 
        `${selectedPlace}, ${prev.district}, ${prev.state}` :
        `${prev.district}, ${prev.state}`
    }));
  };

  const fetchBikeRides = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    setIsSearchActive(false);
    
    try {
      const response = await bikeRidesAPI.getAllBikeRides();
      if (response.success) {
        // Handle both successful response with data and fallback empty array
        const rides = response.data?.bikeRides || [];
        setAllRides(rides);
        setBikeRides(rides);
      } else {
        console.error('API returned success: false', response);
        const emptyRides: BikeRide[] = [];
        setAllRides(emptyRides);
        setBikeRides(emptyRides);
        // Only show error if it's not just empty results
        if (response.message && !response.message.includes('No bike rides found')) {
          setError('Unable to load bike rides. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error fetching bike rides:', err);
      const emptyRides: BikeRide[] = [];
      setAllRides(emptyRides);
      setBikeRides(emptyRides);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
      setError('You must be logged in to create a bike ride');
      return;
    }

    // Enhanced validation with specific error messages
    if (!newRide.title.trim()) {
      setError('Please enter a ride title');
      return;
    }
    if (!newRide.state) {
      setError('Please select a state');
      return;
    }
    if (!newRide.district) {
      setError('Please select a district');
      return;
    }
    if (!newRide.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!newRide.date) {
      setError('Please select a date');
      return;
    }
    if (!newRide.time) {
      setError('Please select a time');
      return;
    }
    if (!newRide.distance.trim()) {
      setError('Please enter the distance');
      return;
    }
    if (!newRide.organizer.trim()) {
      setError('Please enter organizer name');
      return;
    }
    if (newRide.maxParticipants < 1) {
      setError('Maximum participants must be at least 1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await bikeRidesAPI.createBikeRide({
        ...newRide,
        participants: 0
      });

      if (response.success && response.data?.bikeRide) {
        const newRideData = response.data.bikeRide;
        setBikeRides([newRideData, ...bikeRides]);
        setAllRides([newRideData, ...allRides]);
        setShowCreateForm(false);
        // Reset form
        setNewRide({
          title: '',
          location: '',
          state: '',
          district: '',
          touristPlace: '',
          description: '',
          date: '',
          time: '',
          distance: '',
          difficulty: 'Beginner',
          maxParticipants: 10,
          organizer: '',
          images: []
        });
        // Reset location state
        setAvailableDistricts([]);
        setAvailablePlaces([]);
      } else {
        setError('Failed to create bike ride');
      }
    } catch (err: any) {
      console.error('Error creating bike ride:', err);
      setError(err.message || 'Failed to create bike ride');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewRide({ ...newRide, images: Array.from(e.target.files).slice(0, 5) });
    }
  };

  useEffect(() => {
    fetchBikeRides();
  }, []);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    
    // If search is empty, restore all rides
    if (!trimmedQuery) {
      setBikeRides(allRides);
      setIsSearchActive(false);
      setError(null);
      return;
    }

    setSearchLoading(true);
    setError(null);
    setIsSearchActive(true);

    try {
      const response = await bikeRidesAPI.searchBikeRides(trimmedQuery);
      if (response.success) {
        // Handle both successful response with data and fallback empty array
        setBikeRides(response.data?.bikeRides || []);
      } else {
        console.error('Search API returned success: false', response);
        setBikeRides([]);
        // Don't show error for no results, just empty state
        if (!response.message || !response.message.includes('No results')) {
          setError('Search failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Error searching bike rides:', err);
      setBikeRides([]);
      setError('Unable to search. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleJoinRide = async (rideId: string) => {
    if (!currentUserId) {
      setError('You must be logged in to join a ride');
      return;
    }

    if (joiningRides.has(rideId)) {
      return; // Already joining
    }

    setJoiningRides(prev => new Set([...prev, rideId]));
    setError(null);

    try {
      const response = await bikeRidesAPI.joinBikeRide(rideId);
      if (response.success && response.data?.bikeRide) {
        // Update the specific bike ride in the list
        setBikeRides(prev => prev.map(ride => 
          ride._id === rideId ? response.data.bikeRide : ride
        ));
      } else {
        setError('Failed to join bike ride');
      }
    } catch (err: any) {
      console.error('Error joining bike ride:', err);
      setError(err.message || 'Failed to join bike ride');
    } finally {
      setJoiningRides(prev => {
        const newSet = new Set(prev);
        newSet.delete(rideId);
        return newSet;
      });
    }
  };

  const handleViewDetails = (rideId: string) => {
    // For now, we'll create a simple details view
    // In a full app, you'd navigate to a dedicated route
    navigate(`/bike-ride/${rideId}`);
  };

  const isUserJoined = (ride: BikeRide): boolean => {
    return ride.participants.some(participant => participant._id === currentUserId);
  };

  const upcomingRides = bikeRides;

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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-red-200 rounded-xl p-4 mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Create New Ride Button */}
            {currentUserId && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-xl flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create New Bike Ride
                </motion.button>
              </motion.div>
            )}

            {/* Create Form */}
            {showCreateForm && currentUserId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-zinc-900 rounded-xl p-6 mb-6 border-2 border-yellow-400"
              >
                <h3 className="text-xl text-white mb-4">Create New Bike Ride</h3>
                <form onSubmit={handleCreateRide} className="space-y-4">
                  {/* Title and Organizer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Ride Title *</label>
                      <input
                        type="text"
                        placeholder="Enter ride title"
                        value={newRide.title}
                        onChange={(e) => setNewRide({ ...newRide, title: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Organizer Name *</label>
                      <input
                        type="text"
                        placeholder="Enter organizer name"
                        value={newRide.organizer}
                        onChange={(e) => setNewRide({ ...newRide, organizer: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div className="space-y-4">
                    <h4 className="text-white text-lg">Location Details *</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 mb-2">State *</label>
                        <select
                          value={newRide.state}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        >
                          <option value="">Select State</option>
                          {Object.keys(indiaLocationData).sort().map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">District *</label>
                        <select
                          value={newRide.district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                          disabled={!newRide.state}
                          required
                        >
                          <option value="">Select District</option>
                          {availableDistricts.sort().map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Tourist Place (Optional)</label>
                        <select
                          value={newRide.touristPlace}
                          onChange={(e) => handleTouristPlaceChange(e.target.value)}
                          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                          disabled={!newRide.district}
                        >
                          <option value="">Select Tourist Place</option>
                          {availablePlaces.map(place => (
                            <option key={place} value={place}>{place}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {newRide.location && (
                      <div className="bg-zinc-800 rounded-lg p-3">
                        <span className="text-gray-400">Selected Location: </span>
                        <span className="text-yellow-400">{newRide.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-400 mb-2">Description *</label>
                    <textarea
                      placeholder="Describe the bike ride details, route, etc."
                      value={newRide.description}
                      onChange={(e) => setNewRide({ ...newRide, description: e.target.value })}
                      className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Date, Time, Distance, and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-gray-400 mb-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        Date *
                      </label>
                      <input
                        type="date"
                        value={newRide.date}
                        onChange={(e) => setNewRide({ ...newRide, date: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-gray-400 mb-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        Time *
                      </label>
                      <input
                        type="time"
                        value={newRide.time}
                        onChange={(e) => setNewRide({ ...newRide, time: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Distance *</label>
                      <input
                        type="text"
                        placeholder="e.g., 50 km"
                        value={newRide.distance}
                        onChange={(e) => setNewRide({ ...newRide, distance: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Difficulty Level *</label>
                      <select
                        value={newRide.difficulty}
                        onChange={(e) => setNewRide({ ...newRide, difficulty: e.target.value })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Max Participants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Maximum Participants *</label>
                      <input
                        type="number"
                        placeholder="Enter max participants"
                        value={newRide.maxParticipants}
                        onChange={(e) => setNewRide({ ...newRide, maxParticipants: parseInt(e.target.value) || 10 })}
                        className="w-full bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                        min="1"
                        max="100"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-gray-400 text-sm">
                        <p>* Required fields</p>
                        <p>Fill all details to create your bike ride</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">Upload Images (up to 5)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="bg-zinc-800 text-white rounded-lg px-4 py-3 w-full outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-yellow-400 text-black px-6 py-3 rounded-lg disabled:opacity-50"
                    >
                      {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Create Ride'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-zinc-700 text-white px-6 py-3 rounded-lg"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Search Bar */}
            <div className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-2 bg-zinc-800 rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rides by location or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-transparent text-white outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {searchLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </motion.button>
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery('');
                      setBikeRides(allRides);
                      setIsSearchActive(false);
                      setError(null);
                    }}
                    className="bg-zinc-700 text-white px-4 py-3 rounded-lg"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && !upcomingRides.length && (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-yellow-400" />
              </div>
            )}

            {/* No Rides Message */}
            {!loading && upcomingRides.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Bike className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No Bike Rides Yet</h3>
                <p className="text-gray-400 mb-4">Be the first to create a bike ride in your community!</p>
                {currentUserId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateForm(true)}
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg"
                  >
                    Create First Ride
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Rides List */}
            <div className="space-y-6">
              {upcomingRides.map((ride, index) => (
                <motion.div
                  key={ride._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                  className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-64 md:h-auto relative">
                      <ImageWithFallback
                        src={ride.images?.[0]?.url || "https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080"}
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
                          <span className="text-sm">{formatDate(ride.date)} at {ride.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Navigation className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm">{ride.participants.length}/{ride.maxParticipants} riders</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2">
                          <ImageWithFallback
                            src={ride.createdBy?.avatar || "https://i.pravatar.cc/150?img=2"}
                            alt={ride.organizer}
                            className="w-8 h-8 rounded-full border-2 border-yellow-400"
                          />
                          <div>
                            <p className="text-sm text-gray-400">Organized by</p>
                            <p className="text-white text-sm">{ride.organizer}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {currentUserId && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleJoinRide(ride._id)}
                              disabled={
                                isUserJoined(ride) || 
                                ride.participants.length >= ride.maxParticipants ||
                                joiningRides.has(ride._id) ||
                                ride.status !== 'upcoming'
                              }
                              className={`px-6 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 ${
                                isUserJoined(ride) 
                                  ? 'bg-green-600 text-white cursor-not-allowed'
                                  : ride.participants.length >= ride.maxParticipants
                                  ? 'bg-red-600 text-white cursor-not-allowed'
                                  : 'bg-yellow-400 text-black'
                              }`}
                            >
                              {joiningRides.has(ride._id) && <Loader className="w-4 h-4 animate-spin" />}
                              {isUserJoined(ride) 
                                ? 'Joined' 
                                : ride.participants.length >= ride.maxParticipants
                                ? 'Full'
                                : 'Join Ride'
                              }
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(ride._id)}
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
