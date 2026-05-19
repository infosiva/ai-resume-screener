import type { Metadata } from "next";
import "./globals.css";
import FloatingChatWrapper from '@/components/FloatingChatWrapper'

export const metadata: Metadata = {
  title: "AI Resume Screener - Smart Candidate Ranking",
  description: "Screen and rank resumes automatically using AI for faster, smarter hiring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
