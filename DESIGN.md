# DESIGN — AI Resume Screener
Source of truth: `agents/design-system` (MASTER.md). This file is the project pointer.

- Accent: `#15803d` on bg `#ffffff`
- Layout/palette/bg animation/GA4/flags: overridable by the hub via Edge Config `theme_airesumescreener` (loaded by `lib/theme-loader.ts`, applied in `app/layout.tsx`); hub values win over the defaults here.
- Background: `components/AnimatedBg.tsx` (hub `layout.bgAnimation`, reduced-motion safe, default `none` = unchanged look).
- Logo: `components/Logo.tsx` (used in the navbar/header); favicon is static `app/icon.svg` (no `app/icon.tsx`).

## AI platform (ai-core) status
Not on ai-core yet (honest gap): resume screening runs through the local free chain. Resume upload + grounded matching is the natural ai-core RAG fit (upload-token flow, server-side tenant key) and is TODO; not built, do not claim it.
