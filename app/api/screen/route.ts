import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF, truncate } from '@/lib/resumeParser'
import { screenResume } from '@/lib/aiScreener'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const jobDescription = formData.get('jobDescription') as string
    const files = formData.getAll('resumes') as File[]

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description required' }, { status: 400 })
    }
    if (!files.length) {
      return NextResponse.json({ error: 'At least one resume required' }, { status: 400 })
    }
    if (files.length > 10) {
      return NextResponse.json({ error: 'Max 10 resumes per batch' }, { status: 400 })
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer())
        const text = await extractTextFromPDF(buffer)
        return screenResume(truncate(text, 3000), jobDescription, file.name)
      })
    )

    // Sort by match score descending
    results.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({ results, count: results.length })
  } catch (e: unknown) {
    console.error('[screen]', e)
    return NextResponse.json({ error: 'Screening failed' }, { status: 500 })
  }
}
