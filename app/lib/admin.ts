import { cookies, headers } from 'next/headers'

export function isAuthed(): boolean {
  const c = cookies().get('admin')?.value
  if (c === '1') return true

  // 备用：允许用请求头 X-Admin-Key（等于 ADMIN_PASSWORD）做一次性调用
  const key = headers().get('x-admin-key')
  if (key && process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD) {
    return true
  }
  return false
}
