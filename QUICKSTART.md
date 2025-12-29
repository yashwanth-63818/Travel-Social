# 🚀 Quick Start Guide - TravelSocial

## Prerequisites Check
- ✅ Node.js installed? Run: `node --version` (need v18+)
- ✅ MongoDB Atlas account OR local MongoDB running
- ✅ Code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your MongoDB URI and JWT secret
notepad .env
```

**Required in .env:**
```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=any-random-secret-key-here
```

**Start backend:**
```powershell
node index.js
```

Expected output:
```
MongoDB Connected Successfully
Server is running on port 5000
```

### Step 2: Frontend Setup (2 minutes)

Open a **NEW terminal** window:

```powershell
# Navigate to frontend directory
cd TravelSocial-featuristic

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 3: Test It! (1 minute)

1. **Open browser**: http://localhost:5173
2. **Click "Login"** → **"Sign Up"**
3. **Create account**: 
   - Name: John Doe
   - Email: john@example.com
   - Password: test123
4. **Click Sign Up**
5. **Create a post**: Type something and click "Post"
6. **Success!** 🎉 Your post appears in the feed

## Verify Everything Works

### ✅ Backend is running
- Open: http://localhost:5000/api
- Should see: `{"message":"TravelSocial API is running"}`

### ✅ Frontend is running
- Open: http://localhost:5173
- Should see: TravelSocial homepage

### ✅ Database is connected
- Backend terminal should show: "MongoDB Connected Successfully"
- No errors about connection

### ✅ API test (optional)
```powershell
cd backend
node test-api.js
```
Should show 9 passing tests ✅

## Common Issues & Fixes

### ❌ "MONGODB_URI is required"
**Fix**: Create `.env` file in `backend/` directory with MongoDB URI

### ❌ "Cannot connect to MongoDB"
**Fix**: 
1. Check MongoDB Atlas → Network Access → Allow your IP
2. Verify connection string is correct
3. Check internet connection

### ❌ "Port 5000 is already in use"
**Fix**: 
- Option 1: Stop the process using port 5000
- Option 2: Change PORT in `.env` to 5001 (and update frontend api.ts)

### ❌ CORS errors in browser
**Fix**: Check `FRONTEND_URL` in backend `.env` matches your Vite URL (usually http://localhost:5173)

### ❌ "Cannot GET /"
**Fix**: Make sure you're using the frontend URL (http://localhost:5173), not backend URL (http://localhost:5000)

## Next Steps

✅ **Create more users**: Sign up with different emails
✅ **Test features**: Like posts, add comments, view profiles
✅ **Refresh page**: Everything persists!
✅ **Check MongoDB**: Use MongoDB Compass to see your data
✅ **Read full docs**: See [DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md)

## Stop Servers

**Backend**: Press `Ctrl + C` in backend terminal
**Frontend**: Press `Ctrl + C` in frontend terminal

## Restart Servers

Just run the start commands again:
```powershell
# Backend
cd backend
node index.js

# Frontend (new terminal)
cd TravelSocial-featuristic
npm run dev
```

---

**Need help?** Check [DATABASE_MIGRATION_COMPLETE.md](./DATABASE_MIGRATION_COMPLETE.md) for detailed documentation.

**Happy coding!** 🚀
