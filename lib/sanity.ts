// lib/sanity.ts
import { createClient, groq } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-07-01'

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export type EventDoc = {
  _id: string
  title?: string
  slug?: string | { current: string }
  date?: string
  cover?: string // 我们用 GROQ 投影为 URL
  body?: string
}

/** 未来活动（按日期升序），limit 可选 */
export async function getUpcomingEvents(limit = 20): Promise<EventDoc[]> {
  const query = groq`*[_type == "event"] | order(coalesce(date, now()) asc)[0...$limit]{
    _id,
    title,
    // 把 slug 投影为 string，兼容你 schema 的不同写法
    "slug": select(
      defined(slug.current) => slug.current,
      defined(slug) && slug match "*"
        => slug,
      null
    ),
    date,
    // cover 统一转成 URL（兼容 cover 或 mainImage 命名）
    "cover": coalesce(cover.asset->url, mainImage.asset->url)
  }`
  const data = await sanity.fetch<EventDoc[]>(query, { limit })
  return data
}

/** 详情 */
export async function getEventBySlug(slug: string): Promise<EventDoc | null> {
  const query = groq`*[_type == "event" && (
      slug.current == $slug || slug == $slug
    )][0]{
    _id, title, date,
    "slug": select(
      defined(slug.current) => slug.current,
      defined(slug) && slug match "*"
        => slug,
      null
    ),
    "cover": coalesce(cover.asset->url, mainImage.asset->url),
    body
  }`
  const data = await sanity.fetch<EventDoc | null>(query, { slug })
  return data
}
