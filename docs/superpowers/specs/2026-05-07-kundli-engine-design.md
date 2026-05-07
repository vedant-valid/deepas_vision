# Kundli Engine — Design Spec
**Date:** 2026-05-07  
**Project:** Deepa's Vision (`deepas-vision`)  
**Status:** Approved

---

## 1. Overview

A public `/kundli` page where any visitor enters birth details and receives:
1. A North Indian style Kundli chart (SVG, counter-clockwise house numbering)
2. A planet positions table (sign, house, nakshatra, pada, degree, retrograde, dignity)
3. A streaming AI interpretation powered by Claude, organized by topic tabs

Authenticated users can save charts and view history. Charts are persisted in Supabase.

---

## 2. Technology Decisions

| Concern | Choice | Reason |
|---|---|---|
| Calculations | `swisseph` npm (Node.js binding to Swiss Ephemeris C library) | Same accuracy as pyswisseph, no Python service needed |
| Ayanamsa | Lahiri (default) | Vedic astrology standard |
| Geocoding | OpenCage API (free tier: 2,500 req/day) | Returns lat/lng AND timezone in one call — critical for accurate birth time conversion |
| AI interpretation | Claude via Vercel AI SDK `streamText` | Streamed word-by-word, cached to DB after first generation |
| Auth + DB | Supabase (Postgres + Auth + RLS) | Relational structure suits astrology data, native Vercel integration |
| Framework | Next.js 15 App Router (existing project) | Already in use |

---

## 3. Architecture

```
Browser (/kundli)
  ├── BirthDetailsForm  →  POST /api/kundli/calculate
  │                              ├── OpenCage (city → lat/lng + timezone)
  │                              ├── swisseph (planets, lagna, nakshatras)
  │                              └── Returns: KundliData JSON
  │
  ├── KundliChart (SVG, North Indian, CCW numbering)
  ├── PlanetTable (sign, house, nakshatra, degree, retrograde, dignity)
  │
  └── InterpretationPanel  →  POST /api/kundli/interpret (streaming)
                                     └── Claude API via Vercel AI SDK

Supabase
  ├── Auth (email + Google OAuth)
  ├── charts table
  ├── interpretations table
  └── RLS: users access only their own rows
```

---

## 4. File Structure

```
app/
  kundli/
    page.tsx
    components/
      BirthDetailsForm.tsx
      KundliChart.tsx
      PlanetTable.tsx
      InterpretationPanel.tsx
  api/kundli/
    calculate/route.ts
    interpret/route.ts

lib/astro/
  engine.ts              — pure calculation, no HTTP, fully testable
  geocode.ts             — OpenCage wrapper
  interpret.ts           — Claude prompt builder
  constants/
    nakshatras.ts        — 27 nakshatra table (name, start degree, lord)
    dignity.ts           — planet dignity lookup (12 signs × 9 planets)
    signs.ts             — rashi names, lords, elements

lib/supabase/
  client.ts              — browser client
  server.ts              — server client (for API routes)
```

---

## 5. Data Model

```sql
-- Supabase Auth handles users (auth.users)

create table charts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text,                        -- person's name (optional)
  dob         date not null,
  tob         time not null,
  place       text not null,               -- "Mumbai, India"
  latitude    float not null,
  longitude   float not null,
  timezone    text not null,               -- "Asia/Kolkata"
  kundli_data jsonb not null,              -- full KundliData JSON
  created_at  timestamptz default now()
);

create table interpretations (
  id         uuid primary key default gen_random_uuid(),
  chart_id   uuid references charts on delete cascade,
  topic      text not null,               -- "lagna" | "career" | "relationships" | "health"
  content    text not null,               -- full Claude response text
  model      text not null,               -- "claude-sonnet-4-6"
  created_at timestamptz default now(),
  unique (chart_id, topic)               -- one interpretation per topic per chart
);

-- RLS
alter table charts enable row level security;
alter table interpretations enable row level security;

create policy "users own charts"
  on charts for all using (auth.uid() = user_id);

create policy "users own interpretations"
  on interpretations for all
  using (chart_id in (select id from charts where user_id = auth.uid()));
```

**Why JSONB for `kundli_data`:** Navamsa, Dasha, and Ashtakavarga data can be added to the JSON payload without schema migrations.

---

## 6. Calculation Engine (`lib/astro/engine.ts`)

Pure functions, no side effects, fully unit-testable.

### Input / Output types

```ts
type BirthInput = {
  date: string       // "1990-08-15"
  time: string       // "14:30"
  latitude: number
  longitude: number
  timezone: string   // "Asia/Kolkata"
}

type KundliData = {
  lagna:   LagnaData
  planets: PlanetData[]
  houses:  HouseData[]
}

type LagnaData = {
  sign:      string
  degree:    number
  nakshatra: string
  pada:      number
}

type PlanetData = {
  name:       string    // "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu"
  sign:       string
  degree:     number    // 0–29.99 within sign
  house:      number    // 1–12
  nakshatra:  string
  pada:       number    // 1–4
  retrograde: boolean
  dignity:    "exalted" | "debilitated" | "own" | "neutral"
}

type HouseData = {
  house:  number   // 1–12
  sign:   string
  degree: number   // cusp degree
}
```

### Calculation steps

1. Convert local birth time → UTC using `timezone` (via `Intl` or `date-fns-tz`)
2. Compute Julian Day Number from UTC datetime
3. Set Lahiri ayanamsa: `swe_set_sid_mode(SE_SIDM_LAHIRI)`
4. Compute sidereal positions for all 9 grahas via `swe_calc_ut`
5. Compute house cusps + Ascendant via `swe_houses` with birth lat/lng
6. For each planet: derive sign (floor(longitude/30)), degree within sign, house placement, nakshatra (floor(longitude / 13.333)), pada, retrograde flag, dignity
7. Rahu/Ketu: always retrograde, always 180° apart, computed from Moon's mean node

### Nakshatra calculation

```
nakshatra_index = floor(sidereal_longitude / (360/27))
pada = floor((sidereal_longitude % (360/27)) / (360/108)) + 1
```

---

## 7. Geocoding (`lib/astro/geocode.ts`)

Single function wrapping the OpenCage API:

```ts
async function geocodePlace(place: string): Promise<{
  latitude: number
  longitude: number
  timezone: string      // IANA timezone string e.g. "Asia/Kolkata"
  formattedPlace: string
}>
```

- API key stored in `OPENCAGE_API_KEY` env var
- Returns timezone directly from OpenCage response (no second API call needed)
- Throws a descriptive error if place not found

---

## 8. API Routes

### `POST /api/kundli/calculate`

```ts
// Request
{ name?: string, dob: string, tob: string, place: string }

// Response
{ kundliData: KundliData, latitude: number, longitude: number, timezone: string, formattedPlace: string }
```

Does not save to DB (saving is a separate user action).

### `POST /api/kundli/interpret`

```ts
// Request
{ chartId: string, topic: "lagna" | "moon" | "career" | "relationships" | "health" }

// Response
Streaming text (Vercel AI SDK data stream)
```

- Checks `interpretations` table first — returns cached result if found
- Builds a structured prompt from the chart's `kundli_data`
- Streams Claude response, saves to DB on completion

---

## 9. UI Components

### `BirthDetailsForm`
- Fields: name (optional), date, time, place (text input with geocode on submit)
- Shows resolved lat/lng + timezone after geocoding for transparency
- Saved charts list below form (authenticated users only)

### `KundliChart`
- Pure SVG component, takes `KundliData` as props
- North Indian style: Lagna always at top, houses numbered counter-clockwise (1→2→3... going left from top)
- Planets rendered as abbreviations (Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke) with degree
- Retrograde planets marked with ℞

### `PlanetTable`
- Columns: Planet, Sign, Degree, House, Nakshatra + Pada, Dignity
- Dignity color-coded: Exalted (gold), Debilitated (red), Own (green), Neutral (grey)

### `InterpretationPanel`
- Topic tabs: Lagna · Moon Sign · Career · Relationships · Health
- Streaming text renders word-by-word
- "Generate" button per topic; cached topics show instantly
- Requires sign-in to generate (to prevent abuse and enable caching)

---

## 10. AI Interpretation Prompt

```
System:
You are a senior Jyotishi with expertise in classical Parashari Vedic astrology.
Interpret charts with precision and specificity. Ground every insight in the 
actual planetary positions provided. Write in warm, accessible English — 
not jargon-heavy, but astrologically accurate. 2–3 paragraphs per topic.

User:
Interpret the {topic} for this Vedic birth chart:

Lagna: {sign} {degree}° ({nakshatra} pada {pada})
{planet}: {sign} {degree}° — House {house} — {nakshatra} pada {pada}{retrograde?} — {dignity}
...

Focus: {topic-specific instructions}
```

Topic-specific focus instructions:
- **lagna:** Lagna lord placement, physical constitution, personality, life approach
- **moon:** Moon sign, emotional nature, mind, mother, mental tendencies
- **career:** 10th house, 10th lord, planets in 10th, Sun placement
- **relationships:** 7th house, 7th lord, Venus placement, Navamsa (note: future)
- **health:** 6th house, Lagna lord strength, Saturn/Mars afflictions

---

## 11. North Indian Chart — House Position Map

Houses numbered counter-clockwise from Lagna (always at top-center diamond):

| House | Physical Position |
|-------|------------------|
| 1 | Top diamond (Lagna) |
| 2 | Upper-left corner |
| 3 | Left side, upper |
| 4 | Left diamond |
| 5 | Left side, lower |
| 6 | Lower-left corner |
| 7 | Bottom diamond |
| 8 | Lower-right corner |
| 9 | Right side, lower |
| 10 | Right diamond |
| 11 | Right side, upper |
| 12 | Upper-right corner |

---

## 12. Future Modules (out of scope, slots in cleanly)

| Module | File | Notes |
|--------|------|-------|
| Vimshottari Dasha | `lib/astro/dasha.ts` | Needs Moon nakshatra (already computed) |
| Navamsa (D9) | `lib/astro/navamsa.ts` | Divisional chart, same swisseph data |
| Kundli Milan | `lib/astro/compatibility.ts` | Ashtakoot matching, needs two KundliData inputs |
| Ashtakavarga | `lib/astro/ashtakavarga.ts` | Bindus per sign per planet |
| Transit Engine | `lib/astro/transit.ts` | Current planetary positions vs natal chart |
| PDF Export | `app/api/kundli/export/route.ts` | React-PDF or Puppeteer |

---

## 13. Environment Variables Required

```
OPENCAGE_API_KEY=        # OpenCage geocoding
ANTHROPIC_API_KEY=       # Claude via Vercel AI SDK
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side only
```
