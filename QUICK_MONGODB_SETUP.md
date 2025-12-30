# Quick MongoDB Setup Guide

## Option 1: MongoDB Atlas (Easiest - 5 minutes)

### Step 1: Sign up for MongoDB Atlas
1. Go to: https://www.mongodb.com/  
2. Click "Try Free" and create account
3. Choose "Build a database" → "M0 Sandbox" (FREE)
4. Choose any region (AWS, Google Cloud, or Azure)
5. Keep default cluster name or rename it
6. Click "Create"

### Step 2: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `travelsocial`
5. Password: `password123` (or your choice)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Allow Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go to "Databases" → Your cluster
2. Click "Connect" button
3. Choose "Drivers"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://travelsocial:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update Your .env File
1. Replace `<password>` with your actual password
2. Add `/travelsocial` before the query parameters
3. Example:
   ```
   MONGODB_URI=mongodb+srv://travelsocial:password123@cluster0.xxxxx.mongodb.net/travelsocial?retryWrites=true&w=majority
   ```

### Step 6: Test Connection
```bash
npm run test-db
```

## Option 2: Install MongoDB Locally

### Download and Install
1. Go to: https://www.mongodb.com/try/download/community
2. Select: Windows, Version 8.0+, Package: msi
3. Download and run installer
4. Choose "Complete" installation
5. Install MongoDB as a Windows Service ✅
6. Install MongoDB Compass (GUI) ✅

### Start MongoDB Service
```bash
# Start service
net start MongoDB

# Check if running
mongod --version
```

### Test Local Connection
```bash
npm run test-db
```

## Option 3: Use the Install Script

Run the MongoDB install script I created:
```bash
.\install-mongodb.bat
```

## Verify Connection

Once MongoDB is set up, restart your app:
```bash
npm run dev
```

You should see:
- ✅ `MongoDB Connected: cluster0-xxxxx.mongodb.net` (Atlas)
- ✅ `MongoDB Connected: localhost` (Local)
- ❌ No more "using mock data" messages

## Troubleshooting

### "Authentication failed"
- Check username/password in connection string
- Verify user exists in Database Access

### "Network timeout"
- Check Network Access allows your IP
- For development, use 0.0.0.0/0

### "Connection refused"
- Local: Start MongoDB service: `net start MongoDB`
- Atlas: Check connection string format

---

**Recommendation: Start with MongoDB Atlas (Option 1) - it's free and works immediately!**