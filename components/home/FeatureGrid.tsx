'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, GraduationCap, Users, Heart, Calendar, Mosque, Globe } from 'lucide-react'

export function FeatureGrid() {
  const features = [
    {
      icon: BookOpen,
      title: 'Quran Reader',
      description: 'Complete Quran with translations and audio',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Clock,
      title: 'Prayer Times',
      description: 'Accurate prayer times and Qibla direction',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: GraduationCap,
      title: 'Hadith Library',
      description: 'Authentic Hadith collections with search',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with Muslims worldwide',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Mosque,
      title: 'Mosque Finder',
      description: 'Find nearby mosques and Islamic centers',
      color: 'from-amber-500 to-yellow-600'
    },
    {
      icon: Calendar,
      title: 'Islamic Calendar',
      description: 'Hijri dates and important events',
      color: 'from-indigo-500 to-purple-600'
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Comprehensive Islamic Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
