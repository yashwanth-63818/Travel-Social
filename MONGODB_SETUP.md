# MongoDB Setup for TravelSocial

This guide will help you set up MongoDB for your TravelSocial project.

## Option 1: Install MongoDB Community Server (Recommended for Development)

### For Windows:

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, Version 8.0, Package: msi
   - Download the installer

2. **Install MongoDB**:
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```bash
   mongod --version
   mongo --version
   ```

4. **Start MongoDB Service**:
   - MongoDB should start automatically as a Windows Service
   - You can also start it manually: `net start MongoDB`

## Option 2: Use MongoDB Atlas (Cloud Database)

1. **Sign up for MongoDB Atlas**:
   - Go to: https://www.mongodb.com/atlas
   - Create a free account

2. **Create a Cluster**:
   - Choose the free tier (M0)
   - Select your preferred region
   - Create the cluster

3. **Set up Database Access**:
   - Go to Database Access
   - Add a new database user
   - Choose password authentication
   - Save the username and password

4. **Set up Network Access**:
   - Go to Network Access
   - Add IP Address: 0.0.0.0/0 (for development only)
   - Or add your current IP address

5. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string

6. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/travelsocial
   ```

## Quick Start Script

Run this command to test your MongoDB connection:

```bash
npm run test-db
```

## MongoDB Commands for Development

### Start MongoDB (if installed locally):
```bash
# Windows (if not running as service)
mongod

# Or as Windows service
net start MongoDB
```

### Stop MongoDB:
```bash
# Windows service
net stop MongoDB
```

### Connect to MongoDB shell:
```bash
mongo
# or with newer versions
mongosh
```

### Basic MongoDB commands:
```javascript
// Show databases
show dbs

// Use travelsocial database
use travelsocial

// Show collections
show collections

// Find all users
db.users.find()

// Find all posts
db.posts.find()
```

## Troubleshooting

### If you see "connect ECONNREFUSED 127.0.0.1:27017":
1. MongoDB is not running
2. Start MongoDB service: `net start MongoDB`
3. Or install MongoDB Community Server

### If you see authentication errors:
1. Check your MONGODB_URI in .env file
2. Make sure username/password are correct
3. Verify network access settings (for Atlas)

### If you prefer to continue development without database:
- The app now works with mock data when database is not connected
- You'll see "⚠️ Mock data" messages in the backend logs
- All features work, but data won't persist between server restarts

## Testing the Setup

Once MongoDB is running, restart your application:
```bash
npm run dev
```

You should see:
- ✅ "Database connected successfully" (instead of connection failed)
- Posts will be saved to the database
- User authentication will work properly