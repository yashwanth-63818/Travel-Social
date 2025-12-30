require('dotenv').config();
const connectDB = require('./db');
const { User, Post } = require('./models');
const bcrypt = require('bcryptjs');

const testMongoDB = async () => {
  try {
    console.log('🔍 Testing MongoDB Connection...');
    
    // Connect to database
    await connectDB();
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Test user creation
    console.log('🧪 Testing User Creation...');
    
    // Check if test user already exists
    let user = await User.findOne({ email: 'test@travelsocial.com' });
    if (user) {
      console.log('🔄 Test user already exists, using existing user');
    } else {
      // Create user with manually hashed password to avoid middleware issues
      const hashedPassword = await bcrypt.hash('testpassword123', 12);
      
      const testUser = new User({
        name: 'Test User',
        email: 'test@travelsocial.com',
        password: hashedPassword
      });
      
      user = await testUser.save();
      console.log('✅ Test user created successfully');
    }
    
    console.log(`👤 User found: ${user.name} (${user.email})`);
    
    // Test post creation
    console.log('🧪 Testing Post Creation...');
    
    const testPost = new Post({
      author: user._id,
      content: 'This is a test post to verify MongoDB connection is working! 🚀'
    });
    
    await testPost.save();
    console.log('✅ Test post created successfully');
    
    // Retrieve posts with author populated
    const posts = await Post.find().populate('author', 'name avatar').sort({ createdAt: -1 });
    console.log(`📝 Found ${posts.length} posts in database`);
    
    if (posts.length > 0) {
      console.log(`📄 Latest post: "${posts[0].content}" by ${posts[0].author.name}`);
    }
    
    console.log('🎉 All MongoDB tests passed! Database integration is working perfectly.');
    console.log('🔌 Closing database connection...');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Run the test
testMongoDB();