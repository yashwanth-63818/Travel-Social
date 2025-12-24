import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  id: number;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  location?: string;
  locationData?: LocationData;
  media?: MediaFile[];
  likes: string[];
  comments: Comment[];
  shares: number;
  isSaved: boolean;
}

interface PostsContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (postId: number, updates: Partial<Post>) => void;
}

// Create default context value
const defaultContextValue: PostsContextType = {
  posts: [],
  addPost: () => {},
  updatePost: () => {}
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
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=1",
      time: "2 hours ago",
      content: "Just discovered this hidden gem in the mountains! The view is absolutely breathtaking and the hiking trail was challenging but so worth it. Can't wait to come back here with friends! 🏔️✨",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbnxlbnwwfHx8fDE3NjQyOTczMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Mount Rainier, Washington",
      locationData: { name: "Mount Rainier", lat: 46.8523, lon: -121.7603 },
      likes: ['user1', 'user2'],
      comments: [
        {
          id: 1,
          userId: 'user2',
          username: 'Alex M.',
          avatar: 'https://i.pravatar.cc/150?img=5',
          text: 'Amazing shot! Which trail did you take?',
          timestamp: '1 hour ago'
        }
      ],
      shares: 12,
      isSaved: false
    },
    {
      id: 2,
      author: "James Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=2",
      time: "4 hours ago",
      content: "Beach vibes in paradise! 🌊 The water is crystal clear and the sunset here is like nothing I've ever seen. Perfect spot for some well-deserved relaxation after months of work.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaHxlbnwwfHx8fDE3NjQyOTczMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Maldives",
      locationData: { name: "Maldives", lat: 3.2028, lon: 73.2207 },
      likes: ['user3', 'user4', 'user5'],
      comments: [],
      shares: 34,
      isSaved: true
    },
    {
      id: 3,
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
      time: "1 day ago",
      content: "Urban exploration at its finest! This city never sleeps and there's always something new to discover around every corner. The architecture here tells so many stories! 🏙️📸",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZXxlbnwwfHx8fDE3NjQyOTczMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "New York City",
      locationData: { name: "New York City", lat: 40.7128, lon: -74.0060 },
      likes: ['user1', 'user2', 'user3', 'user4', 'user5'],
      comments: [],
      shares: 67,
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
      locationData: { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      likes: ['user_001', 'user2', 'user4'],
      comments: [
        {
          id: 1,
          userId: 'user3',
          username: 'Anna K.',
          avatar: 'https://i.pravatar.cc/150?img=8',
          text: 'Tokyo is absolutely amazing! Love the night photography.',
          timestamp: '1 day ago'
        },
        {
          id: 2,
          userId: 'user5',
          username: 'David L.',
          avatar: 'https://i.pravatar.cc/150?img=2',
          text: 'Which district is this? Planning my visit soon!',
          timestamp: '1 day ago'
        }
      ],
      shares: 92,
      isSaved: false
    }
  ]);

  const addPost = (post: Post) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  const updatePost = (postId: number, updates: Partial<Post>) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost }}>
      {children}
    </PostsContext.Provider>
  );
};