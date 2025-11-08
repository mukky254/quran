import './globals.css'
import { Inter, Amiri, Lateef } from 'next/font/google'
import { Providers } from './providers'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
  display: 'swap'
})

const lateef = Lateef({
  weight: ['400', '600'],
  subsets: ['arabic'],
  variable: '--font-lateef',
  display: 'swap'
})

export const metadata = {
  title: 'Comprehensive Islamic Platform - Your Digital Ibadah Companion',
  description: 'All-in-one Islamic platform featuring Quran, Prayer Times, Hadith, Islamic Knowledge, and Community Tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable} ${lateef.vateef} scroll-smooth`}>
      <body className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
