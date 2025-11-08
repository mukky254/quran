// app/hadith/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { HadithLibrary } from '@/components/hadith/HadithLibrary'

export default async function HadithPage() {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return <HadithLibrary />
}
