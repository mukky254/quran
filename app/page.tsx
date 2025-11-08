'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Clock, 
  BookOpen, 
  Mosque, 
  Compass, 
  Calendar,
  Moon,
  Sun,
  Volume2,
  Share2,
  Download,
  Bookmark,
  Search,
  Users,
  GraduationCap,
  Heart,
  Star,
  Globe,
  Microphone,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { PrayerTimesWidget } from '@/components/prayer/PrayerTimesWidget'
import { QuranPlayer } from '@/components/quran/QuranPlayer'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { LiveDashboard } from '@/components/dashboard/LiveDashboard'

export default function Home() {
  const { data: session } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section with Glass Morphism */}
      <section className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-5xl font-bold font-arabic tracking-tight">
            ﷽
          </h1>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400">
            Welcome to Your Islamic Journey
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Comprehensive digital platform for Quran, Prayer, Knowledge, and Community
          </p>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      </section>

      {/* Live Dashboard */}
      <LiveDashboard />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Clock className="w-6 h-6" />}
          label="Current Time"
          value={currentTime.toLocaleTimeString()}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard 
          icon={<Mosque className="w-6 h-6" />}
          label="Next Prayer"
          value="Asr - 15:30"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />}
          label="Quran Progress"
          value="67% Completed"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />}
          label="Community"
          value="1.2M Active"
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prayer Times Widget */}
        <div className="lg:col-span-1">
          <PrayerTimesWidget />
        </div>

        {/* Quran Player */}
        <div className="lg:col-span-2">
          <QuranPlayer />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Feature Showcase */}
      <FeatureGrid />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />
    </div>
  )
}

function StatCard({ icon, label, value, gradient }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string,
  gradient: string 
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  )
}

function InteractiveDemoSection() {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        Experience Our Features
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DemoFeatureCard 
          title="Digital Tasbih"
          description="Count your dhikr with beautiful animations"
          icon="📿"
          color="bg-amber-500"
        />
        <DemoFeatureCard 
          title="Qibla Finder"
          description="Find Qibla direction with augmented reality"
          icon="🧭"
          color="bg-blue-500"
        />
        <DemoFeatureCard 
          title="Islamic Calendar"
          description"Hijri calendar with important dates"
          icon="📅"
          color="bg-green-500"
        />
      </div>
    </section>
  )
}

function DemoFeatureCard({ title, description, icon, color }: {
  title: string;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  )
}
