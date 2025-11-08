'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Download,
  Bookmark,
  Repeat,
  Shuffle
} from 'lucide-react'

interface Recitation {
  id: string
  name: string
  reciter: string
  duration: string
}

export function QuranPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [currentSurah, setCurrentSurah] = useState('Al-Fatihah')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  const recitations: Recitation[] = [
    { id: '1', name: 'Surah Al-Fatihah', reciter: 'Mishary Rashid', duration: '3:45' },
    { id: '2', name: 'Surah Al-Baqarah', reciter: 'Abdul Rahman Al-Sudais', duration: '12:30' },
    { id: '3', name: 'Surah Yasin', reciter: 'Maher Al Muaiqly', duration: '8:15' }
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📖 Quran Recitation
        </h2>
        <p className="text-purple-100 mt-1">Listen to beautiful recitations</p>
      </div>

      {/* Current Playing */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            ﷽
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {currentSurah}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">Mishary Rashid Alafasy</p>
            <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-400 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
        />
      </div>

      {/* Controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Shuffle className="w-5 h-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handlePlayPause}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-4">
            <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Repeat className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400"
          />
        </div>
      </div>

      {/* Recitations List */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Recitations</h4>
        <div className="space-y-3">
          {recitations.map((recitation, index) => (
            <motion.div
              key={recitation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {recitation.name}
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">{recitation.reciter}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {recitation.duration}
              </div>
              <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <Play className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
