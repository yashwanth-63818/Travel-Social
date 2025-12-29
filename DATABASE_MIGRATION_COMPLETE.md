# TravelSocial - Database-Backed Social Platform

## Overview
TravelSocial has been transformed from a UI prototype with static/hardcoded data into a fully dynamic, database-backed social media platform. All data now persists across refreshes and server restarts using MongoDB.

## Architecture

### Backend (Node.js + Express + MongoDB)
- **Location**: `backend/` directory
- **Port**: 5000 (default)
- **Database**: MongoDB (Atlas or local)
- **Authentication**: JWT-based auth with bcrypt password hashing

### Frontend (React + TypeScript + Vite)
- **Location**: `TravelSocial-featuristic/` directory
- **Port**: 5173 (Vite default)
- **State Management**: React Context API
- **API Communication**: Centralized API utility (`src/utils/api.ts`)

## Data Models

### User
- `_id`: MongoDB ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed with bcrypt)
- `avatar`: String (URL)
- `bio`: String
- `joinDate`: String
- Computed stats: posts, followers, following counts

### Post
- `_id`: MongoDB ObjectId
- `author`: Reference to User
- `content`: String (required)
- `mediaUrl`: Array of strings (image/video URLs)
- `location`: String
- `likes`: Array of User IDs
- `comments`: Array of Comment IDs
- `createdAt`: Date
- Computed counts: likesCount, commentsCount

### Comment
- `_id`: MongoDB ObjectId
- `post`: Reference to Post
- `author`: Reference to User
- `content`: String (required)
- `createdAt`: Date

### Like
- `_id`: MongoDB ObjectId
- `post`: Reference to Post
- `user`: Reference to User
- `createdAt`: Date
- Unique index: (post, user) - prevents duplicate likes

### Follow
- `_id`: MongoDB ObjectId
- `follower`: Reference to User
- `following`: Reference to User
- `createdAt`: Date
- Unique index: (follower, following) - prevents duplicate follows
- Validation: Cannot follow yourself

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client clears token)

### Posts
- `GET /api/posts` - Get all posts (newest first, populated with author data)
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/:postId` - Get single post with full details
- `POST /api/posts/:postId/like` - Toggle like on post (authenticated)
- `GET /api/posts/:postId/comments` - Get all comments for a post
- `POST /api/posts/:postId/comments` - Add comment to post (authenticated)

### Users
- `GET /api/users/:userId` - Get user profile with stats (posts, followers, following)
- `GET /api/users/:userId/posts` - Get all posts by specific user
- `POST /api/users/:userId/follow` - Toggle follow user (authenticated)

### Hidden Places
- `GET /api/hidden-places` - Get all hidden places
- `POST /api/hidden-places` - Create hidden place (authenticated)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account OR local MongoDB instance
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your values:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/travelsocial?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
node index.js
```

You should see:
```
MongoDB Connected Successfully
Server is running on port 5000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd TravelSocial-featuristic
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open browser to `http://localhost:5173`

## Testing the Application

### 1. Create a Test User
1. Open the app in your browser
2. Click "Login" or navigate to the login page
3. Click "Sign Up" to create a new account
4. Fill in: Name, Email, Password
5. Submit the form
6. You'll be automatically logged in with a JWT token stored in localStorage

### 2. Create a Post
1. In the Social Feed, use the "What's on your mind?" input box
2. Type your post content (e.g., "My first post on TravelSocial!")
3. Optionally add a location
4. Click the "Post" button
5. Your post will appear at the top of the feed with your name and avatar

### 3. Like a Post
1. Click the heart icon on any post
2. The icon will turn yellow and the like count will increase
3. Click again to unlike (icon turns gray, count decreases)
4. Refresh the page - your like persists!

### 4. Comment on a Post
1. Click the comment icon on any post
2. Type your comment in the text box that appears
3. Click "Comment" to submit
4. Your comment appears below the post with your name and avatar
5. Refresh the page - your comment persists!

### 5. View Profile
1. Click on your profile icon or navigate to Profile
2. See your dynamic stats:
   - Total posts you've created
   - Number of followers
   - Number of users you're following
3. See all your posts in a grid layout
4. Refresh - everything persists!

### 6. Verify Data Persistence
1. Create several posts
2. Like and comment on posts
3. Close the browser completely
4. Open the browser again
5. Navigate to the app
6. Log in with the same credentials
7. All your posts, likes, and comments are still there!

### 7. Check MongoDB (Optional)
If you have MongoDB Compass or Atlas dashboard:
1. Connect to your MongoDB instance
2. Navigate to the `travelsocial` database
3. Inspect collections:
   - `users` - See your user document
   - `posts` - See all posts with author references
   - `comments` - See all comments with post/author references
   - `likes` - See all like documents
   - `follows` - See all follow relationships

## Key Features

### ✅ Fully Dynamic
- No hardcoded user data
- No static posts or comments
- No mock arrays
- All data fetched from MongoDB

### ✅ Authenticated
- JWT-based authentication
- Protected API routes
- Secure password hashing
- Persistent login sessions

### ✅ Real-time Updates
- Posts appear immediately after creation
- Likes toggle instantly
- Comments appear without page refresh
- Loading states for all async operations

### ✅ Persistent Data
- All data stored in MongoDB
- Survives page refreshes
- Survives server restarts
- Proper database relationships

### ✅ Production-Ready
- Environment variable configuration
- Error handling
- Input validation
- Secure authentication
- CORS configuration
- API middleware

## Component Updates

### SocialFeed.tsx
**Before**: Used mock data arrays (`mockPosts`, `mockUserId`)
**After**: 
- Fetches posts from API via PostsContext
- Uses `getCurrentUserId()` for authenticated actions
- Calls `toggleLike()`, `addComment()`, `createPost()` APIs
- Shows loading states with Loader2 spinner
- Uses `post._id` (string) instead of `post.id` (number)
- Uses `post.author.name/avatar` object instead of string

### Profile.tsx
**Before**: Used hardcoded `userPosts` and `savedSpots` arrays, static stats
**After**:
- Fetches user data from `GET /api/users/:userId`
- Displays dynamic stats (posts, followers, following)
- Fetches user posts from `GET /api/users/:userId/posts`
- Shows loading state while fetching
- Empty state when no posts exist
- Uses real MongoDB `_id` and timestamps

### PostsContext.tsx
**Before**: Provided static mock data
**After**:
- Complete API integration
- `fetchPosts()` - Loads all posts from backend
- `createPost()` - Creates new post via API
- `toggleLike()` - Toggles like via API
- `addComment()` - Adds comment via API
- `getComments()` - Fetches comments for a post
- Proper loading and error states
- TypeScript interfaces matching backend schema

### New: api.ts Utility
Created centralized API wrapper:
- `getCurrentUserId()` - Get logged-in user ID from localStorage
- `getCurrentUser()` - Get full user object from localStorage
- `postsAPI` - All post-related API calls
- `usersAPI` - All user-related API calls
- `authAPI` - Authentication (login, signup, logout)
- Automatic token injection in headers
- Consistent error handling

## API Response Formats

### Post Object
```typescript
{
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  mediaUrl: string[];
  location?: string;
  likes: string[]; // Array of user IDs who liked
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}
```

### Comment Object
```typescript
{
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: Date;
}
```

### User Stats
```typescript
{
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    bio: string;
    joinDate: string;
  };
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend
No environment variables needed - API URL is set to `http://localhost:5000` in `api.ts`

## Development Workflow

1. **Start Backend**:
```bash
cd backend
node index.js
```

2. **Start Frontend** (in another terminal):
```bash
cd TravelSocial-featuristic
npm run dev
```

3. **Make Changes**:
- Backend changes: Restart server
- Frontend changes: Auto-reloads with Vite HMR

4. **Test Changes**:
- Use browser DevTools Network tab to inspect API calls
- Use MongoDB Compass to inspect database
- Check browser Console for errors

## Troubleshooting

### "MongoDB Connected Failed"
- Check your MONGODB_URI in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify network connectivity

### "JWT_SECRET is required"
- Create `.env` file in backend directory
- Copy from `.env.example` and fill in values

### CORS Errors
- Check FRONTEND_URL in backend `.env`
- Ensure it matches your Vite dev server URL
- Default is `http://localhost:5173`

### "Cannot read property '_id' of undefined"
- Ensure you're logged in (check localStorage for 'token')
- Check that API responses include populated author data
- Verify backend is running

### Posts Not Showing
- Check browser Console for API errors
- Verify backend is running on port 5000
- Check MongoDB connection
- Ensure posts collection has documents

## Future Enhancements

### Planned Features
- [ ] Saved Hidden Spots implementation
- [ ] Real-time notifications
- [ ] Image upload to cloud storage (Cloudinary/S3)
- [ ] Search posts by location/content
- [ ] User search and discovery
- [ ] Follow feed (show only followed users' posts)
- [ ] Edit and delete posts
- [ ] Profile picture upload
- [ ] Password reset functionality

### Potential Improvements
- [ ] Pagination for posts (infinite scroll)
- [ ] Comment replies (nested comments)
- [ ] Post sharing functionality
- [ ] Bookmark/save posts
- [ ] Travel statistics and analytics
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Rate limiting
- [ ] Caching layer (Redis)

## Technical Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Motion/Framer** - Animations
- **Lucide Icons** - Icon library
- **Context API** - State management

## Project Structure

```
TravelSocial/
├── backend/
│   ├── db.js                 # MongoDB connection
│   ├── index.js              # Express server + API routes
│   ├── models.js             # Mongoose schemas
│   ├── middleware.js         # Auth middleware
│   ├── package.json
│   ├── .env                  # Environment variables (create this)
│   └── .env.example          # Example env vars
│
└── TravelSocial-featuristic/
    ├── src/
    │   ├── components/
    │   │   ├── SocialFeed.tsx      # Main feed (API-driven)
    │   │   ├── Profile.tsx         # User profile (API-driven)
    │   │   ├── Login.tsx           # Authentication
    │   │   └── ...
    │   ├── contexts/
    │   │   └── PostsContext.tsx    # Global posts state
    │   ├── utils/
    │   │   └── api.ts              # API wrapper
    │   └── ...
    ├── package.json
    └── vite.config.ts
```

## License
MIT

## Contributors
- Initial Development: [Your Name]
- Database Integration: [Your Name]
- API Development: [Your Name]

---

**Status**: ✅ Fully functional database-backed social platform
**Last Updated**: January 2025
**Version**: 2.0.0 (Database-backed)
