import type { Metadata } from "next";
import "./globals.css";
import FloatingChatWrapper from '@/components/FloatingChatWrapper'
import Script from "next/script";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4237294630161176" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AI Resume Screener",
              "description": "Automated resume screening and candidate ranking using AI",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
        <Script defer data-site="ai-resume-screener.vercel.app" src="http://31.97.56.148:3098/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
