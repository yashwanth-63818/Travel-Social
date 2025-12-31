require('dotenv').config();
const mongoose = require('mongoose');
const { User, BikeRide } = require('./models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create sample bike rides
const createSampleBikeRides = async () => {
  try {
    // First, find or create a sample user
    let sampleUser = await User.findOne({ email: 'admin@example.com' });
    if (!sampleUser) {
      sampleUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedpassword123',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?img=1'
      });
      await sampleUser.save();
      console.log('✅ Sample admin user created');
    }

    // Check if bike rides already exist
    const existingRides = await BikeRide.countDocuments();
    if (existingRides > 0) {
      console.log(`✅ ${existingRides} bike rides already exist in database`);
      return;
    }

    // Create sample bike rides
    const sampleBikeRides = [
      {
        title: 'Morning Beach Ride',
        location: 'Santa Monica Beach',
        locationName: 'Santa Monica, CA',
        latitude: 34.0195,
        longitude: -118.4912,
        description: 'Join us for a refreshing morning bike ride along the beautiful Santa Monica Beach. Perfect for all skill levels!',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '08:00',
        distance: '15 km',
        difficulty: 'Beginner',
        maxParticipants: 15,
        participants: [],
        status: 'upcoming',
        organizer: 'Admin User',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
            publicId: 'sample_beach_ride'
          }
        ],
        createdBy: sampleUser._id
      },
      {
        title: 'Mountain Trail Adventure',
        location: 'Hollywood Hills',
        locationName: 'Los Angeles, CA',
        latitude: 34.1341,
        longitude: -118.3215,
        description: 'Challenge yourself with this exciting mountain trail ride through the Hollywood Hills. Intermediate level recommended.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: '16:00',
        distance: '25 km',
        difficulty: 'Intermediate',
        maxParticipants: 10,
        participants: [sampleUser._id],
        status: 'upcoming',
        organizer: 'Admin User',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544191696-15693072f45a?w=800&h=600&fit=crop',
            publicId: 'sample_mountain_ride'
          }
        ],
        createdBy: sampleUser._id
      },
      {
        title: 'Urban City Explorer',
        location: 'Downtown LA',
        locationName: 'Los Angeles, CA',
        latitude: 34.0522,
        longitude: -118.2437,
        description: 'Discover the urban gems of Downtown LA on two wheels. Great for beginners and city enthusiasts!',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        time: '10:30',
        distance: '12 km',
        difficulty: 'Beginner',
        maxParticipants: 20,
        participants: [],
        status: 'upcoming',
        organizer: 'Admin User',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
            publicId: 'sample_city_ride'
          }
        ],
        createdBy: sampleUser._id
      }
    ];

    await BikeRide.insertMany(sampleBikeRides);
    console.log('✅ Sample bike rides created successfully');

  } catch (error) {
    console.error('❌ Error creating sample bike rides:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createSampleBikeRides();
  
  // Test fetching
  const rides = await BikeRide.find().populate('createdBy', '_id name avatar').populate('participants', '_id name avatar');
  console.log(`✅ Total bike rides in database: ${rides.length}`);
  
  mongoose.connection.close();
  console.log('✅ Database connection closed');
};

run().catch(console.error);