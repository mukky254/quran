// app/quran/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { QuranReader } from '@/components/quran/QuranReader'

export default async function QuranPage() {
  const session = await getServerSession(auth)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return <QuranReader />
}
