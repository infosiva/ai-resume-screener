import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const body = await req.json()
  const { rating, message, page } = body
  if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  if (!message || message.trim().length < 5) return NextResponse.json({ error: 'Message too short' }, { status: 400 })
  const entry = { id: Date.now().toString(), rating, message, page: page ?? '/', ip, ts: new Date().toISOString() }
  console.log('[feedback]', JSON.stringify(entry))
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (token && chat) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: `⭐ ${rating}/5 — ${message} (${page ?? '/'})` })
    }).catch(() => {})
  }
  return NextResponse.json({ ok: true, id: entry.id })
}
