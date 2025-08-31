import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ ok: false, error: 'Missing password' }, { status: 400 })
  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin', '1', { httpOnly: true, path: '/', maxAge: 60 * 60 * 8, secure: true, sameSite: 'lax' })
    return res
  }
  return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
}
