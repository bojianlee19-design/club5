// lib/sanity.ts
import { createClient } from '@sanity/client';

// ---- Env ----
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01';

// 生产用 CDN，避免 429；本地你也可以设为 false
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // token: process.env.SANITY_READ_TOKEN, // 只有需要读草稿时才要
});

// ---- Types (统一 slug=>string, cover=>string|undefined) ----
export type EventDoc = {
  _id: string;
  title: string;
  date?: string;
  slug: string;      // 已经在查询里转成字符串
  cover?: string;    // 图片直链
};

export type EventDetail = EventDoc & {
  description?: string;
  body?: unknown;
  // 按你 schema 需要可继续加字段
};

// ---- GROQ（用普通字符串，避免额外依赖）----
const commonFields = `
  _id,
  title,
  date,
  "slug": slug.current,
  // 多字段兜底，按你 schema 改名即可
  "cover": coalesce(cover.asset->url, poster.asset->url, image.asset->url)
`;

// 未来活动（或无日期）优先；如果你只想要未来活动，把 !defined(date) 去掉即可
const UPCOMING_QUERY = `
*[_type == "event" && defined(slug.current) && (date >= now() || !defined(date))]
| order(date asc)[0...$limit]{
  ${commonFields}
}
`;

// 详情
const BY_SLUG_QUERY = `
*[_type == "event" && slug.current == $slug][0]{
  ${commonFields},
  description,
  body
}
`;

// ---- API ----

// 供首页滚动/列表页使用
export async function getUpcomingEvents(limit = 12): Promise<EventDoc[]> {
  const res = await sanityClient.fetch<EventDoc[]>(
    UPCOMING_QUERY,
    { limit },
    { cache: 'no-store' } // 避免旧缓存；也可用 next: { revalidate: 60 }
  );
  // 兜底：过滤掉没有 slug 的
  return (res || []).filter(e => !!e?.slug);
}

// 兼容之前代码里用到的名字（实为别名）
export const getEvents = getUpcomingEvents;

// 详情页
export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  if (!slug) return null;
  const res = await sanityClient.fetch<EventDetail>(
    BY_SLUG_QUERY,
    { slug },
    { cache: 'no-store' }
  );
  return res ?? null;
}
