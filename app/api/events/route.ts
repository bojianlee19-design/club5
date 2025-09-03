// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events });
}
