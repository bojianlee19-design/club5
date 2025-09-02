// lib/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: true,
})

export type EventDoc = {
  _id: string
  title?: string
  slug?: { current?: string } | string
  date?: string
  doorsTime?: string
  endTime?: string
  venue?: string
  ageRestriction?: string
  price?: string
  ticketUrl?: string
  lineup?: string[]
  summary?: string
  cover?: any
  gallery?: any[]
  body?: any
  tags?: string[]
}

export async function fetchEvents(limit = 60) {
  const q = `*[_type=="event"] | order(date asc) [0...$limit]{
    _id, title, date, doorsTime, endTime, venue, ageRestriction, price,
    ticketUrl, lineup, summary, slug, tags,
    cover{asset->{url,_ref}}, gallery[]{asset->{url,_ref}}
  }`
  const rows: EventDoc[] = await sanityClient.fetch(q, { limit })
  return rows.map((r) => ({
    ...r,
    slug: typeof r.slug === 'string' ? r.slug : r.slug?.current || r._id,
  }))
}

export async function fetchEventBySlug(slug: string) {
  const q = `*[_type=="event" && (slug.current==$s || _id==$s)][0]{
    _id, title, date, doorsTime, endTime, venue, ageRestriction, price,
    ticketUrl, lineup, summary, slug, tags,
    cover{asset->{url,_ref}}, gallery[]{asset->{url,_ref}}, body
  }`
  return sanityClient.fetch(q, { s: slug })
}
