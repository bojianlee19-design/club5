// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await getEvents(); // 旧名 fetchEvents -> 新名 getEvents
    return NextResponse.json(events);
  } catch (err) {
    console.error('GET /api/events error:', err);
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}
