import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return NextResponse.json({ ok: false, error: 'missing BLOB_READ_WRITE_TOKEN' }, { status: 500 })
  }
  const { blobs } = await list({ prefix: 'gallery/', token })
  const items = blobs.map(b => ({ url: b.url, pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt }))
  return NextResponse.json({ ok: true, items })
}
