// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

/* =========================
 * Types
 * =======================*/
export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string;
  // 兼容多种封面字段
  cover?: string;
  mainImage?: { asset?: { url?: string } };
  image?: { asset?: { url?: string } };
  poster?: { asset?: { url?: string } };

  // 详情页可能用到的字段
  summary?: string;
  body?: any;
  venue?: string;
  ticketUrl?: string;
  lineup?: string[];
  doorsTime?: string;
  endTime?: string;
  ageRestriction?: string;
  price?: string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;

  // 详情可选字段（页面中用到的做可选，避免类型报错）
  summary?: string;
  body?: any;
  venue?: string;
  ticketUrl?: string;
  lineup?: string[];
  doorsTime?: string;
  endTime?: string;
  ageRestriction?: string;
  price?: string;
};

/* =========================
 * Field fragments
 * =======================*/

// 列表/卡片用的轻量字段
const EVENT_CARD_FIELDS = `
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

// 详情页用的完整字段
const EVENT_DETAIL_FIELDS = `
  ${EVENT_CARD_FIELDS},
  summary,
  body,
  venue,
  ticketUrl,
  lineup,
  doorsTime,
  endTime,
  ageRestriction,
  price
`;

/* =========================
 * Mapping
 * =======================*/
function toEventItem(d: EventDoc): EventItem {
  const slug =
    typeof d.slug === 'string' ? d.slug : d.slug?.current || '';

  // 优先使用 coalesce 后的 cover；若未计算，则兜底从其它字段取
  const cover =
    d.cover ||
    d.mainImage?.asset?.url ||
    d.image?.asset?.url ||
    d.poster?.asset?.url ||
    undefined;

  return {
    id: d._id,
    slug,
    title: d.title || 'Untitled',
    date: d.date,
    cover,
    summary: d.summary,
    body: d.body,
    venue: d.venue,
    ticketUrl: d.ticketUrl,
    lineup: d.lineup,
    doorsTime: d.doorsTime,
    endTime: d.endTime,
    ageRestriction: d.ageRestriction,
    price: d.price,
  };
}

/* =========================
 * Queries
 * =======================*/

// 首页/列表：取若干条（倒序）
export async function getUpcomingEvents(limit = 20): Promise<EventItem[]> {
  const q = `
    *[_type == "event"]
      | order(coalesce(date, _createdAt) desc)[0...$limit]{
        ${EVENT_CARD_FIELDS}
      }
  `;
  const docs = await client.fetch<EventDoc[]>(
    q,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return docs.map(toEventItem);
}

// 详情：按 slug 取完整字段
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const q = `
    *[_type == "event" && coalesce(slug.current, slug) == $slug][0]{
      ${EVENT_DETAIL_FIELDS}
    }
  `;
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return d ? toEventItem(d) : null;
}

