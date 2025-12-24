import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Send, Image as ImageIcon, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { usePostsContext, Post } from '../contexts/PostsContext';

// Mock user constants
const mockUserId = "user_001";
const mockUserName = "Nova";

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface LocationSuggestion {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address: {
    country?: string;
    country_code?: string;
  };
}

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

interface SocialFeedProps {
  currentUser: any;
  onLocationSelect?: (location: LocationData) => void;
}

export default function SocialFeed({ 
  currentUser, 
  onLocationSelect
}: SocialFeedProps) {
  const { posts, addPost, updatePost } = usePostsContext();
  const [newPost, setNewPost] = useState('');

  const [commentText, setCommentText] = useState<{[key: number]: string}>({});
  const [showComments, setShowComments] = useState<{[key: number]: boolean}>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [newLocation, setNewLocation] = useState('');
  const [selectedLocationData, setSelectedLocationData] = useState<LocationData | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      selectedMedia.forEach(media => {
        if (media.url.startsWith('blob:')) {
          URL.revokeObjectURL(media.url);
        }
      });
    };
  }, [selectedMedia]);

  const handleLike = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isCurrentlyLiked = post.likes.includes(mockUserId);
      const newLikes = isCurrentlyLiked 
        ? post.likes.filter(userId => userId !== mockUserId)
        : [...post.likes, mockUserId];
      updatePost(postId, { likes: newLikes });
    }
  };

  const handleSave = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { isSaved: !post.isSaved });
    }
  };

  const handleAddComment = (postId: number) => {
    const comment = commentText[postId]?.trim();
    if (!comment) return;

    const newComment = {
      id: Date.now(),
      userId: mockUserId,
      username: currentUser?.name || mockUserName,
      avatar: currentUser?.avatar || "https://i.pravatar.cc/150?img=8",
      text: comment,
      timestamp: "Just now"
    };

    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(postId, { comments: [...post.comments, newComment] });
    }

    setCommentText(prev => ({ ...prev, [postId]: '' }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment(postId);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newMediaFiles: MediaFile[] = [];
    
    Array.from(files).forEach((file) => {
      // Check file type
      const isImage = file.type.startsWith('image/') && /\.(jpg|jpeg|png)$/i.test(file.name);
      const isVideo = file.type.startsWith('video/') && /\.(mp4|webm)$/i.test(file.name);
      
      if (isImage || isVideo) {
        const mediaFile: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          url: URL.createObjectURL(file),
          type: isImage ? 'image' : 'video'
        };
        newMediaFiles.push(mediaFile);
      }
    });

    setSelectedMedia(prev => [...prev, ...newMediaFiles]);
    
    // Clear the input value so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeMedia = (mediaId: string) => {
    setSelectedMedia(prev => {
      const updated = prev.filter(media => media.id !== mediaId);
      // Clean up the removed media's URL
      const removed = prev.find(media => media.id === mediaId);
      if (removed && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
      );
      if (response.ok) {
        const suggestions: LocationSuggestion[] = await response.json();
        setLocationSuggestions(suggestions);
        setShowLocationSuggestions(suggestions.length > 0);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const debouncedSearchLocations = (query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewLocation(value);
    setSelectedLocationData(null); // Clear selected data when typing
    debouncedSearchLocations(value);
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    const locationData: LocationData = {
      name: suggestion.name || suggestion.display_name.split(',')[0],
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    };
    setSelectedLocationData(locationData);
    setNewLocation(locationData.name);
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    
    // Sync with map if callback is available
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  const toggleLocationInput = () => {
    const newShowLocationInput = !showLocationInput;
    setShowLocationInput(newShowLocationInput);
    
    if (!newShowLocationInput) {
      // Clear location data when hiding input
      setNewLocation('');
      setSelectedLocationData(null);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShare = async (post: Post) => {
    const shareData = {
      title: `${post.author}'s Travel Story`,
      text: post.content,
      url: `${window.location.origin}/post/${post.id}`
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
          alert('Post link copied to clipboard!');
        } else {
          // Final fallback for very old browsers
          console.log('Share data:', shareData);
          alert('Sharing not supported in this browser.');
        }
      }
    } catch (error) {
      // Fallback if both methods fail
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
          alert('Post link copied to clipboard!');
        } else {
          console.log('Share failed:', error);
          alert('Unable to share at the moment. Please try again.');
        }
      } catch (clipboardError) {
        console.log('Clipboard failed:', clipboardError);
        alert('Unable to share at the moment. Please try again.');
      }
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim() || selectedMedia.length > 0) {
      const post = {
        id: posts && posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        author: currentUser?.name || mockUserName,
        avatar: currentUser?.avatar || "https://i.pravatar.cc/150?img=8",
        time: "Just now",
        content: newPost,
        image: "",
        location: newLocation.trim() || undefined,
        locationData: selectedLocationData || undefined,
        media: selectedMedia.length > 0 ? [...selectedMedia] : undefined,
        likes: [],
        comments: [],
        shares: 0,
        isSaved: false
      };
      addPost(post);
      setNewPost('');
      setSelectedMedia([]);
      setNewLocation('');
      setSelectedLocationData(null);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      setShowLocationInput(false);
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
              alt={currentUser?.name || mockUserName}
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
          
          {/* Media Preview Section */}
          {selectedMedia.length > 0 && (
            <div className="mb-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedMedia.map((media) => (
                  <div key={media.id} className="relative group">
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg border border-zinc-700"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-24 object-cover rounded-lg border border-zinc-700"
                        muted
                      />
                    )}
                    <button
                      onClick={() => removeMedia(media.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Location Input Section */}
          {showLocationInput && (
            <div className="mb-3 relative" ref={locationInputRef}>
              <input
                type="text"
                value={newLocation}
                onChange={handleLocationInputChange}
                placeholder="Add a location..."
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 border-2 border-transparent focus:border-yellow-400 outline-none text-sm"
                autoComplete="off"
              />
              {isLoadingSuggestions && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Suggestions Dropdown */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-zinc-800 border-2 border-zinc-700 rounded-lg mt-1 max-h-48 overflow-y-auto z-10 shadow-lg">
                  {locationSuggestions.map((suggestion) => {
                    const placeName = suggestion.name || suggestion.display_name.split(',')[0];
                    const country = suggestion.address?.country || '';
                    
                    return (
                      <button
                        key={suggestion.place_id}
                        onClick={() => handleLocationSelect(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors border-b border-zinc-700 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium">{placeName}</div>
                            {country && (
                              <div className="text-gray-400 text-xs">{country}</div>
                            )}
                          </div>
                          <MapPin className="w-4 h-4 text-yellow-400 ml-2" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpg,image/jpeg,image/png,video/mp4,video/webm"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Photo</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLocationInput}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showLocationInput ? 'bg-yellow-400 text-black' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <MapPin className={`w-4 h-4 ${showLocationInput ? 'text-black' : 'text-yellow-400'}`} />
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
          {posts && posts.length > 0 ? posts.map((post, index) => {
            if (!post || !post.id) return null;
            
            return (
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

              {/* Post Image (legacy) */}
              {post.image && (
                <div className="relative">
                  <ImageWithFallback
                    src={post.image}
                    alt="Post"
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Post Media (new upload system) */}
              {post.media && post.media.length > 0 && (
                <div className="px-4 pb-4">
                  <div className={`grid gap-2 ${
                    post.media.length === 1 ? 'grid-cols-1' : 
                    post.media.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {post.media.map((media) => (
                      <div key={media.id} className="relative">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Post media"
                            className={`w-full object-cover rounded-lg ${
                              post.media!.length === 1 ? 'h-64' : 'h-32'
                            }`}
                          />
                        ) : (
                          <video
                            src={media.url}
                            controls
                            className={`w-full object-cover rounded-lg ${
                              post.media!.length === 1 ? 'h-64' : 'h-32'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
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
                        post.likes.includes(mockUserId) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${post.likes.includes(mockUserId) ? 'fill-yellow-400' : ''}`} />
                      <span>{post.likes.length}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>{post.comments.length}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(post)}
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
                        onKeyPress={(e) => handleKeyPress(e, post.id)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 border-2 border-transparent focus:border-yellow-400 outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddComment(post.id)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <ImageWithFallback
                            src={comment.avatar}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full border border-yellow-400"
                          />
                          <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">{comment.username}</p>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            );
          }) : (
            <div className="text-center text-gray-400 py-8">
              <p>No posts yet. Share your first travel story!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
