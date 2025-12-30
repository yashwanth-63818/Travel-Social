// API base URL - Use relative path since Vite proxy handles backend forwarding
const API_BASE_URL = '/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper to get current user ID
export const getCurrentUserId = (): string | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }
  return null;
};

// Helper to get current user
export const getCurrentUser = (): any | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  }
  return null;
};

// API request helper with better error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {})
      }
    });

    // Check if response is ok
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use the HTTP status message
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
    }
    
    throw error;
  }
};

// Posts API
export const postsAPI = {
  // Get all posts
  getAllPosts: async () => {
    return apiRequest('/posts');
  },

  // Get single post
  getPost: async (postId: string) => {
    return apiRequest(`/posts/${postId}`);
  },

  // Create new post
  createPost: async (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    location?: string;
    locationData?: { name: string; lat: number; lon: number };
  }) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  // Like/Unlike post
  toggleLike: async (postId: string) => {
    return apiRequest(`/posts/${postId}/like`, {
      method: 'POST'
    });
  },

  // Get comments for a post
  getComments: async (postId: string) => {
    return apiRequest(`/posts/${postId}/comments`);
  },

  // Add comment to post
  addComment: async (postId: string, text: string) => {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }
};

// Users API
export const usersAPI = {
  // Get user profile with stats
  getUser: async (userId: string) => {
    return apiRequest(`/users/${userId}`);
  },

  // Get user's posts
  getUserPosts: async (userId: string) => {
    return apiRequest(`/users/${userId}/posts`);
  },

  // Follow/Unfollow user
  toggleFollow: async (userId: string) => {
    return apiRequest(`/users/${userId}/follow`, {
      method: 'POST'
    });
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Save token and user to localStorage
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  },

  // Signup
  signup: async (name: string, email: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
