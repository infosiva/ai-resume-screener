'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function submit() {
    if (!rating) return
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, message, page: '/' }),
    }).catch(() => {})
    setSent(true)
    setTimeout(() => { setOpen(false); setSent(false); setRating(0); setMessage('') }, 1600)
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        style={{
          position: 'fixed', bottom: 24, left: 24, padding: '8px 14px', borderRadius: 999,
          background: 'color-mix(in oklab, var(--ink) 6%, transparent)', border: '1px solid var(--border)',
          color: 'var(--ink)', fontSize: 12, fontWeight: 600, cursor: 'pointer', zIndex: 999,
        }}
      >
        Feedback
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', bottom: 72, left: 24, width: 280, borderRadius: 16, zIndex: 999,
              background: 'var(--surface-strong)', border: '1px solid var(--border)', padding: 16,
              backdropFilter: 'blur(20px)', color: 'var(--ink)',
            }}
          >
            {sent ? (
              <div style={{ fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Thanks for the feedback!</div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>How's ResumeScreen working for you?</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      style={{
                        width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
                        background: n <= rating ? 'var(--accent)' : 'color-mix(in oklab, var(--ink) 4%, transparent)',
                        color: n <= rating ? 'var(--surface-strong)' : 'var(--ink)',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >{n}</button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Optional: tell us more…"
                  rows={3}
                  style={{
                    width: '100%', background: 'color-mix(in oklab, var(--ink) 4%, transparent)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 8, fontSize: 12, color: 'var(--ink)', outline: 'none', resize: 'none',
                    marginBottom: 10, fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={submit}
                  disabled={!rating}
                  style={{
                    width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
                    background: rating ? 'linear-gradient(135deg,var(--accent),var(--accent-2))' : 'color-mix(in oklab, var(--ink) 8%, transparent)',
                    color: rating ? 'var(--surface-strong)' : 'var(--ink)', fontSize: 12, fontWeight: 700,
                    cursor: rating ? 'pointer' : 'not-allowed',
                  }}
                >Send</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
