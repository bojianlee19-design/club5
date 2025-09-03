// app/api/events/route.ts
import { NextResponse } from 'next/server'
import { getUpcomingEvents } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// GET /api/events
export async function GET() {
  try {
    const docs: any[] = await getUpcomingEvents()

    const events = docs.map((d: any) => ({
      id: d._id ?? d.id ?? '',
      slug: typeof d.slug === 'string' ? d.slug : d.slug?.current ?? '',
      title: d.title ?? '',
      date: d.date ?? null,
      cover: d.cover ?? null,
    }))

    return NextResponse.json({ events }, { status: 200 })
  } catch (err) {
    console.error('GET /api/events failed:', err)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
