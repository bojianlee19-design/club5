import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const email = form.get('email')?.toString()
  if (!email) return NextResponse.redirect('/?newsletter=error', { status: 303 })
  const line = JSON.stringify({ email, ts: new Date().toISOString() }) + '\n'
  await put(`newsletter/subscribers.jsonl`, line, { access: 'public', addRandomSuffix: false, token: process.env.BLOB_READ_WRITE_TOKEN, contentType: 'application/x-ndjson', append: true })
  return NextResponse.redirect('/?newsletter=ok', { status: 303 })
}
