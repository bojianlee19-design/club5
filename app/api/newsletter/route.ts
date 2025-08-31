import { NextResponse } from 'next/server'
import { list, put } from '@vercel/blob'

export async function POST(req: Request) {
  const form = await req.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()
  if (!email) return NextResponse.redirect('/?newsletter=error', { status: 303 })

  const line = JSON.stringify({ email, ts: new Date().toISOString() }) + '\n'
  const pathname = 'newsletter/subscribers.jsonl'
  const token = process.env.BLOB_READ_WRITE_TOKEN

  let body = line
  try {
    const { blobs } = await list({ prefix: pathname, token })
    const found = blobs.find((b) => b.pathname === pathname)
    if (found) {
      const resp = await fetch(found.url)
      const prev = await resp.text()
      body = prev + line
    }
  } catch {}

  await put(pathname, body, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/x-ndjson',
    token,
  })

  return NextResponse.redirect('/?newsletter=ok', { status: 303 })
}
