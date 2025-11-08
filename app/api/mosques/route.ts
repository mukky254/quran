// app/api/mosques/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '50') // km
    const search = searchParams.get('search')
    const amenities = searchParams.get('amenities')?.split(',')

    let where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (amenities && amenities.length > 0) {
      where.amenities = { hasEvery: amenities }
    }

    // If coordinates provided, we'd calculate distance
    // This is a simplified version - in production you'd use PostGIS or similar
    const mosques = await prisma.mosque.findMany({
      where,
      include: {
        events: {
          where: {
            startDate: { gte: new Date() }
          },
          take: 3,
          orderBy: { startDate: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(mosques)
  } catch (error) {
    console.error('Mosques API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mosques' },
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
    const { action, mosqueId } = body

    switch (action) {
      case 'bookmark':
        const existingBookmark = await prisma.bookmark.findFirst({
          where: {
            userId: session.user.id,
            itemId: mosqueId,
            type: 'MOSQUE'
          }
        })

        if (existingBookmark) {
          await prisma.bookmark.delete({
            where: { id: existingBookmark.id }
          })
          return NextResponse.json({ bookmarked: false })
        } else {
          await prisma.bookmark.create({
            data: {
              userId: session.user.id,
              type: 'MOSQUE',
              itemId: mosqueId
            }
          })
          return NextResponse.json({ bookmarked: true })
        }

      case 'add-review':
        // Add review logic
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Mosque action error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
