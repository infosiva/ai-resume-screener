export const metadata = { title: 'Privacy Policy — AI Resume Screener', description: 'How AI Resume Screener handles your data.' }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e40af', marginBottom: 12 }}>{title}</h2>
    <div style={{ color: '#374151', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#64748b', marginBottom: 48, fontSize: 14 }}>Last updated: June 2025</p>
      <Section title="Data We Collect"><p>We collect resume files and job descriptions you submit for screening. We do not store these beyond the current session unless you explicitly save results.</p></Section>
      <Section title="How We Use Data"><p>Submitted content is sent to AI providers (Groq, OpenAI) solely to generate screening results. We never use your resume data for training or advertising.</p></Section>
      <Section title="Cookies"><p>We use minimal session cookies for functionality. No tracking or advertising cookies are used.</p></Section>
      <Section title="Third-Party Services"><p>AI screening uses Groq and/or OpenAI APIs. Resume files are transmitted to these services and subject to their privacy policies.</p></Section>
      <Section title="Data Retention"><p>Resume and job description data is not retained after your session ends. Results are ephemeral unless you download them.</p></Section>
      <Section title="Your Rights"><p>You may request deletion of any account data by emailing privacy@ai-resume-screener.vercel.app.</p></Section>
      <Section title="Children&apos;s Privacy"><p>This service is not directed at children under 13. We do not knowingly collect data from minors.</p></Section>
      <Section title="Contact"><p>Questions? Email <a href="mailto:privacy@ai-resume-screener.vercel.app" style={{ color: '#2563eb' }}>privacy@ai-resume-screener.vercel.app</a></p></Section>
    </main>
  )
}
