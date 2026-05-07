import { callAI } from './ai'

export interface ScreeningResult {
  name: string
  fileName: string
  matchScore: number
  matchedSkills: string[]
  experience: string
  education: string
  summary: string
}

const SYSTEM = `You are an expert HR recruiter and resume analyst.
Analyze resumes against job descriptions and provide structured scoring.
Always respond with valid JSON only, no markdown, no explanation.`

export async function screenResume(
  resumeText: string,
  jobDescription: string,
  fileName: string,
): Promise<ScreeningResult> {
  const prompt = `Job Description:
${jobDescription}

Resume:
${resumeText}

Analyze this resume against the job description and respond with JSON:
{
  "name": "candidate full name or 'Unknown'",
  "matchScore": <0-100 integer>,
  "matchedSkills": ["skill1", "skill2", ...],
  "experience": "brief summary of relevant experience",
  "education": "highest relevant education",
  "summary": "2-sentence candidate summary"
}`

  const { text } = await callAI(SYSTEM, [{ role: 'user', content: prompt }], 1024, 'balanced')

  try {
    const clean = text.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      name: parsed.name ?? 'Unknown',
      fileName,
      matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      experience: parsed.experience ?? '',
      education: parsed.education ?? '',
      summary: parsed.summary ?? '',
    }
  } catch {
    return {
      name: 'Unknown',
      fileName,
      matchScore: 0,
      matchedSkills: [],
      experience: '',
      education: '',
      summary: 'Failed to parse AI response',
    }
  }
}
