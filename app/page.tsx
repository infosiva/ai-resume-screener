'use client'
import { motion } from 'framer-motion'

import { useState, useRef } from 'react'

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
  if (score >= 75) return 'text-green-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Animated blob bg */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} aria-hidden>
        <motion.div
          style={{ position: 'absolute', top: '-15%', left: '-8%', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.div
          style={{ position: 'absolute', bottom: '-10%', right: '-6%', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', filter: 'blur(90px)' }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, delay: 2 }}
        />
      </div>
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-400">AI Resume Screener</h1>
          <p className="text-xs text-gray-500">Rank candidates automatically with AI</p>
        </div>
        <div className="text-sm text-gray-400">{getRemainingFree()} free screenings left today</div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
            <textarea
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none text-sm"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resumes (PDF, up to 10)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="h-48 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors"
            >
              <svg className="w-10 h-10 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-gray-500 text-sm">Click to upload PDFs</p>
              {files.length > 0 && (
                <p className="text-blue-400 text-sm mt-2">{files.length} file(s) selected</p>
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
          <div className="rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Free limit reached</h3>
            <p className="text-gray-400 mb-4">5 free screenings used today. Upgrade for unlimited access.</p>
            <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors">
              Upgrade — $29/month for HR teams
            </button>
          </div>
        ) : (
          <button
            onClick={screen}
            disabled={loading || !jobDesc.trim() || !files.length}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? `Screening ${files.length} resume(s)...` : `Screen ${files.length || 0} Resume(s)`}
          </button>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{results.length} Candidate(s) Ranked</h2>
              <button
                onClick={() => downloadCSV(results)}
                className="text-sm text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                Download CSV
              </button>
            </div>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-mono">#{i + 1}</span>
                        <span className="font-semibold">{r.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{r.fileName}</p>
                    </div>
                    <div className={`text-2xl font-bold ${scoreColor(r.matchScore)}`}>
                      {r.matchScore}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{r.summary}</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-600">Experience: </span>
                      <span className="text-gray-300">{r.experience}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Education: </span>
                      <span className="text-gray-300">{r.education}</span>
                    </div>
                  </div>
                  {r.matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.matchedSkills.map(skill => (
                        <span key={skill} className="text-xs bg-blue-900/40 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
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
