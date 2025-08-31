import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  const blobs = await list({ prefix: 'news/' })
  const posts = await Promise.all(blobs.blobs.map(async (b) => {
    const res = await fetch(b.url, { cache: 'no-store' })
    return await res.json()
  }))
  posts.sort((a:any,b:any)=> new Date(b.date).getTime() - new Date(a.date).getTime())
  return NextResponse.json({ posts })
}
