// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string;
  // 封面可能来自多个字段
  cover?: string;
  // 详情页用到的字段
  summary?: string;
  body?: any[];              // <-- 关键：明确为 any[]，给 RichText 用
  lineup?: string[];
  venue?: string;
  price?: string;
  ticketUrl?: string;
  ageRestriction?: string;
  doorsTime?: string;
  endTime?: string;
  gallery?: string[];
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
  summary?: string;
  body?: any[];
  lineup?: string[];
  venue?: string;
  price?: string;
  ticketUrl?: string;
  ageRestriction?: string;
  doorsTime?: string;
  endTime?: string;
  gallery?: string[];
};

// 统一映射
function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover,
    summary: d.summary,
    body: (d.body ?? []) as any[],
    lineup: d.lineup,
    venue: d.venue,
    price: d.price,
    ticketUrl: d.ticketUrl,
    ageRestriction: d.ageRestriction,
    doorsTime: d.doorsTime,
    endTime: d.endTime,
    gallery: d.gallery,
  };
}

// 兼容不同封面字段，同时把详情页会用到的字段都取出
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
  summary,
  body,
  lineup,
  venue,
  price,
  ticketUrl,
  ageRestriction,
  doorsTime,
  endTime,
  "gallery": gallery[].asset->url
`;

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

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const q = `*[_type == "event" && slug.current == $slug][0]{ ${EVENT_FIELDS} }`;
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return d ? mapEvent(d) : null;
}

/**
 * 临时 tables 数据（为避免构建时报 “getTables 未导出”）
 * 以后接入 Sanity 时，把这里换成真实查询即可。
 */
export type TableItem = {
  id: string;
  name: string;
  desc?: string;
  link?: string;
};

export async function getTables(): Promise<TableItem[]> {
  // 占位：返回空数组即可满足页面渲染
  return [];
  // 如果将来有 schema，可改成类似：
  // const q = `*[_type == "table"]{ _id, name, desc, link }`;
  // const rows = await client.fetch<any[]>(q);
  // return rows.map(r => ({ id: r._id, name: r.name, desc: r.desc, link: r.link }));
}
