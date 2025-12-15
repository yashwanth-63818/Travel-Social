import { motion } from 'motion/react';
import { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Calendar, MapPin, Luggage, FileText, Smartphone, CreditCard, Plane, Shield } from 'lucide-react';

export default function TravelChecklist() {
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, category: 'Documents', text: 'Passport', checked: true, icon: FileText },
    { id: 2, category: 'Documents', text: 'Travel insurance', checked: true, icon: Shield },
    { id: 3, category: 'Documents', text: 'Flight tickets', checked: true, icon: Plane },
    { id: 4, category: 'Documents', text: 'Hotel confirmations', checked: false, icon: FileText },
    { id: 5, category: 'Money', text: 'Credit cards', checked: true, icon: CreditCard },
    { id: 6, category: 'Money', text: 'Cash in local currency', checked: false, icon: CreditCard },
    { id: 7, category: 'Electronics', text: 'Phone charger', checked: true, icon: Smartphone },
    { id: 8, category: 'Electronics', text: 'Power adapter', checked: false, icon: Smartphone },
    { id: 9, category: 'Electronics', text: 'Camera', checked: false, icon: Smartphone },
    { id: 10, category: 'Clothing', text: 'Underwear & socks', checked: false, icon: Luggage },
    { id: 11, category: 'Clothing', text: 'Shirts & pants', checked: false, icon: Luggage },
    { id: 12, category: 'Clothing', text: 'Jacket', checked: false, icon: Luggage },
    { id: 13, category: 'Toiletries', text: 'Toothbrush & toothpaste', checked: false, icon: Luggage },
    { id: 14, category: 'Toiletries', text: 'Shampoo & soap', checked: false, icon: Luggage },
    { id: 15, category: 'Toiletries', text: 'Medications', checked: false, icon: Shield },
  ]);

  const [newItem, setNewItem] = useState('');

  const toggleItem = (id: number) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setChecklistItems(items => items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setChecklistItems([
        ...checklistItems,
        {
          id: Date.now(),
          category: 'Custom',
          text: newItem,
          checked: false,
          icon: CheckSquare
        }
      ]);
      setNewItem('');
    }
  };

  const categories = [...new Set(checklistItems.map(item => item.category))];
  
  const getProgress = () => {
    const checked = checklistItems.filter(item => item.checked).length;
    return Math.round((checked / checklistItems.length) * 100);
  };

  const upcomingTrip = {
    destination: 'Tokyo, Japan',
    date: 'December 10, 2025',
    daysLeft: 15
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl text-yellow-400 mb-2">Travel Checklist</h2>
        <p className="text-gray-400">Stay organized and never forget essentials</p>
      </motion.div>

      {/* Trip Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black/20 p-3 rounded-lg">
              <MapPin className="w-8 h-8 text-black" />
            </div>
            <div>
              <h3 className="text-xl text-black mb-1">Next Trip: {upcomingTrip.destination}</h3>
              <p className="text-black/80 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {upcomingTrip.date} • {upcomingTrip.daysLeft} days to go
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl text-white">Packing Progress</h3>
          <span className="text-2xl text-yellow-400">{getProgress()}%</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-yellow-400 h-full rounded-full"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {checklistItems.filter(item => item.checked).length} of {checklistItems.length} items completed
        </p>
      </motion.div>

      {/* Add New Item */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add new item to checklist..."
            className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-3 border-2 border-transparent focus:border-yellow-400 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addItem}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </motion.button>
        </div>
      </motion.div>

      {/* Checklist by Category */}
      {categories.map((category, catIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="bg-zinc-900 rounded-xl border-2 border-yellow-400 overflow-hidden"
        >
          <div className="p-4 bg-zinc-800 border-b border-yellow-400">
            <h3 className="text-lg text-yellow-400">{category}</h3>
          </div>
          <div className="p-2">
            {checklistItems
              .filter(item => item.category === category)
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 215, 0, 0.05)' }}
                    className="flex items-center gap-3 p-3 rounded-lg group"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleItem(item.id)}
                      className="flex-shrink-0"
                    >
                      {item.checked ? (
                        <CheckSquare className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </motion.button>
                    
                    <Icon className={`w-5 h-5 ${item.checked ? 'text-gray-500' : 'text-yellow-400'}`} />
                    
                    <span
                      className={`flex-1 ${
                        item.checked
                          ? 'text-gray-500 line-through'
                          : 'text-white'
                      }`}
                    >
                      {item.text}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      ))}

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-xl border-2 border-yellow-400 p-6"
      >
        <h3 className="text-xl text-yellow-400 mb-4">Packing Tips</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Roll clothes instead of folding to save space</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Pack a change of clothes in your carry-on</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Use packing cubes to organize items by category</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">•</span>
            <span>Check airline baggage restrictions before packing</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
