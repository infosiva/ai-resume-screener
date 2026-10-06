import type { Metadata } from "next";
import "./globals.css";
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import { getSiteFlags } from '@/lib/flags'
import FeedbackWidget from '@/components/FeedbackWidget'
import Script from "next/script";

import { AnimatedBg } from "@/components/AnimatedBg";
import Telemetry from "@/components/Telemetry";
import { loadSiteTheme, buildThemeStyleTag, buildGa4Snippet, isValidGa4Id } from "@/lib/theme-loader";
import { MotionProvider } from "@infosiva/shared-ui/modern";
export const metadata: Metadata = {
  metadataBase: new URL("https://ai-resume-screener.vercel.app"),
  title: "AI Resume Screener — Automated Candidate Screening & Ranking",
  description: "Screen and rank resumes automatically using AI for faster, smarter hiring. Save hours on resume review.",
  keywords: ["resume screening", "automated hiring", "AI recruitment", "candidate ranking", "HR software"],
  openGraph: {
    title: "AI Resume Screener — Automated Candidate Screening",
    description: "AI-powered resume screening and ranking for recruiters and hiring teams.",
    type: "website",
  },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.svg" },
};

export const revalidate = 600

const SITE_ID = 'ai-resume-screener'
const DEFAULT_ARCHETYPE = 'career-portfolio'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [flags, theme] = await Promise.all([getSiteFlags('airesumescreener'), loadSiteTheme(SITE_ID)])
  const ga4 = theme?.analytics?.ga4Id
  return (
    <html lang="en" data-layout={theme?.layout?.archetype ?? DEFAULT_ARCHETYPE}>
      <head>
        <style id="hub-theme" dangerouslySetInnerHTML={{ __html: buildThemeStyleTag(theme) }} />
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176" crossOrigin="anonymous" strategy="afterInteractive" />
        {isValidGa4Id(ga4) && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: buildGa4Snippet(theme) }} />
          </>
        )}
      </head>
      <body>
        <AnimatedBg theme={theme} fallback="gradient-shift" />
        <MotionProvider>{children}</MotionProvider>
        {flags.chatbot && <FloatingChatWrapper />}
        <FeedbackWidget />
        <Telemetry />
      </body>
    </html>
  )
}
