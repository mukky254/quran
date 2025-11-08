'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, Heart, Calendar, Compass } from 'lucide-react'

export function QuickActions() {
  const actions = [
    { name: 'Read Quran', icon: BookOpen, color: 'from-green-500 to-emerald-600', href: '/quran' },
    { name: 'Prayer Times', icon: Clock, color: 'from-blue-500 to-cyan-600', href: '/prayer-times' },
    { name: 'Community', icon: Users, color: 'from-purple-500 to-pink-600', href: '/community' },
    { name: 'Charity', icon: Heart, color: 'from-red-500 to-rose-600', href: '/charity' },
    { name: 'Calendar', icon: Calendar, color: 'from-amber-500 to-orange-600', href: '/calendar' },
    { name: 'Qibla Finder', icon: Compass, color: 'from-indigo-500 to-purple-600', href: '/qibla' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <motion.a
            key={action.name}
            href={action.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-md transition-all group cursor-pointer"
          >
            <div className={`p-3 bg-gradient-to-br ${action.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {action.name}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  )
}
