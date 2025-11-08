// app/api/quran/route.ts

import { NextRequest, NextResponse } from 'next/server'

const QURAN_API = 'https://api.alquran.cloud/v1'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const surah = searchParams.get('surah')
    const ayah = searchParams.get('ayah')
    const edition = searchParams.get('edition') || 'en.asad'

    if (surah && ayah) {
      // Specific ayah
      const response = await fetch(
        `${QURAN_API}/ayah/${surah}:${ayah}/${edition}`
      )
      const data = await response.json()
      return NextResponse.json(data)
    } else if (surah) {
      // Entire surah
      const response = await fetch(
        `${QURAN_API}/surah/${surah}/${edition}`
      )
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      // All surahs
      const response = await fetch(`${QURAN_API}/surah`)
      const data = await response.json()
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('Quran API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Quran data' },
      { status: 500 }
    )
  }
}

// Additional endpoints for specific functionalities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'search':
        const searchResponse = await fetch(
          `${QURAN_API}/search/${data.query}/all/${data.edition || 'en.asad'}`
        )
        const searchData = await searchResponse.json()
        return NextResponse.json(searchData)

      case 'juz':
        const juzResponse = await fetch(
          `${QURAN_API}/juz/${data.juz}/${data.edition || 'en.asad'}`
        )
        const juzData = await juzResponse.json()
        return NextResponse.json(juzData)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Quran API POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
