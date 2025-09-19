// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

/** ------------ Events: types & helpers ------------ */
export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string; // ISO datetime
  cover?: string; // final URL after GROQ coalesce
  // 详情页可能用到的字段（可选）
  doorsTime?: string;
  endTime?: string;
  venue?: string;
  ageRestriction?: string;
  price?: string;
  ticketUrl?: string;
  lineup?: string[];
  summary?: string;
  gallery?: { asset?: { _ref?: string; url?: string } }[];
  body?: any[];
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

const mapEvent = (d: EventDoc): EventItem => ({
  id: d._id,
  slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
  title: d.title || 'Untitled',
  date: d.date,
  cover: d.cover,
});

// 统一封面字段：cover / mainImage / image / poster
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
  ),
  doorsTime,
  endTime,
  venue,
  ageRestriction,
  price,
  ticketUrl,
  lineup,
  summary,
  gallery[],
  body
`;

/** 最近/全部活动（按日期或创建时间倒序） */
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

/** 通过 slug 获取单个活动 */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const q = `*[_type == "event" && slug.current == $slug][0]{ ${EVENT_FIELDS} }`;
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return d ? mapEvent(d) : null;
}

/** 用于 “Select Dates” 过滤：获取某个时间段内的活动（含当天，按日期升序） */
export async function getEventsBetween(opts: {
  startISO?: string; // 仅开始
  endISO?: string;   // 仅结束
} = {}): Promise<EventItem[]> {
  const { startISO, endISO } = opts;

  // 根据传参拼接条件
  const where =
    startISO && endISO
      ? `date >= $startISO && date <= $endISO`
      : startISO
      ? `date >= $startISO`
      : endISO
      ? `date <= $endISO`
      : `true`;

  const q = `
    *[_type == "event" && ${where}]
      | order(date asc){
        ${EVENT_FIELDS}
      }
  `;

  const docs = await client.fetch<EventDoc[]>(
    q,
    { startISO, endISO },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return docs.map(mapEvent);
}

/** （可选）获取全部活动，给管理/统计用 */
export async function getAllEvents(): Promise<EventItem[]> {
  const q = `*[_type == "event"] | order(coalesce(date, _createdAt) desc){ ${EVENT_FIELDS} }`;
  const docs = await client.fetch<EventDoc[]>(
    q,
    {},
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return docs.map(mapEvent);
}

/** ------------ (预留) Tables: types ------------ */
/* 只是类型，没导出函数；不会影响现有功能 */
export type TableDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  price?: string;
  capacity?: number;
  cover?: string;
};

export type TableItem = {
  id: string;
  slug: string;
  title: string;
  price?: string;
  capacity?: number;
  cover?: string;
};
