// lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  ''
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production'
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  '2024-05-01'
const token = process.env.SANITY_READ_TOKEN // 可选：私有数据读取

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token,
  perspective: 'published',
})

const builder = imageUrlBuilder({ projectId, dataset })

export function urlFor(src: any, width = 1200): string | undefined {
  try {
    if (!src) return undefined
    if (typeof src === 'string') return src
    return builder.image(src).width(width).auto('format').url()
  } catch {
    return undefined
  }
}

export type EventDoc = {
  _id: string
  slug?: { current: string } | string
  title?: string
  date?: string
  cover?: any // Sanity image object or string URL
  summary?: string
  [key: string]: any
}

export type EventItem = {
  id: string
  slug: string
  title: string
  date?: string
  cover?: string
}

export function flattenSlug(s?: { current: string } | string): string {
  if (!s) return ''
  return typeof s === 'string' ? s : s.current || ''
}

export function toEventItem(d: EventDoc): EventItem {
  return {
    id: d._id || flattenSlug(d.slug) || (d.title ?? ''),
    slug: flattenSlug(d.slug),
    title: d.title ?? '',
    date: d.date,
    cover: urlFor(d.cover, 1600),
  }
}

const EVENT_FIELDS = `
  _id,
  title,
  "slug": slug,
  date,
  cover,
  summary
`

/**
 * 未来/即将到来的活动（或没有日期的也会排在后面）
 */
export async function getUpcomingEvents(limit: number = 12): Promise<EventDoc[]> {
  const now = new Date().toISOString()
  const query = `*[_type == "event" && (date >= $now || !defined(date))] 
    | order(coalesce(date, now()) asc)[0...$limit]{${EVENT_FIELDS}}`
  return sanityClient.fetch(query, { now, limit })
}

/**
 * 所有活动（按时间正序）
 */
export async function getEvents(limit: number = 24): Promise<EventDoc[]> {
  const query = `*[_type == "event"] 
    | order(coalesce(date, now()) asc)[0...$limit]{${EVENT_FIELDS}}`
  return sanityClient.fetch(query, { limit })
}

/**
 * 根据 slug 获取单条活动
 */
export async function getEventBySlug(slug: string): Promise<EventDoc | null> {
  const query = `*[_type == "event" && slug.current == $slug][0]{${EVENT_FIELDS}, body}`
  return sanityClient.fetch(query, { slug })
}

// 兼容旧命名
export const fetchEvents = getEvents
export const fetchEventBySlug = getEventBySlug
