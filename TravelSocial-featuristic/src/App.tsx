import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MapView from './components/MapView';
import SocialFeed from './components/SocialFeed';
import SearchPanel from './components/SearchPanel';
import Packages from './components/Packages';
import Login from './components/Login';
import Profile from './components/Profile';
import BikeRiding from './components/BikeRiding';
import MoreMenu from './components/MoreMenu';
import Settings from './components/Settings';
import FlightResultsPage from './components/FlightResultsPage';
import HotelResultsPage from './components/HotelResultsPage';
import { PostsProvider } from './contexts/PostsContext';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // Check for stored authentication data on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAuthenticated(true);
        setCurrentUser(user);
        console.log('Restored authentication state for:', user.email);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    console.log('User logged in:', user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  return (
    <PostsProvider>
      <Router>
        <div className="min-h-screen bg-black">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <Routes>
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
            <Route path="/map" element={
              <MapView 
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            } />
            <Route path="/feed" element={
              isAuthenticated ? 
              <SocialFeed 
                currentUser={currentUser} 
                onLocationSelect={handleLocationSelect}
              /> : 
              <Navigate to="/login" />
            } />
            <Route path="/book" element={<SearchPanel />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/booking" element={<Navigate to="/book" replace />} />
            <Route path="/search" element={<Navigate to="/book" replace />} />
            <Route path="/flights/results" element={<FlightResultsPage />} />
            <Route path="/hotels/results" element={<HotelResultsPage />} />
            <Route path="/bike-riding" element={<BikeRiding />} />
            <Route path="/profile" element={
              isAuthenticated ? <Profile user={currentUser} /> : <Navigate to="/login" />
            } />
            <Route path="/settings" element={
              isAuthenticated ? <Settings /> : <Navigate to="/login" />
            } />
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/more" element={<MoreMenu />} />
          </Routes>
        </div>
      </Router>
    </PostsProvider>
  );
}
