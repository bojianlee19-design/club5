'use client'

import React, { useState } from 'react'

type Json = Record<string, any>

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  async function saveEvent(form: FormData) {
    // 将 FormData 转成普通对象，再做字段加工
    const entries = Object.fromEntries(form.entries())
    const payload: Json = { ...entries }

    // lineup 从 string → string[]
    const rawLineup = form.get('lineup')
    payload.lineup =
      typeof rawLineup === 'string'
        ? rawLineup.split(',').map((s) => s.trim()).filter(Boolean)
        : []

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      alert('Event saved ✅')
      ;(document.getElementById('event-form') as HTMLFormElement).reset()
    } else {
      alert('Failed to save event ❌')
    }
  }

  async function saveNews(form: FormData) {
    const entries = Object.fromEntries(form.entries())
    const payload: Json = { ...entries }

    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      alert('News saved ✅')
      ;(document.getElementById('news-form') as HTMLFormElement).reset()
    } else {
      alert('Failed to save news ❌')
    }
  }

  async function uploadImage(form: FormData) {
    setUploading(true)
    setUploadedUrl(null)
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form, // 注意：上传文件时不要加 Content-Type，浏览器会自动带 boundary
      })
      if (!res.ok) throw new Error('upload failed')
      const data = await res.json()
      setUploadedUrl(data.url)
      alert('Image uploaded ✅')
    } catch (e) {
      console.error(e)
      alert('Image upload failed ❌')
    } finally {
      setUploading(false)
      ;(document.getElementById('upload-form') as HTMLFormElement).reset()
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Admin Panel</h1>

      {/* Event */}
      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Create / Update Event</h2>
        <form
          id="event-form"
          onSubmit={async (e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            await saveEvent(f)
          }}
          style={{ display: 'grid', gap: 12 }}
        >
          <input name="id" placeholder="ID/Slug (可留空自动生成)" />
          <input name="title" placeholder="Title" required />
          <input name="date" placeholder="Date (YYYY-MM-DD)" />
          <input name="image" placeholder="Image URL (可选)" />
          <input name="lineup" placeholder="Lineup（用英文逗号分隔）" />
          <textarea name="description" placeholder="Description" rows={4} />
          <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, background: 'black', color: 'white' }}>
            Save Event
          </button>
        </form>
      </section>

      {/* News */}
      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 12, marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Create / Update News</h2>
        <form
          id="news-form"
          onSubmit={async (e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            await saveNews(f)
          }}
          style={{ display: 'grid', gap: 12 }}
        >
          <input name="id" placeholder="ID/Slug (可留空自动生成)" />
          <input name="title" placeholder="Title" required />
          <input name="image" placeholder="Image URL (可选)" />
          <textarea name="content" placeholder="Content" rows={4} />
          <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, background: 'black', color: 'white' }}>
            Save News
          </button>
        </form>
      </section>

      {/* Upload */}
      <section style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Upload Image to Blob</h2>
        <form
          id="upload-form"
          onSubmit={async (e) => {
            e.preventDefault()
            const f = new FormData(e.currentTarget)
            await uploadImage(f)
          }}
          style={{ display: 'grid', gap: 12 }}
        >
          <input type="file" name="file" accept="image/*" required />
          <button type="submit" disabled={uploading} style={{ padding: '8px 14px', borderRadius: 8, background: 'black', color: 'white' }}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>
        {uploadedUrl && (
          <p style={{ marginTop: 12 }}>
            Uploaded URL:&nbsp;
            <a href={uploadedUrl} target="_blank" rel="noreferrer">{uploadedUrl}</a>
          </p>
        )}
      </section>
    </main>
  )
}
