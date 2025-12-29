import { motion } from 'motion/react';
import { MapPin, Heart, Calendar, Edit, Settings, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { getCurrentUserId, usersAPI } from '../utils/api';

interface ProfileProps {
  user: any;
}

export default function Profile({ user }: ProfileProps) {
  const currentUserId = getCurrentUserId();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = currentUserId || user._id;
        
        // Fetch user stats
        const userData = await usersAPI.getUser(userId);
        setUserStats(userData.stats);
        
        // Fetch user posts
        const posts = await usersAPI.getUserPosts(userId);
        setUserPosts(posts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUserId, user._id]);

  const stats = userStats ? [
    { label: 'Posts', value: userStats.posts },
    { label: 'Following', value: userStats.following },
    { label: 'Followers', value: userStats.followers },
    { label: 'Saved Spots', value: 0 } // TODO: Implement saved spots
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

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
          {userPosts.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-xl border-2 border-yellow-400/20">
              <p className="text-gray-400">No posts yet. Start sharing your adventures!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.map((post: any, index: number) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <ImageWithFallback
                    src={post.mediaUrl?.[0] || "https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080"}
                    alt={post.content}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white mb-2 text-sm line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-300">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {post.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                    {post.location && (
                      <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-yellow-400" />
                        <span className="text-white">{post.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Saved Spots - Placeholder for future implementation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl mb-4 text-yellow-400">Saved Hidden Spots</h2>
          <div className="text-center py-12 bg-zinc-900 rounded-xl border-2 border-yellow-400/20">
            <p className="text-gray-400">Saved spots feature coming soon!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
