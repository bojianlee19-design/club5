// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// ---- 列表卡片用的轻量类型（供首页 /events 列表） ----
export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string;
  cover?: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

// 统一映射
function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover,
  };
}

// 卡片需要的字段
const EVENT_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`;

// 首页 / 列表
export async function getUpcomingEvents(limit = 20): Promise<EventItem[]> {
  const q = `
    *[_type == "event"]
      | order(coalesce(date, _createdAt) desc)[0...$limit]{
        ${EVENT_FIELDS}
      }
  `;
  const docs = await client.fetch<EventDoc[]>(
    q,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return docs.map(mapEvent);
}

// ---- 详情页用的完整类型与查询 ----
export type EventDetail = EventItem & {
  summary?: string;
  ageRestriction?: string;
  venue?: string;
  doorsTime?: string;
  endTime?: string;
  price?: string;
  ticketUrl?: string;
  lineup?: string[];
  gallery?: { url: string }[];
  body?: any[]; // 富文本（不引入额外包，这里用简易渲染）
};

// 详情页需要的字段
const EVENT_DETAIL_FIELDS = `
  ${EVENT_FIELDS},
  summary,
  ageRestriction,
  venue,
  doorsTime,
  endTime,
  price,
  ticketUrl,
  lineup,
  "gallery": gallery[]{ "url": asset->url },
  body
`;

// 详情页查询
export async function getEventDetailBySlug(slug: string): Promise<EventDetail | null> {
  const q = `*[_type == "event" && slug.current == $slug][0]{ ${EVENT_DETAIL_FIELDS} }`;
  const d = await client.fetch<any | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  if (!d) return null;
  const base = mapEvent(d as EventDoc);
  return {
    ...base,
    summary: d.summary || undefined,
    ageRestriction: d.ageRestriction || undefined,
    venue: d.venue || undefined,
    doorsTime: d.doorsTime || undefined,
    endTime: d.endTime || undefined,
    price: d.price || undefined,
    ticketUrl: d.ticketUrl || undefined,
    lineup: Array.isArray(d.lineup) ? d.lineup : undefined,
    gallery: Array.isArray(d.gallery) ? d.gallery : undefined,
    body: Array.isArray(d.body) ? d.body : undefined,
  };
}
