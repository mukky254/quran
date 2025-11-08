// components/community/CommunityFeed.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image,
  Video,
  Link,
  Smile,
  Send,
  User,
  Calendar,
  MapPin,
  Globe,
  Lock
} from 'lucide-react'

interface Post {
  id: string
  userId: string
  user: {
    name: string
    image: string
    username: string
  }
  content: string
  image?: string
  video?: string
  link?: {
    url: string
    title: string
    description: string
    image: string
  }
  tags: string[]
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  userId: string
  user: {
    name: string
    image: string
    username: string
  }
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'following' | 'popular'>('all')
  const [newPostContent, setNewPostContent] = useState('')
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: '1',
        user: {
          name: 'Ahmed Rahman',
          image: '',
          username: 'ahmed_rahman'
        },
        content: 'Just completed my morning Quran reading. Surah Al-Fatiha never fails to bring peace to my heart. May Allah accept our prayers and grant us guidance. 🤲',
        tags: ['Quran', 'Morning', 'Peace'],
        likes: 42,
        comments: 8,
        shares: 3,
        isLiked: true,
        isBookmarked: false,
        isPublic: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        user: {
          name: 'Fatima Ahmed',
          image: '',
          username: 'fatima_ahmed'
        },
        content: 'Beautiful reminder from today\'s lecture: "The best among you are those who have the best manners and character." - Prophet Muhammad (PBUH)',
        image: '/api/placeholder/600/400',
        tags: ['Hadith', 'Character', 'Reminder'],
        likes: 89,
        comments: 15,
        shares: 12,
        isLiked: false,
        isBookmarked: true,
        isPublic: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        userId: '3',
        user: {
          name: 'Islamic Knowledge',
          image: '',
          username: 'islamic_knowledge'
        },
        content: 'Did you know? The word "Quran" appears 70 times in the Quran itself. Every verse is a miracle and guidance for humanity.',
        link: {
          url: 'https://example.com/quran-facts',
          title: '10 Amazing Facts About the Quran',
          description: 'Discover incredible facts about the Holy Quran that will strengthen your faith',
          image: '/api/placeholder/400/200'
        },
        tags: ['Quran', 'Knowledge', 'Facts'],
        likes: 156,
        comments: 23,
        shares: 45,
        isLiked: true,
        isBookmarked: false,
        isPublic: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    setPosts(mockPosts)
    setFilteredPosts(mockPosts)
    setIsLoading(false)
  }, [])

  // Filter posts based on search and tab
  useEffect(() => {
    let filtered = posts

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedTab === 'following') {
      // In production, this would filter by followed users
      filtered = filtered.filter(post => post.userId !== '3') // Example: exclude official accounts
    } else if (selectedTab === 'popular') {
      filtered = filtered.filter(post => post.likes > 50)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedTab, posts])

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const createPost = () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: Date.now().toString(),
      userId: 'current-user',
      user: {
        name: 'You',
        image: '',
        username: 'current_user'
      },
      content: newPostContent,
      tags: extractTags(newPostContent),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPosts(prev => [newPost, ...prev])
    setNewPostContent('')
    setShowNewPostModal(false)
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedPost) return

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userId: 'current-user',
      user: {
        name: 'You',
        image: '',
        username: 'current_user'
      },
      content: newComment,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString()
    }

    setComments(prev => [newCommentObj, ...prev])
    setPosts(prev => prev.map(post =>
      post.id === selectedPost.id
        ? { ...post, comments: post.comments + 1 }
        : post
    ))
    setNewComment('')
  }

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g
    const matches = content.match(tagRegex)
    return matches ? matches.map(tag => tag.slice(1)) : []
  }

  if (isLoading) {
    return <CommunityLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Community
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search and Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts, people, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'all'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  For You
                </button>
                <button
                  onClick={() => setSelectedTab('following')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'following'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Following
                </button>
                <button
                  onClick={() => setSelectedTab('popular')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTab === 'popular'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Popular
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onLike={toggleLike}
                onBookmark={toggleBookmark}
                onComment={() => setSelectedPost(post)}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try adjusting your search' : 'Be the first to post in the community!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <NewPostModal
            content={newPostContent}
            onChange={setNewPostContent}
            onSubmit={createPost}
            onClose={() => setShowNewPostModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedPost && (
          <CommentsModal
            post={selectedPost}
            comments={comments}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onAddComment={addComment}
            onClose={() => setSelectedPost(null)}
            onLike={toggleLike}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function PostCard({ post, index, onLike, onBookmark, onComment }: {
  post: Post
  index: number
  onLike: (id: string) => void
  onBookmark: (id: string) => void
  onComment: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {post.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.user.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>@{post.user.username}</span>
              <span>•</span>
              <span>{formatTime(post.createdAt)}</span>
              {post.isPublic ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className={`text-gray-900 dark:text-white leading-relaxed ${
          !isExpanded && post.content.length > 200 ? 'line-clamp-3' : ''
        }`}>
          {post.content.split(' ').map((word, i) =>
            word.startsWith('#') ? (
              <span key={i} className="text-blue-500 font-medium">
                {word}{' '}
              </span>
            ) : (
              word + ' '
            )
          )}
        </p>
        
        {post.content.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm mt-2"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="mb-4 rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt="Post image"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Link Preview */}
      {post.link && (
        <div className="mb-4 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
          <img
            src={post.link.image}
            alt={post.link.title}
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              {post.link.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {post.link.description}
            </p>
            <p className="text-blue-500 text-sm mt-2">{post.link.url}</p>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.isLiked
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{post.likes}</span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{post.comments}</span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">{post.shares}</span>
          </button>
        </div>

        <button
          onClick={() => onBookmark(post.id)}
          className={`p-2 rounded-xl transition-colors ${
            post.isBookmarked
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
              : 'text-gray-500 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </motion.div>
  )
}

function NewPostModal({ content, onChange, onSubmit, onClose }: {
  content: string
  onChange: (content: string) => void
  onSubmit: () => void
  onClose: () => void
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
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Post
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              Y
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                You
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Share your thoughts, knowledge, or inspiration with the community..."
            className="w-full h-48 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
          />

          {/* Tags Preview */}
          {content.includes('#') && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Tags will be automatically created from hashtags
              </p>
              <div className="flex flex-wrap gap-2">
                {content.split(' ').filter(word => word.startsWith('#')).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Image className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-purple-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Link className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={onSubmit}
              disabled={!content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CommentsModal({ post, comments, newComment, onNewCommentChange, onAddComment, onClose, onLike }: {
  post: Post
  comments: Comment[]
  newComment: string
  onNewCommentChange: (comment: string) => void
  onAddComment: () => void
  onClose: () => void
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
        className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Comments ({post.comments})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Original Post */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold">
                {post.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {post.user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{post.user.username}
                </p>
              </div>
            </div>
            <p className="text-gray-900 dark:text-white">
              {post.content}
            </p>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => onNewCommentChange(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onAddComment}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:shadow-none"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0">
        {comment.user.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {comment.user.name}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{comment.user.username} • {formatTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-gray-900 dark:text-white">
            {comment.content}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-2 ml-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{comment.likes}</span>
          </button>
          <button className="text-gray-500 hover:text-blue-500 transition-colors text-sm">
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

function CommunityLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
