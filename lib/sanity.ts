// lib/sanity.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

/* ---------- Event types ---------- */
export type EventDoc = {
  _id: string
  slug?: { current: string } | string
  title?: string
  date?: string
  cover?: string
  venue?: string
  doorsTime?: string
  endTime?: string
  ageRestriction?: string
  price?: string
  ticketUrl?: string
  lineup?: string[]
  summary?: string
}

export type EventItem = {
  id: string
  slug: string
  title: string
  date?: string
  cover?: string
  venue?: string
  doorsTime?: string
  endTime?: string
  ageRestriction?: string
  price?: string
  ticketUrl?: string
  lineup?: string[]
  summary?: string
}

// 将 Sanity 文档→前端数据做统一映射
function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover,
    venue: d.venue,
    doorsTime: d.doorsTime,
    endTime: d.endTime,
    ageRestriction: d.ageRestriction,
    price: d.price,
    ticketUrl: d.ticketUrl,
    lineup: d.lineup,
    summary: d.summary,
  }
}

// 兼容不同图片字段：cover/mainImage/image/poster
const EVENT_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  venue,
  doorsTime,
  endTime,
  ageRestriction,
  price,
  ticketUrl,
  lineup,
  summary,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`

/** 获取最近的活动（用于首页 & What's On 列表） */
export async function getUpcomingEvents(limit = 20): Promise<EventItem[]> {
  const query = `
    *[_type == "event"]
      | order(coalesce(date, _createdAt) desc)[0...$limit]{
        ${EVENT_FIELDS}
      }
  `
  const docs = await client.fetch<EventDoc[]>(
    query,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } },
  )
  return docs.map(mapEvent)
}

/** 根据 slug 获取活动详情 */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const query = `*[_type == "event" && slug.current == $slug][0]{ ${EVENT_FIELDS} }`
  const d = await client.fetch<EventDoc | null>(
    query,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } },
  )
  return d ? mapEvent(d) : null
}

/* ---------- Tables (包厢/桌位) ---------- */
export type TableDoc = {
  _id: string
  slug?: { current: string } | string
  title?: string
  cover?: string
  description?: string
}

export type TableItem = {
  id: string
  slug: string
  title: string
  cover?: string
  description?: string
}

function mapTable(d: TableDoc): TableItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    cover: d.cover,
    description: d.description,
  }
}

const TABLE_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  description,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`

/** 获取桌位列表（供 /tables 使用） */
export async function getTables(): Promise<TableItem[]> {
  const query = `*[_type == "table"]|order(_createdAt desc){ ${TABLE_FIELDS} }`
  const docs = await client.fetch<TableDoc[]>(
    query,
    {},
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } },
  )
  return docs.map(mapTable)
}

/** 获取单个桌位（供 /tables/[slug] 使用） */
export async function getTableBySlug(slug: string): Promise<TableItem | null> {
  const query = `*[_type == "table" && slug.current == $slug][0]{ ${TABLE_FIELDS} }`
  const d = await client.fetch<TableDoc | null>(
    query,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } },
  )
  return d ? mapTable(d) : null
}
