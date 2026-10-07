// Document glyph with a check, accent-coloured via hub-switchable CSS vars.
export default function ResumeScreenLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--accent)" />
      <path d="M20 12h17l9 9v29a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" fill="var(--on-accent)" opacity=".95" />
      <path d="M25 36l5 5 10-11" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
