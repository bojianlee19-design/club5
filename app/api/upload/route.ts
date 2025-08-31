import { NextResponse } from 'next/server'
import { isAuthed } from '../../../lib/admin'
import { uploadFile } from '../../../lib/blob'

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'invalid file' }, { status: 400 })
  }

  const pathname = `gallery/${Date.now()}-${(file as File).name}`
  const url = await uploadFile(pathname, file as File)

  return NextResponse.json({ ok: true, url, pathname })
}
