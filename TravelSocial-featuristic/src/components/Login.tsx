import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate credentials
    const user = {
      name: formData.name || 'Travel Explorer',
      email: formData.email,
      avatar: 'https://i.pravatar.cc/150?img=8',
      joinDate: 'November 2025',
      bio: 'Adventure seeker and travel enthusiast',
      savedSpots: 12,
      posts: 5
    };
    onLogin(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1672841828482-45faa4c70e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NDM3NTM2MHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Authentication Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px] bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </motion.h2>
            <p className="text-gray-400">
              {isSignUp ? 'Start your journey with us' : 'Login to continue your adventure'}
            </p>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Name Field - Only for Sign Up */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your name"
                  className="w-full h-12 bg-zinc-800/70 text-white rounded-xl px-4 border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
                  required={isSignUp}
                />
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
                className="w-full h-12 bg-zinc-800/70 text-white rounded-xl px-4 border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
                className="w-full h-12 bg-zinc-800/70 text-white rounded-xl px-4 border border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all"
                required
              />
            </div>

            {/* Remember Me & Forgot Password - Login Only */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-yellow-400 rounded" />
                  Remember me
                </label>
                <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-xl transition-all duration-200 shadow-lg"
            >
              {isSignUp ? 'Create Account' : 'Login'}
            </motion.button>
          </motion.form>

          {/* Toggle Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
