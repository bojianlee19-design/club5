import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // If going to /api/events locally and Blob empty, rewrite to a static file for preview.
  if (req.nextUrl.pathname === '/api/events' && process.env.VERCEL !== '1') {
    return NextResponse.rewrite(new URL('/data-dev/events.json', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/events']
}
