import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { postsAPI } from '../utils/api';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface Comment {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  location?: string;
  locationData?: LocationData;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    location?: string;
    locationData?: LocationData;
  }) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  getComments: (postId: string) => Promise<Comment[]>;
}

// Create default context value
const defaultContextValue: PostsContextType = {
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async () => {},
  createPost: async () => {},
  toggleLike: async () => {},
  addComment: async () => {},
  getComments: async () => []
};

const PostsContext = createContext<PostsContextType>(defaultContextValue);

export const usePostsContext = (): PostsContextType => {
  const context = useContext(PostsContext);
  return context;
};

interface PostsProviderProps {
  children: ReactNode;
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getAllPosts();
      if (response.success) {
        setPosts(response.data.posts || []);
      } else {
        throw new Error(response.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to fetch posts');
      // Set empty array as fallback instead of keeping previous posts
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new post
  const createPost = async (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    location?: string;
    locationData?: LocationData;
  }) => {
    try {
      const response = await postsAPI.createPost(postData);
      if (response.success) {
        // Fetch fresh posts to get accurate counts
        await fetchPosts();
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  // Toggle like on a post
  const toggleLike = async (postId: string) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const currentUserId = localStorage.getItem('user') 
              ? JSON.parse(localStorage.getItem('user')!)._id 
              : null;
            
            if (!currentUserId) return post;

            const isLiked = post.likes.includes(currentUserId);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter(id => id !== currentUserId)
                : [...post.likes, currentUserId],
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
            };
          }
          return post;
        })
      );
    } catch (err: any) {
      console.error('Error toggling like:', err);
      throw err;
    }
  };

  // Add comment to post
  const addComment = async (postId: string, text: string) => {
    try {
      const response = await postsAPI.addComment(postId, text);
      
      // Update comments count optimistically
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, commentsCount: post.commentsCount + 1 }
            : post
        )
      );
    } catch (err: any) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  // Get comments for a post
  const getComments = async (postId: string): Promise<Comment[]> => {
    try {
      const response = await postsAPI.getComments(postId);
      if (response.success) {
        return response.data.comments;
      }
      return [];
    } catch (err: any) {
      console.error('Error getting comments:', err);
      return [];
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        toggleLike,
        addComment,
        getComments
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};