# TravelSocial - Explore the Gems 🌍✨

> **A full-stack social media platform for travelers to discover, share, and explore hidden gems around the world.**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Quick Links

- **[⚡ Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- **[📚 Complete Documentation](./DATABASE_MIGRATION_COMPLETE.md)** - Full technical details
- **[✅ Transformation Summary](./TRANSFORMATION_SUMMARY.md)** - What changed overview
- **[📝 Final Checklist](./FINAL_CHECKLIST.md)** - Implementation checklist

---

## 🎯 What is TravelSocial?

TravelSocial is a modern, full-stack social media platform designed for travel enthusiasts. Share your adventures, discover hidden gems, connect with fellow travelers, and plan your next journey.

### Key Features

✅ **Social Feed** - Share posts with photos, locations, and stories
✅ **Interactive Map** - Discover travel spots on an interactive map
✅ **User Profiles** - Track your posts, followers, and travel stats
✅ **Engagement** - Like, comment, and interact with posts
✅ **Authentication** - Secure JWT-based login and signup
✅ **Real-time Updates** - See changes instantly without refresh
✅ **Data Persistence** - All data stored in MongoDB database
✅ **Meta-Search Pricing** - Dynamic flight and hotel prices
✅ **Hidden Places** - Discover local secrets and hidden gems

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Framer Motion** - Animations
- **Leaflet** - Interactive maps
- **Lucide Icons** - Beautiful icons
- **Context API** - State management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "Travelsocial-Explore the gems"
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Setup Frontend**
```bash
cd TravelSocial-featuristic
npm install
```

4. **Start Development**
```bash
# Terminal 1 - Backend
cd backend
node index.js

# Terminal 2 - Frontend
cd TravelSocial-featuristic
npm run dev
```

5. **Open Browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

**For detailed setup, see [QUICKSTART.md](./QUICKSTART.md)**

---

## 📁 Project Structure

```
TravelSocial/
├── backend/                    # Backend server
│   ├── db.js                  # MongoDB connection
│   ├── models.js              # Mongoose schemas
│   ├── middleware.js          # Auth middleware
│   ├── index.js               # Express server + API routes
│   ├── test-api.js            # API testing script
│   ├── package.json
│   └── .env.example
│
├── TravelSocial-featuristic/  # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # Context providers
│   │   ├── utils/             # Utilities & API wrapper
│   │   ├── styles/            # Global styles
│   │   └── App.tsx            # Main app component
│   ├── package.json
│   └── vite.config.ts
│
├── DATABASE_MIGRATION_COMPLETE.md
├── QUICKSTART.md
├── TRANSFORMATION_SUMMARY.md
├── FINAL_CHECKLIST.md
└── README.md (this file)
```

---

## 🎨 Features Overview

### 1. Social Feed
- Create posts with text, photos, and locations
- Like and unlike posts
- Comment on posts
- View all posts from community
- Real-time UI updates

### 2. User Profiles
- Dynamic stats (posts, followers, following)
- View user's post history
- Edit profile (coming soon)
- Follow/unfollow users (API ready)

### 3. Interactive Map
- View posts on map
- Discover nearby places
- Filter by categories (food, hotels, transport)
- Hidden gems markers

### 4. Travel Planning
- Flight search with meta-search pricing
- Hotel search with competitive rates
- Package deals
- Bike riding adventures

### 5. Authentication
- Secure signup with password hashing
- JWT-based login
- Persistent sessions
- Protected routes

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Toggle like
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/comments` - Add comment

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user posts
- `POST /api/users/:id/follow` - Toggle follow

### Hidden Places
- `GET /api/hidden-places` - Get all places
- `POST /api/hidden-places` - Add place

**Full API documentation: [DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md#api-endpoints)**

---

## 🧪 Testing

### Manual Testing
1. Sign up a new user
2. Create posts with different content
3. Like and comment on posts
4. View your profile
5. Refresh the page - data persists!

### Automated Testing
```bash
cd backend
node test-api.js
```
Runs 9 test cases covering all major endpoints.

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication with 7-day expiry
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Environment variable secrets
- ✅ Input validation
- ✅ MongoDB injection prevention (Mongoose)

---

## 📈 Database Schema

### Models
1. **User** - Account information, authentication
2. **Post** - Social media posts with content and media
3. **Comment** - Comments on posts
4. **Like** - Post likes (unique per user per post)
5. **Follow** - User follow relationships (unique)
6. **HiddenPlace** - Travel spots and hidden gems

**Full schema details: [DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md#data-models)**

---

## 🌟 Transformation Journey

### v1.0 - Static Prototype ❌
- Hardcoded mock data
- No persistence
- No backend
- UI demonstration only

### v2.0 - Database-Backed Platform ✅
- Dynamic data from MongoDB
- Full persistence
- Node.js/Express backend
- JWT authentication
- Real social interactions
- Production-ready architecture

**Read the full story: [TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md)**

---

## 📚 Documentation

### Available Guides
1. **[QUICKSTART.md](./QUICKSTART.md)** (120 lines)
   - 5-minute setup guide
   - Common issues & fixes
   - Quick verification steps

2. **[DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md)** (550 lines)
   - Complete technical documentation
   - API reference
   - Architecture overview
   - Troubleshooting guide

3. **[TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md)** (500 lines)
   - What changed
   - Files modified
   - Code metrics
   - Future roadmap

4. **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** (400 lines)
   - Implementation checklist
   - Testing guide
   - Next steps

---

## 🛣️ Roadmap

### Phase 1 - Core Improvements ⏳
- [ ] Image upload to cloud storage
- [ ] Edit and delete posts
- [ ] Follow/unfollow UI
- [ ] Profile picture upload
- [ ] Saved spots feature

### Phase 2 - Enhanced Social 📅
- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] User search
- [ ] Hashtags
- [ ] Trending posts

### Phase 3 - Travel Features 🌍
- [ ] Trip planning
- [ ] Travel checklist
- [ ] Photo albums
- [ ] Travel statistics
- [ ] Enhanced map integration

### Phase 4 - Production 🚀
- [ ] Email verification
- [ ] Password reset
- [ ] Rate limiting
- [ ] Admin panel
- [ ] Deployment (AWS/Azure)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**See [backend/.env.example](./backend/.env.example) for template**

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Ensure MongoDB service is running

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure it matches Vite dev server URL

### Port Already in Use
- Change PORT in `.env` (backend)
- Kill process using the port

**Full troubleshooting guide: [DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md#troubleshooting)**

---

## 📊 Project Stats

- **Total Code**: ~3,000 lines
- **API Endpoints**: 12
- **Database Models**: 6
- **React Components**: 30+
- **Documentation**: 1,200+ lines
- **Development Time**: 11 hours

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Lead Developer** - TravelSocial Team
- **Database Architecture** - Backend Team
- **UI/UX Design** - Frontend Team

---

## 🙏 Acknowledgments

- React team for an amazing library
- MongoDB for flexible database
- Express.js for robust backend framework
- Vite for blazing fast development
- Framer Motion for smooth animations
- Leaflet for interactive maps

---

## 📞 Support

- **Documentation**: See [docs](./DATABASE_MIGRATION_COMPLETE.md)
- **Issues**: Open a GitHub issue
- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)

---

## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ by travelers, for travelers**

🌍 **Explore. Share. Connect.**

---

## 🚀 Quick Commands

```bash
# Start backend
cd backend && node index.js

# Start frontend (new terminal)
cd TravelSocial-featuristic && npm run dev

# Test API
cd backend && node test-api.js

# Install dependencies
cd backend && npm install
cd TravelSocial-featuristic && npm install
```

---

**Version**: 2.0.0 | **Status**: ✅ Production-Ready (Local) | **Last Updated**: January 2025
