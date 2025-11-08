// components/dashboard/DashboardHeader.tsx

'use client'

import { User } from '@prisma/client'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Settings, 
  Calendar,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const hijriDate = '25 Rabi al-Thani 1445 AH' // This would come from an API

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* User Welcome */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                As-salamu alaykum,{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {user.name || 'Friend'}
                </span>
                ! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                May your day be filled with blessings and peace
              </p>
            </div>
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-end lg:items-end xl:items-center gap-4">
          {/* Date Display */}
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium">{currentDate}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hijriDate}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl transition-colors group relative">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>
            
            <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl transition-colors group">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600" />
            </button>
            
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <StatItem 
          label="Prayer Streak" 
          value="7 days" 
          icon="🕌" 
          trend="+2"
          color="text-green-600"
        />
        <StatItem 
          label="Quran Pages" 
          value="15 today" 
          icon="📖" 
          trend="+5"
          color="text-blue-600"
        />
        <StatItem 
          label="Dhikr Count" 
          value="1,234" 
          icon="📿" 
          trend="+89"
          color="text-purple-600"
        />
        <StatItem 
          label="Level" 
          value="Novice" 
          icon="⭐" 
          trend="+15%"
          color="text-amber-600"
        />
      </div>
    </motion.div>
  )
}

function StatItem({ label, value, icon, trend, color }: {
  label: string
  value: string
  icon: string
  trend: string
  color: string
}) {
  return (
    <div className="text-center group">
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>
      <div className="flex items-center justify-center gap-1 mt-1">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {label}
        </span>
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
    </div>
  )
}
