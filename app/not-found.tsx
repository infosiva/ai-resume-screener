import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 16px', textAlign: 'center', background: '#0d1120' }}>
      <div style={{ fontSize: 64, fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Page not found</h1>
      <p style={{ fontSize: 13, color: 'rgba(248,250,252,0.5)', margin: 0, maxWidth: 320 }}>This page has moved or doesn&apos;t exist.</p>
      <Link href="/" style={{ marginTop: 8, padding: '12px 28px', borderRadius: 12, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontWeight: 800, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(167,139,250,0.3)' }}>Go home →</Link>
    </div>
  )
}
