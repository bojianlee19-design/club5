// lib/sanity.ts
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
});

export type EventDoc = {
  _id: string;
  title: string;
  date?: string;
  slug?: { current: string };
  cover?: { asset?: { url?: string } };
  summary?: string;
};

export async function fetchEvents(limit = 12) {
  const q = `*[_type=="event"] | order(date asc) [0...$limit]{
    _id, title, date, slug, cover{asset->{url}}, summary
  }`;
  const rows: EventDoc[] = await sanityClient.fetch(q, { limit });
  return rows.map((r) => ({
    _id: r._id,
    title: r.title,
    date: r.date,
    slug: r.slug?.current || r._id,         // 回退 _id，保证可点进
    coverUrl: r.cover?.asset?.url || '',
    summary: r.summary || '',
  }));
}

export async function fetchEventBySlug(slug: string) {
  const q = `*[_type=="event" && (slug.current==$s OR _id==$s)][0]{
    _id, title, date, slug, cover{asset->{url}}, summary, body
  }`;
  return sanityClient.fetch(q, { s: slug });
}
