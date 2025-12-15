import { motion } from 'motion/react';
import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Send, Image as ImageIcon, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SocialFeedProps {
  currentUser: any;
}

export default function SocialFeed({ currentUser }: SocialFeedProps) {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
      time: "2 hours ago",
      content: "Just discovered this amazing hidden waterfall in Bali! The trek was challenging but absolutely worth it. Who else loves off-the-beaten-path adventures? 🌊✨",
      image: "https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjQzNTM5MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Bali, Indonesia",
      likes: 342,
      comments: 56,
      shares: 23,
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      author: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "5 hours ago",
      content: "Sunrise at Angkor Wat never gets old. This was my third visit and it still takes my breath away every time. 🌅",
      image: "https://images.unsplash.com/photo-1598177183308-ec8555cbfe76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwdGVtcGxlJTIwcnVpbnN8ZW58MXx8fHwxNzY0Mzk5MjM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Siem Reap, Cambodia",
      likes: 567,
      comments: 89,
      shares: 34,
      isLiked: true,
      isSaved: true
    },
    {
      id: 3,
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=9",
      time: "1 day ago",
      content: "Found this incredible local food market in Marrakech. The flavors, colors, and energy are unmatched! If you're visiting, this is a must-see. 🍲🌶️",
      image: "https://images.unsplash.com/photo-1758346972493-86586fc8e5d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzY0MzY0MTc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Marrakech, Morocco",
      likes: 892,
      comments: 124,
      shares: 67,
      isLiked: false,
      isSaved: false
    },
    {
      id: 4,
      author: "Mike Johnson",
      avatar: "https://i.pravatar.cc/150?img=3",
      time: "2 days ago",
      content: "Tokyo at night hits different. The neon lights, the energy, the endless discoveries around every corner. Already planning my next trip back! 🗼🌃",
      image: "https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc2NDI5NzMxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Tokyo, Japan",
      likes: 1234,
      comments: 178,
      shares: 92,
      isLiked: true,
      isSaved: false
    }
  ]);

  const [commentText, setCommentText] = useState<{[key: number]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: currentUser?.name || "You",
        avatar: currentUser?.avatar || "https://i.pravatar.cc/150?img=8",
        time: "Just now",
        content: newPost,
        image: "",
        location: "",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isSaved: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl mb-2 text-yellow-400">Travel Stories</h1>
          <p className="text-gray-400">Share your adventures with the community</p>
        </motion.div>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 mb-6"
        >
          <div className="flex items-start gap-3 mb-3">
            <ImageWithFallback
              src={currentUser?.avatar || "https://i.pravatar.cc/150?img=8"}
              alt="You"
              className="w-12 h-12 rounded-full border-2 border-yellow-400"
            />
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your travel story..."
              className="flex-1 bg-zinc-800 text-white rounded-lg p-3 resize-none border-2 border-transparent focus:border-yellow-400 outline-none"
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Photo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Location</span>
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post
            </motion.button>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 rounded-xl border-2 border-transparent hover:border-yellow-400 transition-all overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                  <div>
                    <p className="text-white">{post.author}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{post.time}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {post.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSave(post.id)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Bookmark 
                    className={`w-6 h-6 ${post.isSaved ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                  />
                </motion.button>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                <p className="text-white mb-4">{post.content}</p>
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="relative">
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.isLiked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-yellow-400' : ''}`} />
                      <span>{post.likes}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>{post.comments}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Share2 className="w-6 h-6" />
                      <span>{post.shares}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-zinc-800 pt-4 mt-4"
                  >
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                        placeholder="Add a comment..."
                        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 border-2 border-transparent focus:border-yellow-400 outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src="https://i.pravatar.cc/150?img=7"
                          alt="Commenter"
                          className="w-8 h-8 rounded-full border border-yellow-400"
                        />
                        <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                          <p className="text-sm mb-1">John Doe</p>
                          <p className="text-sm text-gray-400">Amazing shots! Added to my bucket list 🙌</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
