import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, ExternalLink, TrendingUp, Clock, Plus, Loader } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { packagesAPI, getCurrentUserId, isCurrentUserAdmin } from '../utils/api';

interface Package {
  _id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  includes: string[];
  highlights: string[];
  maxPeople: number;
  badge?: string;
  discount?: string;
  images: Array<{ url: string; publicId: string }>;
  createdBy: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookingPackages, setBookingPackages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Form state for creating new package
  const [newPackage, setNewPackage] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    originalPrice: '',
    rating: 0,
    reviews: 0,
    includes: [''],
    highlights: [''],
    maxPeople: 10,
    badge: '',
    discount: '',
    images: [] as File[]
  });

  const currentUserId = getCurrentUserId();

  // Check if user is admin
  const checkAdminStatus = async () => {
    if (currentUserId) {
      try {
        const adminStatus = await isCurrentUserAdmin();
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }
  };

  const handleBookPackage = async (packageId: string) => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    setBookingPackages(prev => new Set(prev).add(packageId));
    setError(null);

    try {
      const response = await packagesAPI.bookPackage(packageId);
      if (response.success) {
        // Show success message or redirect to bookings
        alert('Package booked successfully!');
      } else {
        setError(response.message || 'Failed to book package');
      }
    } catch (err: any) {
      console.error('Error booking package:', err);
      setError(err.message || 'Failed to book package');
    } finally {
      setBookingPackages(prev => {
        const next = new Set(prev);
        next.delete(packageId);
        return next;
      });
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [currentUserId]);

  const fetchPackages = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await packagesAPI.getAllPackages();
      if (response.success && response.data?.packages) {
        setPackages(response.data.packages);
      } else {
        setError('Failed to load packages');
      }
    } catch (err: any) {
      console.error('Error fetching packages:', err);
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUserId) {
      setError('You must be logged in to create a package');
      return;
    }

    if (!newPackage.title || !newPackage.location || !newPackage.duration || !newPackage.price) {
      setError('Please fill in all required fields');
      return;
    }

    // Filter out empty strings from arrays
    const cleanIncludes = newPackage.includes.filter(item => item.trim() !== '');
    const cleanHighlights = newPackage.highlights.filter(item => item.trim() !== '');

    if (cleanIncludes.length === 0 || cleanHighlights.length === 0) {
      setError('Please add at least one inclusion and one highlight');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await packagesAPI.createPackage({
        ...newPackage,
        includes: cleanIncludes,
        highlights: cleanHighlights
      });

      if (response.success && response.data?.package) {
        setPackages([response.data.package, ...packages]);
        setShowCreateForm(false);
        setNewPackage({
          title: '',
          location: '',
          duration: '',
          price: '',
          originalPrice: '',
          rating: 0,
          reviews: 0,
          includes: [''],
          highlights: [''],
          maxPeople: 10,
          badge: '',
          discount: '',
          images: []
        });
      } else {
        setError('Failed to create package');
      }
    } catch (err: any) {
      console.error('Error creating package:', err);
      setError(err.message || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPackage({ ...newPackage, images: Array.from(e.target.files).slice(0, 5) });
    }
  };

  const addInclude = () => {
    setNewPackage({ ...newPackage, includes: [...newPackage.includes, ''] });
  };

  const addHighlight = () => {
    setNewPackage({ ...newPackage, highlights: [...newPackage.highlights, ''] });
  };

  const removeInclude = (index: number) => {
    setNewPackage({ 
      ...newPackage, 
      includes: newPackage.includes.filter((_, i) => i !== index)
    });
  };

  const removeHighlight = (index: number) => {
    setNewPackage({ 
      ...newPackage, 
      highlights: newPackage.highlights.filter((_, i) => i !== index)
    });
  };

  const updateInclude = (index: number, value: string) => {
    const updated = [...newPackage.includes];
    updated[index] = value;
    setNewPackage({ ...newPackage, includes: updated });
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...newPackage.highlights];
    updated[index] = value;
    setNewPackage({ ...newPackage, highlights: updated });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const categories = [
    { name: "All Packages", count: packages.length },
    { name: "Beach & Islands", count: 12 },
    { name: "Mountains & Nature", count: 8 },
    { name: "City Breaks", count: 15 },
    { name: "Cultural Tours", count: 10 },
    { name: "Adventure", count: 9 }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl text-yellow-400">Travel Packages</h1>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-400">Curated experiences from the best travel providers worldwide</p>
        </motion.div>

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

        {/* Create New Package Button - Admin Only */}
        {currentUserId && isAdmin && (
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
              Create New Package
            </motion.button>
          </motion.div>
        )}

        {/* Create Form */}
        {showCreateForm && currentUserId && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-zinc-900 rounded-xl p-6 mb-6 border-2 border-yellow-400"
          >
            <h3 className="text-xl text-white mb-4">Create New Travel Package</h3>
            <form onSubmit={handleCreatePackage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Package Title"
                  value={newPackage.title}
                  onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newPackage.location}
                  onChange={(e) => setNewPackage({ ...newPackage, location: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Duration (e.g., 7 Days / 6 Nights)"
                  value={newPackage.duration}
                  onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Price (e.g., $899)"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Original Price (optional)"
                  value={newPackage.originalPrice}
                  onChange={(e) => setNewPackage({ ...newPackage, originalPrice: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="number"
                  placeholder="Max People"
                  value={newPackage.maxPeople}
                  onChange={(e) => setNewPackage({ ...newPackage, maxPeople: parseInt(e.target.value) || 10 })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  min="1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Rating (0-5)"
                  value={newPackage.rating}
                  onChange={(e) => setNewPackage({ ...newPackage, rating: parseFloat(e.target.value) || 0 })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                  min="0"
                  max="5"
                  step="0.1"
                />
                <input
                  type="text"
                  placeholder="Badge (optional)"
                  value={newPackage.badge}
                  onChange={(e) => setNewPackage({ ...newPackage, badge: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Discount (optional)"
                  value={newPackage.discount}
                  onChange={(e) => setNewPackage({ ...newPackage, discount: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Package Includes */}
              <div>
                <label className="block text-gray-400 mb-2">What's Included:</label>
                {newPackage.includes.map((include, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Inclusion ${index + 1}`}
                      value={include}
                      onChange={(e) => updateInclude(index, e.target.value)}
                      className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {newPackage.includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInclude(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInclude}
                  className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Inclusion
                </button>
              </div>

              {/* Package Highlights */}
              <div>
                <label className="block text-gray-400 mb-2">Highlights:</label>
                {newPackage.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Highlight ${index + 1}`}
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {newPackage.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Highlight
                </button>
              </div>

              {/* Image Upload */}
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
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Create Package'}
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

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {categories.map((category, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-zinc-900 border-2 border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition-all"
            >
              {category.name}
              <span className="ml-2 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-sm">
                {category.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && !packages.length && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
        )}

        {/* No Packages Message */}
        {!loading && packages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">No Travel Packages Yet</h3>
            <p className="text-gray-400 mb-4">Be the first to create an amazing travel package!</p>
            {currentUserId && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg"
              >
                Create First Package
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)" }}
              className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer"
            >
              {/* Package Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={pkg.images?.[0]?.url || "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080"}
                  alt={pkg.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Badges */}
                {pkg.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                {pkg.discount && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
                      {pkg.discount}
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white">{pkg.rating}</span>
                  <span className="text-gray-400 text-sm">({pkg.reviews})</span>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-5">
                <h3 className="text-xl text-white mb-2">{pkg.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    {pkg.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users className="w-4 h-4 text-yellow-400" />
                    Max {pkg.maxPeople} people
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Highlights:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.slice(0, 3).map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                    {pkg.highlights.length > 3 && (
                      <span className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded text-xs">
                        +{pkg.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Includes */}
                <div className="mb-4 pb-4 border-b border-zinc-800">
                  <p className="text-sm text-gray-400 mb-2">Package includes:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {pkg.includes.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-gray-300">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                  {pkg.includes.length > 4 && (
                    <p className="text-xs text-yellow-400 mt-1">+{pkg.includes.length - 4} more inclusions</p>
                  )}
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    {pkg.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">{pkg.originalPrice}</p>
                    )}
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl text-yellow-400">{pkg.price}</p>
                      <span className="text-sm text-gray-400">/ person</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBookPackage(pkg._id)}
                    disabled={bookingPackages.has(pkg._id)}
                    className="bg-yellow-400 text-black px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {bookingPackages.has(pkg._id) && <Loader className="w-4 h-4 animate-spin" />}
                    {bookingPackages.has(pkg._id) ? 'Booking...' : 'Book Now'}
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Book With Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-zinc-900 rounded-xl border-2 border-yellow-400 p-8"
        >
          <h2 className="text-3xl mb-6 text-yellow-400 text-center">Why Book With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Best Price Guarantee", description: "Find a lower price? We'll match it." },
              { title: "24/7 Support", description: "Round-the-clock customer assistance." },
              { title: "Flexible Booking", description: "Free cancellation on most packages." },
              { title: "Verified Reviews", description: "Real feedback from real travelers." }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-black fill-black" />
                </div>
                <h3 className="text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
