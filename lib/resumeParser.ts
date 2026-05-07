// PDF text extraction using pdf-parse
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR issues
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text.trim()
  } catch (e) {
    console.error('[resumeParser] PDF parse error:', e)
    throw new Error('Failed to extract text from PDF')
  }
}

export function truncate(text: string, maxChars = 3000): string {
  return text.length > maxChars ? text.slice(0, maxChars) + '...' : text
}
