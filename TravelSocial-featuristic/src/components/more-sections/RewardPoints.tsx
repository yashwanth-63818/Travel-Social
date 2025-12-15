import { motion } from 'motion/react';
import { Award, Gift, TrendingUp, Calendar, Star, Zap, Target, Trophy } from 'lucide-react';

export default function RewardPoints() {
  const userPoints = {
    total: 2450,
    tier: 'Gold',
    tierProgress: 65,
    nextTier: 'Platinum',
    pointsToNextTier: 550
  };

  const recentActivity = [
    { id: 1, action: 'Hotel Booking', points: 300, date: 'Nov 25, 2025', type: 'earned' },
    { id: 2, action: 'Flight to Tokyo', points: 450, date: 'Nov 20, 2025', type: 'earned' },
    { id: 3, action: 'Redeemed Discount', points: -200, date: 'Nov 18, 2025', type: 'redeemed' },
    { id: 4, action: 'Package Booking', points: 500, date: 'Nov 15, 2025', type: 'earned' },
    { id: 5, action: 'Ride Participation', points: 100, date: 'Nov 10, 2025', type: 'earned' },
  ];

  const redeemOptions = [
    {
      id: 1,
      title: '$10 Travel Credit',
      points: 500,
      icon: Gift,
      description: 'Use on any booking',
      available: true
    },
    {
      id: 2,
      title: '$25 Travel Credit',
      points: 1000,
      icon: Gift,
      description: 'Use on any booking',
      available: true
    },
    {
      id: 3,
      title: '$50 Travel Credit',
      points: 2000,
      icon: Gift,
      description: 'Use on any booking',
      available: true
    },
    {
      id: 4,
      title: 'Free Hotel Upgrade',
      points: 3000,
      icon: Star,
      description: 'Subject to availability',
      available: false
    },
    {
      id: 5,
      title: 'Airport Lounge Access',
      points: 1500,
      icon: Zap,
      description: 'One-time access',
      available: true
    },
    {
      id: 6,
      title: 'Priority Booking',
      points: 800,
      icon: Target,
      description: '30 days early access',
      available: true
    },
  ];

  const tiers = [
    { name: 'Bronze', minPoints: 0, color: 'bg-orange-600', benefits: '5% discount' },
    { name: 'Silver', minPoints: 1000, color: 'bg-gray-400', benefits: '10% discount' },
    { name: 'Gold', minPoints: 2000, color: 'bg-yellow-400', benefits: '15% discount + perks' },
    { name: 'Platinum', minPoints: 3000, color: 'bg-purple-400', benefits: '20% discount + VIP perks' },
  ];

  const earnMore = [
    { action: 'Book a flight', points: '50-500', icon: Calendar },
    { action: 'Book a hotel', points: '30-300', icon: Calendar },
    { action: 'Write a review', points: '25', icon: Star },
    { action: 'Share a post', points: '10', icon: TrendingUp },
    { action: 'Refer a friend', points: '500', icon: Gift },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl text-yellow-400 mb-2">Reward Points</h2>
        <p className="text-gray-400">Earn points and unlock exclusive benefits</p>
      </motion.div>

      {/* Points Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-black/80 mb-1">Your Total Points</p>
            <p className="text-5xl text-black">{userPoints.total.toLocaleString()}</p>
          </div>
          <div className="bg-black/20 p-4 rounded-full">
            <Trophy className="w-12 h-12 text-black" />
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black">Current Tier: {userPoints.tier}</span>
            <span className="text-black text-sm">{userPoints.pointsToNextTier} pts to {userPoints.nextTier}</span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${userPoints.tierProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-black h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Tier Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Membership Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`rounded-lg p-4 text-center border-2 ${
                tier.name === userPoints.tier ? 'border-yellow-400' : 'border-zinc-700'
              }`}
            >
              <div className={`w-12 h-12 ${tier.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <Award className="w-6 h-6 text-black" />
              </div>
              <p className="text-white mb-1">{tier.name}</p>
              <p className="text-xs text-gray-400 mb-2">{tier.minPoints}+ points</p>
              <p className="text-xs text-gray-500">{tier.benefits}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Redeem Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          Redeem Your Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {redeemOptions.map((option, index) => {
            const OptionIcon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={option.available ? { scale: 1.05, y: -5 } : {}}
                className={`bg-zinc-800 rounded-lg p-4 border-2 ${
                  option.available ? 'border-yellow-400 cursor-pointer' : 'border-zinc-700 opacity-50'
                }`}
              >
                <OptionIcon className={`w-8 h-8 mb-3 ${option.available ? 'text-yellow-400' : 'text-gray-500'}`} />
                <h4 className="text-white mb-1">{option.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{option.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400">{option.points} pts</span>
                  {option.available && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-400 text-black px-3 py-1 rounded text-sm"
                    >
                      Redeem
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5, backgroundColor: 'rgba(255, 215, 0, 0.05)' }}
              className="flex items-center justify-between p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${
                  activity.type === 'earned' ? 'bg-green-500/20' : 'bg-red-500/20'
                } rounded-lg flex items-center justify-center`}>
                  <Award className={`w-5 h-5 ${
                    activity.type === 'earned' ? 'text-green-400' : 'text-red-400'
                  }`} />
                </div>
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-sm text-gray-400">{activity.date}</p>
                </div>
              </div>
              <span className={`text-lg ${
                activity.type === 'earned' ? 'text-green-400' : 'text-red-400'
              }`}>
                {activity.points > 0 ? '+' : ''}{activity.points}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Earn More Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Ways to Earn More Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earnMore.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-3 bg-zinc-800 p-4 rounded-lg cursor-pointer"
              >
                <ItemIcon className="w-5 h-5 text-yellow-400" />
                <div className="flex-1">
                  <p className="text-white">{item.action}</p>
                  <p className="text-sm text-gray-400">Earn {item.points} points</p>
                </div>
                <span className="text-yellow-400">→</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
