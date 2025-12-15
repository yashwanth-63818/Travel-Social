import { motion } from 'motion/react';
import { MapPin, Heart, Calendar, Edit, Settings, Share2, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const userPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Sunset vibes in Bali 🌅",
      likes: 342,
      comments: 56,
      location: "Bali, Indonesia"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Mountain peak conquered! 🏔️",
      likes: 289,
      comments: 34,
      location: "Swiss Alps"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Tokyo nights never disappoint ✨",
      likes: 567,
      comments: 89,
      location: "Tokyo, Japan"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Lost in ancient history 🏛️",
      likes: 423,
      comments: 67,
      location: "Cambodia"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      caption: "Food market adventures 🍜",
      likes: 198,
      comments: 23,
      location: "Morocco"
    }
  ];

  const savedSpots = [
    {
      id: 1,
      name: "Hidden Waterfall Cave",
      location: "Iceland",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "2 days ago"
    },
    {
      id: 2,
      name: "Secret Beach Cove",
      location: "Philippines",
      image: "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Ancient Temple Ruins",
      location: "Cambodia",
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "2 weeks ago"
    },
    {
      id: 4,
      name: "Local Street Market",
      location: "Morocco",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      savedDate: "3 weeks ago"
    }
  ];

  const stats = [
    { label: 'Posts', value: userPosts.length },
    { label: 'Saved Spots', value: savedSpots.length },
    { label: 'Countries', value: 12 },
    { label: 'Followers', value: '1.2K' }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-yellow-400"
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-zinc-900" />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-3xl mb-1 text-white">{user.name}</h1>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {user.joinDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-zinc-800 text-white px-4 py-2 rounded-lg border-2 border-yellow-400"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{user.bio}</p>

              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center bg-zinc-800 rounded-lg p-3 border border-yellow-400/20"
                  >
                    <p className="text-2xl text-yellow-400">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-6 bg-zinc-900 rounded-xl p-2 border-2 border-yellow-400"
        >
          {['Posts', 'Saved Spots', 'Travel Map', 'Statistics'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2 rounded-lg bg-yellow-400 text-black"
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* User Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl mb-4 text-yellow-400">My Posts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <ImageWithFallback
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white mb-2 text-sm">{post.caption}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> {post.comments}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-yellow-400" />
                    <span className="text-white">{post.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Saved Spots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl mb-4 text-yellow-400">Saved Hidden Spots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedSpots.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.2)" }}
                className="bg-zinc-900 rounded-xl overflow-hidden border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="w-32 h-32 flex-shrink-0">
                    <ImageWithFallback
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-3 pr-3">
                    <h3 className="text-white mb-2">{spot.name}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-yellow-400" />
                      {spot.location}
                    </p>
                    <p className="text-xs text-gray-500">Saved {spot.savedDate}</p>
                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-black px-3 py-1 rounded text-sm"
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-zinc-800 text-white px-3 py-1 rounded text-sm border border-yellow-400"
                      >
                        <Share2 className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
