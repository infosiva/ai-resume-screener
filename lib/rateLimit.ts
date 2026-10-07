// In-memory IP rate limiter (per §H). Resets on cold start — fine for a single
// serverless region; swap for Edge Config/KV if abuse becomes real.
const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string, maxPerHour: number): { ok: boolean; resetAt: number } {
  const now = Date.now()
  const b = buckets.get(ip)
  if (!b || now > b.resetAt) {
    const resetAt = now + 60 * 60 * 1000
    buckets.set(ip, { count: 1, resetAt })
    return { ok: true, resetAt }
  }
  if (b.count >= maxPerHour) return { ok: false, resetAt: b.resetAt }
  b.count++
  return { ok: true, resetAt: b.resetAt }
}

export function getIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown'
}
