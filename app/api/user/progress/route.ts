// app/api/user/progress/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [prayerStats, quranStats, goalStats] = await Promise.all([
      // Prayer statistics
      prisma.prayerTime.aggregate({
        where: { userId: session.user.id },
        _count: { id: true },
        _avg: { 
          // You can add prayer completion calculations here
        }
      }),

      // Quran statistics
      prisma.quranProgress.aggregate({
        where: { 
          userId: session.user.id,
          completed: true 
        },
        _count: { id: true },
        _sum: { duration: true }
      }),

      // Goal statistics
      prisma.goal.aggregate({
        where: { userId: session.user.id },
        _count: { id: true },
        _avg: { current: true, target: true }
      })
    ])

    return NextResponse.json({
      prayers: prayerStats,
      quran: quranStats,
      goals: goalStats
    })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}
