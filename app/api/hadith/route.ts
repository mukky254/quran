// app/api/hadith/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(auth)

  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get('collection')
    const book = searchParams.get('book')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let where: any = {}

    if (collection) {
      where.collection = collection
    }

    if (book) {
      where.book = book
    }

    if (search) {
      where.OR = [
        { arabic: { contains: search, mode: 'insensitive' } },
        { english: { contains: search, mode: 'insensitive' } },
        { narrator: { contains: search, mode: 'insensitive' } },
        { topics: { has: search } }
      ]
    }

    const [hadiths, total] = await Promise.all([
      prisma.hadith.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { hadithNumber: 'asc' }
      }),
      prisma.hadith.count({ where })
    ])

    return NextResponse.json({
      hadiths,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Hadith API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hadith data' },
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
    const { action, hadithId } = body

    switch (action) {
      case 'bookmark':
        // Toggle bookmark
        const existingBookmark = await prisma.bookmark.findFirst({
          where: {
            userId: session.user.id,
            itemId: hadithId,
            type: 'HADITH'
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
              type: 'HADITH',
              itemId: hadithId
            }
          })
          return NextResponse.json({ bookmarked: true })
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Hadith action error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
