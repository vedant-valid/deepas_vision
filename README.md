<div align="center">

<img src="./public/assets/logo.png" width="100" height="100" alt="Deepa's Vision Logo" />

<br/>

# ✦ Deepa's Vision

### *"It's not too late — we can still reset."*

<p>
  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=600&size=22&duration=3000&pause=800&color=68020D&center=true&vCenter=true&width=500&lines=Vedic+Astrology+%C2%B7+Numerology+%C2%B7+Lal+Kitab;Free+Kundli+Generator+%E2%9C%A6;AI-Powered+Chart+Interpretation;%E0%A4%A6%E0%A5%8C%E0%A4%A1%E0%A4%BC+%E0%A4%95%E0%A4%BE+%E0%A4%AF%E0%A5%87+%E0%A4%AB%E0%A5%87%E0%A4%B0%E0%A4%BE%2C+%E0%A4%95%E0%A5%8C%E0%A4%A8+%E0%A4%B8%E0%A4%BE+%E0%A4%B0%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A4%BE+%E0%A4%B9%E0%A5%88+%E0%A4%AE%E0%A5%87%E0%A4%B0%E0%A4%BE%3F" alt="Typing SVG" />
</p>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live-deepas--vision.vercel.app-68020d?style=for-the-badge&labelColor=1a0a00)](https://deepas-vision.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Auth_&_DB-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=68020d&height=80&section=header" width="100%" />

</div>

---

## 🌙 What is Deepa's Vision?

Deepa's Vision is a **Vedic astrology consultation platform** built for a real practitioner with years of experience in Jyotish, Numerology, and Lal Kitab.

The platform opens with a psychological hook — *are you stuck in a loop, doubt, or guilt?* — and guides visitors toward booking a 1:1 session with Deepa.

It also includes a fully functional **Free Kundli Generator** powered by Swiss Ephemeris, with AI-generated chart interpretations via Google Gemini 2.0 Flash.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔭 **Free Kundli Generator** | Accurate Vedic birth chart (North Indian style) with Lahiri Ayanamsa |
| 🪐 **Planet Table** | Planet positions — sign, house, nakshatra, pada, dignity |
| 🤖 **AI Interpretation** | Google Gemini 2.0 Flash interprets your chart across 5 topics |
| 💾 **Save Charts** | Authenticated users can save and reload past charts |
| 🔐 **Google OAuth** | Sign in with Google via Supabase Auth |
| 💫 **Animated Landing Page** | Celestial animations, glassmorphism navbar, parchment testimonials |
| 📅 **Booking Integration** | TidyCal embedded booking widget |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

```
Frontend       →  Next.js 16 (App Router + Turbopack)  ·  React 19  ·  Tailwind CSS v4
Fonts          →  Playfair Display (headings, small-caps)  ·  Inter (body)
Animations     →  Framer Motion  ·  CSS Keyframes
Auth & DB      →  Supabase (PostgreSQL + Google OAuth)
Astrology      →  Swiss Ephemeris (swisseph native Node.js addon)
Geocoding      →  OpenCage API
AI             →  Google Gemini 2.0 Flash via Vercel AI SDK v6
Deployment     →  Vercel (Node 20, Fluid Compute)
```

---

## 📁 Folder Structure

```
deepas-vision/
│
├── app/                            # Next.js App Router
│   ├── page.js                     # Root page
│   ├── layout.js                   # Global layout (fonts, footer)
│   ├── globals.css                 # Global styles & typography
│   │
│   ├── landingPage/                # Marketing landing page
│   │   ├── page.jsx
│   │   └── sections/
│   │       ├── hero.jsx            # Hook headline + typing animation
│   │       ├── guideStat.jsx       # Animated stats + celestial mandala
│   │       ├── how-works.jsx       # Sticky scroll cards
│   │       ├── services.jsx        # 3D flip service cards
│   │       ├── review.jsx          # Parchment testimonial carousel
│   │       └── booking.jsx         # TidyCal booking section
│   │
│   ├── kundli/                     # Kundli Generator feature
│   │   ├── page.tsx                # Server component (auth + data)
│   │   ├── actions.ts              # Server Actions (save/load charts)
│   │   └── components/
│   │       ├── KundliPageClient.tsx      # Client orchestrator
│   │       ├── BirthDetailsForm.tsx      # Birth input form
│   │       ├── KundliChart.tsx           # SVG North Indian chart
│   │       ├── PlanetTable.tsx           # Planet positions table
│   │       ├── InterpretationPanel.tsx   # AI streaming panel
│   │       └── AuthButton.tsx            # Google sign in/out
│   │
│   ├── api/
│   │   ├── kundli/
│   │   │   ├── calculate/route.ts  # Swisseph calculation endpoint
│   │   │   └── interpret/route.ts  # Gemini AI streaming endpoint
│   │   └── auth/callback/route.ts  # Supabase OAuth callback
│   │
│   └── products/page.jsx           # Products/remedies page
│
├── components/                     # Shared UI components
│   ├── navbar.jsx                  # Glassmorphism pill navbar
│   ├── footer.jsx                  # Compact footer with logo
│   ├── TopBanner.jsx               # Scrolling Sanskrit banner
│   └── SectionDivider.jsx          # Ornate section divider
│
├── lib/                            # Core logic
│   ├── astro/
│   │   ├── engine.ts               # Swiss Ephemeris wrapper
│   │   ├── geocode.ts              # OpenCage geocoding
│   │   ├── interpret.ts            # Gemini prompt builders
│   │   ├── types.ts                # TypeScript types
│   │   └── constants/              # Signs, nakshatras, dignity
│   └── supabase/
│       ├── client.ts               # Browser client
│       └── server.ts               # Server client (SSR cookies)
│
├── public/
│   ├── assets/                     # Logo, product images
│   ├── videos/                     # Hero & testimonial videos
│   └── thumbnails/                 # Video poster images
│
├── supabase/
│   └── migrations/                 # SQL schema migrations
│
├── next.config.mjs                 # Next.js config
├── vercel.json                     # Vercel deployment config
└── package.json                    # Dependencies (Node 20.x)
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/vedant-valid/deepas_vision.git
cd deepas_vision
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Geocoding
OPENCAGE_API_KEY=your_opencage_key

# AI (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### 3. Database Setup

Run `supabase/migrations/001_kundli_tables.sql` in your Supabase SQL editor.

Enable **Google OAuth** in Supabase → Authentication → Providers.

### 4. Run Dev Server

```bash
npm run dev
# → http://localhost:3000
```

---

## ☁️ Deployment

```bash
vercel link        # Link to Vercel project
vercel --prod      # Deploy to production
```

> **Note on native addon:** `swisseph` compiles via `node-gyp`. The project pins Node 20 and overrides `node-gyp` to v10 for Python 3.12 compatibility. `outputFileTracingIncludes` in `next.config.mjs` ensures the `.node` binary is bundled correctly on Vercel.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Maroon) | `#68020d` |
| Gold Accent | `#c9a84c` |
| Background | `#fffaf5` (warm cream) |
| Heading Font | Playfair Display (small-caps) |
| Body Font | Inter |

---

<div align="center">

<br/>

*Built with care — guiding lives through the wisdom of the stars.*

**✦ ज्योतिष · नक्षत्र · कर्म ✦**

<img src="https://capsule-render.vercel.app/api?type=waving&color=68020d&height=80&section=footer&reversal=false" width="100%" />

</div>
