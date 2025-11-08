// app/api/chat/route.ts

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
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    // Get user's chats
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: session.user.id }
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const formattedChats = chats.map(chat => ({
      id: chat.id,
      type: chat.type,
      name: chat.name || chat.participants
        .filter(p => p.userId !== session.user.id)
        .map(p => p.user.name)
        .join(', '),
      participants: chat.participants.map(p => ({
        ...p.user,
        isOnline: Math.random() > 0.5 // This would come from real-time status
      })),
      lastMessage: chat.messages[0] ? {
        id: chat.messages[0].id,
        content: chat.messages[0].content,
        timestamp: chat.messages[0].createdAt,
        isRead: chat.messages[0].isRead,
        isDelivered: chat.messages[0].isDelivered
      } : undefined,
      unreadCount: chat._count.messages
    }))

    return NextResponse.json(formattedChats)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
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
    const { action, chatId, participantIds, message } = body

    switch (action) {
      case 'create-chat':
        const chat = await prisma.chat.create({
          data: {
            type: participantIds.length > 1 ? 'group' : 'direct',
            name: body.name,
            participants: {
              create: [
                { userId: session.user.id },
                ...participantIds.map((id: string) => ({ userId: id }))
              ]
            }
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                  }
                }
              }
            }
          }
        })
        return NextResponse.json(chat)

      case 'send-message':
        const newMessage = await prisma.message.create({
          data: {
            chatId,
            senderId: session.user.id,
            content: message.content,
            type: message.type || 'text'
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })

        // Update chat's updatedAt
        await prisma.chat.update({
          where: { id: chatId },
          data: { updatedAt: new Date() }
        })

        return NextResponse.json(newMessage)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Chat action error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat action' },
      { status: 500 }
    )
  }
}
