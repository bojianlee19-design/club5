// app/api/events/route.ts
import { fetchEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  const events = await fetchEvents(24);
  return Response.json({ events });
}
