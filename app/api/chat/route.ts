import { NextRequest, NextResponse } from 'next/server'
import { aiChat } from '@/lib/ai'
import { log } from '@/lib/log'
import { checkRateLimit, getIp } from '@/lib/rateLimit'

const SCOPE_FALLBACK = "If asked anything outside resume screening, ATS optimisation, hiring, or candidate evaluation, respond: \"I'm trained for ResumeScreen AI. For that, try Google or ChatGPT!\""

export async function POST(req: NextRequest) {
  const { ok } = checkRateLimit(getIp(req), 60)
  if (!ok) return NextResponse.json({ text: 'Chat is resting. Please try again in a moment.' })

  try {
    const { messages } = await req.json()
    if (!Array.isArray(messages) || !messages.length) return NextResponse.json({ text: 'Ask me about screening resumes.' })
    // System prompt is server-owned; a client-supplied one is ignored.
    const sysPrompt = `You are ResumeScreen AI — an expert HR assistant. Help users understand resume screening, ATS optimisation, hiring best practices, and candidate evaluation. Be concise and practical. ${SCOPE_FALLBACK}`
    const text = await aiChat(messages.slice(-10), sysPrompt, 400, 'fast')
    log('info', 'chat_used', { turns: messages.length })
    return NextResponse.json({ text })
  } catch (e) {
    log('error', 'chat_failed', { msg: e instanceof Error ? e.message.slice(0, 120) : 'unknown' })
    return NextResponse.json({ text: 'Upload a resume above to get started!' }, { status: 200 })
  }
}
