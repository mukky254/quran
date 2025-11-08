// app/api/prayer-times/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(auth)

  try {
    const { searchParams } = new URL(request.url)
    const latitude = searchParams.get('lat')
    const longitude = searchParams.get('lng')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Location required' }, { status: 400 })
    }

    // Fetch from Aladhan API
    const response = await fetch(
      `http://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch prayer times')
    }

    const data = await response.json()

    // Save to database if user is authenticated
    if (session?.user?.id) {
      await prisma.prayerTime.upsert({
        where: {
          userId_date: {
            userId: session.user.id,
            date: new Date(date),
          },
        },
        update: {
          fajr: data.data.timings.Fajr,
          sunrise: data.data.timings.Sunrise,
          dhuhr: data.data.timings.Dhuhr,
          asr: data.data.timings.Asr,
          maghrib: data.data.timings.Maghrib,
          isha: data.data.timings.Isha,
          location: `${latitude},${longitude}`,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        create: {
          userId: session.user.id,
          date: new Date(date),
          fajr: data.data.timings.Fajr,
          sunrise: data.data.timings.Sunrise,
          dhuhr: data.data.timings.Dhuhr,
          asr: data.data.timings.Asr,
          maghrib: data.data.timings.Maghrib,
          isha: data.data.timings.Isha,
          location: `${latitude},${longitude}`,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      })
    }

    return NextResponse.json({
      ...data.data,
      location: { latitude, longitude },
    })
  } catch (error) {
    console.error('Prayer times error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prayer times' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { date, fajr, dhuhr, asr, maghrib, isha, location, latitude, longitude } = body

    const prayerTime = await prisma.prayerTime.upsert({
      where: {
        userId_date: {
          userId: session.user.id,
          date: new Date(date),
        },
      },
      update: {
        fajr,
        dhuhr,
        asr,
        maghrib,
        isha,
        location,
        latitude,
        longitude,
      },
      create: {
        userId: session.user.id,
        date: new Date(date),
        fajr,
        dhuhr,
        asr,
        maghrib,
        isha,
        location,
        latitude,
        longitude,
      },
    })

    return NextResponse.json(prayerTime)
  } catch (error) {
    console.error('Save prayer times error:', error)
    return NextResponse.json(
      { error: 'Failed to save prayer times' },
      { status: 500 }
    )
  }
}
