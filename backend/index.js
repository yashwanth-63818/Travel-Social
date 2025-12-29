require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { User, Post, Comment, Like, Follow, HiddenPlace } = require('./models');
const { generateToken, authenticateToken, validateSignup, validateLogin } = require('./middleware');

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is required');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET environment variable is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Travel Social Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes

// Signup Route
app.post('/api/auth/signup', validateSignup, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          joinDate: user.joinDate
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

// Login Route
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          joinDate: user.joinDate,
          savedSpots: user.savedSpots,
          posts: user.posts
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// ==================== SOCIAL MEDIA ROUTES ====================

// POST /api/posts - Create a new post (Protected)
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content, mediaUrl, mediaType, location, locationData } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }

    const post = new Post({
      author: req.userId,
      content,
      mediaUrl,
      mediaType,
      location,
      locationData
    });

    await post.save();
    await post.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error creating post'
    });
  }
});

// GET /api/posts - Get all posts (newest first)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Get likes and comments count for each post
    const postsWithData = await Promise.all(posts.map(async (post) => {
      const likesCount = await Like.countDocuments({ post: post._id });
      const commentsCount = await Comment.countDocuments({ post: post._id });
      const likes = await Like.find({ post: post._id }).select('user');
      
      return {
        ...post,
        likesCount,
        commentsCount,
        likes: likes.map(like => like.user.toString())
      };
    }));

    res.status(200).json({
      success: true,
      data: { posts: postsWithData }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching posts'
    });
  }
});

// GET /api/posts/:postId - Get single post
app.get('/api/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likesCount = await Like.countDocuments({ post: post._id });
    const commentsCount = await Comment.countDocuments({ post: post._id });
    const likes = await Like.find({ post: post._id }).select('user');

    res.status(200).json({
      success: true,
      data: {
        post: {
          ...post.toObject(),
          likesCount,
          commentsCount,
          likes: likes.map(like => like.user.toString())
        }
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching post'
    });
  }
});

// POST /api/posts/:postId/like - Like/Unlike a post (Protected)
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ post: postId, user: req.userId });

    if (existingLike) {
      // Unlike the post
      await Like.deleteOne({ _id: existingLike._id });
      
      res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: { liked: false }
      });
    } else {
      // Like the post
      const like = new Like({
        post: postId,
        user: req.userId
      });
      await like.save();

      res.status(200).json({
        success: true,
        message: 'Post liked',
        data: { liked: true }
      });
    }

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error liking post'
    });
  }
});

// GET /api/posts/:postId/comments - Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { comments }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching comments'
    });
  }
});

// POST /api/posts/:postId/comments - Add comment to post (Protected)
app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = new Comment({
      post: postId,
      author: req.userId,
      text
    });

    await comment.save();
    await comment.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: { comment }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error adding comment'
    });
  }
});

// GET /api/users/:userId - Get user profile with stats
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate dynamic stats
    const postsCount = await Post.countDocuments({ author: userId });
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          stats: {
            posts: postsCount,
            followers: followersCount,
            following: followingCount
          }
        }
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching user'
    });
  }
});

// GET /api/users/:userId/posts - Get user's posts
app.get('/api/users/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Add likes and comments count
    const postsWithData = await Promise.all(posts.map(async (post) => {
      const likesCount = await Like.countDocuments({ post: post._id });
      const commentsCount = await Comment.countDocuments({ post: post._id });
      
      return {
        ...post,
        likesCount,
        commentsCount
      };
    }));

    res.status(200).json({
      success: true,
      data: { posts: postsWithData }
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching user posts'
    });
  }
});

// POST /api/users/:userId/follow - Follow/Unfollow user (Protected)
app.post('/api/users/:userId/follow', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.userId,
      following: userId
    });

    if (existingFollow) {
      // Unfollow
      await Follow.deleteOne({ _id: existingFollow._id });
      
      res.status(200).json({
        success: true,
        message: 'Unfollowed user',
        data: { following: false }
      });
    } else {
      // Follow
      const follow = new Follow({
        follower: req.userId,
        following: userId
      });
      await follow.save();

      res.status(200).json({
        success: true,
        message: 'Followed user',
        data: { following: true }
      });
    }

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error following user'
    });
  }
});

// Hidden Places Routes

// POST /api/places - Add a new hidden place (Protected)
app.post('/api/places', authenticateToken, async (req, res) => {
  try {
    const { title, description, imageUrl, location } = req.body;

    // Validate required fields
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and location are required'
      });
    }

    // Validate location coordinates
    if (!location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: 'Location must include both latitude and longitude'
      });
    }

    if (location.lat < -90 || location.lat > 90) {
      return res.status(400).json({
        success: false,
        message: 'Latitude must be between -90 and 90'
      });
    }

    if (location.lng < -180 || location.lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Longitude must be between -180 and 180'
      });
    }

    // Create new hidden place
    const hiddenPlace = new HiddenPlace({
      title,
      description,
      imageUrl,
      location: {
        lat: location.lat,
        lng: location.lng
      },
      createdBy: req.userId
    });

    await hiddenPlace.save();

    // Populate creator info and return
    await hiddenPlace.populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Hidden place added successfully',
      data: {
        place: hiddenPlace
      }
    });

  } catch (error) {
    console.error('Add hidden place error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while adding hidden place'
    });
  }
});

// GET /api/places - Get all hidden places (Public)
app.get('/api/places', async (req, res) => {
  try {
    const hiddenPlaces = await HiddenPlace.find()
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Hidden places retrieved successfully',
      data: {
        places: hiddenPlaces,
        count: hiddenPlaces.length
      }
    });

  } catch (error) {
    console.error('Get hidden places error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving hidden places'
    });
  }
});

// GET /api/places/system - Fetch and save places from OpenStreetMap (Public)
app.get('/api/places/system', async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query; // Default 10km radius

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided'
      });
    }

    // OpenStreetMap Overpass API query for nature places
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"="viewpoint"](around:${radius},${lat},${lng});
        node["natural"="waterfall"](around:${radius},${lat},${lng});
        node["natural"="peak"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["natural"="beach"](around:${radius},${lat},${lng});
        node["natural"="hot_spring"](around:${radius},${lat},${lng});
        way["tourism"="viewpoint"](around:${radius},${lat},${lng});
        way["natural"="waterfall"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
        way["natural"="beach"](around:${radius},${lat},${lng});
      );
      out geom;
    `;

    // Fetch data from Overpass API
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const response = await fetch(overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    const newPlaces = [];
    let duplicateCount = 0;

    for (const element of data.elements) {
      if (!element.lat || !element.lon) {
        // For ways, calculate centroid
        if (element.geometry && element.geometry.length > 0) {
          const coords = element.geometry;
          element.lat = coords.reduce((sum, coord) => sum + coord.lat, 0) / coords.length;
          element.lon = coords.reduce((sum, coord) => sum + coord.lon, 0) / coords.length;
        } else {
          continue;
        }
      }

      // Check for existing place at same coordinates (within 100m tolerance)
      const existingPlace = await HiddenPlace.findOne({
        'location.lat': { $gte: element.lat - 0.001, $lte: element.lat + 0.001 },
        'location.lng': { $gte: element.lon - 0.001, $lte: element.lon + 0.001 },
        source: 'system'
      });

      if (existingPlace) {
        duplicateCount++;
        continue;
      }

      // Generate title and description
      const tags = element.tags || {};
      const name = tags.name || tags['name:en'] || 'Hidden Natural Place';
      
      let description = 'A beautiful natural place discovered through OpenStreetMap data.';
      if (tags.natural) {
        description = `A scenic ${tags.natural} perfect for nature enthusiasts.`;
      } else if (tags.tourism === 'viewpoint') {
        description = 'A scenic viewpoint offering beautiful vistas.';
      } else if (tags.leisure === 'park') {
        description = 'A peaceful park area ideal for relaxation and recreation.';
      }

      // Add elevation info if available
      if (tags.ele) {
        description += ` Located at ${tags.ele}m elevation.`;
      }

      try {
        const newPlace = new HiddenPlace({
          title: name,
          description: description,
          location: {
            lat: element.lat,
            lng: element.lon
          },
          source: 'system'
          // Note: createdBy is not required for system-generated places
        });

        await newPlace.save();
        newPlaces.push(newPlace);
      } catch (saveError) {
        console.error('Error saving place:', saveError.message);
        continue;
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully processed ${data.elements.length} places from OpenStreetMap`,
      data: {
        newPlaces: newPlaces,
        addedCount: newPlaces.length,
        duplicateCount: duplicateCount,
        totalProcessed: data.elements.length
      }
    });

  } catch (error) {
    console.error('System places fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching system places'
    });
  }
});

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// GET /api/places/nearby - Get places within specified radius (Public)
app.get('/api/places/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // Default radius 10km

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude parameters are required'
      });
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const searchRadius = parseFloat(radius);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid numeric values for coordinates or radius'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinate values'
      });
    }

    if (searchRadius < 0 || searchRadius > 100) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be between 0 and 100 kilometers'
      });
    }

    // Get all hidden places from database
    const allPlaces = await HiddenPlace.find()
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });

    // Filter places within radius using Haversine formula
    const nearbyPlaces = allPlaces.filter(place => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        place.location.lat, 
        place.location.lng
      );
      return distance <= searchRadius;
    });

    // Add distance to each place for frontend use
    const placesWithDistance = nearbyPlaces.map(place => ({
      ...place.toObject(),
      distance: Math.round(calculateDistance(
        latitude, 
        longitude, 
        place.location.lat, 
        place.location.lng
      ) * 100) / 100 // Round to 2 decimal places
    }));

    // Sort by distance (closest first)
    placesWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: `Found ${placesWithDistance.length} hidden places within ${searchRadius}km`,
      data: {
        places: placesWithDistance,
        count: placesWithDistance.length,
        searchCenter: {
          lat: latitude,
          lng: longitude
        },
        searchRadius: searchRadius,
        sources: {
          user: placesWithDistance.filter(p => p.source === 'user').length,
          system: placesWithDistance.filter(p => p.source === 'system').length
        }
      }
    });

  } catch (error) {
    console.error('Nearby places search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching nearby places'
    });
  }
});

// GET /api/locations - Location autocomplete for flight and hotel booking (Public)
app.get('/api/locations', async (req, res) => {
  try {
    const { q } = req.query;

    // Return empty array if query is too short
    if (!q || q.length < 2) {
      return res.status(200).json([]);
    }

    // Fetch data from OpenStreetMap Nominatim API
    const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
    nominatimUrl.searchParams.append('q', q);
    nominatimUrl.searchParams.append('format', 'json');
    nominatimUrl.searchParams.append('addressdetails', '1');
    nominatimUrl.searchParams.append('limit', '5');

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        'User-Agent': 'TravelSocialApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    // Map the response to required format
    const locations = data.map(item => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type || 'location'
    }));

    res.status(200).json(locations);

  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching locations'
    });
  }
});

// Flight Search Endpoint - Meta-search with simulated pricing
app.get('/api/flights/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: 'From, to, and date parameters are required'
      });
    }

    // Simulate flight providers with base fares
    const providers = [
      {
        name: 'Skyscanner',
        baseFare: 1500,
        urlTemplate: 'https://www.skyscanner.co.in/transport/flights/{from}/{to}/{date}'
      },
      {
        name: 'AirAsia',
        baseFare: 1200,
        urlTemplate: 'https://www.airasia.com/en/gb/flights/search?origin={from}&destination={to}&departureDate={date}'
      },
      {
        name: 'MakeMyTrip',
        baseFare: 1800,
        urlTemplate: 'https://www.makemytrip.com/flight/search?itinerary={from}-{to}-{date}'
      }
    ];

    // Generate dynamic pricing based on date
    const searchDate = new Date(date);
    const dayOfWeek = searchDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateMultiplier = isWeekend ? 1.3 : 1.0; // Weekend premium
    
    // Add some randomness based on date hash
    const dateHash = date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const randomFactor = 0.8 + ((dateHash % 100) / 100) * 0.4; // 0.8 to 1.2

    const results = providers.map(provider => {
      const dynamicPrice = Math.round(provider.baseFare * dateMultiplier * randomFactor);
      const bookUrl = provider.urlTemplate
        .replace('{from}', from.toLowerCase())
        .replace('{to}', to.toLowerCase())
        .replace('{date}', date);

      return {
        provider: provider.name,
        price: dynamicPrice,
        currency: 'INR',
        bookUrl: bookUrl
      };
    });

    // Sort by lowest price first
    results.sort((a, b) => a.price - b.price);

    res.status(200).json({
      success: true,
      data: {
        flights: results,
        searchParams: { from, to, date },
        count: results.length
      }
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching flights'
    });
  }
});

// Hotel Search Endpoint - Meta-search with simulated pricing
app.get('/api/hotels/search', async (req, res) => {
  try {
    const { city, checkIn, checkOut } = req.query;

    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'City, checkIn, and checkOut parameters are required'
      });
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));

    // Simulate hotel providers
    const providers = [
      {
        name: 'Booking.com',
        urlTemplate: 'https://www.booking.com/searchresults.html?ss={city}&checkin={checkIn}&checkout={checkOut}'
      },
      {
        name: 'Hostelworld',
        urlTemplate: 'https://www.hostelworld.com/search?search_keywords={city}&date_from={checkIn}&date_to={checkOut}'
      },
      {
        name: 'Agoda',
        urlTemplate: 'https://www.agoda.com/search?city={city}&checkIn={checkIn}&checkOut={checkOut}'
      }
    ];

    // Generate dynamic hotel listings
    const hotelNames = [
      'Grand Plaza Hotel', 'City Center Inn', 'Royal Gardens Resort',
      'Budget Backpackers', 'Executive Suites', 'Comfort Lodge',
      'Urban Stay Hotel', 'Heritage Palace', 'Modern Business Hotel'
    ];

    // Date-based pricing variations
    const dateHash = checkIn.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const seasonMultiplier = (dateHash % 50 + 50) / 100; // 0.5 to 1.0
    const isWeekend = new Date(checkIn).getDay() >= 5;
    const weekendMultiplier = isWeekend ? 1.4 : 1.0;

    const results = [];

    providers.forEach(provider => {
      // Generate 2-3 hotels per provider
      const hotelCount = 2 + (dateHash % 2);
      
      for (let i = 0; i < hotelCount; i++) {
        const basePrice = 800 + (i * 600) + (dateHash % 400);
        const dynamicPrice = Math.round(basePrice * seasonMultiplier * weekendMultiplier);
        const rating = 3.5 + (i * 0.5) + ((dateHash + i) % 10) / 10;
        
        const bookUrl = provider.urlTemplate
          .replace('{city}', encodeURIComponent(city))
          .replace('{checkIn}', checkIn)
          .replace('{checkOut}', checkOut);

        results.push({
          hotelName: hotelNames[(dateHash + i) % hotelNames.length],
          rating: Math.min(5.0, Math.round(rating * 10) / 10),
          pricePerNight: dynamicPrice,
          totalPrice: dynamicPrice * nights,
          currency: 'INR',
          provider: provider.name,
          nights: nights,
          bookUrl: bookUrl
        });
      }
    });

    // Sort by lowest price per night
    results.sort((a, b) => a.pricePerNight - b.pricePerNight);

    res.status(200).json({
      success: true,
      data: {
        hotels: results,
        searchParams: { city, checkIn, checkOut, nights },
        count: results.length
      }
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while searching hotels'
    });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 TravelSocial Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;