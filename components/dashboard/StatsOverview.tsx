// components/dashboard/StatsOverview.tsx

'use client'

import { User, PrayerTime, QuranProgress } from '@prisma/client'
import { motion } from 'framer-motion'
import { 
  Clock, 
  BookOpen, 
  Target, 
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface StatsOverviewProps {
  user: User
  prayerTimes: PrayerTime[]
  quranProgress: QuranProgress[]
}

export function StatsOverview({ user, prayerTimes, quranProgress }: StatsOverviewProps) {
  // Calculate stats
  const totalPrayers = prayerTimes.length * 5
  const prayersCompleted = prayerTimes.reduce((acc, day) => {
    return acc + [day.fajr, day.dhuhr, day.asr, day.maghrib, day.isha].filter(Boolean).length
  }, 0)

  const prayerPercentage = totalPrayers > 0 ? (prayersCompleted / totalPrayers) * 100 : 0
  
  const quranPagesRead = quranProgress.filter(p => p.completed).length
  const totalPages = 604 // Total pages in Quran
  const quranPercentage = (quranPagesRead / totalPages) * 100

  const currentStreak = calculateStreak(prayerTimes)
  const longestStreak = Math.max(currentStreak, 21) // Example data

  const stats = [
    {
      label: 'Prayer Completion',
      value: `${prayersCompleted}/${totalPrayers}`,
      percentage: prayerPercentage,
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      description: `${Math.round(prayerPercentage)}% of prayers completed`
    },
    {
      label: 'Quran Progress',
      value: `${quranPagesRead}/${totalPages}`,
      percentage: quranPercentage,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600',
      description: `${Math.round(quranPercentage)}% of Quran completed`
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      percentage: (currentStreak / 30) * 100,
      icon: Target,
      color: 'from-amber-500 to-orange-600',
      description: `${longestStreak} days longest streak`
    },
    {
      label: 'Achievements',
      value: '3/10',
      percentage: 30,
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      description: '3 achievements unlocked'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
              style={{ width: `${stat.percentage}%` }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Progress
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {Math.round(stat.percentage)}%
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function calculateStreak(prayerTimes: PrayerTime[]): number {
  // Simplified streak calculation
  // In production, you'd want more sophisticated logic
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const prayersThatDay = prayerTimes.find(pt => 
      pt.date.toDateString() === date.toDateString()
    )
    
    if (prayersThatDay) {
      const prayersCount = [
        prayersThatDay.fajr, 
        prayersThatDay.dhuhr, 
        prayersThatDay.asr, 
        prayersThatDay.maghrib, 
        prayersThatDay.isha
      ].filter(Boolean).length
      
      if (prayersCount >= 3) { // At least 3 prayers to count as a day
        streak++
      } else {
        break
      }
    } else {
      break
    }
  }
  
  return streak
}
