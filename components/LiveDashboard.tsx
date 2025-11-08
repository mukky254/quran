'use client'

import { motion } from 'framer-motion'

export function LiveDashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Live Dashboard
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
        >
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">1.2K</div>
          <div className="text-sm text-green-600 dark:text-green-400">Active Users</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
        >
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">567</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Prayers Today</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
        >
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</div>
          <div className="text-sm text-purple-600 dark:text-purple-400">New Posts</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
        >
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">42</div>
          <div className="text-sm text-amber-600 dark:text-amber-400">Quran Sessions</div>
        </motion.div>
      </div>
    </div>
  )
}
