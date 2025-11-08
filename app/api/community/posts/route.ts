// app/api/community/posts/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(auth)

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || 'all'

    let where: any = { isPublic: true }

    if (type === 'following' && session?.user?.id) {
      // Get posts from followed users
      const followedUsers = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true }
      })
      
      where.userId = {
        in: followedUsers.map(f => f.followingId)
      }
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              username: true,
              image: true
            }
          },
          likes: {
            where: { userId: session?.user?.id },
            select: { id: true }
          },
          bookmarks: {
            where: { userId: session?.user?.id },
            select: { id: true }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    const postsWithCounts = posts.map(post => ({
      ...post,
      likes: post._count.likes,
      comments: post._count.comments,
      isLiked: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0
    }))

    return NextResponse.json({
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Community posts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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
    const { content, image, isPublic = true, tags = [] } = body

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        content,
        image,
        isPublic,
        tags
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
