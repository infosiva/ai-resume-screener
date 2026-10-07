import { NextRequest, NextResponse } from 'next/server'
import { log } from '@/lib/log'

// Always ok: feedback must never error the visitor. No IP stored.
export async function POST(req: NextRequest) {
  try {
    const { rating, message, page } = await req.json()
    const r = Number(rating)
    const m = typeof message === 'string' ? message.trim().slice(0, 1000) : ''
    if (!(r >= 1 && r <= 5)) return NextResponse.json({ ok: false, error: 'Rating 1-5 required' }, { status: 400 })
    log('info', 'feedback', { rating: r, page: typeof page === 'string' ? page.slice(0, 80) : '/', len: m.length })
    const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID
    if (token && chat && process.env.TELEGRAM_NOTIFICATIONS_DISABLED !== 'true') {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text: `Feedback ${r}/5: ${m} (${page ?? '/'})` }),
      }).catch(() => {})
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
