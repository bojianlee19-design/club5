// lib/sanity.ts
import { createClient, groq } from 'next-sanity';

export type EventDoc = {
  _id: string;
  slug?: { current: string } | string;
  title?: string;
  date?: string;
  cover?: string;
  image?: { asset?: { url?: string } } | string;
  mainImage?: { asset?: { url?: string } } | string;
};

export type EventItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  cover?: string;
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// 兜底把可能的图片字段解析成 URL
const pickCover = (d: EventDoc): string | undefined => {
  if (typeof d.cover === 'string') return d.cover;
  if (typeof d.image === 'string') return d.image;
  if (typeof d.mainImage === 'string') return d.mainImage;
  const fromObj = (v: any) => v?.asset?.url as string | undefined;
  return fromObj(d.image) || fromObj(d.mainImage);
};

const slugToString = (s: EventDoc['slug']): string =>
  typeof s === 'string' ? s : s?.current ?? '';

const mapDoc = (d: EventDoc): EventItem => ({
  id: d._id,
  slug: slugToString(d.slug),
  title: d.title ?? '',
  date: d.date,
  cover: d.cover ?? pickCover(d),
});

export async function getUpcomingEvents(): Promise<EventItem[]> {
  // 如果你已有自己的 schema 字段，请把 coalesce 链按需调整
  const query = groq`*[_type=="event"]|order(date asc){
    _id, title, date,
    "slug": coalesce(slug.current, slug),
    "cover": coalesce(cover.asset->url, image.asset->url, mainImage.asset->url)
  }`;
  const docs = (await client.fetch<EventDoc[]>(query)) ?? [];
  return docs.map(mapDoc).filter(e => e.slug);
}

// 给 /api/events 使用
export async function getEvents() {
  return getUpcomingEvents();
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const query = groq`*[_type=="event" && slug.current==$slug][0]{
    _id, title, date,
    "slug": coalesce(slug.current, slug),
    "cover": coalesce(cover.asset->url, image.asset->url, mainImage.asset->url)
  }`;
  const doc = await client.fetch<EventDoc | null>(query, { slug });
  return doc ? mapDoc(doc) : null;
}
