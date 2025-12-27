import { motion } from 'motion/react';
import { Settings as SettingsIcon, Bell, Globe, Moon, Sun, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';

// Type definitions for settings items
interface SettingsOption {
  value: string;
  label: string;
}

interface BaseSettingsItem {
  icon: any;
  label: string;
  description: string;
}

interface ActionSettingsItem extends BaseSettingsItem {
  action: () => void;
  toggle?: never;
  value?: never;
  onChange?: never;
  options?: never;
}

interface ToggleSettingsItem extends BaseSettingsItem {
  toggle: true;
  value: boolean;
  onChange: (value: boolean) => void;
  action?: never;
  options?: never;
}

interface SelectSettingsItem extends BaseSettingsItem {
  value: string;
  options: SettingsOption[];
  onChange?: (value: string) => void;
  toggle?: never;
  action?: never;
}

type SettingsItem = ActionSettingsItem | ToggleSettingsItem | SelectSettingsItem;

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your privacy settings and account security',
          action: () => console.log('Privacy clicked')
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Control when and how you receive notifications',
          toggle: true,
          value: notifications,
          onChange: setNotifications
        }
      ]
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: darkMode ? Sun : Moon,
          label: 'Theme',
          description: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'Choose your preferred language',
          value: language,
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' }
          ]
        }
      ]
    },
    {
      title: 'Device',
      items: [
        {
          icon: Smartphone,
          label: 'Push Notifications',
          description: 'Allow push notifications on this device',
          toggle: true,
          value: true,
          onChange: () => {}
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl text-yellow-400">Settings</h1>
          </div>
          <p className="text-gray-400">Manage your account preferences and app settings</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-zinc-900 rounded-xl border-2 border-yellow-400 overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-xl text-white">{section.title}</h2>
              </div>

              {/* Section Items */}
              <div className="p-2">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      whileHover={{ 
                        scale: 1.01, 
                        x: 5,
                        backgroundColor: 'rgba(255, 215, 0, 0.1)' 
                      }}
                      onClick={'action' in item ? item.action : undefined}
                      className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-white">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                      </div>

                      {/* Toggle or Select */}
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
                      ) : 'options' in item && item.options ? (
                        <select 
                          value={item.value as string}
                          onChange={(e) => item.onChange && item.onChange(e.target.value)}
                          className="bg-zinc-800 text-white border border-gray-600 rounded px-3 py-1"
                        >
                          {item.options.map((option: SettingsOption) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>TravelSocial Version 2.5.0</p>
          <p className="mt-1">Settings are automatically saved</p>
        </motion.div>
      </div>
    </div>
  );
}