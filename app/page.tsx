'use client'
import { MagneticButton } from "@infosiva/shared-ui/modern";

import { useState, useRef } from 'react'
import Logo from '@/components/Logo'

interface Candidate {
  name: string
  fileName: string
  matchScore: number
  matchedSkills: string[]
  experience: string
  education: string
  summary: string
}

const FREE_LIMIT = 5
const STORAGE_KEY = 'resume_screener_usage'

function getRemainingFree(): number {
  if (typeof window === 'undefined') return FREE_LIMIT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return FREE_LIMIT
    const { count, date } = JSON.parse(raw)
    const today = new Date().toISOString().slice(0, 10)
    return date === today ? Math.max(0, FREE_LIMIT - count) : FREE_LIMIT
  } catch { return FREE_LIMIT }
}

function incrementUsage() {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const prev = raw ? JSON.parse(raw) : { count: 0, date: '' }
    const count = prev.date === today ? prev.count + 1 : 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: today }))
  } catch { /* ignore */ }
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-(--accent-ink)'
  if (score >= 50) return 'text-(--ink-2)'
  return 'text-(--ink-3)'
}

function downloadCSV(results: Candidate[]) {
  const headers = ['Name', 'File', 'Match Score', 'Matched Skills', 'Experience', 'Education', 'Summary']
  const rows = results.map(r => [
    r.name, r.fileName, r.matchScore + '%',
    r.matchedSkills.join('; '), r.experience, r.education, r.summary,
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'candidates.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function Home() {
  const [jobDesc, setJobDesc]     = useState('')
  const [files, setFiles]         = useState<File[]>([])
  const [results, setResults]     = useState<Candidate[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [limitHit, setLimitHit]   = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function screen() {
    if (!jobDesc.trim() || !files.length) return
    if (getRemainingFree() <= 0) { setLimitHit(true); return }

    setLoading(true); setError(''); setResults([])
    try {
      const form = new FormData()
      form.append('jobDescription', jobDesc)
      files.forEach(f => form.append('resumes', f))

      const res = await fetch('/api/screen', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Screening failed')
      setResults(data.results)
      incrementUsage()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ color: 'var(--ink)' }}>
      <header className="border-b px-6 py-4 flex items-center justify-between relative z-10" style={{ borderColor: 'var(--line)' }}>
        <div className="flex items-center gap-3">
          <Logo size={30} />
          <div>
            <h1 className="text-xl font-bold">
              Resume<span style={{ color: 'var(--accent)' }}>Screen</span>
            </h1>
            <p className="text-xs text-(--ink-2)">Rank candidates automatically with AI</p>
          </div>
        </div>
        <div className="text-sm text-(--ink-2)">{getRemainingFree()} free screenings left today</div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Job Description */}
          <div className="rs-in" style={{ ["--i" as string]: 1 }}>
            <label className="block text-sm font-medium text-(--ink) mb-2">Job Description</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-36 md:h-48 bg-(--surface) border border-(--line) rounded-xl px-4 py-3 text-(--ink) placeholder:text-(--ink-3) focus:outline-none resize-none text-sm"
            />
          </div>

          {/* Resume Upload */}
          <div className="rs-in" style={{ ["--i" as string]: 2 }}>
            <label className="block text-sm font-medium text-(--ink) mb-2">
              Resumes (PDF, up to 10)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="h-36 md:h-48 border-2 border-dashed border-(--line) rs-dropzone rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors rs-dropzone"
            >
              <svg className="w-10 h-10 text-(--ink-3) mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-(--ink-2) text-sm">Click to upload PDFs</p>
              {files.length > 0 && (
                <p className="text-sm mt-2" style={{ color: "var(--accent)" }}>{files.length} file(s) selected</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={e => setFiles(Array.from(e.target.files ?? []))}
            />
          </div>
        </div>

        {limitHit ? (
          <div className="rounded-xl p-6 text-center border border-(--line) bg-(--surface)">
            <h3 className="text-lg font-semibold mb-2">Free limit reached</h3>
            <p className="mb-2 text-(--ink-2)">{FREE_LIMIT} free screenings used today. Come back tomorrow.</p>
            <p className="text-sm text-(--ink-3)">Paid plans for HR teams are planned, not yet available.</p>
          </div>
        ) : (
          <MagneticButton
            onClick={screen}
            disabled={loading || !jobDesc.trim() || !files.length}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-medium rs-btn-accent rs-in" style={{ ["--i" as string]: 3, background: "var(--accent)", color: "var(--on-accent)" }}
          >
            {loading ? `Screening ${files.length} resume(s)...` : `Screen ${files.length || 0} Resume(s)`}
          </MagneticButton>
        )}

        {error && (
          <div className="border border-(--line) bg-(--surface) rounded-xl p-4 text-(--ink) text-sm">{error}</div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{results.length} Candidate(s) Ranked</h2>
              <button
                onClick={() => downloadCSV(results)}
                className="text-sm px-4 rounded-lg transition-colors rs-tap" style={{ color: "var(--accent-ink)", border: "1px solid var(--line)" }}
              >
                Download CSV
              </button>
            </div>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="bg-(--surface) border border-(--line) backdrop-blur-sm rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-(--ink-3) font-mono">#{i + 1}</span>
                        <span className="font-semibold">{r.name}</span>
                      </div>
                      <p className="text-xs text-(--ink-2) mt-0.5">{r.fileName}</p>
                    </div>
                    <div className={`text-2xl font-bold ${scoreColor(r.matchScore)}`}>
                      {r.matchScore}%
                    </div>
                  </div>
                  <p className="text-sm text-(--ink-2)">{r.summary}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-(--ink-3)">Experience: </span>
                      <span className="text-(--ink)">{r.experience}</span>
                    </div>
                    <div>
                      <span className="text-(--ink-3)">Education: </span>
                      <span className="text-(--ink)">{r.education}</span>
                    </div>
                  </div>
                  {r.matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.matchedSkills.map(skill => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in oklab, var(--accent) 14%, transparent)", color: "var(--accent-ink)", border: "1px solid var(--line)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
