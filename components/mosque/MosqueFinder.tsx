// components/mosque/MosqueFinder.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation,
  Clock,
  Phone,
  Globe,
  Users,
  Wifi,
  Car,
  Wheelchair,
  Star,
  Share2,
  Bookmark
} from 'lucide-react'

interface Mosque {
  id: string
  name: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  website?: string
  description?: string
  amenities: string[]
  jummahTimes: string[]
  distance?: number
  rating: number
  isBookmarked: boolean
}

export function MosqueFinder() {
  const [mosques, setMosques] = useState<Mosque[]>([])
  const [filteredMosques, setFilteredMosques] = useState<Mosque[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockMosques: Mosque[] = [
      {
        id: '1',
        name: 'Islamic Center of Downtown',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.0060,
        phone: '+1 (555) 123-4567',
        website: 'https://example.com',
        description: 'A beautiful mosque in the heart of downtown with modern facilities and a welcoming community.',
        amenities: ['WiFi', 'Parking', 'Wheelchair Access', 'Library', 'Cafeteria'],
        jummahTimes: ['13:00', '13:30', '14:00'],
        rating: 4.8,
        isBookmarked: false
      },
      {
        id: '2',
        name: 'Al-Rahman Masjid',
        address: '456 Oak Avenue',
        city: 'New York',
        country: 'USA',
        latitude: 40.7282,
        longitude: -73.9942,
        phone: '+1 (555) 987-6543',
        description: 'Community mosque with educational programs and youth activities.',
        amenities: ['Parking', 'Wheelchair Access', 'Islamic School'],
        jummahTimes: ['12:45', '13:15'],
        rating: 4.6,
        isBookmarked: true
      },
      {
        id: '3',
        name: 'Masjid Al-Noor',
        address: '789 Park Road',
        city: 'New York',
        country: 'USA',
        latitude: 40.7505,
        longitude: -73.9934,
        amenities: ['WiFi', 'Parking', 'Bookstore'],
        jummahTimes: ['13:00', '13:45'],
        rating: 4.9,
        isBookmarked: false
      }
    ]

    setMosques(mockMosques)
    setFilteredMosques(mockMosques)
    setIsLoading(false)
  }, [])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Error getting location:', error)
        }
      )
    }
  }, [])

  // Calculate distances when user location is available
  useEffect(() => {
    if (userLocation && mosques.length > 0) {
      const mosquesWithDistance = mosques.map(mosque => ({
        ...mosque,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          mosque.latitude,
          mosque.longitude
        )
      }))
      setMosques(mosquesWithDistance)
      setFilteredMosques(mosquesWithDistance)
    }
  }, [userLocation, mosques.length])

  // Filter mosques
  useEffect(() => {
    let filtered = mosques

    if (searchQuery) {
      filtered = filtered.filter(mosque =>
        mosque.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mosque.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mosque.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(mosque =>
        selectedAmenities.every(amenity => mosque.amenities.includes(amenity))
      )
    }

    setFilteredMosques(filtered)
  }, [searchQuery, selectedAmenities, mosques])

  const toggleBookmark = (mosqueId: string) => {
    setMosques(prev => prev.map(mosque =>
      mosque.id === mosqueId 
        ? { ...mosque, isBookmarked: !mosque.isBookmarked }
        : mosque
    ))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const amenitiesList = ['WiFi', 'Parking', 'Wheelchair Access', 'Library', 'Islamic School', 'Cafeteria', 'Bookstore']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                Mosque Finder
              </h1>
            </div>

            <button
              onClick={() => userLocation && setSelectedAmenities([])}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Near Me
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search mosques..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>

                {/* Amenities Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Amenities
                  </h3>
                  <div className="space-y-2">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Nearby Mosques
                </h3>
                <div className="space-y-3">
                  <StatItem label="Total Found" value={filteredMosques.length} />
                  <StatItem label="With Parking" value={filteredMosques.filter(m => m.amenities.includes('Parking')).length} />
                  <StatItem label="Wheelchair Access" value={filteredMosques.filter(m => m.amenities.includes('Wheelchair Access')).length} />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Map Placeholder */}
                <div 
                  ref={mapRef}
                  className="h-64 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center"
                >
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Interactive Map
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userLocation ? 'Your location and nearby mosques shown here' : 'Enable location to see mosques near you'}
                    </p>
                  </div>
                </div>

                {/* Mosque List */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {filteredMosques.length} Mosques Found
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Sorted by Distance</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredMosques.map((mosque, index) => (
                      <MosqueCard
                        key={mosque.id}
                        mosque={mosque}
                        index={index}
                        onSelect={setSelectedMosque}
                        onBookmark={toggleBookmark}
                      />
                    ))}
                  </div>

                  {filteredMosques.length === 0 && (
                    <div className="text-center py-12">
                      <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No mosques found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mosque Detail Modal */}
      <AnimatePresence>
        {selectedMosque && (
          <MosqueDetailModal
            mosque={selectedMosque}
            onClose={() => setSelectedMosque(null)}
            onBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function MosqueCard({ mosque, index, onSelect, onBookmark }: {
  mosque: Mosque
  index: number
  onSelect: (mosque: Mosque) => void
  onBookmark: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onSelect(mosque)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {mosque.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {mosque.address}, {mosque.city}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {mosque.rating}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark(mosque.id)
                }}
                className={`p-2 rounded-lg transition-colors ${
                  mosque.isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-white dark:hover:bg-gray-600'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${mosque.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Amenities */}
          {mosque.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {mosque.amenities.slice(0, 3).map(amenity => (
                <AmenityBadge key={amenity} amenity={amenity} />
              ))}
              {mosque.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
                  +{mosque.amenities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Jummah Times */}
          {mosque.jummahTimes.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Jummah: {mosque.jummahTimes.join(', ')}
              </span>
              {mosque.distance && (
                <span className="flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  {mosque.distance.toFixed(1)} km
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function MosqueDetailModal({ mosque, onClose, onBookmark }: {
  mosque: Mosque
  onClose: () => void
  onBookmark: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mosque.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {mosque.address}, {mosque.city}, {mosque.country}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBookmark(mosque.id)}
                className={`p-3 rounded-xl transition-colors ${
                  mosque.isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${mosque.isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Rating and Distance */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  {mosque.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
            </div>

            {mosque.distance && (
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {mosque.distance.toFixed(1)} km
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">away</span>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {mosque.phone && (
              <InfoItem label="Phone" value={mosque.phone} icon={<Phone className="w-4 h-4" />} />
            )}
            {mosque.website && (
              <InfoItem label="Website" value={mosque.website} icon={<Globe className="w-4 h-4" />} />
            )}
          </div>

          {/* Jummah Times */}
          {mosque.jummahTimes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Jummah Prayer Times
              </h3>
              <div className="flex flex-wrap gap-2">
                {mosque.jummahTimes.map((time, index) => (
                  <span
                    key={time}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {mosque.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mosque.amenities.map(amenity => (
                  <AmenityBadge key={amenity} amenity={amenity} large />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {mosque.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {mosque.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
              Add to Prayer Times
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AmenityBadge({ amenity, large = false }: { amenity: string; large?: boolean }) {
  const getIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi': return <Wifi className="w-3 h-3" />
      case 'Parking': return <Car className="w-3 h-3" />
      case 'Wheelchair Access': return <Wheelchair className="w-3 h-3" />
      default: return <Users className="w-3 h-3" />
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 ${
      large 
        ? 'px-3 py-2 text-sm' 
        : 'px-2 py-1 text-xs'
    } bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium`}>
      {getIcon(amenity)}
      {amenity}
    </span>
  )
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <div className="text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  )
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
