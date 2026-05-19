import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()
    const sysPrompt = system ?? 'You are ResumeScreen AI — an expert HR assistant. Help users understand resume screening, ATS optimisation, hiring best practices, and candidate evaluation. Be concise and practical.'
    const text = await callAI(messages, sysPrompt, 400)
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ text: 'Upload a resume above to get started!' }, { status: 200 })
  }
}
