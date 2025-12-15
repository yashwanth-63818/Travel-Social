import { motion } from 'motion/react';
import { MapPin, Calendar, Users, Star, ExternalLink, TrendingUp, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Packages() {
  const packages = [
    {
      id: 1,
      title: "Bali Paradise Experience",
      location: "Bali, Indonesia",
      duration: "7 Days / 6 Nights",
      price: "$899",
      originalPrice: "$1,299",
      rating: 4.9,
      reviews: 456,
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "5-Star Hotel", "Daily Breakfast", "Airport Transfers", "Guided Tours", "Travel Insurance"],
      highlights: ["Ubud Rice Terraces", "Beach Hopping", "Temple Tours", "Snorkeling"],
      maxPeople: 12,
      link: "https://www.viator.com",
      badge: "Best Seller",
      discount: "31% OFF"
    },
    {
      id: 2,
      title: "Swiss Alps Adventure",
      location: "Switzerland",
      duration: "10 Days / 9 Nights",
      price: "$1,599",
      originalPrice: "$2,199",
      rating: 4.8,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "Boutique Hotels", "All Meals", "Swiss Rail Pass", "Mountain Activities", "Local Guide"],
      highlights: ["Jungfrau Summit", "Interlaken", "Zermatt", "Lake Geneva Cruise"],
      maxPeople: 8,
      link: "https://www.viator.com",
      badge: "Premium",
      discount: "27% OFF"
    },
    {
      id: 3,
      title: "Tokyo City Explorer",
      location: "Tokyo, Japan",
      duration: "5 Days / 4 Nights",
      price: "$1,299",
      originalPrice: "$1,799",
      rating: 4.7,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "4-Star Hotel", "Daily Breakfast", "Tokyo City Pass", "Cultural Experiences", "Subway Pass"],
      highlights: ["Shibuya & Harajuku", "Tokyo Skytree", "Traditional Tea Ceremony", "Tsukiji Market"],
      maxPeople: 15,
      link: "https://www.viator.com",
      badge: "Popular",
      discount: "28% OFF"
    },
    {
      id: 4,
      title: "Ancient Wonders of Egypt",
      location: "Cairo & Luxor, Egypt",
      duration: "8 Days / 7 Nights",
      price: "$1,199",
      originalPrice: "$1,699",
      rating: 4.9,
      reviews: 289,
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "Deluxe Hotels", "All Meals", "Nile Cruise", "Egyptologist Guide", "All Entrance Fees"],
      highlights: ["Great Pyramids", "Valley of the Kings", "Karnak Temple", "Nile River Cruise"],
      maxPeople: 20,
      link: "https://www.viator.com",
      badge: "Historical",
      discount: "29% OFF"
    },
    {
      id: 5,
      title: "Morocco Magic Tour",
      location: "Marrakech & Sahara, Morocco",
      duration: "6 Days / 5 Nights",
      price: "$799",
      originalPrice: "$1,099",
      rating: 4.8,
      reviews: 412,
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "Riads & Hotels", "Daily Breakfast", "Desert Camp Experience", "Camel Trek", "Local Guide"],
      highlights: ["Medina Exploration", "Sahara Desert", "Atlas Mountains", "Berber Villages"],
      maxPeople: 10,
      link: "https://www.viator.com",
      badge: "Adventure",
      discount: "27% OFF"
    },
    {
      id: 6,
      title: "Iceland Northern Lights",
      location: "Reykjavik, Iceland",
      duration: "5 Days / 4 Nights",
      price: "$1,399",
      originalPrice: "$1,899",
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      includes: ["Round-trip Flights", "Hotel", "Daily Breakfast", "Golden Circle Tour", "Northern Lights Hunt", "Blue Lagoon Entry"],
      highlights: ["Northern Lights", "Blue Lagoon", "Geysers & Waterfalls", "Glacier Hike"],
      maxPeople: 12,
      link: "https://www.viator.com",
      badge: "Winter Special",
      discount: "26% OFF"
    }
  ];

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

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)" }}
              className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer"
            >
              {/* Package Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg">
                    {pkg.badge}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-lg">
                    {pkg.discount}
                  </span>
                </div>

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
                  <div className="grid grid-cols-2 gap-1">
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
                    <p className="text-sm text-gray-400 line-through">{pkg.originalPrice}</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl text-yellow-400">{pkg.price}</p>
                      <span className="text-sm text-gray-400">/ person</span>
                    </div>
                  </div>
                  <motion.a
                    href={pkg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-black px-5 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    View
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
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
