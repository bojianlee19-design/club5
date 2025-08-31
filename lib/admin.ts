import { cookies, headers } from 'next/headers'

export function isAuthed(): boolean {
  // 登录成功后写入的 Cookie
  const c = cookies().get('admin')?.value
  if (c === '1') return true

  // 备用：允许用请求头 X-Admin-Key（等于 ADMIN_PASSWORD）访问一次
  const key = headers().get('x-admin-key')
  if (key && process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD) {
    return true
  }
  return false
}
