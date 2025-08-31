import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin'
import { saveJSON, deleteBlob } from '@/lib/blob'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status: 401 })
  const payload = await req.json()
  if (!payload.title || !payload.date) return NextResponse.json({ ok:false, error:'Missing title/date' }, { status: 400 })
  const id = payload.id || crypto.randomBytes(6).toString('hex')
  const event = { id, ...payload }
  await saveJSON(`events/${id}.json`, event)
  return NextResponse.json({ ok: true, event })
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ ok:false, error:'Missing id' }, { status: 400 })
  await deleteBlob(`events/${id}.json`)
  return NextResponse.json({ ok: true })
}
