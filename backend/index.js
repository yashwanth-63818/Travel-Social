require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { User, HiddenPlace } = require('./models');
const { generateToken, authenticateToken, validateSignup, validateLogin } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;