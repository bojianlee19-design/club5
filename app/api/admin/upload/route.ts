import { NextRequest, NextResponse } from 'next/server'
import { isAuthed } from '@/lib/admin'
import { uploadFile } from '@/lib/blob'

export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ ok:false, error:'Unauthorized' }, { status: 401 })
  const form = await req.formData()
  const file = form.get('file')
  const folder = form.get('folder')?.toString() || 'gallery'
  if (!file || !(file instanceof File)) return NextResponse.json({ ok:false, error:'Missing file' }, { status: 400 })
  const url = await uploadFile(`${folder}/${file.name}`, file)
  return NextResponse.json({ ok:true, url })
}
