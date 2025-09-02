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
  coverUrl?: string;
  description?: string;
  lineup?: string[];
};

// 统一查询：拿到列表（带封面 URL）
export async function getEvents(): Promise<EventDoc[]> {
  const q = groq`*[_type == "event"] | order(date asc){
    _id,
    title,
    slug,
    date,
    "coverUrl": coalesce(coverImage.asset->url, image.asset->url)
  }`;
  return await client.fetch(q);
}

// 详情按 slug
export async function getEventBySlug(slug: string): Promise<EventDoc | null> {
  const q = groq`*[_type == "event" && slug.current == $slug][0]{
    _id, title, slug, date,
    "coverUrl": coalesce(coverImage.asset->url, image.asset->url),
    description,
    lineup
  }`;
  const data = await client.fetch(q, { slug });
  return data || null;
}

/** ——兼容旧命名（避免其它文件还在用旧函数名导致编译失败）—— */
export const fetchEvents = getEvents;
export const fetchEventBySlug = getEventBySlug;
