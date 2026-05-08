<div align="center">

<img src="./public/assets/logo.png" width="100" height="100" alt="Deepa's Vision Logo" />

<br/>

# Deepa's Vision

### *"It's not too late — we can still reset."*

<p>
  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=600&size=22&duration=3000&pause=800&color=68020D&center=true&vCenter=true&width=560&lines=Vedic+Astrology+%C2%B7+Numerology+%C2%B7+Lal+Kitab;Free+Kundli+Generator;AI-Powered+Chart+Interpretation;Predict+Your+Career+%26+Growth;%E0%A4%A6%E0%A5%8C%E0%A4%A1%E0%A4%BC+%E0%A4%95%E0%A4%BE+%E0%A4%AF%E0%A5%87+%E0%A4%AB%E0%A5%87%E0%A4%B0%E0%A4%BE%2C+%E0%A4%95%E0%A5%8C%E0%A4%A8+%E0%A4%B8%E0%A4%BE+%E0%A4%B0%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A4%BE+%E0%A4%B9%E0%A5%88+%E0%A4%AE%E0%A5%87%E0%A4%B0%E0%A4%BE%3F" alt="Typing SVG" />
</p>

<br/>

[![Live Demo](https://img.shields.io/badge/Live-deepas--vision.vercel.app-68020d?style=for-the-badge&labelColor=1a0a00)](https://deepas-vision.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Auth_&_DB-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=68020d&height=80&section=header" width="100%" />

</div>

---

## About

Deepa's Vision is a Vedic astrology consultation platform that helps you predict your **career, growth, and the success opportunities** available to you in life — using the very ancient science of Vedic astrology, proven through mathematics, astronomy, and centuries of observation.

Through a personalised 1:1 session, Deepa tells you clearly: what fields you can excel in, where your natural strengths lie, and what different career directions suit your planetary placements. With the help of AI-powered chart interpretation, we go further — helping you understand not just *what* the stars say, but *how* to act on it in the modern world.

This platform is built on three pillars:

- **Clarity** — no fear-based readings, only logic and direction
- **Science** — Vedic astrology backed by Lahiri Ayanamsa, Swiss Ephemeris, and Numerology
- **Action** — from possibility to a real plan, with AI helping bridge ancient wisdom and modern decisions

---

## Features

| Feature | Description |
|---|---|
| **Free Kundli Generator** | Accurate Vedic birth chart (North Indian style) with Lahiri Ayanamsa |
| **Planet Table** | Full planet positions — sign, house, nakshatra, pada, dignity |
| **AI Interpretation** | Google Gemini 2.0 Flash interprets your chart across 5 life topics |
| **Save Charts** | Authenticated users can save and reload past charts |
| **Google Sign-In** | One-click sign in via Supabase Auth + Google OAuth |
| **Booking Integration** | TidyCal embedded booking widget for 1:1 sessions |
| **Animated Landing Page** | Psychological hook hero, celestial animations, testimonial carousel |
| **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## Tech Stack

```
Frontend       →  Next.js 16 (App Router + Turbopack)  ·  React 19  ·  Tailwind CSS v4
Fonts          →  Playfair Display (headings, small-caps)  ·  Inter (body)
Animations     →  Framer Motion  ·  CSS Keyframes
Auth & DB      →  Supabase (PostgreSQL + Google OAuth)
Astrology      →  Swiss Ephemeris (swisseph — native Node.js addon)
Geocoding      →  OpenCage API
AI             →  Google Gemini 2.0 Flash via Vercel AI SDK v6
Deployment     →  Vercel (Node 20, Fluid Compute)
```

---

## Folder Structure

```
deepas-vision/
│
├── app/
│   ├── landingPage/
│   │   └── sections/
│   │       ├── hero.jsx              # Psychological hook + typing headline
│   │       ├── guideStat.jsx         # Animated impact stats + celestial mandala
│   │       ├── how-works.jsx         # Sticky scroll — how the process works
│   │       ├── services.jsx          # 3D flip service cards
│   │       ├── review.jsx            # Parchment testimonial carousel
│   │       └── booking.jsx           # TidyCal booking section
│   │
│   ├── kundli/
│   │   ├── page.tsx                  # Server component — auth check, data fetch
│   │   ├── actions.ts                # Server Actions — save & load charts
│   │   └── components/
│   │       ├── KundliPageClient.tsx  # Main client orchestrator
│   │       ├── BirthDetailsForm.tsx  # Birth details input
│   │       ├── KundliChart.tsx       # SVG North Indian chart renderer
│   │       ├── PlanetTable.tsx       # Planet positions table
│   │       ├── InterpretationPanel.tsx # AI streaming interpretation
│   │       └── AuthButton.tsx        # Google sign in / sign out
│   │
│   └── api/
│       ├── kundli/calculate/         # Swiss Ephemeris calculation endpoint
│       ├── kundli/interpret/         # Gemini AI streaming endpoint
│       └── auth/callback/            # Supabase OAuth callback
│
├── components/
│   ├── navbar.jsx                    # Glassmorphism pill navbar
│   ├── footer.jsx                    # Footer with logo
│   ├── TopBanner.jsx                 # Scrolling Sanskrit mantra banner
│   └── SectionDivider.jsx            # Ornate section divider
│
├── lib/
│   ├── astro/
│   │   ├── engine.ts                 # Swiss Ephemeris wrapper (sidereal calc)
│   │   ├── geocode.ts                # OpenCage — place to lat/lng/timezone
│   │   ├── interpret.ts              # Gemini prompt builders per topic
│   │   ├── types.ts                  # Shared TypeScript types
│   │   └── constants/               # Signs, nakshatras, dignity tables
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client
│       └── server.ts                 # Server Supabase client (SSR)
│
├── public/
│   ├── assets/                       # Logo, product images, borders
│   ├── videos/                       # Hero + testimonial videos
│   └── thumbnails/                   # Video poster images
│
├── supabase/migrations/              # SQL schema for charts + interpretations
├── next.config.mjs                   # Next.js config (swisseph file tracing)
├── vercel.json                       # Vercel config (Node 20)
└── package.json                      # Dependencies (Node 20.x engines)
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/vedant-valid/deepas_vision.git
cd deepas_vision
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENCAGE_API_KEY=your_opencage_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### 3. Database

Run `supabase/migrations/001_kundli_tables.sql` in your Supabase SQL editor.
Enable Google OAuth in Supabase → Authentication → Providers.

### 4. Run

```bash
npm run dev
# http://localhost:3000
```

---

## Deployment

```bash
vercel link
vercel --prod
```

> **Native addon note:** `swisseph` compiles via `node-gyp`. The project pins Node 20 and overrides `node-gyp` to v10 for Python 3.12 compatibility on Vercel. `outputFileTracingIncludes` in `next.config.mjs` ensures the `.node` binary is bundled with the serverless function.

---

<div align="center">

<br/>

*Built with care — guiding lives through the wisdom of the stars.*

**ज्योतिष · नक्षत्र · कर्म**

<img src="https://capsule-render.vercel.app/api?type=waving&color=68020d&height=80&section=footer&reversal=false" width="100%" />

</div>
