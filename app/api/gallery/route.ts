import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  const blobs = await list({ prefix: 'gallery/' })
  const items = blobs.blobs.sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  return NextResponse.json({ images: items.map(i => ({ url: i.url, pathname: i.pathname })) })
}
