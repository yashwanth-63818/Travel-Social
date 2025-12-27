import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, Map, Users, Search, Package, LogOut, User, Bike, Menu, Settings, UserPen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  currentUser?: any;
}

export default function Navbar({ isAuthenticated, onLogout, currentUser }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use the actual authentication state
  const isLoggedIn = isAuthenticated;

  const navItems = [
    { path: '/', label: 'Home', icon: Plane },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/feed', label: 'Feed', icon: Users },
    { path: '/book', label: 'Book', icon: Search },
    { path: '/packages', label: 'Packages', icon: Package },
    { path: '/bike-riding', label: 'Bike Riding', icon: Bike },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit Profile clicked");
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Settings clicked");
    setIsUserMenuOpen(false);
    navigate("/settings");
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Logout clicked");
    setIsUserMenuOpen(false);
    onLogout();
    navigate("/login");
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black border-b-2 border-yellow-400 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="flex items-center justify-between h-16">
          
          {/* Left section: Menu button + TravelSocial brand */}
          <div className="flex items-center space-x-3 relative">
            <button
              onClick={() => navigate('/more')}
              className="p-2 rounded-lg transition-colors text-white hover:bg-yellow-400 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/">
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plane className="w-7 h-7 text-yellow-400" />
                <span className="text-white text-lg font-bold">TravelSocial</span>
              </motion.div>
            </Link>
          </div>

          {/* Right section: Navigation items + User avatar */}
          <div className="flex items-center space-x-1">
            {/* Navigation items on the right */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium ${
                        isActive 
                          ? 'bg-yellow-400 text-black' 
                          : 'text-white hover:bg-yellow-400 hover:text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* User avatar or Login button */}
            <div className="flex items-center ml-3">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(prev => !prev);
                    }}
                    className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </motion.button>

                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-gray-600 rounded-lg shadow-lg py-2 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-white font-medium">
                          {currentUser?.name || currentUser?.username || 'User'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {currentUser?.email || 'user@example.com'}
                        </p>
                      </div>
                      
                      {/* Menu Items */}
                      <button
                        onClick={handleEditProfile}
                        className="w-full px-4 py-2 text-left text-white hover:bg-yellow-400 hover:text-black transition-colors flex items-center space-x-2"
                      >
                        <UserPen className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        onClick={handleSettings}
                        className="w-full px-4 py-2 text-left text-white hover:bg-yellow-400 hover:text-black transition-colors flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-white hover:bg-yellow-400 hover:text-black transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-2 space-x-2 scrollbar-hide px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-zinc-900 text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </motion.nav>
  );
}
