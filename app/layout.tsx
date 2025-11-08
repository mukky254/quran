import './globals.css'

export const metadata = {
  title: 'Islamic Platform - Your Digital Ibadah Companion',
  description: 'Comprehensive Islamic platform featuring Quran, Prayer Times, Hadith, and Community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
