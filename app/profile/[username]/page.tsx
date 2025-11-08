// app/profile/[username]/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserProfile } from '@/components/profile/UserProfile'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { 
      OR: [
        { username: params.username },
        { id: params.username }
      ]
    },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
          prayers: true,
          quranProgress: true,
          goals: true
        }
      },
      posts: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      },
      goals: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      quranProgress: {
        take: 10,
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/dashboard')
  }

  // Check if current user is following this profile
  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: session.user.id,
      followingId: user.id
    }
  })

  // Calculate user stats
  const stats = await calculateUserStats(user.id)

  return (
    <UserProfile 
      user={user}
      currentUserId={session.user.id}
      isFollowing={!!isFollowing}
      stats={stats}
    />
  )
}

async function calculateUserStats(userId: string) {
  const [
    prayerStats,
    quranStats,
    streakData,
    achievements
  ] = await Promise.all([
    // Prayer statistics
    prisma.prayerTime.aggregate({
      where: { userId },
      _count: { id: true }
    }),

    // Quran statistics
    prisma.quranProgress.aggregate({
      where: { 
        userId,
        completed: true 
      },
      _count: { id: true },
      _sum: { duration: true }
    }),

    // Streak calculation
    calculatePrayerStreak(userId),

    // Achievements
    prisma.achievement.findMany({
      where: { userId }
    })
  ])

  return {
    totalPrayers: prayerStats._count.id * 5, // 5 prayers per day
    quranPages: quranStats._count.id,
    studyTime: quranStats._sum.duration || 0,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    achievements: achievements.length
  }
}

async function calculatePrayerStreak(userId: string) {
  const prayerTimes = await prisma.prayerTime.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 30
  })

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const prayersThatDay = prayerTimes.find(pt => 
      pt.date.toDateString() === date.toDateString()
    )
    
    if (prayersThatDay) {
      const prayersCount = [
        prayersThatDay.fajr, 
        prayersThatDay.dhuhr, 
        prayersThatDay.asr, 
        prayersThatDay.maghrib, 
        prayersThatDay.isha
      ].filter(Boolean).length
      
      if (prayersCount >= 3) {
        tempStreak++
        if (i === 0) currentStreak = tempStreak
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 0
      }
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 0
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak)
  
  return { currentStreak, longestStreak }
}
