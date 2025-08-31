import { isAuthed } from '../../../../lib/admin'
import { saveJSON, deleteBlob } from '../../../../lib/blob'

export async function GET() {
  const blobs = await list({ prefix: 'events/' })
  const events = await Promise.all(blobs.blobs.map(async (b) => {
    const res = await fetch(b.url, { cache: 'no-store' })
    return await res.json()
  }))
  // Sort by date ascending
  events.sort((a: any, b: any) => a.date.localeCompare(b.date))
  return NextResponse.json({ events })
}
