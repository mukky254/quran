// app/community/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { CommunityFeed } from '@/components/community/CommunityFeed'

export default async function CommunityPage() {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return <CommunityFeed />
}
