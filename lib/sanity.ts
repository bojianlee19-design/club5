// lib/sanity.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

/* -------------------- Event 类型与映射 -------------------- */
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

function mapEvent(d: EventDoc): EventItem {
  return {
    id: d._id,
    slug: typeof d.slug === 'string' ? d.slug : d.slug?.current || '',
    title: d.title || 'Untitled',
    date: d.date,
    cover: d.cover,
  };
}

// 统一字段：兼容 cover / mainImage / image / poster
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
  const q = `
    *[_type == "event" && (slug.current == $slug || slug == $slug)][0]{
      ${EVENT_FIELDS}
    }
  `;
  const d = await client.fetch<EventDoc | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['events'] } }
  );
  return d ? mapEvent(d) : null;
}

/* -------------------- Tables（可选） -------------------- */
export type TableItem = {
  id: string;
  slug: string;
  title: string;
  cover?: string;
};

const TABLE_FIELDS = `
  _id,
  "slug": coalesce(slug.current, slug),
  title,
  "cover": coalesce(
    cover.asset->url,
    mainImage.asset->url,
    image.asset->url,
    poster.asset->url
  )
`;

export async function getTables(limit = 50): Promise<TableItem[]> {
  const q = `
    *[_type == "table"]
      | order(_createdAt desc)[0...$limit]{
        ${TABLE_FIELDS}
      }
  `;
  const docs = await client.fetch<any[]>(
    q,
    { limit },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } }
  );
  return docs.map((d) => ({
    id: d._id,
    slug: d.slug ?? '',
    title: d.title ?? 'Untitled',
    cover: d.cover,
  }));
}

export async function getTableBySlug(slug: string): Promise<TableItem | null> {
  const q = `
    *[_type == "table" && (slug.current == $slug || slug == $slug)][0]{
      ${TABLE_FIELDS}
    }
  `;
  const d = await client.fetch<any | null>(
    q,
    { slug },
    { cache: 'no-store', next: { revalidate: 0, tags: ['tables'] } }
  );
  return d
    ? { id: d._id, slug: d.slug ?? '', title: d.title ?? 'Untitled', cover: d.cover }
    : null;
}
