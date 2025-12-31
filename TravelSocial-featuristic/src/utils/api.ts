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

// Helper to check if current user is admin
export const isCurrentUserAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
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
    images?: File[];
    location?: string;
    locationData?: { name: string; lat: number; lon: number };
  }) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('content', postData.content);
    
    if (postData.location) {
      formData.append('location', postData.location);
    }
    
    if (postData.locationData) {
      formData.append('locationData', JSON.stringify(postData.locationData));
    }
    
    // Add image files
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData
      });

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
  },

  // Edit post caption
  editPost: async (postId: string, content: string) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  },

  // Delete post
  deletePost: async (postId: string) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'DELETE'
    });
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE'
    });
  }
};

// BikeRides API
export const bikeRidesAPI = {
  // Get all bike rides
  getAllBikeRides: async () => {
    return apiRequest('/bike-rides');
  },

  // Create new bike ride
  createBikeRide: async (bikeRideData: {
    title: string;
    location: string;
    description: string;
    date: string;
    time: string;
    distance: string;
    difficulty: string;
    maxParticipants: number;
    participants?: number;
    organizer: string;
    images?: File[];
  }) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', bikeRideData.title);
    formData.append('location', bikeRideData.location);
    formData.append('description', bikeRideData.description);
    formData.append('date', bikeRideData.date);
    formData.append('time', bikeRideData.time);
    formData.append('distance', bikeRideData.distance);
    formData.append('difficulty', bikeRideData.difficulty);
    formData.append('maxParticipants', bikeRideData.maxParticipants.toString());
    formData.append('participants', (bikeRideData.participants || 0).toString());
    formData.append('organizer', bikeRideData.organizer);
    
    // Add image files
    if (bikeRideData.images && bikeRideData.images.length > 0) {
      bikeRideData.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bike-rides`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData
      });

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
  },

  // Search bike rides
  searchBikeRides: async (query: string) => {
    return apiRequest(`/bike-rides/search?query=${encodeURIComponent(query)}`);
  },

  // Get single bike ride details
  getBikeRideDetails: async (rideId: string) => {
    return apiRequest(`/bike-rides/${rideId}`);
  },

  // Join a bike ride
  joinBikeRide: async (rideId: string) => {
    return apiRequest(`/bike-rides/${rideId}/join`, {
      method: 'POST'
    });
  }
};

// Packages API
export const packagesAPI = {
  // Get all packages
  getAllPackages: async () => {
    return apiRequest('/packages');
  },

  // Create new package
  createPackage: async (packageData: {
    title: string;
    location: string;
    duration: string;
    price: string;
    originalPrice?: string;
    rating?: number;
    reviews?: number;
    includes: string[];
    highlights: string[];
    maxPeople: number;
    badge?: string;
    discount?: string;
    images?: File[];
  }) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', packageData.title);
    formData.append('location', packageData.location);
    formData.append('duration', packageData.duration);
    formData.append('price', packageData.price);
    
    if (packageData.originalPrice) {
      formData.append('originalPrice', packageData.originalPrice);
    }
    
    formData.append('rating', (packageData.rating || 0).toString());
    formData.append('reviews', (packageData.reviews || 0).toString());
    formData.append('includes', JSON.stringify(packageData.includes));
    formData.append('highlights', JSON.stringify(packageData.highlights));
    formData.append('maxPeople', packageData.maxPeople.toString());
    
    if (packageData.badge) {
      formData.append('badge', packageData.badge);
    }
    
    if (packageData.discount) {
      formData.append('discount', packageData.discount);
    }
    
    // Add image files
    if (packageData.images && packageData.images.length > 0) {
      packageData.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let browser set it with boundary for FormData
        },
        body: formData
      });

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
  },

  // Book a package
  bookPackage: async (packageId: string, bookingData: {
    travelers: number;
    totalPrice: string;
    specialRequests?: string;
  }) => {
    return apiRequest(`/packages/${packageId}/book`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }
};

// Bookings API
export const bookingsAPI = {
  // Get user's bookings
  getMyBookings: async () => {
    return apiRequest('/bookings/my');
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
