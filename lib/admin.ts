import { cookies, headers } from 'next/headers'

export function isAuthed(): boolean {
  const c = cookies().get('admin')?.value
  if (c === '1') return true

  const key = headers().get('x-admin-key')
  if (key && process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD) {
    return true
  }
  return false
}
