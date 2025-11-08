// components/layout/Navigation.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Mosque, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Clock,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  Compass,
  Moon,
  Sun,
  Bell,
  Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'Quran', href: '/quran', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Prayer Times', href: '/prayer-times', icon: <Clock className="w-5 h-5" /> },
    { name: 'Hadith', href: '/hadith', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Mosques', href: '/mosques', icon: <Mosque className="w-5 h-5" /> },
    { name: 'Community', href: '/community', icon: <Users className="w-5 h-5" /> },
    { name: 'Events', href: '/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Charity', href: '/charity', icon: <Heart className="w-5 h-5" /> },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 text-2xl font-bold group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Mosque className="w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              IslamicPlatform
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-inner'
                      : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => signIn()}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 my-4"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-6 py-4 mx-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )
                })}

                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-6 py-4 mx-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-6 py-4 mx-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        signIn()
                        setIsOpen(false)
                      }}
                      className="w-full mx-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg text-center"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
