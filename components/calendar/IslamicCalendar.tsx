// components/calendar/IslamicCalendar.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Moon,
  Sun,
  Clock,
  MapPin
} from 'lucide-react'

interface IslamicEvent {
  id: string
  date: string
  hijriDate: string
  title: string
  description: string
  type: 'religious' | 'historical' | 'occasion'
  importance: 'high' | 'medium' | 'low'
  isPublicHoliday: boolean
}

export function IslamicCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<IslamicEvent[]>([])
  const [view, setView] = useState<'month' | 'year'>('month')

  useEffect(() => {
    // Mock events data - in production, this would come from API
    const mockEvents: IslamicEvent[] = [
      {
        id: '1',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
        hijriDate: '1 Ramadan 1445',
        title: 'First Day of Ramadan',
        description: 'The beginning of the holy month of Ramadan, month of fasting and spiritual reflection.',
        type: 'religious',
        importance: 'high',
        isPublicHoliday: true
      },
      {
        id: '2',
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
        hijriDate: '15 Ramadan 1445',
        title: 'Laylat al-Qadr',
        description: 'The Night of Decree, better than a thousand months. Muslims seek this night in the last 10 days of Ramadan.',
        type: 'religious',
        importance: 'high',
        isPublicHoliday: false
      },
      {
        id: '3',
        date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        hijriDate: '1 Shawwal 1445',
        title: 'Eid al-Fitr',
        description: 'Festival of Breaking the Fast, marking the end of Ramadan.',
        type: 'religious',
        importance: 'high',
        isPublicHoliday: true
      }
    ]
    setEvents(mockEvents)
  }, [])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getHijriDate = (gregorianDate: Date) => {
    // Simplified conversion - in production, use proper Hijri conversion library
    const offset = -1 // Approximate day offset
    const hijriDay = (gregorianDate.getDate() + offset) % 30 || 30
    const hijriMonths = ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah']
    const hijriMonth = hijriMonths[gregorianDate.getMonth()]
    const hijriYear = 1445 // This would be calculated properly
    
    return `${hijriDay} ${hijriMonth} ${hijriYear}`
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    )
  }

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Previous month's days
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push(date)
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => (
            <CalendarDay
              key={index}
              date={date}
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
              events={getEventsForDate(date || new Date())}
              hijriDate={date ? getHijriDate(date) : ''}
            />
          ))}
        </div>
      </div>
    )
  }

  const getSelectedDateEvents = () => {
    return events.filter(event => 
      new Date(event.date).toDateString() === selectedDate.toDateString()
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <CalendarIcon className="w-8 h-8 text-purple-600" />
            Islamic Calendar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track important Islamic dates, holidays, and events according to the Hijri calendar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            {renderMonthView()}

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Upcoming Important Dates
              </h3>
              <div className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Selected Date
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedDate.getDate()}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Hijri Date</div>
                <div className="font-semibold text-purple-700 dark:text-purple-300">
                  {getHijriDate(selectedDate)}
                </div>
              </div>
            </div>

            {/* Events for Selected Date */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Events on {selectedDate.toLocaleDateString()}
              </h3>
              
              {getSelectedDateEvents().length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No events scheduled for this date
                </p>
              ) : (
                <div className="space-y-3">
                  {getSelectedDateEvents().map(event => (
                    <div key={event.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          event.importance === 'high' ? 'bg-red-500' :
                          event.importance === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`} />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {event.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Calendar Settings
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  Go to Today
                </button>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">View Mode</span>
                  <select 
                    value={view}
                    onChange={(e) => setView(e.target.value as 'month' | 'year')}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarDay({ date, currentDate, selectedDate, onSelect, events, hijriDate }: {
  date: Date | null
  currentDate: Date
  selectedDate: Date
  onSelect: (date: Date) => void
  events: IslamicEvent[]
  hijriDate: string
}) {
  if (!date) {
    return <div className="h-24 bg-gray-50 dark:bg-gray-700 rounded-xl" />
  }

  const isToday = date.toDateString() === new Date().toDateString()
  const isSelected = date.toDateString() === selectedDate.toDateString()
  const isCurrentMonth = date.getMonth() === currentDate.getMonth()

  const hasEvents = events.length > 0
  const hasImportantEvent = events.some(event => event.importance === 'high')

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(date)}
      className={`h-24 p-2 rounded-xl text-left transition-all border-2 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : isToday
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-transparent bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
      } ${!isCurrentMonth ? 'opacity-40' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-1">
          <span className={`font-semibold text-sm ${
            isSelected || isToday
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {date.getDate()}
          </span>
          
          {hasEvents && (
            <div className="flex gap-1">
              {hasImportantEvent && (
                <Star className="w-3 h-3 text-amber-500 fill-current" />
              )}
              <div className={`w-2 h-2 rounded-full ${
                events[0]?.importance === 'high' ? 'bg-red-500' :
                events[0]?.importance === 'medium' ? 'bg-amber-500' : 'bg-green-500'
              }`} />
            </div>
          )}
        </div>

        {/* Hijri Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {hijriDate.split(' ')[0]}
        </div>

        {/* Events Preview */}
        <div className="flex-1 overflow-hidden">
          {events.slice(0, 2).map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded mb-1 truncate ${
                event.importance === 'high'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : event.importance === 'medium'
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}
            >
              {event.title}
            </div>
          ))}
          {events.length > 2 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              +{events.length - 2} more
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function EventCard({ event }: { event: IslamicEvent }) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'religious':
        return <Moon className="w-4 h-4" />
      case 'historical':
        return <Clock className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getEventIcon(event.type)}
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h4>
        </div>
        
        {event.isPublicHoliday && (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
            Holiday
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {event.description}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{event.hijriDate}</span>
        <span>{new Date(event.date).toLocaleDateString()}</span>
      </div>
    </motion.div>
  )
}
