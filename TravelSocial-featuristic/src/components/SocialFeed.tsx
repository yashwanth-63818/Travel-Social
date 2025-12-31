import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Send, Image as ImageIcon, MapPin, Loader2, MoreHorizontal, Edit3, Trash2, X, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { usePostsContext, Post } from '../contexts/PostsContext';
import { getCurrentUser, getCurrentUserId } from '../utils/api';

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
  const { posts, loading, error, createPost, toggleLike, addComment: addCommentAPI, getComments, editPost, deletePost, deleteComment } = usePostsContext();
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({});
  const [loadedComments, setLoadedComments] = useState<{[key: string]: any[]}>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);
  const [newLocation, setNewLocation] = useState('');
  
  // Post management states
  const [showPostMenu, setShowPostMenu] = useState<{[key: string]: boolean}>({});
  const [editingPost, setEditingPost] = useState<{[key: string]: boolean}>({});
  const [editContent, setEditContent] = useState<{[key: string]: string}>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{[key: string]: boolean}>({});
  const [selectedLocationData, setSelectedLocationData] = useState<LocationData | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = getCurrentUserId();
  const loggedInUser = getCurrentUser();

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if the click is outside any post menu or its trigger button
      if (!target.closest('.post-menu-container')) {
        setShowPostMenu({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLike = async (postId: string) => {
    if (!currentUserId) {
      alert('Please log in to like posts');
      return;
    }
    
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleAddComment = async (postId: string) => {
    const comment = commentText[postId]?.trim();
    if (!comment || !currentUserId) return;

    try {
      await addCommentAPI(postId, comment);
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      
      // Reload comments for this post
      const updatedComments = await getComments(postId);
      setLoadedComments(prev => ({ ...prev, [postId]: updatedComments }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const toggleCommentsView = async (postId: string) => {
    const isShowing = showComments[postId];
    
    if (!isShowing && !loadedComments[postId]) {
      // Load comments if not already loaded
      const comments = await getComments(postId);
      setLoadedComments(prev => ({ ...prev, [postId]: comments }));
    }
    
    setShowComments(prev => ({ ...prev, [postId]: !isShowing }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, postId: string) => {
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
      title: `${post.author.name}'s Travel Story`,
      text: post.content,
      url: `${window.location.origin}/post/${post._id}`
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

  const handleCreatePost = async () => {
    if (!newPost.trim() && selectedMedia.length === 0) {
      return;
    }

    if (!currentUserId) {
      alert('Please log in to create posts');
      return;
    }

    try {
      setIsPosting(true);
      
      // Extract File objects from selectedMedia
      const imageFiles = selectedMedia
        .filter(media => media.type === 'image')
        .map(media => media.file);

      await createPost({
        content: newPost,
        images: imageFiles.length > 0 ? imageFiles : undefined,
        location: newLocation.trim() || undefined,
        locationData: selectedLocationData || undefined
      });

      // Clear form and revoke object URLs
      selectedMedia.forEach(media => {
        if (media.url.startsWith('blob:')) {
          URL.revokeObjectURL(media.url);
        }
      });
      
      setNewPost('');
      setSelectedMedia([]);
      setNewLocation('');
      setSelectedLocationData(null);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      setShowLocationInput(false);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  // Post management handlers
  const togglePostMenu = (postId: string) => {
    setShowPostMenu(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const startEditPost = (postId: string, currentContent: string) => {
    setEditingPost(prev => ({ ...prev, [postId]: true }));
    setEditContent(prev => ({ ...prev, [postId]: currentContent }));
    setShowPostMenu(prev => ({ ...prev, [postId]: false }));
  };

  const cancelEditPost = (postId: string, originalContent: string) => {
    setEditingPost(prev => ({ ...prev, [postId]: false }));
    setEditContent(prev => ({ ...prev, [postId]: originalContent }));
  };

  const saveEditPost = async (postId: string) => {
    const newContent = editContent[postId]?.trim();
    if (!newContent) {
      alert('Post content cannot be empty');
      return;
    }

    try {
      await editPost(postId, newContent);
      setEditingPost(prev => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error('Error editing post:', error);
      alert('Failed to edit post. Please try again.');
    }
  };

  const confirmDeletePost = (postId: string) => {
    setShowDeleteConfirm(prev => ({ ...prev, [postId]: true }));
    setShowPostMenu(prev => ({ ...prev, [postId]: false }));
  };

  const cancelDeletePost = (postId: string) => {
    setShowDeleteConfirm(prev => ({ ...prev, [postId]: false }));
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setShowDeleteConfirm(prev => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      // Reload comments for this post
      const updatedComments = await getComments(postId);
      setLoadedComments(prev => ({ ...prev, [postId]: updatedComments }));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
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
              disabled={isPosting || (!newPost.trim() && selectedMedia.length === 0)}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Posts Feed */}
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mb-4" />
            <p className="text-gray-400">Loading travel stories...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md text-center">
              <div className="text-red-400 mb-2">⚠️ Connection Error</div>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No stories yet!</h3>
              <p className="text-gray-400 mb-6">
                Be the first to share your travel adventure with the community.
              </p>
              <button
                onClick={() => document.querySelector('textarea')?.focus()}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Share Your Story
              </button>
            </div>
          </div>
        ) : (
        <div className="space-y-6">
          {posts.map((post, index) => {
            if (!post || !post._id) return null;
            
            const isLikedByUser = currentUserId ? post.likes.includes(currentUserId) : false;
            const postComments = loadedComments[post._id] || [];
            
            return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 rounded-xl border-2 border-transparent hover:border-yellow-400 transition-all overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full border-2 border-yellow-400"
                  />
                  <div>
                    <p className="text-white font-semibold">{post.author.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
                
                {/* Three-dot menu for post owner only */}
                {(() => {
                  const isOwner = currentUserId && (
                    post.author._id === currentUserId || 
                    post.author.id === currentUserId ||
                    post.author._id?.toString() === currentUserId?.toString()
                  );
                  
                  return isOwner;
                })() && (
                  <div className="relative post-menu-container">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => togglePostMenu(post._id)}
                      className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </motion.button>
                    
                    {/* Dropdown menu */}
                    {showPostMenu[post._id] && (
                      <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 min-w-[150px]">
                        <button
                          onClick={() => startEditPost(post._id, post.content)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Caption
                        </button>
                        <button
                          onClick={() => confirmDeletePost(post._id)}
                          className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="px-4 pb-4">
                {editingPost[post._id] ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent[post._id] || ''}
                      onChange={(e) => setEditContent(prev => ({ ...prev, [post._id]: e.target.value }))}
                      className="w-full bg-zinc-800 text-white rounded-lg p-3 resize-none border-2 border-transparent focus:border-yellow-400 outline-none"
                      rows={3}
                      placeholder="What's on your mind?"
                    />
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => saveEditPost(post._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => cancelEditPost(post._id, post.content)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white mb-4">{post.content}</p>
                )}
              </div>
              
              {/* Delete Confirmation Modal */}
              {showDeleteConfirm[post._id] && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30 rounded-xl">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 max-w-sm mx-4">
                    <h3 className="text-white font-semibold mb-2">Delete Post?</h3>
                    <p className="text-gray-400 mb-4 text-sm">This action cannot be undone. Your post and all its comments will be permanently deleted.</p>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeletePost(post._id)}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => cancelDeletePost(post._id)}
                        className="flex-1 bg-zinc-700 text-white py-2 px-4 rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* Post Media */}
              {/* Show images from new images array or fallback to legacy mediaUrl */}
              {((post.images && post.images.length > 0) || post.mediaUrl) && (
                <div className="relative">
                  {/* New images array format */}
                  {post.images && post.images.length > 0 ? (
                    post.images.length === 1 ? (
                      // Single image
                      <ImageWithFallback
                        src={post.images[0].url}
                        alt="Post"
                        className="w-full h-96 object-cover"
                      />
                    ) : (
                      // Multiple images grid
                      <div className={`grid gap-1 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                        {post.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative">
                            <ImageWithFallback
                              src={image.url}
                              alt={`Post image ${index + 1}`}
                              className={`w-full object-cover ${
                                post.images.length <= 2 ? 'h-64' : 'h-48'
                              }`}
                            />
                            {/* Show +X more overlay for 4th image if there are more than 4 images */}
                            {index === 3 && post.images.length > 4 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-xl font-bold">+{post.images.length - 4}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    // Legacy mediaUrl format (backward compatibility)
                    post.mediaType === 'video' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full h-96 object-cover"
                      />
                    ) : (
                      <ImageWithFallback
                        src={post.mediaUrl}
                        alt="Post"
                        className="w-full h-96 object-cover"
                      />
                    )
                  )}
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 transition-colors ${
                        isLikedByUser ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${isLikedByUser ? 'fill-yellow-400' : ''}`} />
                      <span>{post.likesCount}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleCommentsView(post._id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>{post.commentsCount}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(post)}
                      className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      <Share2 className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post._id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-zinc-800 pt-4 mt-4"
                  >
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                        onKeyPress={(e) => handleKeyPress(e, post._id)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 border-2 border-transparent focus:border-yellow-400 outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddComment(post._id)}
                        className="bg-yellow-400 text-black px-4 py-2 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {postComments.map((comment: any) => {
                        const isCommentAuthor = currentUserId && (
                          comment.author._id === currentUserId || 
                          comment.author.id === currentUserId ||
                          comment.author._id?.toString() === currentUserId?.toString()
                        );
                        
                        const isPostOwner = currentUserId && (
                          post.author._id === currentUserId || 
                          post.author.id === currentUserId ||
                          post.author._id?.toString() === currentUserId?.toString()
                        );
                        
                        const canDeleteComment = isCommentAuthor || isPostOwner;
                        
                        return (
                          <div key={comment._id} className="flex gap-3">
                            <ImageWithFallback
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              className="w-8 h-8 rounded-full border border-yellow-400"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 bg-zinc-800 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium">{comment.author.name}</p>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">{comment.text}</p>
                                </div>
                                
                                {canDeleteComment && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                    className="ml-2 p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
