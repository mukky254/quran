// app/dashboard/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { PrayerTracker } from '@/components/dashboard/PrayerTracker'
import { QuranProgress } from '@/components/dashboard/QuranProgress'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { GoalsWidget } from '@/components/dashboard/GoalsWidget'
import { CommunityFeed } from '@/components/dashboard/CommunityFeed'

export default async function Dashboard() {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch user data in parallel
  const [user, prayerTimes, quranProgress, goals, recentActivities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            prayers: true,
            bookmarks: true,
            notes: true,
          }
        }
      }
    }),
    prisma.prayerTime.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.quranProgress.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.goal.findMany({
      where: { 
        userId: session.user.id,
        completed: false 
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.activity.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, image: true }
        }
      }
    }),
  ])

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <DashboardHeader user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <StatsOverview 
              user={user}
              prayerTimes={prayerTimes}
              quranProgress={quranProgress}
            />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PrayerTracker prayerTimes={prayerTimes} />
              <QuranProgress progress={quranProgress} />
            </div>

            <CommunityFeed />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <GoalsWidget goals={goals} />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  )
}
