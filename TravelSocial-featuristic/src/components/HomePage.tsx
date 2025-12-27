import { motion } from 'motion/react';
import { MapPin, Heart, MessageCircle, Share2, Eye, TrendingUp, Plane, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  isAuthenticated: boolean;
}

export default function HomePage({ isAuthenticated }: HomePageProps) {
  const featuredBlogs = [
    {
      id: 1,
      title: "Hidden Beaches of Bali: A Local's Guide",
      author: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      views: 12500,
      likes: 1234,
      category: "Hidden Gems"
    },
    {
      id: 2,
      title: "Mountain Trails Less Traveled",
      author: "Mike Johnson",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 9800,
      likes: 876,
      category: "Adventure"
    },
    {
      id: 3,
      title: "Urban Exploration: Tokyo After Dark",
      author: "Yuki Tanaka",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      views: 15600,
      likes: 2341,
      category: "City Guide"
    }
  ];

  const hiddenSpots = [
    {
      id: 1,
      name: "Secret Waterfall Cave",
      location: "Iceland",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      saves: 456
    },
    {
      id: 2,
      name: "Ancient Temple Ruins",
      location: "Cambodia",
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      saves: 678
    },
    {
      id: 3,
      name: "Local Food Market",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      saves: 892
    },
    {
      id: 4,
      name: "Sunset Beach",
      location: "Philippines",
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      saves: 1234
    }
  ];

  const travelPackages = [
    {
      id: 1,
      title: "Bali Paradise - 7 Days",
      price: "$899",
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Flights", "Hotels", "Tours"]
    },
    {
      id: 2,
      title: "Swiss Alps Adventure - 10 Days",
      price: "$1,599",
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Flights", "Hotels", "Meals", "Guide"]
    },
    {
      id: 3,
      title: "Tokyo City Explorer - 5 Days",
      price: "$1,299",
      rating: 4.7,
      reviews: 412,
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Flights", "Hotels", "City Pass"]
    }
  ];

  const latestPosts = [
    {
      id: 1,
      author: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "2 hours ago",
      content: "Just discovered an amazing hidden café in Barcelona! The locals keep this place a secret 🤫",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 234,
      comments: 45,
      shares: 12
    },
    {
      id: 2,
      author: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
      time: "5 hours ago",
      content: "Sunrise at Angkor Wat was absolutely breathtaking! Worth the early wake-up call 🌅",
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      likes: 567,
      comments: 89,
      shares: 34
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl mb-6 text-yellow-400"
          >
            Discover Hidden Wonders
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl mb-8 text-white"
          >
            Share your adventures, explore secret spots, ride together
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/map">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black px-8 py-3 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Explore Map
              </motion.button>
            </Link>
            <Link to={isAuthenticated ? "/feed" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
              >
                Join Community
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Search Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12 bg-zinc-900/50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl text-yellow-400 mb-4">
              Search Your Next Adventure
            </h2>
            <p className="text-gray-400 text-lg">
              Find the best deals on flights and hotels with our smart search
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/book">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-900 border-2 border-yellow-400 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-yellow-400/20 transition-all"
              >
                <div className="flex items-center mb-4">
                  <Plane className="w-8 h-8 text-yellow-400 mr-3" />
                  <h3 className="text-2xl text-white font-semibold">Flight Search</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Search and compare flights to destinations worldwide with smart city autocomplete
                </p>
                <div className="flex items-center text-yellow-400">
                  <span>Search Flights</span>
                  <MapPin className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>
            
            <Link to="/book">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-900 border-2 border-yellow-400 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-yellow-400/20 transition-all"
              >
                <div className="flex items-center mb-4">
                  <Calendar className="w-8 h-8 text-yellow-400 mr-3" />
                  <h3 className="text-2xl text-white font-semibold">Hotel Search</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Discover amazing hotels and accommodations in any city with location search
                </p>
                <div className="flex items-center text-yellow-400">
                  <span>Search Hotels</span>
                  <MapPin className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Blogs */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl text-yellow-400">Featured Travel Blogs</h2>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }}
                className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl mb-2 text-white">{blog.title}</h3>
                  <p className="text-gray-400 mb-4">by {blog.author}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {blog.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-yellow-400" /> {blog.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Hidden Tourist Spots */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl mb-8 text-yellow-400">Hidden Tourist Spots</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hiddenSpots.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white mb-1">{spot.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-yellow-400 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {spot.location}
                      </p>
                      <span className="text-white text-sm flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {spot.saves}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Travel Packages */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl text-yellow-400">Popular Travel Packages</h2>
            <Link to="/packages">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="text-yellow-400 hover:underline"
              >
                View All →
              </motion.button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-yellow-400 cursor-pointer"
              >
                <div className="relative h-56">
                  <ImageWithFallback
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 text-yellow-400 px-4 py-2 rounded-lg">
                    {pkg.price}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl text-white mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400">★ {pkg.rating}</span>
                    <span className="text-gray-400">({pkg.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pkg.includes.map((item, i) => (
                      <span
                        key={i}
                        className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Latest Posts */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl mb-8 text-yellow-400">Latest Travel Stories</h2>
          <div className="space-y-6">
            {latestPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 rounded-xl p-5 border-2 border-transparent hover:border-yellow-400 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ImageWithFallback
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                  <div>
                    <p className="text-white">{post.author}</p>
                    <p className="text-gray-400 text-sm">{post.time}</p>
                  </div>
                </div>
                <p className="text-white mb-4">{post.content}</p>
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-4">
                    <ImageWithFallback
                      src={post.image}
                      alt="Post"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-6 text-gray-400">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" /> {post.likes}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" /> {post.comments}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                  >
                    <Share2 className="w-5 h-5" /> {post.shares}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={isAuthenticated ? "/feed" : "/login"}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black px-8 py-3 rounded-lg"
              >
                View All Stories
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
