// lib/sanity.ts
import { createClient } from 'next-sanity'

// —— Sanity Client ————————————————————————————————————————————
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// —— 类型（保持与你现有使用兼容） ——————————————————————————————
export type EventDoc = {
  _id: string
  slug?: { current: string } | string
  title?: string
  date?: string
  cover?: string
  // 兼容不同封面字段（映射时统一到 cover）
  mainImage?: { asset?: { url?: string } }
  image?: { asset?: { url?: string } }
  poster?: { asset?: { url?: string } }
  // 新增：用于 Refine 的风格标签
  genres?: string[]
}

export type EventItem = {
  id: string
  slug: string
  title: string
  date?: string
  cover?: string
  genres?: string[]
}

// —— 统一字段与映射 ————————————————————————————————————————
const EVENT_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  genres,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`

function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover ||
      d.mainImage?.asset?.url ||
      d.image?.asset?.url ||
      d.poster?.asset?.url,
    genres: d.genres || [],
  }
}

// —— 查询参数与工具 ————————————————————————————————————————
export type GetEventsOptions = {
  limit?: number
  range?: 'all' | 'week' | 'month'
  from?: string // YYYY-MM-DD
  to?: string   // YYYY-MM-DD
  genres?: string[] // 多选
}

// 计算日期区间
function getRangeDates(range?: 'all' | 'week' | 'month') {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const isoDate = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`

  if (range === 'week') {
    const to = new Date(now)
    to.setUTCDate(now.getUTCDate() + 7)
    return { from: isoDate(now), to: isoDate(to) }
  }
  if (range === 'month') {
    const to = new Date(now)
    to.setUTCMonth(now.getUTCMonth() + 1)
    return { from: isoDate(now), to: isoDate(to) }
  }
  return {}
}

// —— 列表：支持筛选（兼容旧签名） ————————————————————————————
export async function getUpcomingEvents(
  arg?: number | GetEventsOptions
): Promise<EventItem[]> {
  const opts: GetEventsOptions =
    typeof arg === 'number' ? { limit: arg } : (arg || {})

  const limit = typeof opts.limit === 'number' ? opts.limit : 60

  // 计算最终 from/to
  let from = opts.from
  let to = opts.to
  if (opts.range && (!from || !to)) {
    const r = getRangeDates(opts.range)
    from = from || r.from
    to = to || r.to
  }

  // 组装 GROQ 条件
  const conds: string[] = ['_type == "event"']
  // 只取未来或未填写日期的活动可按需修改：这里不过滤历史，交给 range/from/to 控制
  if (from) conds.push(`defined(date) && date >= $from`)
  if (to) conds.push(`defined(date) && date < $to`)
  if (opts.genres && opts.genres.length > 0) {
    // 只要包含任意一个所选风格
    conds.push(`count(genres[@ in $genres]) > 0`)
  }

  const where = conds.length ? `*[${conds.join(' && ')}]` : `*[]`

  const query = `
    ${where}
    | order(coalesce(date, _createdAt) asc)[0...$limit]{
      ${EVENT_FIELDS}
    }
  `

  const params: Record<string, any> = { limit }
  if (from) params.from = from
  if (to) params.to = to
  if (opts.genres && opts.genres.length > 0) params.genres = opts.genres

  const docs = await client.fetch<EventDoc[]>(
    query,
    params,
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  )
  return docs.map(mapEvent)
}

// —— 兼容历史导出名（你项目以前有地方 import getEvents） ———————
export const getEvents = (limit = 100) => getUpcomingEvents({ limit })

// —— 详情 ————————————————————————————————————————————————
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const q = `*[_type == "event" && coalesce(slug.current, slug) == $slug][0]{ ${EVENT_FIELDS} }`
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  )
  return d ? mapEvent(d) : null
}

// —— 取所有可用的 genres（用于 Refine 下拉） ——————————————
export async function getAllGenres(): Promise<string[]> {
  const q = `array::unique(*[_type=="event" && defined(genres)].genres[])|order(@ asc)`
  const list = await client.fetch<string[]>(
    q,
    {},
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  )
  return list || []
}
