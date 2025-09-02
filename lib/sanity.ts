import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-01',
  useCdn: true,
});

const baseProjection = `{
  _id,
  title,
  "slug": coalesce(slug.current, _id),
  date,
  "cover": coalesce(cover.asset->url, poster.asset->url, mainImage.asset->url)
}`;

export type EventDoc = {
  _id: string;
  title: string;
  slug: string;
  date?: string;
  cover?: string | null;
};

export async function getUpcomingEvents(limit = 12): Promise<EventDoc[]> {
  const q = `*[_type=="event"]|order(date asc)[0...$limit]${baseProjection}`;
  return sanityClient.fetch(q, { limit });
}

export async function getEventBySlug(slug: string): Promise<EventDoc | null> {
  const q = `*[_type=="event" && (slug.current==$slug || _id==$slug)][0]${baseProjection}`;
  return sanityClient.fetch(q, { slug });
}
