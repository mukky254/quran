// components/hadith/HadithLibrary.tsx

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Bookmark,
  Share2,
  Download,
  Heart,
  GraduationCap,
  Sparkles,
  Hash,
  User,
  Calendar,
  Award
} from 'lucide-react'

interface Hadith {
  id: string
  collection: string
  book: string
  hadithNumber: string
  arabic: string
  english: string
  narrator: string
  translation: string
  grade: string
  explanation?: string
  topics: string[]
  likes: number
  isBookmarked: boolean
  isLiked: boolean
}

export function HadithLibrary() {
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [filteredHadiths, setFilteredHadiths] = useState<Hadith[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [selectedBook, setSelectedBook] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockHadiths: Hadith[] = [
      {
        id: '1',
        collection: 'Sahih al-Bukhari',
        book: 'Book of Faith',
        hadithNumber: '1',
        arabic: 'إنما الأعمال بالنيات...',
        english: 'Actions are judged by intentions...',
        narrator: "Umar ibn Al-Khattab",
        translation: 'The reward of deeds depends on the intentions...',
        grade: 'Sahih',
        topics: ['Intention', 'Actions', 'Faith'],
        likes: 1245,
        isBookmarked: false,
        isLiked: false
      },
      {
        id: '2',
        collection: 'Sahih Muslim',
        book: 'Book of Purification',
        hadithNumber: '223',
        arabic: 'الطهور شطر الإيمان...',
        english: 'Cleanliness is half of faith...',
        narrator: "Abu Malik Al-Ash'ari",
        translation: 'Purity is half of iman (faith)...',
        grade: 'Sahih',
        topics: ['Purification', 'Cleanliness', 'Faith'],
        likes: 892,
        isBookmarked: true,
        isLiked: true
      },
      {
        id: '3',
        collection: 'Sunan Abu Dawud',
        book: 'Book of Manners',
        hadithNumber: '4799',
        arabic: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه',
        english: 'None of you will believe until you love for your brother what you love for yourself',
        narrator: "Anas ibn Malik",
        translation: 'None of you has faith until he loves for his brother what he loves for himself',
        grade: 'Sahih',
        topics: ['Brotherhood', 'Love', 'Faith', 'Manners'],
        likes: 1567,
        isBookmarked: false,
        isLiked: true
      }
    ]

    setHadiths(mockHadiths)
    setFilteredHadiths(mockHadiths)
    setIsLoading(false)
  }, [])

  // Filter hadiths based on search and filters
  useEffect(() => {
    let filtered = hadiths

    if (searchQuery) {
      filtered = filtered.filter(hadith =>
        hadith.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hadith.arabic.includes(searchQuery) ||
        hadith.narrator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hadith.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCollection !== 'all') {
      filtered = filtered.filter(hadith => hadith.collection === selectedCollection)
    }

    if (selectedBook !== 'all') {
      filtered = filtered.filter(hadith => hadith.book === selectedBook)
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(hadith => hadith.grade === selectedGrade)
    }

    setFilteredHadiths(filtered)
  }, [searchQuery, selectedCollection, selectedBook, selectedGrade, hadiths])

  const collections = useMemo(() => 
    Array.from(new Set(hadiths.map(h => h.collection))), [hadiths]
  )

  const books = useMemo(() => 
    Array.from(new Set(hadiths.map(h => h.book))), [hadiths]
  )

  const grades = useMemo(() => 
    Array.from(new Set(hadiths.map(h => h.grade))), [hadiths]
  )

  const toggleBookmark = (hadithId: string) => {
    setHadiths(prev => prev.map(hadith =>
      hadith.id === hadithId 
        ? { ...hadith, isBookmarked: !hadith.isBookmarked }
        : hadith
    ))
  }

  const toggleLike = (hadithId: string) => {
    setHadiths(prev => prev.map(hadith =>
      hadith.id === hadithId 
        ? { 
            ...hadith, 
            isLiked: !hadith.isLiked,
            likes: hadith.isLiked ? hadith.likes - 1 : hadith.likes + 1
          }
        : hadith
    ))
  }

  if (isLoading) {
    return <HadithLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-purple-600" />
                Hadith Library
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {viewMode === 'grid' ? 'List' : 'Grid'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search hadiths by text, narrator, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Collections</option>
                  {collections.map(collection => (
                    <option key={collection} value={collection}>{collection}</option>
                  ))}
                </select>

                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Books</option>
                  {books.map(book => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>

                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <StatCard label="Total Hadiths" value={hadiths.length} icon={<BookOpen className="w-4 h-4" />} />
              <StatCard label="Collections" value={collections.length} icon={<Hash className="w-4 h-4" />} />
              <StatCard label="Books" value={books.length} icon={<GraduationCap className="w-4 h-4" />} />
              <StatCard label="Topics" value={Array.from(new Set(hadiths.flatMap(h => h.topics))).length} icon={<Sparkles className="w-4 h-4" />} />
            </div>
          </div>

          {/* Hadith Grid/List */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredHadiths.map((hadith, index) => (
                  <HadithCard
                    key={hadith.id}
                    hadith={hadith}
                    index={index}
                    onSelect={setSelectedHadith}
                    onBookmark={toggleBookmark}
                    onLike={toggleLike}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredHadiths.map((hadith, index) => (
                  <HadithListItem
                    key={hadith.id}
                    hadith={hadith}
                    index={index}
                    onSelect={setSelectedHadith}
                    onBookmark={toggleBookmark}
                    onLike={toggleLike}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredHadiths.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hadiths found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hadith Detail Modal */}
      <AnimatePresence>
        {selectedHadith && (
          <HadithDetailModal
            hadith={selectedHadith}
            onClose={() => setSelectedHadith(null)}
            onBookmark={toggleBookmark}
            onLike={toggleLike}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function HadithCard({ hadith, index, onSelect, onBookmark, onLike }: {
  hadith: Hadith
  index: number
  onSelect: (hadith: Hadith) => void
  onBookmark: (id: string) => void
  onLike: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
      onClick={() => onSelect(hadith)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
            {hadith.hadithNumber}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
              {hadith.collection}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {hadith.book}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark(hadith.id)
            }}
            className={`p-2 rounded-lg transition-colors ${
              hadith.isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${hadith.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hadith Text */}
      <div className="space-y-3">
        <p className="text-gray-900 dark:text-white text-lg leading-relaxed font-arabic text-right">
          {hadith.arabic}
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {hadith.english}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {hadith.narrator}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            hadith.grade === 'Sahih' 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {hadith.grade}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike(hadith.id)
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              hadith.isLiked
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${hadith.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{hadith.likes}</span>
          </button>
        </div>
      </div>

      {/* Topics */}
      {hadith.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {hadith.topics.slice(0, 2).map(topic => (
            <span
              key={topic}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium"
            >
              #{topic}
            </span>
          ))}
          {hadith.topics.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
              +{hadith.topics.length - 2}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

function HadithListItem({ hadith, index, onSelect, onBookmark, onLike }: {
  hadith: Hadith
  index: number
  onSelect: (hadith: Hadith) => void
  onBookmark: (id: string) => void
  onLike: (id: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
      onClick={() => onSelect(hadith)}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
          {hadith.hadithNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {hadith.collection}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hadith.book} • {hadith.narrator}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                hadith.grade === 'Sahih' 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {hadith.grade}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark(hadith.id)
                }}
                className={`p-2 rounded-lg transition-colors ${
                  hadith.isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${hadith.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-900 dark:text-white text-lg leading-relaxed font-arabic text-right">
              {hadith.arabic}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {hadith.english}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-1">
              {hadith.topics.slice(0, 3).map(topic => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium"
                >
                  #{topic}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onLike(hadith.id)
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                hadith.isLiked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${hadith.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{hadith.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function HadithDetailModal({ hadith, onClose, onBookmark, onLike }: {
  hadith: Hadith
  onClose: () => void
  onBookmark: (id: string) => void
  onLike: (id: string) => void
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
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {hadith.hadithNumber}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hadith.collection}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {hadith.book}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onBookmark(hadith.id)}
                className={`p-3 rounded-xl transition-colors ${
                  hadith.isBookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${hadith.isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button className="p-3 text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Arabic Text */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <p className="text-3xl font-arabic text-gray-900 dark:text-white leading-loose text-right">
                {hadith.arabic}
              </p>
            </div>

            {/* English Translation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                English Translation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {hadith.english}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoItem label="Narrator" value={hadith.narrator} icon={<User className="w-4 h-4" />} />
                <InfoItem label="Grade" value={hadith.grade} icon={<Award className="w-4 h-4" />} />
              </div>
              <div className="space-y-4">
                <InfoItem label="Collection" value={hadith.collection} icon={<BookOpen className="w-4 h-4" />} />
                <InfoItem label="Book" value={hadith.book} icon={<GraduationCap className="w-4 h-4" />} />
              </div>
            </div>

            {/* Topics */}
            {hadith.topics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hadith.topics.map(topic => (
                    <span
                      key={topic}
                      className="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-medium"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {hadith.explanation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Explanation
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {hadith.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onLike(hadith.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-colors ${
                hadith.isLiked
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${hadith.isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{hadith.likes} likes</span>
            </button>

            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl font-medium transition-colors">
                Copy Text
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all">
                Save to Notes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <div className="text-purple-600 dark:text-purple-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <div className="text-purple-600 dark:text-purple-400 mb-2 flex justify-center">
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}

function HadithLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
