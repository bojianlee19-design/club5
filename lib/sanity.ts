// lib/sanity.ts
import { createClient, groq } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export type EventDoc = {
  _id: string;
  title: string;
  slug?: { current: string };
  date?: string;
  /** 我们同时提供两个字段，以兼容不同组件的使用 */
  coverUrl?: string; // 新字段
  cover?: string;    // 兼容旧组件用到的 ev.cover
  description?: string;
  lineup?: string[];
};

/** 所有活动（按日期升序） */
export async function getEvents(): Promise<EventDoc[]> {
  const q = groq`*[_type == "event"] | order(date asc){
    _id,
    title,
    slug,
    date,
    // 同时返回 coverUrl 与 cover，指向同一个 asset url
    "coverUrl": coalesce(coverImage.asset->url, image.asset->url),
    "cover":    coalesce(coverImage.asset->url, image.asset->url)
  }`;
  return await client.fetch(q);
}

/** 仅未来活动（homepage/what's on 常用） */
export async function getUpcomingEvents(): Promise<EventDoc[]> {
  const q = groq`*[_type == "event" && defined(date) && dateTime(date) >= dateTime(now())]
    | order(date asc){
      _id,
      title,
      slug,
      date,
      "coverUrl": coalesce(coverImage.asset->url, image.asset->url),
      "cover":    coalesce(coverImage.asset->url, image.asset->url)
    }`;
  return await client.fetch(q);
}

/** 详情：按 slug 获取 */
export async function getEventBySlug(slug: string): Promise<EventDoc | null> {
  const q = groq`*[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    date,
    "coverUrl": coalesce(coverImage.asset->url, image.asset->url),
    "cover":    coalesce(coverImage.asset->url, image.asset->url),
    description,
    lineup
  }`;
  const data = await client.fetch(q, { slug });
  return data || null;
}

/** ——向后兼容旧命名（防止别处还在引用）—— */
export const fetchEvents = getEvents;
export const fetchEventBySlug = getEventBySlug;
