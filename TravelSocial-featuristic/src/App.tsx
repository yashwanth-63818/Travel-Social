import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
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

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
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
