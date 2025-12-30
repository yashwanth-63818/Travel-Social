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

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

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
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.status(200).json({
    success: true,
    message: 'Travel Social Backend is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStates[dbStatus] || 'unknown',
      connected: dbStatus === 1
    }
  });
});

// Authentication Routes

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

    // Generate JWT token
    const token = generateToken({ 
      id: user._id.toString(), 
      email: user.email 
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

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

    // Generate JWT token
    const token = generateToken({ 
      id: user._id.toString(), 
      email: user.email 
    });

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
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Posts Routes

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

    // Create new post
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
      message: 'Internal server error creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      message: 'Internal server error fetching posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/posts/:postId/like - Like/Unlike a post (Protected)
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked this post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // Unlike: Remove the like
      await Like.deleteOne({ user: userId, post: postId });
      
      res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        data: { liked: false }
      });
    } else {
      // Like: Create new like
      const like = new Like({ user: userId, post: postId });
      await like.save();
      
      res.status(200).json({
        success: true,
        message: 'Post liked successfully',
        data: { liked: true }
      });
    }

  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error toggling like'
    });
  }
});

// GET /api/posts/:postId/comments - Get comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

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
    const postId = req.params.postId;
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

    // Create comment
    const comment = new Comment({
      post: postId,
      author: req.userId,
      text: text.trim()
    });

    await comment.save();
    await comment.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
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

// Start server with proper async initialization
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Start server only after database connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer();