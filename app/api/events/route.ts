// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getEvents();
    return NextResponse.json(items, { status: 200 });
  } catch (e) {
    console.error('GET /api/events failed:', e);
    return NextResponse.json({ error: 'failed to load events' }, { status: 500 });
  }
}
