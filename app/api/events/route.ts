// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await getUpcomingEvents(50); // 取前 50 条
    return NextResponse.json({ events }, { headers: { 'cache-control': 'no-store' } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
