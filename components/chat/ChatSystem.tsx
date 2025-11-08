// components/chat/ChatSystem.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Send,
  Paperclip,
  Smile,
  User,
  Users,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react'

interface Chat {
  id: string
  type: 'direct' | 'group'
  name: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  isOnline?: boolean
  lastSeen?: string
}

interface User {
  id: string
  name: string
  username: string
  image?: string
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: string
  isRead: boolean
  isDelivered: boolean
}

export function ChatSystem() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data - in production, this would come from WebSocket or API
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        type: 'direct',
        name: 'Ahmed Rahman',
        participants: [
          {
            id: '2',
            name: 'Ahmed Rahman',
            username: 'ahmed_rahman',
            isOnline: true
          }
        ],
        lastMessage: {
          id: '1',
          chatId: '1',
          senderId: '2',
          content: 'As-salamu alaykum! How are you doing today?',
          type: 'text',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        unreadCount: 0,
        isOnline: true
      },
      {
        id: '2',
        type: 'group',
        name: 'Quran Study Group',
        participants: [
          {
            id: '2',
            name: 'Ahmed Rahman',
            username: 'ahmed_rahman',
            isOnline: true
          },
          {
            id: '3',
            name: 'Fatima Ahmed',
            username: 'fatima_ahmed',
            isOnline: false
          },
          {
            id: '4',
            name: 'Islamic Knowledge',
            username: 'islamic_knowledge',
            isOnline: true
          }
        ],
        lastMessage: {
          id: '2',
          chatId: '2',
          senderId: '4',
          content: 'Don\'t forget about our study session tomorrow!',
          type: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isDelivered: true
        },
        unreadCount: 3
      },
      {
        id: '3',
        type: 'direct',
        name: 'Brother Yusuf',
        participants: [
          {
            id: '5',
            name: 'Yusuf Ali',
            username: 'yusuf_ali',
            isOnline: false,
            lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        lastMessage: {
          id: '3',
          chatId: '3',
          senderId: '1',
          content: 'JazakAllah khair for your help!',
          type: 'text',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        unreadCount: 0
      }
    ]

    setChats(mockChats)
    setIsLoading(false)
  }, [])

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      // Mock messages - in production, this would come from API
      const mockMessages: Message[] = [
        {
          id: '1',
          chatId: selectedChat.id,
          senderId: '2',
          content: 'As-salamu alaykum! How are you doing today?',
          type: 'text',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        {
          id: '2',
          chatId: selectedChat.id,
          senderId: '1',
          content: 'Wa alaykum as-salam! Alhamdulillah, I\'m doing well. Just finished my morning prayers.',
          type: 'text',
          timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        {
          id: '3',
          chatId: selectedChat.id,
          senderId: '2',
          content: 'MashaAllah! That\'s wonderful. Have you been reading any particular surah recently?',
          type: 'text',
          timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        {
          id: '4',
          chatId: selectedChat.id,
          senderId: '1',
          content: 'Yes, I\'ve been focusing on Surah Al-Kahf. The stories and lessons are truly amazing.',
          type: 'text',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        },
        {
          id: '5',
          chatId: selectedChat.id,
          senderId: '2',
          content: 'That\'s one of my favorites too! The story of the People of the Cave is especially profound.',
          type: 'text',
          timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          isRead: true,
          isDelivered: true
        }
      ]
      setMessages(mockMessages)
    }
  }, [selectedChat])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: Message = {
      id: Date.now().toString(),
      chatId: selectedChat.id,
      senderId: '1', // Current user
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isDelivered: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update last message in chat
    setChats(prev => prev.map(chat =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            lastMessage: message,
            unreadCount: 0
          }
        : chat
    ))
  }

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return <ChatLoadingSkeleton />
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              Messages
            </h2>
            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onSelect={setSelectedChat}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold">
                      {selectedChat.name.charAt(0).toUpperCase()}
                    </div>
                    {selectedChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedChat.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.type === 'direct' 
                        ? selectedChat.isOnline 
                          ? 'Online' 
                          : `Last seen ${formatTime(selectedChat.participants[0]?.lastSeen || '')}`
                        : `${selectedChat.participants.length} members`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map(message => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === '1'}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-amber-500 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-xl transition-colors transform hover:scale-105 disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatListItem({ chat, isSelected, onSelect }: {
  chat: Chat
  isSelected: boolean
  onSelect: (chat: Chat) => void
}) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`
    } else {
      return `${Math.floor(diffInHours / 24)}d`
    }
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={() => onSelect(chat)}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold">
            {chat.name.charAt(0).toUpperCase()}
          </div>
          {chat.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
          {chat.type === 'group' && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <Users className="w-2 h-2 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {chat.name}
            </h4>
            {chat.lastMessage && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatTime(chat.lastMessage.timestamp)}
              </span>
            )}
          </div>

          {chat.lastMessage && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage.content}
            </p>
          )}

          {chat.type === 'group' && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {chat.participants.length} members
            </p>
          )}
        </div>

        {chat.unreadCount > 0 && (
          <div className="flex-shrink-0">
            <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
              {chat.unreadCount}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
        isOwn
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        <div className={`flex items-center gap-1 mt-2 text-xs ${
          isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <>
              {message.isDelivered && !message.isRead && (
                <Check className="w-3 h-3" />
              )}
              {message.isRead && (
                <CheckCheck className="w-3 h-3" />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function formatTime(timestamp: string) {
  if (!timestamp) return 'recently'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'recently'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else {
    return `${Math.floor(diffInHours / 24)} days ago`
  }
}

function ChatLoadingSkeleton() {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex">
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-700 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
}
