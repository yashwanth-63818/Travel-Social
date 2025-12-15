import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  BookOpen, Heart, Settings, HelpCircle, Info, MessageSquare, Download, 
  Globe, Moon, Sun, Gift, Phone, Cloud, Star, CheckSquare, Activity, 
  Bell, AlertTriangle, FileText, ChevronRight, Calendar, CreditCard,
  Hotel, Bike, MapPin, Package, Utensils, Award, Shield, Languages,
  Wallet, TrendingUp, Zap, Target
} from 'lucide-react';
import Bookings from './more-sections/Bookings';
import Favourites from './more-sections/Favourites';
import TravelChecklist from './more-sections/TravelChecklist';
import WeatherForecast from './more-sections/WeatherForecast';
import RewardPoints from './more-sections/RewardPoints';

export default function MoreMenu() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuCategories = [
    {
      title: 'My Account',
      icon: Activity,
      color: 'text-yellow-400',
      items: [
        { 
          icon: BookOpen, 
          label: 'My Bookings', 
          description: 'View all travel and ride bookings',
          badge: '3 active',
          action: () => setActiveSection('bookings')
        },
        { 
          icon: Heart, 
          label: 'Favourites', 
          description: 'Saved posts, packages, hotels & rides',
          badge: '24 items',
          action: () => setActiveSection('favourites')
        },
        { 
          icon: Star, 
          label: 'My Reviews', 
          description: 'Hotels, places, rides, and foods',
          badge: '12 reviews',
          action: () => console.log('Reviews')
        },
        { 
          icon: Activity, 
          label: 'Activity Log', 
          description: 'Recent likes, comments, saves',
          action: () => console.log('Activity')
        },
      ]
    },
    {
      title: 'Rewards & Wallet',
      icon: Gift,
      color: 'text-yellow-400',
      items: [
        { 
          icon: Award, 
          label: 'Reward Points', 
          description: 'Travel rewards and loyalty program',
          badge: '2,450 pts',
          highlight: true,
          action: () => setActiveSection('rewards')
        },
        { 
          icon: Wallet, 
          label: 'Loyalty Wallet', 
          description: 'Manage vouchers and credits',
          badge: '$125',
          action: () => console.log('Wallet')
        },
      ]
    },
    {
      title: 'Travel Tools',
      icon: Target,
      color: 'text-yellow-400',
      items: [
        { 
          icon: Download, 
          label: 'Download My Trips', 
          description: 'Export itinerary as PDF',
          action: () => console.log('Download')
        },
        { 
          icon: CheckSquare, 
          label: 'Travel Checklist', 
          description: 'Packing list and reminders',
          badge: '8/15',
          action: () => setActiveSection('checklist')
        },
        { 
          icon: Cloud, 
          label: 'Weather Forecast', 
          description: 'Check weather for destinations',
          action: () => setActiveSection('weather')
        },
        { 
          icon: Phone, 
          label: 'Emergency Contacts', 
          description: 'Safety tips and SOS numbers',
          action: () => console.log('Emergency')
        },
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      color: 'text-yellow-400',
      items: [
        { 
          icon: Settings, 
          label: 'Account Settings', 
          description: 'Privacy, security, and preferences',
          action: () => console.log('Settings')
        },
        { 
          icon: Bell, 
          label: 'Notifications', 
          description: 'Manage notification preferences',
          toggle: true,
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
          action: () => console.log('Notifications')
        },
        { 
          icon: Globe, 
          label: 'Language & Region', 
          description: 'English (US) · USD',
          action: () => console.log('Language')
        },
        { 
          icon: darkMode ? Sun : Moon, 
          label: 'Appearance', 
          description: darkMode ? 'Light Mode' : 'Dark Mode',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
          action: () => console.log('Theme')
        },
      ]
    },
    {
      title: 'Support & Info',
      icon: HelpCircle,
      color: 'text-yellow-400',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Help & Support', 
          description: 'FAQs and customer service',
          action: () => console.log('Help')
        },
        { 
          icon: MessageSquare, 
          label: 'App Feedback', 
          description: 'Share your thoughts with us',
          action: () => console.log('Feedback')
        },
        { 
          icon: AlertTriangle, 
          label: 'Report an Issue', 
          description: 'Report bugs or problems',
          action: () => console.log('Report')
        },
        { 
          icon: Info, 
          label: 'About', 
          description: 'App version 2.5.0',
          action: () => console.log('About')
        },
        { 
          icon: FileText, 
          label: 'Terms & Privacy', 
          description: 'Legal information and policies',
          action: () => console.log('Terms')
        },
      ]
    },
  ];

  const quickStats = [
    { label: 'Active Bookings', value: '3', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Reward Points', value: '2.4K', icon: Award, color: 'bg-yellow-400' },
    { label: 'Saved Items', value: '24', icon: Heart, color: 'bg-red-500' },
    { label: 'Reviews', value: '12', icon: Star, color: 'bg-purple-500' },
  ];

  const bookingTypes = [
    { label: 'Flights', count: 2, icon: Package },
    { label: 'Hotels', count: 3, icon: Hotel },
    { label: 'Rides', count: 1, icon: Bike },
    { label: 'Tours', count: 2, icon: MapPin },
  ];

  // Render active section
  if (activeSection === 'bookings') {
    return (
      <div className="min-h-screen bg-black text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => setActiveSection(null)}
            className="text-yellow-400 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to More Menu
          </motion.button>
          <Bookings />
        </div>
      </div>
    );
  }

  if (activeSection === 'favourites') {
    return (
      <div className="min-h-screen bg-black text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => setActiveSection(null)}
            className="text-yellow-400 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to More Menu
          </motion.button>
          <Favourites />
        </div>
      </div>
    );
  }

  if (activeSection === 'checklist') {
    return (
      <div className="min-h-screen bg-black text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => setActiveSection(null)}
            className="text-yellow-400 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to More Menu
          </motion.button>
          <TravelChecklist />
        </div>
      </div>
    );
  }

  if (activeSection === 'weather') {
    return (
      <div className="min-h-screen bg-black text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => setActiveSection(null)}
            className="text-yellow-400 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to More Menu
          </motion.button>
          <WeatherForecast />
        </div>
      </div>
    );
  }

  if (activeSection === 'rewards') {
    return (
      <div className="min-h-screen bg-black text-white py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => setActiveSection(null)}
            className="text-yellow-400 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to More Menu
          </motion.button>
          <RewardPoints />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl mb-2 text-yellow-400">More</h1>
          <p className="text-gray-400">Manage your account, preferences, and explore more features</p>
        </motion.div>

        {/* Quick Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4 cursor-pointer"
              >
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <p className="text-2xl mb-1 text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Featured Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-8 cursor-pointer"
          onClick={() => setActiveSection('rewards')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-black/20 p-3 rounded-lg">
                <Gift className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-xl text-black">You have 2,450 Reward Points!</h3>
                <p className="text-black/80">Redeem for discounts on your next trip</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-yellow-400 px-6 py-3 rounded-lg"
            >
              Redeem Now
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Bookings Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-yellow-400">Recent Bookings</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="text-yellow-400 text-sm hover:underline"
            >
              View All
            </motion.button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bookingTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-zinc-800 rounded-lg p-4 border border-yellow-400/30 hover:border-yellow-400 transition-all cursor-pointer"
                >
                  <Icon className="w-6 h-6 text-yellow-400 mb-2" />
                  <p className="text-white mb-1">{type.label}</p>
                  <p className="text-sm text-gray-400">{type.count} active</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Menu Categories */}
        <div className="space-y-6">
          {menuCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                className="bg-zinc-900 rounded-xl border-2 border-yellow-400 overflow-hidden"
              >
                {/* Category Header */}
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                  className="p-4 border-b border-zinc-800 cursor-pointer flex items-center justify-between"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.title ? null : category.title
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon className={`w-6 h-6 ${category.color}`} />
                    <h3 className="text-xl text-white">{category.title}</h3>
                    <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      {category.items.length}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: selectedCategory === category.title ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.div>

                {/* Category Items */}
                <AnimatePresence>
                  {(selectedCategory === category.title || selectedCategory === null) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2">
                        {category.items.map((item, itemIndex) => {
                          const ItemIcon = item.icon;
                          return (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05 }}
                              whileHover={{ 
                                scale: 1.02, 
                                x: 5,
                                backgroundColor: 'rgba(255, 215, 0, 0.1)' 
                              }}
                              whileTap={{ scale: 0.98 }}
                              onClick={item.action}
                              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                                item.highlight ? 'bg-yellow-400/10 border border-yellow-400' : ''
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 ${
                                  item.highlight ? 'bg-yellow-400' : 'bg-zinc-800'
                                } rounded-lg flex items-center justify-center`}>
                                  <ItemIcon className={`w-5 h-5 ${
                                    item.highlight ? 'text-black' : 'text-yellow-400'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-white">{item.label}</p>
                                    {item.badge && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs"
                                      >
                                        {item.badge}
                                      </motion.span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 mt-0.5">{item.description}</p>
                                </div>
                              </div>

                              {/* Toggle or Arrow */}
                              {item.toggle ? (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    item.onChange && item.onChange(!item.value);
                                  }}
                                  className={`relative w-14 h-7 rounded-full transition-colors ${
                                    item.value ? 'bg-yellow-400' : 'bg-zinc-700'
                                  }`}
                                >
                                  <motion.div
                                    animate={{ x: item.value ? 28 : 2 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className={`absolute top-1 w-5 h-5 rounded-full ${
                                      item.value ? 'bg-black' : 'bg-gray-400'
                                    }`}
                                  />
                                </motion.button>
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 space-y-4"
        >
          {/* App Version */}
          <div className="text-center text-gray-500 text-sm">
            <p>TravelSocial Version 2.5.0</p>
            <p className="mt-1">Made with ❤️ for travelers worldwide</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Careers'].map((link, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, color: '#FFD700' }}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                {link}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
