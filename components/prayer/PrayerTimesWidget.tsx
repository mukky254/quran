'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  MapPin, 
  Volume2, 
  Share2, 
  Settings,
  Compass,
  Bell
} from 'lucide-react'

interface PrayerTime {
  name: string
  time: string
  isCurrent: boolean
  isNext: boolean
  passed: boolean
}

export function PrayerTimesWidget() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [location, setLocation] = useState('Mecca, Saudi Arabia')
  const [hijriDate, setHijriDate] = useState('')
  const [is24Hour, setIs24Hour] = useState(false)

  useEffect(() => {
    // Mock prayer times - will be replaced with API
    const times: PrayerTime[] = [
      { name: 'Fajr', time: '05:30', isCurrent: false, isNext: false, passed: true },
      { name: 'Sunrise', time: '06:45', isCurrent: false, isNext: false, passed: true },
      { name: 'Dhuhr', time: '12:30', isCurrent: false, isNext: false, passed: true },
      { name: 'Asr', time: '15:45', isCurrent: true, isNext: false, passed: false },
      { name: 'Maghrib', time: '18:20', isCurrent: false, isNext: true, passed: false },
      { name: 'Isha', time: '19:45', isCurrent: false, isNext: false, passed: false }
    ]
    setPrayerTimes(times)
    setHijriDate('24 Rabi al-Thani 1445 AH')
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Prayer Times
            </h2>
            <p className="text-green-100 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-100">Hijri Date</p>
            <p className="text-lg font-semibold">{hijriDate}</p>
          </div>
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="p-6 space-y-4">
        <AnimatePresence>
          {prayerTimes.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                prayer.isCurrent 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg scale-105' 
                  : prayer.isNext
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                  : prayer.passed
                  ? 'border-gray-200 dark:border-gray-600 opacity-60'
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  prayer.isCurrent ? 'bg-green-500 animate-pulse' :
                  prayer.isNext ? 'bg-amber-500' :
                  prayer.passed ? 'bg-gray-400' : 'bg-blue-500'
                }`} />
                <span className={`font-semibold ${
                  prayer.isCurrent ? 'text-green-700 dark:text-green-300 text-lg' :
                  prayer.isNext ? 'text-amber-700 dark:text-amber-300' :
                  prayer.passed ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {prayer.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-lg font-bold ${
                  prayer.isCurrent ? 'text-green-600 dark:text-green-400' :
                  prayer.isNext ? 'text-amber-600 dark:text-amber-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {prayer.time}
                </span>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-4 gap-3">
          <ActionButton icon={<Compass className="w-4 h-4" />} label="Qibla" />
          <ActionButton icon={<Volume2 className="w-4 h-4" />} label="Adhan" />
          <ActionButton icon={<Share2 className="w-4 h-4" />} label="Share" />
          <ActionButton icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
      <div className="text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
        {icon}
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
        {label}
      </span>
    </button>
  )
}
