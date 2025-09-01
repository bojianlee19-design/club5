// app/api/events/route.ts
import { NextResponse } from 'next/server'
import { sanityFetch } from '../../../lib/sanity'  // ← 相对路径，确保可解析

export const revalidate = 60

export async function GET() {
  try {
    const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    if (!pid || !dataset) return NextResponse.json([])

    const query = `
      *[_type == "event"] | order(coalesce(date, startDate, datetime) asc)[0...20]{
        "id": _id,
        title,
        "slug": coalesce(slug.current, _id),
        "date": coalesce(date, startDate, datetime),
        "imageUrl": coalesce(mainImage.asset->url, poster.asset->url, cover.asset->url)
      }
    `
    const list = await sanityFetch<any[]>(query)
    return NextResponse.json(list ?? [])
  } catch (e) {
    console.error('[api/events] error:', e)
    return NextResponse.json([])
  }
}
