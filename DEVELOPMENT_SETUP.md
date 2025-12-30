# TravelSocial - Quick Start Guide

## How to Run the Application

### Single Command Setup
The project is now configured to run both frontend and backend with one command:

```bash
npm run dev
```

This will:
- Start the Express backend on `http://localhost:5000`
- Start the React frontend on `http://localhost:3000`
- Automatically proxy API calls from frontend to backend

### Available Scripts

- `npm run dev` - Start both frontend and backend simultaneously
- `npm run dev:frontend` - Start only the React frontend
- `npm run dev:backend` - Start only the Express backend
- `npm run install:all` - Install dependencies for root, backend, and frontend
- `npm run build` - Build the frontend for production

### Project Structure

- `/` - Root project with concurrently configuration
- `/backend` - Express.js API server
- `/TravelSocial-featuristic` - React frontend with Vite

### Configuration Details

1. **API Proxy**: The frontend uses Vite's proxy feature to forward `/api/*` requests to `http://localhost:5000`
2. **Relative URLs**: All API calls use relative URLs (`/api/...`) instead of absolute URLs
3. **Auto-restart**: Backend uses `nodemon` for automatic restarts during development
4. **Port Configuration**: Frontend runs on port 3000, backend on port 5000

### Database Setup

The application requires MongoDB to be running for full functionality. The backend will show database connection errors if MongoDB is not available, but the servers will still start successfully.

### Usage

1. Run `npm run dev` in the root directory
2. Open your browser to `http://localhost:3000`
3. The application will be ready to use with both frontend and backend running

No need to start servers manually or run multiple terminals!