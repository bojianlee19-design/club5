'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

type EventItem = {
  id?: string
  title: string
  date: string
  venue?: string
  lineup?: string
  coverUrl?: string
  ticketsUrl?: string
  description?: string
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState<'events'|'gallery'|'news'>('events')
  const [events, setEvents] = useState<EventItem[]>([])
  const [img, setImg] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  async function login() {
    const res = await fetch('/api/admin/login', { method:'POST', body: JSON.stringify({ password }) })
    setAuthed(res.ok)
    if (!res.ok) alert('Invalid password')
  }
  async function loadEvents() {
    const res = await fetch('/api/events', { cache:'no-store' })
    if (!res.ok) return
    const data = await res.json()
    setEvents(data.events)
  }
  useEffect(()=>{ if(authed) loadEvents() }, [authed])

  async function saveEvent(form: FormData) {
    const payload = Object.fromEntries(form.entries())
    payload.lineup = payload.lineup ? String(payload.lineup).split(',').map(s=>s.trim()) : []
    const res = await fetch('/api/admin/events', { method:'POST', body: JSON.stringify(payload) })
    if (res.ok) { await loadEvents(); (document.getElementById('event-form') as HTMLFormElement).reset() }
    else alert('Failed to save event')
  }


  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    const res = await fetch(`/api/admin/events?id=${id}`, { method:'DELETE' })
    if (res.ok) loadEvents()
  }

  async function uploadImage() {
    if (!img) return
    setUploading(true)
    const fd = new FormData()
    fd.set('file', img)
    fd.set('folder', 'gallery')
    const res = await fetch('/api/admin/upload', { method:'POST', body: fd })
    setUploading(false)
    const data = await res.json()
    if (res.ok) {
      alert('Uploaded: ' + data.url)
    } else {
      alert('Upload failed')
    }
  }

  async function saveNews(form: FormData) {
    const payload = Object.fromEntries(form.entries())
    const res = await fetch('/api/admin/news', { method:'POST', body: JSON.stringify(payload) })
    if (res.ok) { alert('Saved'); (document.getElementById('news-form') as HTMLFormElement).reset() }
  }

  if (!authed) {
    return (
      <div className="container-max py-12 max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Admin Sign In</h1>
        <div className="card p-6 space-y-3">
          <input type="password" placeholder="Admin password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary" onClick={login}>Sign In</button>
          <p className="text-white/50 text-sm">Set <code>ADMIN_PASSWORD</code> in .env (or Vercel) before using.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-max py-8 space-y-6">
      <div className="flex gap-2">
        <button className={`btn ${tab==='events'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('events')}>Events</button>
        <button className={`btn ${tab==='gallery'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('gallery')}>Gallery</button>
        <button className={`btn ${tab==='news'?'btn-primary':'btn-outline'}`} onClick={()=>setTab('news')}>News</button>
      </div>

      {tab === 'events' && (
        <div className="grid md:grid-cols-2 gap-8">
          <form id="event-form" action={(formData)=>saveEvent(formData as any)} className="card p-6 space-y-3">
            <h2 className="text-xl font-semibold">Create / Update Event</h2>
            <div className="row">
              <div><label>Title</label><input name="title" required /></div>
              <div><label>Date & time</label><input type="datetime-local" name="date" required /></div>
            </div>
            <div className="row">
              <div><label>Venue</label><input name="venue" placeholder="HAZY Club, Sheffield" /></div>
              <div><label>Tickets URL</label><input name="ticketsUrl" placeholder="https://..." /></div>
            </div>
            <div><label>Lineup (comma-separated)</label><input name="lineup" placeholder="DJ A, DJ B" /></div>
            <div><label>Cover Image URL</label><input name="coverUrl" placeholder="https://..." /></div>
            <div><label>Description (supports plain text)</label><textarea name="description" rows={5} /></div>
            <button className="btn btn-primary" type="submit">Save Event</button>
          </form>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Existing Events</h2>
            <div className="space-y-3">
              {events.map(e => (
                <div key={e.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-white/60 text-sm">{new Date(e.date).toLocaleString()}</div>
                  </div>
                  <button className="btn btn-outline" onClick={()=>deleteEvent(e.id!)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'gallery' && (
        <div className="card p-6 space-y-3 max-w-lg">
          <h2 className="text-xl font-semibold">Upload Image</h2>
          <input type="file" accept="image/*" onChange={e=>setImg(e.target.files?.[0] || null)} />
          <button className="btn btn-primary" onClick={uploadImage} disabled={uploading}>{uploading? 'Uploading...' : 'Upload'}</button>
          <p className="text-white/60 text-sm">Images go to <code>gallery/</code> on Vercel Blob.</p>
        </div>
      )}

      {tab === 'news' && (
        <form id="news-form" action={(formData)=>saveNews(formData as any)} className="card p-6 space-y-3 max-w-2xl">
          <h2 className="text-xl font-semibold">Publish News</h2>
          <div className="row">
            <div><label>Title</label><input name="title" required /></div>
            <div><label>Date</label><input type="date" name="date" required /></div>
          </div>
          <div><label>Cover Image URL</label><input name="coverUrl" placeholder="https://..." /></div>
          <div><label>Body (HTML allowed)</label><textarea name="body" rows={8} placeholder="<p>Launch weekend announced...</p>" /></div>
          <button className="btn btn-primary" type="submit">Publish</button>
        </form>
      )}
    </div>
  )
}
