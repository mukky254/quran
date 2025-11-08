// components/quran/QuranReader.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Settings, 
  Bookmark,
  Share2,
  Download,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  List,
  Grid,
  Type,
  Languages
} from 'lucide-react'

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

interface Ayah {
  number: number
  text: string
  translation: string
  audio: string
  numberInSurah: number
}

export function QuranReader() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [currentAyah, setCurrentAyah] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSurahList, setShowSurahList] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'translation' | 'arabic' | 'both'>('both')
  const [fontSize, setFontSize] = useState('text-3xl')
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())
  const [recitation, setRecitation] = useState('mishari-rashid')

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Fetch list of surahs
    const fetchSurahs = async () => {
      try {
        const response = await fetch('/api/quran')
        const data = await response.json()
        setSurahs(data.data)
      } catch (error) {
        console.error('Error fetching surahs:', error)
      }
    }

    fetchSurahs()
  }, [])

  const fetchSurah = async (surahNumber: number) => {
    try {
      const response = await fetch(`/api/quran?surah=${surahNumber}`)
      const data = await response.json()
      setCurrentSurah(data.data)
      setAyahs(data.data.ayahs)
      setShowSurahList(false)
      setCurrentAyah(0)
    } catch (error) {
      console.error('Error fetching surah:', error)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleBookmark = (ayahNumber: number) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(ayahNumber)) {
      newBookmarks.delete(ayahNumber)
    } else {
      newBookmarks.add(ayahNumber)
    }
    setBookmarks(newBookmarks)
  }

  const filteredSurahs = surahs.filter(surah =>
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSurahList(true)}
                className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                Quran Reader
              </h1>

              {currentSurah && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>•</span>
                  <span className="font-arabic text-lg">{currentSurah.name}</span>
                  <span>•</span>
                  <span>{currentSurah.englishName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View Controls */}
              <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('arabic')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'arabic'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Arabic
                </button>
                <button
                  onClick={() => setViewMode('translation')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'translation'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Translation
                </button>
                <button
                  onClick={() => setViewMode('both')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'both'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Both
                </button>
              </div>

              <button className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showSurahList ? (
            <motion.div
              key="surah-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* Search Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search surahs by name or translation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                  <button className="p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                    <Grid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Surah Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSurahs.map((surah) => (
                  <motion.div
                    key={surah.number}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => fetchSurah(surah.number)}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        {surah.number}
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-gray-900 dark:text-white text-2xl font-arabic">
                          {surah.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          {surah.englishName}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                      {surah.englishNameTranslation}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="capitalize">{surah.revelationType}</span>
                      <span>{surah.numberOfAyahs} verses</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="surah-reader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Surah Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 text-center relative">
                <button
                  onClick={() => setShowSurahList(true)}
                  className="absolute left-6 top-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-colors flex items-center gap-2"
                >
                  <SkipBack className="w-4 h-4" />
                  Back to Surahs
                </button>
                
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-5xl font-bold text-gray-900 dark:text-white font-arabic mb-4">
                    {currentSurah?.name}
                  </h2>
                  <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
                    {currentSurah?.englishName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {currentSurah?.englishNameTranslation}
                  </p>
                  <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400">
                    <span>{currentSurah?.numberOfAyahs} verses</span>
                    <span>•</span>
                    <span className="capitalize">{currentSurah?.revelationType}</span>
                  </div>
                </div>
              </div>

              {/* Reading Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Type className="w-5 h-5 text-gray-400" />
                      <select 
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="text-2xl">Small</option>
                        <option value="text-3xl">Medium</option>
                        <option value="text-4xl">Large</option>
                        <option value="text-5xl">X-Large</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Languages className="w-5 h-5 text-gray-400" />
                      <select 
                        value={recitation}
                        onChange={(e) => setRecitation(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="mishari-rashid">Mishari Rashid</option>
                        <option value="abdul-basit">Abdul Basit</option>
                        <option value="al-afasy">Al-Afasy</option>
                        <option value="al-hussary">Al-Hussary</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ayahs */}
              <div className="space-y-6">
                {ayahs.map((ayah, index) => (
                  <motion.div
                    key={ayah.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start gap-6">
                      {/* Ayah Number */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {ayah.numberInSurah}
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleBookmark(ayah.number)}
                            className={`p-2 rounded-lg transition-colors ${
                              bookmarks.has(ayah.number)
                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarks.has(ayah.number) ? 'fill-current' : ''}`} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Ayah Content */}
                      <div className="flex-1 min-w-0">
                        {/* Arabic Text */}
                        {(viewMode === 'arabic' || viewMode === 'both') && (
                          <p className={`${fontSize} font-arabic text-gray-900 dark:text-white leading-loose text-right mb-4`}>
                            {ayah.text} ﴿{ayah.numberInSurah}﴾
                          </p>
                        )}

                        {/* Translation */}
                        {(viewMode === 'translation' || viewMode === 'both') && (
                          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
                            {ayah.translation}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Audio Player */}
              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg transform hover:scale-105 transition-all"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {currentSurah?.englishName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ayah {currentAyah + 1} of {ayahs.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <SkipBack className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentAyah + 1) / ayahs.length) * 100}%` }}
                  />
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={ayahs[currentAyah]?.audio}
                  onEnded={() => setCurrentAyah(prev => (prev + 1) % ayahs.length)}
                  onTimeUpdate={(e) => {
                    // Handle audio progress updates
                  }}
                />
              </div>

              {/* Bottom Spacing for Audio Player */}
              <div className="h-32"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
