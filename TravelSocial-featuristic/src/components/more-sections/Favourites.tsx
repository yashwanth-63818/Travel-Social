import { motion } from 'motion/react';
import { useState } from 'react';
import { Heart, MapPin, Hotel, Bike, Package, Utensils, Star, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function Favourites() {
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'spots' | 'hotels' | 'packages' | 'rides'>('all');

  const favourites = {
    posts: [
      {
        id: 1,
        type: 'post',
        title: 'Sunset in Bali',
        author: 'Sarah Chen',
        image: 'https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        likes: 342,
        savedDate: '2 days ago'
      },
      {
        id: 2,
        type: 'post',
        title: 'Tokyo Night Lights',
        author: 'Yuki Tanaka',
        image: 'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        likes: 567,
        savedDate: '5 days ago'
      }
    ],
    spots: [
      {
        id: 3,
        type: 'spot',
        name: 'Hidden Waterfall Cave',
        location: 'Iceland',
        image: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.9,
        savedDate: '1 week ago'
      },
      {
        id: 4,
        type: 'spot',
        name: 'Ancient Temple Ruins',
        location: 'Cambodia',
        image: 'https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        rating: 4.8,
        savedDate: '2 weeks ago'
      }
    ],
    hotels: [
      {
        id: 5,
        type: 'hotel',
        name: 'Mandarin Oriental Tokyo',
        location: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '$299/night',
        rating: 4.9,
        savedDate: '3 days ago'
      }
    ],
    packages: [
      {
        id: 6,
        type: 'package',
        name: 'Bali Paradise - 7 Days',
        location: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: '$899',
        rating: 4.8,
        savedDate: '1 week ago'
      }
    ],
    rides: [
      {
        id: 7,
        type: 'ride',
        name: 'Coastal Highway Sunset Ride',
        location: 'Pacific Coast, California',
        image: 'https://images.unsplash.com/photo-1762178103168-58472e27126e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmlkZXIlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY0MzMzNTYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: 'Dec 5, 2025',
        savedDate: '4 days ago'
      }
    ]
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Heart },
    { id: 'posts', label: 'Posts', icon: Heart },
    { id: 'spots', label: 'Spots', icon: MapPin },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'rides', label: 'Rides', icon: Bike },
  ];

  const getAllFavourites = () => {
    return [
      ...favourites.posts,
      ...favourites.spots,
      ...favourites.hotels,
      ...favourites.packages,
      ...favourites.rides
    ];
  };

  const getFilteredFavourites = () => {
    if (activeTab === 'all') return getAllFavourites();
    return favourites[activeTab as keyof typeof favourites];
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'post': return Heart;
      case 'spot': return MapPin;
      case 'hotel': return Hotel;
      case 'package': return Package;
      case 'ride': return Bike;
      default: return Heart;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl text-yellow-400 mb-2">My Favourites</h2>
        <p className="text-gray-400">All your saved items in one place</p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black'
                  : 'bg-zinc-900 text-white border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredFavourites().map((item: any, index) => {
          const ItemIcon = getItemIcon(item.type);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)" }}
              className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all relative group"
            >
              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-3 right-3 z-10 bg-black/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-yellow-400" />
              </motion.button>

              {/* Image */}
              <div className="relative h-48">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-lg flex items-center gap-2">
                  <ItemIcon className="w-4 h-4" />
                  <span className="capitalize text-sm">{item.type}</span>
                </div>

                {/* Rating or Likes */}
                {item.rating && (
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{item.rating}</span>
                  </div>
                )}
                {item.likes && (
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1">
                    <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{item.likes}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white mb-1">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  {item.location && (
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-yellow-400" />
                      {item.location}
                    </p>
                  )}
                  {item.author && (
                    <p className="text-sm text-gray-400">by {item.author}</p>
                  )}
                </div>
                
                {/* Additional Info */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Saved {item.savedDate}</span>
                  {item.price && (
                    <span className="text-yellow-400">{item.price}</span>
                  )}
                  {item.date && (
                    <span className="text-yellow-400">{item.date}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {getFilteredFavourites().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">No favourites yet</h3>
          <p className="text-gray-400">Start exploring and save your favorite items</p>
        </motion.div>
      )}
    </div>
  );
}
