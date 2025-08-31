import { NextResponse } from 'next/server'
import { isAuthed } from '../../../../lib/admin'
import { saveJSON } from '../../../../lib/blob'

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const data = await req.json()
  const id = (data.id || data.slug || String(Date.now())).toString()
  await saveJSON(`data/news/${id}.json`, data)
  return NextResponse.json({ ok: true, id })
}
