// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

/** --- Sanity 原始文档 --- */
export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string;
  cover?: string;
  // 详情页可能用到的字段（都可选）
  summary?: string;
  body?: unknown[];          // Portable Text
  venue?: string;
  doorsTime?: string;
  endTime?: string;
  ageRestriction?: string;
  price?: string;
  ticketUrl?: string;
  lineup?: string[];
  gallery?: string[];
};

/** --- 前端统一使用的类型（列表/详情通用，详情字段为可选） --- */
export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;

  // 详情页可用（列表查询不会取这些，但类型上允许存在）
  summary?: string;
  body?: unknown[];
  venue?: string;
  doorsTime?: string;
  endTime?: string;
  ageRestriction?: string;
  price?: string;
  ticketUrl?: string;
  lineup?: string[];
  gallery?: string[];
};

/** 统一映射函数 */
function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover,

    summary: d.summary,
    body: d.body,
    venue: d.venue,
    doorsTime: d.doorsTime,
    endTime: d.endTime,
    ageRestriction: d.ageRestriction,
    price: d.price,
    ticketUrl: d.ticketUrl,
    lineup: d.lineup,
    gallery: d.gallery,
  };
}

/** 封面字段兼容：cover / mainImage / image / poster */
const COVER_EXPR = `
  coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`;

/** 列表用的轻量字段（首页/列表页） */
const EVENT_FIELDS_LIST = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  "cover": ${COVER_EXPR}
`;

/** 详情页用的完整字段 */
const EVENT_FIELDS_DETAIL = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  date,
  "cover": ${COVER_EXPR},
  summary,
  body,
  venue,
  doorsTime,
  endTime,
  ageRestriction,
  price,
  ticketUrl,
  lineup[],
  "gallery": coalesce(
    gallery[].asset->url,
    []
  )
`;

/** 获取最近活动（用于首页、列表） */
export async function getUpcomingEvents(limit = 20): Promise<EventItem[]> {
  const q = `
    *[_type == "event"]
      | order(coalesce(date, _createdAt) desc)[0...$limit]{
        ${EVENT_FIELDS_LIST}
      }
  `;
  const docs = await client.fetch<EventDoc[]>(
    q,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return docs.map(mapEvent);
}

/** 根据 slug 获取单条活动（用于详情页） */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const q = `*[_type == "event" && slug.current == $slug][0]{ ${EVENT_FIELDS_DETAIL} }`;
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return d ? mapEvent(d) : null;
}
// -------------------------------
// Tables helpers (add below events helpers)
// -------------------------------

export type TableDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  price?: string;          // 自由文本，如 "from £300"
  minSpend?: string;       // 可选
  description?: string;    // 可选
  cover?: string;          // 统一映射后的图片 URL
  image?: { asset?: { url?: string } }; // 兼容旧字段
  mainImage?: { asset?: { url?: string } };
  poster?: { asset?: { url?: string } };
};

export type TableItem = {
  id: string;
  slug: string;
  title: string;
  price?: string;
  minSpend?: string;
  description?: string;
  cover?: string;
};

function mapTable(d: TableDoc): TableItem {
  const slug =
    typeof d.slug === 'string' ? d.slug : d.slug?.current || '';
  // 与 Event 一样做封面字段兼容
  const cover =
    d.cover ||
    d.mainImage?.asset?.url ||
    d.image?.asset?.url ||
    d.poster?.asset?.url;

  return {
    id: d._id,
    slug,
    title: d.title || 'Untitled',
    price: d.price,
    minSpend: d.minSpend,
    description: d.description,
    cover,
  };
}

// 统一字段选择（尽量兼容不同历史字段名）
const TABLE_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  price,
  minSpend,
  description,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`;

// 列表：按创建时间倒序（可按需改 order）
export async function getTables(limit = 50): Promise<TableItem[]> {
  const q = `
    *[_type == "table"]
      | order(_createdAt desc)[0...$limit]{
        ${TABLE_FIELDS}
      }
  `;
  const docs = await client.fetch<TableDoc[]>(
    q,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } }
  );
  return docs.map(mapTable);
}

// 详情
export async function getTableBySlug(slug: string): Promise<TableItem | null> {
  const q = `*[_type == "table" && slug.current == $slug][0]{ ${TABLE_FIELDS} }`;
  const doc = await client.fetch<TableDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } }
  );
  return doc ? mapTable(doc) : null;
}
