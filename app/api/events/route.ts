// app/api/events/route.ts
import { NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity'

// 每 60 秒再生成（如果你用 SSG）
export const revalidate = 60

export async function GET() {
  try {
    // 若没配置 Sanity，直接返回空数组，组件会显示占位文案
    const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    if (!pid || !dataset) {
      return NextResponse.json([])
    }

    // 取 20 条最近活动，字段尽量通用
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
    // 返回 200 + 空数组，前端友好处理
    return NextResponse.json([])
  }
}
