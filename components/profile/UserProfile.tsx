// components/profile/UserProfile.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Edit3,
  Camera,
  Mail,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Clock,
  Award,
  Target,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Grid,
  List,
  BarChart3,
  Trophy,
  Activity
} from 'lucide-react'

interface UserProfileProps {
  user: any
  currentUserId: string
  isFollowing: boolean
  stats: {
    totalPrayers: number
    quranPages: number
    studyTime: number
    currentStreak: number
    longestStreak: number
    achievements: number
  }
}

export function UserProfile({ user, currentUserId, isFollowing, stats }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'goals' | 'progress' | 'achievements'>('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [isFollowingState, setIsFollowingState] = useState(isFollowing)

  const isOwnProfile = currentUserId === user.id

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <Grid className="w-4 h-4" />, count: user._count.posts },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" />, count: user._count.goals },
    { id: 'progress', label: 'Progress', icon: <Activity className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" />, count: stats.achievements }
  ]

  const toggleFollow = async () => {
    // In production, this would call an API
    setIsFollowingState(!isFollowingState)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Edit Cover Button */}
        {isOwnProfile && (
          <button className="absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Edit Cover
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white dark:border-gray-800">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                {isOwnProfile && (
                  <button className="absolute -bottom-2 -right-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transform hover:scale-110 transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      @{user.username}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                      <>
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl font-medium transition-colors flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </button>
                        <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl transition-colors">
                          <Settings className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={toggleFollow}
                          className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                            isFollowingState
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          {isFollowingState ? 'Following' : 'Follow'}
                        </button>
                        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl font-medium transition-colors flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                        <button className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                {/* User Details */}
                <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>

                  {user.email && isOwnProfile && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <StatCard 
                label="Followers" 
                value={user._count.followers} 
                icon={<Users className="w-5 h-5" />}
              />
              <StatCard 
                label="Following" 
                value={user._count.following} 
                icon={<User className="w-5 h-5" />}
              />
              <StatCard 
                label="Posts" 
                value={user._count.posts} 
                icon={<MessageCircle className="w-5 h-5" />}
              />
              <StatCard 
                label="Goals" 
                value={user._count.goals} 
                icon={<Target className="w-5 h-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Spiritual Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Spiritual Progress
                </h3>
                
                <div className="space-y-4">
                  <ProgressStat 
                    label="Prayer Completion" 
                    value={stats.totalPrayers} 
                    max={30 * 5} // 30 days * 5 prayers
                    icon={<Clock className="w-4 h-4" />}
                  />
                  <ProgressStat 
                    label="Quran Pages" 
                    value={stats.quranPages} 
                    max={604} // Total pages in Quran
                    icon={<BookOpen className="w-4 h-4" />}
                  />
                  <ProgressStat 
                    label="Study Time" 
                    value={Math.round(stats.studyTime / 60)} // Convert to hours
                    suffix="h"
                    icon={<BookOpen className="w-4 h-4" />}
                  />
                  <ProgressStat 
                    label="Current Streak" 
                    value={stats.currentStreak} 
                    suffix="days"
                    icon={<Award className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Achievements Preview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Achievements
                </h3>
                
                <div className="space-y-3">
                  {stats.achievements > 0 ? (
                    <>
                      <AchievementItem 
                        title="Prayer Warrior"
                        description="Completed 100 prayers"
                        icon="🕌"
                        unlocked={true}
                      />
                      <AchievementItem 
                        title="Quran Reader"
                        description="Read 50 pages of Quran"
                        icon="📖"
                        unlocked={true}
                      />
                      <AchievementItem 
                        title="Community Builder"
                        description="Helped 10 community members"
                        icon="👥"
                        unlocked={false}
                      />
                    </>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No achievements yet. Start your journey!
                    </p>
                  )}
                </div>

                {stats.achievements > 0 && (
                  <button className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors">
                    View All {stats.achievements} Achievements
                  </button>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap gap-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <AnimatedTabContent activeTab={activeTab} user={user} stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="text-center group cursor-pointer">
      <div className="text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  )
}

function ProgressStat({ label, value, max, suffix = '', icon }: {
  label: string
  value: number
  max?: number
  suffix?: string
  icon: React.ReactNode
}) {
  const percentage = max ? (value / max) * 100 : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {value}{suffix}{max ? `/${max}${suffix}` : ''}
        </span>
      </div>
      
      {max && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

function AchievementItem({ title, description, icon, unlocked }: {
  title: string
  description: string
  icon: string
  unlocked: boolean
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      unlocked
        ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        : 'bg-gray-50 dark:bg-gray-700 opacity-60'
    }`}>
      <div className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold ${
          unlocked ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {title}
        </h4>
        <p className={`text-sm ${
          unlocked ? 'text-amber-600 dark:text-amber-300' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {description}
        </p>
      </div>
      {unlocked && (
        <Star className="w-4 h-4 text-amber-500 fill-current" />
      )}
    </div>
  )
}

function AnimatedTabContent({ activeTab, user, stats }: {
  activeTab: string
  user: any
  stats: any
}) {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === 'posts' && <PostsTab posts={user.posts} />}
      {activeTab === 'goals' && <GoalsTab goals={user.goals} />}
      {activeTab === 'progress' && <ProgressTab stats={stats} progress={user.quranProgress} />}
      {activeTab === 'achievements' && <AchievementsTab />}
    </motion.div>
  )
}

function PostsTab({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Share your thoughts and experiences with the community
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {post.user.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <p className="text-gray-900 dark:text-white mb-4">
            {post.content}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post._count.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post._count.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function GoalsTab({ goals }: { goals: any[] }) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No goals yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Set spiritual goals to track your progress
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {goals.map(goal => (
        <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {goal.title}
            </h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              goal.completed
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {goal.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {goal.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{goal.current}/{goal.target} {goal.unit}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProgressTab({ stats, progress }: { stats: any; progress: any[] }) {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.totalPrayers}</div>
          <div className="text-sm opacity-90">Prayers</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.quranPages}</div>
          <div className="text-sm opacity-90">Quran Pages</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white text-center">
          <div className="text-2xl font-bold">{stats.achievements}</div>
          <div className="text-sm opacity-90">Achievements</div>
        </div>
      </div>

      {/* Recent Progress */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Recent Quran Progress
        </h4>
        {progress.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent progress recorded
          </p>
        ) : (
          <div className="space-y-3">
            {progress.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.surahName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Verses {item.ayahFrom}-{item.ayahTo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.duration}min
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AchievementsTab() {
  return (
    <div className="text-center py-12">
      <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Achievements System
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Track your spiritual milestones and accomplishments
      </p>
      <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all">
        View All Achievements
      </button>
    </div>
  )
}
