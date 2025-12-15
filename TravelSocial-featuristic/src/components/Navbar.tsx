import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plane, Map, Users, Search, Package, LogOut, User, Bike, Menu } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  currentUser?: any;
}

export default function Navbar({ isAuthenticated, onLogout, currentUser }: NavbarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Plane },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/feed', label: 'Feed', icon: Users },
    { path: '/search', label: 'Search', icon: Search },
    { path: '/packages', label: 'Packages', icon: Package },
    { path: '/bike-riding', label: 'Bike Riding', icon: Bike },
    { path: '/more', label: 'More', icon: Menu },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-black border-b-2 border-yellow-400 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plane className="w-8 h-8 text-yellow-400" />
              <span className="text-white text-xl">TravelSocial</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
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

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-yellow-400 text-black px-4 py-2 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{currentUser?.name || 'Profile'}</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center space-x-2 border-2 border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-lg"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 whitespace-nowrap ${
                    isActive 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-zinc-900 text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
