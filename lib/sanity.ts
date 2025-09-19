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

/* =========================
// —— Tables —— 追加到 lib/sanity.ts 末尾（保留你已有的 Events 代码）
// 类型：Sanity 原始文档
export type TableDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  price?: string;                // 自由文本价格
  summary?: string;              // 简述
  perks?: string[];              // 权益列表
  capacity?: string;             // 可选：人数/容量
  cover?: string;                // 兜底后的主图 URL（下方 GROQ 会映射出来）
  gallery?: string[];            // 兜底后的图集 URL 数组
};

// 类型：供前端页面使用的干净结构
export type TableItem = {
  id: string;
  slug: string;
  title: string;
  price?: string;
  summary?: string;
  perks?: string[];
  capacity?: string;
  cover?: string;
  gallery?: string[];
};

// 统一映射（把可能为 undefined 的字段做兜底）
function mapTable(d: TableDoc): TableItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    price: d.price,
    summary: d.summary,
    perks: d.perks,
    capacity: d.capacity,
    cover: d.cover,
    gallery: d.gallery,
  };
}

// 兼容不同图片字段名：cover / mainImage / image / poster / gallery[]
const TABLE_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  price,
  summary,
  perks,
  capacity,
  // 主图 URL 兜底
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  ),
  // 图集 URL 兜底（若 schema 用 gallery: [{image}] 或 images: [{image}] 都尝试取）
  "gallery": coalesce(
    gallery[].asset->url,
    images[].asset->url
  )
`;

// 列表：取所有桌位产品（或按需求限制数量/排序）
export async function getTables(limit = 50): Promise<TableItem[]> {
  const q = `
    *[_type == "table"] 
      | order(title asc)[0...$limit]{
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

// 详情：通过 slug 取单个桌位产品
export async function getTableBySlug(slug: string): Promise<TableItem | null> {
  const q = `*[_type == "table" && slug.current == $slug][0]{ ${TABLE_FIELDS} }`;
  const d = await client.fetch<TableDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } }
  );
  return d ? mapTable(d) : null;
}
