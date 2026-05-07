# Kundli Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/kundli` page where any visitor enters birth details and receives a North Indian Kundli chart, planet positions table, and streaming AI interpretation — with chart save/history for authenticated users.

**Architecture:** Next.js 15 API routes handle geocoding (OpenCage → lat/lng + timezone) and sidereal calculation (`swisseph` Swiss Ephemeris C binding, Lahiri ayanamsa, Whole Sign houses). Pure calc functions in `lib/astro/` are fully unit-tested. A streaming Claude interpretation via Vercel AI SDK is cached per `(chartId, topic)` in Supabase. Supabase Postgres + RLS persists charts and interpretations per user.

**Tech Stack:** Next.js 15 App Router · TypeScript · `swisseph` · `date-fns-tz` · OpenCage API · `ai` + `@ai-sdk/anthropic` · `@supabase/supabase-js` + `@supabase/ssr` · Vitest · Tailwind CSS v4

---

## File Map

```
tsconfig.json                              — NEW: TypeScript config
vitest.config.ts                           — NEW: Vitest config

lib/astro/
  types.ts                                 — NEW: BirthInput, KundliData, PlanetData, etc.
  engine.ts                                — NEW: pure sidereal calculation (swisseph)
  geocode.ts                               — NEW: OpenCage wrapper
  interpret.ts                             — NEW: Claude prompt builder
  constants/
    signs.ts                               — NEW: sign list + helper fns
    nakshatras.ts                          — NEW: 27-nakshatra table + lookup
    dignity.ts                             — NEW: exaltation/debilitation/own lookup
  __tests__/
    engine.test.ts                         — NEW: unit tests for engine helpers
    nakshatras.test.ts                     — NEW: unit tests for nakshatra lookup

lib/supabase/
  client.ts                                — NEW: browser Supabase client
  server.ts                                — NEW: server Supabase client (API routes)

supabase/migrations/
  001_kundli_tables.sql                    — NEW: charts + interpretations tables + RLS

app/
  kundli/
    page.tsx                               — NEW: /kundli route (Server Component shell)
    actions.ts                             — NEW: Server Actions (saveChart, getSavedCharts)
    components/
      KundliChart.tsx                      — NEW: SVG North Indian chart renderer
      PlanetTable.tsx                      — NEW: planet positions table
      BirthDetailsForm.tsx                 — NEW: birth input form (client)
      InterpretationPanel.tsx              — NEW: streaming AI output + topic tabs (client)
      KundliPageClient.tsx                 — NEW: client orchestrator
  api/kundli/
    calculate/route.ts                     — NEW: POST endpoint (geocode + calculate)
    interpret/route.ts                     — NEW: POST streaming endpoint (Claude)

.env.local                                 — MODIFY: add required env vars
```

---

## Task 1: TypeScript + Vitest Setup

**Files:**
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install TypeScript and test dependencies**

```bash
cd /Users/vedantmadne/Desktop/deepas-project/deepas-vision
npm install --save-dev typescript @types/react @types/react-dom @types/node vitest @vitejs/plugin-react
```

Expected: packages installed, no errors.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install swisseph date-fns-tz @supabase/supabase-js @supabase/ssr ai @ai-sdk/anthropic
```

Expected: packages installed. Note: `swisseph` is a native addon — it will compile during install (requires node-gyp; pre-built binaries are fetched automatically on most systems).

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Add env vars to .env.local**

Create `.env.local` (if it doesn't exist) and add:
```
OPENCAGE_API_KEY=your_opencage_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

Get keys from:
- OpenCage: https://opencagedata.com (free signup, 2,500 req/day)
- Anthropic: https://console.anthropic.com
- Supabase: https://app.supabase.com → Project Settings → API

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: exits with no errors (or only "next-env.d.ts not found" which resolves on first `next dev`).

- [ ] **Step 8: Commit**

```bash
git add tsconfig.json vitest.config.ts package.json package-lock.json .env.local
git commit -m "chore: add TypeScript, Vitest, and runtime dependencies for Kundli engine"
```

---

## Task 2: Astro Type Definitions

**Files:**
- Create: `lib/astro/types.ts`

- [ ] **Step 1: Create lib/astro/types.ts**

```ts
export type BirthInput = {
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:MM" 24h
  latitude: number
  longitude: number
  timezone: string   // IANA e.g. "Asia/Kolkata"
}

export type LagnaData = {
  sign: string
  degree: number     // 0–29.99 within sign
  nakshatra: string
  pada: number       // 1–4
}

export type PlanetData = {
  name: string       // "Sun"|"Moon"|"Mars"|"Mercury"|"Jupiter"|"Venus"|"Saturn"|"Rahu"|"Ketu"
  sign: string
  degree: number     // 0–29.99 within sign
  house: number      // 1–12
  nakshatra: string
  pada: number       // 1–4
  retrograde: boolean
  dignity: 'exalted' | 'debilitated' | 'own' | 'neutral'
}

export type HouseData = {
  house: number      // 1–12
  sign: string
  degree: number     // cusp sidereal longitude
}

export type KundliData = {
  lagna: LagnaData
  planets: PlanetData[]
  houses: HouseData[]
}

export type GeocodeResult = {
  latitude: number
  longitude: number
  timezone: string
  formattedPlace: string
}

export type InterpretationTopic = 'lagna' | 'moon' | 'career' | 'relationships' | 'health'
```

- [ ] **Step 2: Commit**

```bash
git add lib/astro/types.ts
git commit -m "feat(kundli): add core type definitions"
```

---

## Task 3: Astro Constants

**Files:**
- Create: `lib/astro/constants/signs.ts`
- Create: `lib/astro/constants/nakshatras.ts`
- Create: `lib/astro/constants/dignity.ts`
- Create: `lib/astro/__tests__/nakshatras.test.ts`

- [ ] **Step 1: Write failing nakshatra tests first**

Create `lib/astro/__tests__/nakshatras.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getNakshatra } from '../constants/nakshatras'

describe('getNakshatra', () => {
  it('returns Ashwini pada 1 for 0°', () => {
    expect(getNakshatra(0)).toEqual({ nakshatra: 'Ashwini', pada: 1 })
  })

  it('returns Ashwini pada 2 for 3.334°', () => {
    expect(getNakshatra(3.334)).toEqual({ nakshatra: 'Ashwini', pada: 2 })
  })

  it('returns Ashwini pada 4 for 10°', () => {
    expect(getNakshatra(10)).toEqual({ nakshatra: 'Ashwini', pada: 4 })
  })

  it('returns Bharani pada 1 at nakshatra boundary 13.334°', () => {
    expect(getNakshatra(13.334)).toEqual({ nakshatra: 'Bharani', pada: 1 })
  })

  it('returns Revati pada 4 for 359°', () => {
    const result = getNakshatra(359)
    expect(result.nakshatra).toBe('Revati')
    expect(result.pada).toBe(4)
  })

  it('wraps correctly for longitude > 360', () => {
    expect(getNakshatra(360)).toEqual({ nakshatra: 'Ashwini', pada: 1 })
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run lib/astro/__tests__/nakshatras.test.ts
```

Expected: FAIL — `getNakshatra` not found.

- [ ] **Step 3: Create lib/astro/constants/signs.ts**

```ts
export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

export type SignName = typeof SIGNS[number]

export function signFromLongitude(longitude: number): string {
  const lon = ((longitude % 360) + 360) % 360
  return SIGNS[Math.floor(lon / 30)]
}

export function degreeWithinSign(longitude: number): number {
  const lon = ((longitude % 360) + 360) % 360
  return lon % 30
}

export function signIndex(sign: string): number {
  return SIGNS.indexOf(sign as SignName)
}
```

- [ ] **Step 4: Create lib/astro/constants/nakshatras.ts**

```ts
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const

const NAKSHATRA_SPAN = 360 / 27  // 13.3333...°
const PADA_SPAN = NAKSHATRA_SPAN / 4

export function getNakshatra(siderealLongitude: number): { nakshatra: string; pada: number } {
  const lon = ((siderealLongitude % 360) + 360) % 360
  const index = Math.floor(lon / NAKSHATRA_SPAN)
  const posInNakshatra = lon % NAKSHATRA_SPAN
  const pada = Math.floor(posInNakshatra / PADA_SPAN) + 1
  return { nakshatra: NAKSHATRAS[Math.min(index, 26)], pada: Math.min(pada, 4) }
}
```

- [ ] **Step 5: Run nakshatra tests — verify they pass**

```bash
npm run test:run lib/astro/__tests__/nakshatras.test.ts
```

Expected: 6 tests PASS.

- [ ] **Step 6: Create lib/astro/constants/dignity.ts**

```ts
import type { PlanetData } from '../types'

type Dignity = PlanetData['dignity']

const EXALTATION: Record<string, string> = {
  Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
  Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra',
}

const DEBILITATION: Record<string, string> = {
  Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
  Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries',
}

const OWN_SIGNS: Record<string, readonly string[]> = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mars: ['Aries', 'Scorpio'],
  Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Venus: ['Taurus', 'Libra'],
  Saturn: ['Capricorn', 'Aquarius'],
}

export function getDignity(planet: string, sign: string): Dignity {
  if (planet === 'Rahu' || planet === 'Ketu') return 'neutral'
  if (EXALTATION[planet] === sign) return 'exalted'
  if (DEBILITATION[planet] === sign) return 'debilitated'
  if (OWN_SIGNS[planet]?.includes(sign)) return 'own'
  return 'neutral'
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/astro/constants/ lib/astro/__tests__/nakshatras.test.ts
git commit -m "feat(kundli): add astro constants and nakshatra tests"
```

---

## Task 4: Calculation Engine

**Files:**
- Create: `lib/astro/engine.ts`
- Create: `lib/astro/__tests__/engine.test.ts`

- [ ] **Step 1: Write failing engine tests**

Create `lib/astro/__tests__/engine.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { calculate } from '../engine'
import { SIGNS } from '../constants/signs'

const DELHI_INPUT = {
  date: '1990-08-15',
  time: '14:30',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
}

describe('calculate', () => {
  it('returns a KundliData with lagna, planets, and houses', () => {
    const result = calculate(DELHI_INPUT)
    expect(result).toHaveProperty('lagna')
    expect(result).toHaveProperty('planets')
    expect(result).toHaveProperty('houses')
  })

  it('lagna has a valid sign, degree, nakshatra, and pada', () => {
    const { lagna } = calculate(DELHI_INPUT)
    expect(SIGNS).toContain(lagna.sign)
    expect(lagna.degree).toBeGreaterThanOrEqual(0)
    expect(lagna.degree).toBeLessThan(30)
    expect(typeof lagna.nakshatra).toBe('string')
    expect([1, 2, 3, 4]).toContain(lagna.pada)
  })

  it('returns exactly 9 planets (7 + Rahu + Ketu)', () => {
    const { planets } = calculate(DELHI_INPUT)
    expect(planets).toHaveLength(9)
    const names = planets.map(p => p.name)
    expect(names).toContain('Sun')
    expect(names).toContain('Moon')
    expect(names).toContain('Rahu')
    expect(names).toContain('Ketu')
  })

  it('all planets have valid house numbers 1–12', () => {
    const { planets } = calculate(DELHI_INPUT)
    planets.forEach(p => {
      expect(p.house).toBeGreaterThanOrEqual(1)
      expect(p.house).toBeLessThanOrEqual(12)
    })
  })

  it('all planets have valid signs', () => {
    const { planets } = calculate(DELHI_INPUT)
    planets.forEach(p => expect(SIGNS).toContain(p.sign))
  })

  it('returns exactly 12 houses', () => {
    const { houses } = calculate(DELHI_INPUT)
    expect(houses).toHaveLength(12)
    houses.forEach(h => {
      expect(h.house).toBeGreaterThanOrEqual(1)
      expect(h.house).toBeLessThanOrEqual(12)
      expect(SIGNS).toContain(h.sign)
    })
  })

  it('Rahu and Ketu are always marked retrograde', () => {
    const { planets } = calculate(DELHI_INPUT)
    const rahu = planets.find(p => p.name === 'Rahu')!
    const ketu = planets.find(p => p.name === 'Ketu')!
    expect(rahu.retrograde).toBe(true)
    expect(ketu.retrograde).toBe(true)
  })

  it('Rahu and Ketu are in opposite signs', () => {
    const { planets } = calculate(DELHI_INPUT)
    const rahu = planets.find(p => p.name === 'Rahu')!
    const ketu = planets.find(p => p.name === 'Ketu')!
    const rahuIdx = SIGNS.indexOf(rahu.sign as any)
    const ketuIdx = SIGNS.indexOf(ketu.sign as any)
    expect((rahuIdx + 6) % 12).toBe(ketuIdx)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm run test:run lib/astro/__tests__/engine.test.ts
```

Expected: FAIL — `calculate` not found.

- [ ] **Step 3: Create lib/astro/engine.ts**

```ts
// Only import on server side — swisseph is a native Node.js addon
import swisseph from 'swisseph'
import { fromZonedTime } from 'date-fns-tz'
import type { BirthInput, KundliData, LagnaData, PlanetData, HouseData } from './types'
import { SIGNS, signFromLongitude, degreeWithinSign, signIndex } from './constants/signs'
import { getNakshatra } from './constants/nakshatras'
import { getDignity } from './constants/dignity'

const PLANET_DEFS = [
  { name: 'Sun',     id: swisseph.SE_SUN },
  { name: 'Moon',    id: swisseph.SE_MOON },
  { name: 'Mars',    id: swisseph.SE_MARS },
  { name: 'Mercury', id: swisseph.SE_MERCURY },
  { name: 'Jupiter', id: swisseph.SE_JUPITER },
  { name: 'Venus',   id: swisseph.SE_VENUS },
  { name: 'Saturn',  id: swisseph.SE_SATURN },
  { name: 'Rahu',    id: swisseph.SE_MEAN_NODE },
] as const

const SIDEREAL_FLAG = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED

export function calculate(input: BirthInput): KundliData {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)

  // Convert local birth time to UTC
  const localStr = `${input.date}T${input.time}:00`
  const utcDate = fromZonedTime(localStr, input.timezone)

  const year = utcDate.getUTCFullYear()
  const month = utcDate.getUTCMonth() + 1
  const day = utcDate.getUTCDate()
  const hourUt =
    utcDate.getUTCHours() +
    utcDate.getUTCMinutes() / 60 +
    utcDate.getUTCSeconds() / 3600

  const jd = swisseph.swe_julday(year, month, day, hourUt, swisseph.SE_GREG_CAL)

  // Ascendant via Whole Sign ('W') house system
  const housesResult = swisseph.swe_houses(jd, input.latitude, input.longitude, 'W')
  const ascLon = ((housesResult.ascendant % 360) + 360) % 360
  const lagnaSignIdx = Math.floor(ascLon / 30)
  const lagnaSign = SIGNS[lagnaSignIdx]
  const { nakshatra: lagnaNak, pada: lagnaPada } = getNakshatra(ascLon)

  const lagna: LagnaData = {
    sign: lagnaSign,
    degree: degreeWithinSign(ascLon),
    nakshatra: lagnaNak,
    pada: lagnaPada,
  }

  // 12 house cusps (Whole Sign: each house = one full sign)
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    sign: SIGNS[(lagnaSignIdx + i) % 12],
    degree: housesResult.house[i + 1] ?? (lagnaSignIdx + i) * 30,
  }))

  // Compute the 7 classical planets + Rahu
  const planets: PlanetData[] = []

  for (const def of PLANET_DEFS) {
    const res = swisseph.swe_calc_ut(jd, def.id, SIDEREAL_FLAG)
    const lon = ((res.longitude % 360) + 360) % 360
    const sign = signFromLongitude(lon)
    const degree = degreeWithinSign(lon)
    const { nakshatra, pada } = getNakshatra(lon)
    const retrograde = def.name === 'Rahu' ? true : res.longitudeSpeed < 0
    const house = ((signIndex(sign) - lagnaSignIdx + 12) % 12) + 1
    const dignity = getDignity(def.name, sign)

    planets.push({ name: def.name, sign, degree, house, nakshatra, pada, retrograde, dignity })
  }

  // Ketu is always exactly opposite Rahu
  const rahu = planets.find(p => p.name === 'Rahu')!
  const rahuRes = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, SIDEREAL_FLAG)
  const rahuRawLon = ((rahuRes.longitude % 360) + 360) % 360
  const ketuLon = (rahuRawLon + 180) % 360
  const ketuSign = signFromLongitude(ketuLon)
  const ketuDegree = degreeWithinSign(ketuLon)
  const { nakshatra: ketuNak, pada: ketuPada } = getNakshatra(ketuLon)
  const ketuHouse = ((signIndex(ketuSign) - lagnaSignIdx + 12) % 12) + 1

  planets.push({
    name: 'Ketu', sign: ketuSign, degree: ketuDegree,
    house: ketuHouse, nakshatra: ketuNak, pada: ketuPada,
    retrograde: true, dignity: 'neutral',
  })

  return { lagna, planets, houses }
}
```

- [ ] **Step 4: Run engine tests — verify they pass**

```bash
npm run test:run lib/astro/__tests__/engine.test.ts
```

Expected: 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/astro/engine.ts lib/astro/__tests__/engine.test.ts
git commit -m "feat(kundli): add sidereal calculation engine with swisseph"
```

---

## Task 5: Geocoding Wrapper

**Files:**
- Create: `lib/astro/geocode.ts`

- [ ] **Step 1: Create lib/astro/geocode.ts**

```ts
import type { GeocodeResult } from './types'

export async function geocodePlace(place: string): Promise<GeocodeResult> {
  const apiKey = process.env.OPENCAGE_API_KEY
  if (!apiKey) throw new Error('OPENCAGE_API_KEY env var is not set')

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}&limit=1&no_annotations=0`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`OpenCage API error: ${res.status}`)

  const data = await res.json()

  if (!data.results?.length) {
    throw new Error(`Place not found: "${place}". Try a more specific city name.`)
  }

  const result = data.results[0]
  const { lat, lng } = result.geometry
  const timezone = result.annotations?.timezone?.name

  if (!timezone) {
    throw new Error(`Could not determine timezone for "${place}"`)
  }

  return {
    latitude: lat,
    longitude: lng,
    timezone,
    formattedPlace: result.formatted,
  }
}
```

- [ ] **Step 2: Manual smoke test (requires OPENCAGE_API_KEY set)**

```bash
node -e "
require('dotenv').config({ path: '.env.local' })
// Quick import test — actual API call done via the calculate route
console.log('geocode.ts exports look correct')
"
```

Expected: no import errors.

- [ ] **Step 3: Commit**

```bash
git add lib/astro/geocode.ts
git commit -m "feat(kundli): add OpenCage geocoding wrapper"
```

---

## Task 6: Supabase Clients + Migration

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `supabase/migrations/001_kundli_tables.sql`

- [ ] **Step 1: Create lib/supabase/client.ts**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create lib/supabase/server.ts**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookie setting ignored
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create migration SQL**

Create `supabase/migrations/001_kundli_tables.sql`:

```sql
-- Charts: one row per generated Kundli
create table if not exists charts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text,
  dob         date not null,
  tob         time not null,
  place       text not null,
  latitude    float not null,
  longitude   float not null,
  timezone    text not null,
  kundli_data jsonb not null,
  created_at  timestamptz default now()
);

-- Interpretations: one per (chart, topic), cached after first Claude call
create table if not exists interpretations (
  id         uuid primary key default gen_random_uuid(),
  chart_id   uuid references charts on delete cascade,
  topic      text not null,
  content    text not null,
  model      text not null,
  created_at timestamptz default now(),
  unique (chart_id, topic)
);

-- Row Level Security
alter table charts enable row level security;
alter table interpretations enable row level security;

create policy "users_own_charts"
  on charts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_own_interpretations"
  on interpretations for all
  using (
    chart_id in (
      select id from charts where user_id = auth.uid()
    )
  );
```

- [ ] **Step 4: Run migration in Supabase**

Go to https://app.supabase.com → your project → SQL Editor → paste the contents of `supabase/migrations/001_kundli_tables.sql` → Run.

Expected: "Success. No rows returned."

Also enable Google OAuth in Supabase: Authentication → Providers → Google → enable and add credentials from Google Cloud Console.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/ supabase/migrations/
git commit -m "feat(kundli): add Supabase clients and database migration"
```

---

## Task 7: Calculate API Route

**Files:**
- Create: `app/api/kundli/calculate/route.ts`

- [ ] **Step 1: Create app/api/kundli/calculate/route.ts**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { geocodePlace } from '@/lib/astro/geocode'
import { calculate } from '@/lib/astro/engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, dob, tob, place } = body as {
      name?: string
      dob: string
      tob: string
      place: string
    }

    if (!dob || !tob || !place) {
      return NextResponse.json(
        { error: 'dob, tob, and place are required' },
        { status: 400 }
      )
    }

    // 1. Geocode the place name → lat, lng, timezone
    const geo = await geocodePlace(place)

    // 2. Run sidereal calculation
    const kundliData = calculate({
      date: dob,
      time: tob,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
    })

    return NextResponse.json({
      kundliData,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone,
      formattedPlace: geo.formattedPlace,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Calculation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2: Smoke test the route**

```bash
npm run dev &
sleep 3

curl -s -X POST http://localhost:3000/api/kundli/calculate \
  -H "Content-Type: application/json" \
  -d '{"dob":"1990-08-15","tob":"14:30","place":"Mumbai, India"}' | jq .
```

Expected: JSON with `kundliData.lagna`, `kundliData.planets` (9 items), `kundliData.houses` (12 items), `timezone: "Asia/Kolkata"`.

Kill the dev server: `kill %1`

- [ ] **Step 3: Commit**

```bash
git add app/api/kundli/calculate/
git commit -m "feat(kundli): add calculate API route (geocode + swisseph)"
```

---

## Task 8: KundliChart SVG Component

**Files:**
- Create: `app/kundli/components/KundliChart.tsx`

- [ ] **Step 1: Create app/kundli/components/KundliChart.tsx**

```tsx
import type { KundliData } from '@/lib/astro/types'

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
}

// Approximate text anchor positions for each house cell (CCW from top)
// Based on a 420×340 SVG with center at (210, 170)
const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1:  { x: 210, y: 58 },   // top diamond
  2:  { x: 108, y: 55 },   // upper-left corner
  3:  { x: 44,  y: 108 },  // left side, upper
  4:  { x: 58,  y: 170 },  // left diamond
  5:  { x: 44,  y: 232 },  // left side, lower
  6:  { x: 108, y: 285 },  // lower-left corner
  7:  { x: 210, y: 298 },  // bottom diamond
  8:  { x: 312, y: 285 },  // lower-right corner
  9:  { x: 376, y: 232 },  // right side, lower
  10: { x: 362, y: 170 },  // right diamond
  11: { x: 376, y: 108 },  // right side, upper
  12: { x: 312, y: 55 },   // upper-right corner
}

type Props = { data: KundliData; name?: string }

export default function KundliChart({ data, name }: Props) {
  // Group planets by house
  const planetsByHouse: Record<number, typeof data.planets> = {}
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = []
  data.planets.forEach(p => planetsByHouse[p.house]?.push(p))

  return (
    <div className="flex flex-col items-center">
      {name && (
        <p className="text-xs text-[#888] mb-2 tracking-wider uppercase">{name}</p>
      )}
      <svg
        viewBox="0 0 420 340"
        width="420"
        height="340"
        className="max-w-full"
        style={{ fontFamily: 'serif' }}
      >
        {/* Outer border */}
        <rect
          x="10" y="10" width="400" height="320"
          fill="#fffaf5" stroke="#9c6b2e" strokeWidth="2" rx="3"
        />

        {/* Internal grid lines: corner-to-center (4 lines) */}
        <line x1="10"  y1="10"  x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="410" y1="10"  x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="10"  y1="330" x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="410" y1="330" x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>

        {/* Inner diamond lines: midpoint-to-midpoint (4 lines) */}
        <line x1="210" y1="10"  x2="10"  y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="10"  x2="410" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="330" x2="10"  y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="330" x2="410" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>

        {/* House cells: number + Lagna marker + planets */}
        {Array.from({ length: 12 }, (_, i) => {
          const house = i + 1
          const pos = HOUSE_LABEL_POS[house]
          const housePlanets = planetsByHouse[house] ?? []
          const isLagna = house === 1

          return (
            <g key={house}>
              {/* House number */}
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle"
                fontSize="10"
                fill={isLagna ? '#68020d' : '#888'}
                fontWeight={isLagna ? 'bold' : 'normal'}
              >
                {isLagna ? 'As' : house}
              </text>
              {/* Lagna sign */}
              {isLagna && (
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize="9" fill="#68020d">
                  {data.lagna.sign.slice(0, 3)} {Math.floor(data.lagna.degree)}°
                </text>
              )}
              {/* Planets in this house */}
              {housePlanets.map((planet, pi) => (
                <text
                  key={planet.name}
                  x={pos.x}
                  y={pos.y + (isLagna ? 24 : 13) + pi * 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#333"
                >
                  {PLANET_ABBR[planet.name] ?? planet.name.slice(0, 2)}
                  {planet.retrograde && planet.name !== 'Rahu' && planet.name !== 'Ketu' ? '℞' : ''}
                  {' '}{Math.floor(planet.degree)}°
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/kundli/components/KundliChart.tsx
git commit -m "feat(kundli): add North Indian SVG chart component (CCW house numbering)"
```

---

## Task 9: PlanetTable Component

**Files:**
- Create: `app/kundli/components/PlanetTable.tsx`

- [ ] **Step 1: Create app/kundli/components/PlanetTable.tsx**

```tsx
import type { KundliData } from '@/lib/astro/types'

const DIGNITY_COLORS: Record<string, string> = {
  exalted:     'text-yellow-600 font-semibold',
  debilitated: 'text-red-700 font-semibold',
  own:         'text-green-700 font-semibold',
  neutral:     'text-gray-500',
}

type Props = { data: KundliData }

export default function PlanetTable({ data }: Props) {
  const rows = [
    { label: 'Ascendant', sign: data.lagna.sign, degree: data.lagna.degree, house: 1, nakshatra: data.lagna.nakshatra, pada: data.lagna.pada, retrograde: false, dignity: 'neutral' as const },
    ...data.planets,
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#f5ede0] text-[#68020d]">
            <th className="text-left p-2 font-semibold">Graha</th>
            <th className="text-left p-2 font-semibold">Rashi</th>
            <th className="text-left p-2 font-semibold">Deg</th>
            <th className="text-left p-2 font-semibold">House</th>
            <th className="text-left p-2 font-semibold">Nakshatra</th>
            <th className="text-left p-2 font-semibold">Pada</th>
            <th className="text-left p-2 font-semibold">State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label ?? row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf5ee]'}>
              <td className="p-2 font-medium text-[#4a3728]">
                {'label' in row ? row.label : row.name}
                {'retrograde' in row && row.retrograde && row.name !== 'Rahu' && row.name !== 'Ketu'
                  ? <span className="ml-1 text-[10px] text-orange-600">℞</span>
                  : null}
              </td>
              <td className="p-2">{row.sign}</td>
              <td className="p-2">{row.degree.toFixed(2)}°</td>
              <td className="p-2">{'house' in row ? row.house : 1}</td>
              <td className="p-2">{row.nakshatra}</td>
              <td className="p-2">{row.pada}</td>
              <td className={`p-2 capitalize ${DIGNITY_COLORS[row.dignity]}`}>
                {row.dignity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/kundli/components/PlanetTable.tsx
git commit -m "feat(kundli): add planet positions table component"
```

---

## Task 10: BirthDetailsForm Component

**Files:**
- Create: `app/kundli/components/BirthDetailsForm.tsx`

- [ ] **Step 1: Create app/kundli/components/BirthDetailsForm.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { KundliData } from '@/lib/astro/types'

type CalculateResponse = {
  kundliData: KundliData
  latitude: number
  longitude: number
  timezone: string
  formattedPlace: string
}

type Props = {
  onResult: (result: CalculateResponse & { name?: string; dob: string; tob: string }) => void
}

export default function BirthDetailsForm({ onResult }: Props) {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [place, setPlace] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/kundli/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dob, tob, place }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Calculation failed')
      onResult({ ...data, name: name || undefined, dob, tob })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#68020d]'
  const labelClass = 'block text-[10px] text-gray-400 uppercase tracking-wider mb-1'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Full Name (optional)</label>
        <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma" />
      </div>

      <div>
        <label className={labelClass}>Date of Birth</label>
        <input className={inputClass} type="date" value={dob} onChange={e => setDob(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Time of Birth (24h)</label>
        <input className={inputClass} type="time" value={tob} onChange={e => setTob(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Place of Birth</label>
        <input className={inputClass} value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. Mumbai, India" required />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#68020d] text-white py-2.5 rounded text-xs tracking-widest uppercase font-medium hover:bg-[#4a0109] disabled:opacity-60 transition-colors"
      >
        {loading ? 'Calculating...' : 'Generate Kundli'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/kundli/components/BirthDetailsForm.tsx
git commit -m "feat(kundli): add birth details form component"
```

---

## Task 11: Interpret Prompt Builder

**Files:**
- Create: `lib/astro/interpret.ts`

- [ ] **Step 1: Create lib/astro/interpret.ts**

```ts
import type { KundliData, InterpretationTopic } from './types'

const TOPIC_FOCUS: Record<InterpretationTopic, string> = {
  lagna: 'The Ascendant sign, Lagna lord (its sign, house, and strength), physical constitution, personality traits, and overall life approach.',
  moon: 'Moon sign, nakshatra, and house. Emotional nature, mind, mental habits, relationship with mother, and psychological tendencies.',
  career: '10th house sign and lord, planets in the 10th house, Sun placement. Suitable career fields, professional strengths, and timing of career growth.',
  relationships: '7th house sign and lord, Venus placement, Mars placement. Nature of partnerships, spouse qualities, and relationship patterns.',
  health: '6th house sign and lord, Lagna lord strength, Mars and Saturn placements. Constitutional strengths, vulnerable areas, and health tendencies.',
}

export function buildSystemPrompt(): string {
  return `You are a senior Jyotishi with 30 years of expertise in classical Parashari Vedic astrology. Interpret birth charts with precision, grounding every insight in the actual planetary positions provided. Write in warm, accessible English — insightful and specific, not generic. 2–3 paragraphs per topic. Do not repeat the planet data back to the reader; interpret it.`
}

export function buildUserPrompt(data: KundliData, topic: InterpretationTopic): string {
  const planetLines = data.planets
    .map(p => {
      const retro = p.retrograde ? ' ℞' : ''
      const dig = p.dignity !== 'neutral' ? ` [${p.dignity}]` : ''
      return `${p.name}: ${p.sign} ${p.degree.toFixed(1)}° — House ${p.house} — ${p.nakshatra} pada ${p.pada}${retro}${dig}`
    })
    .join('\n')

  return `Interpret the topic "${topic.toUpperCase()}" for this Vedic birth chart:

Lagna (Ascendant): ${data.lagna.sign} ${data.lagna.degree.toFixed(1)}° — ${data.lagna.nakshatra} pada ${data.lagna.pada}

Planets:
${planetLines}

Focus specifically on: ${TOPIC_FOCUS[topic]}`
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/astro/interpret.ts
git commit -m "feat(kundli): add Claude prompt builder for chart interpretation"
```

---

## Task 12: Interpret API Route (Streaming)

**Files:**
- Create: `app/api/kundli/interpret/route.ts`

- [ ] **Step 1: Create app/api/kundli/interpret/route.ts**

```ts
import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/astro/interpret'
import type { InterpretationTopic, KundliData } from '@/lib/astro/types'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Auth check: only signed-in users can generate interpretations
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Sign in to generate interpretations' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { chartId, topic } = await req.json() as {
    chartId: string
    topic: InterpretationTopic
  }

  // Fetch chart (RLS enforces ownership)
  const { data: chart, error: chartErr } = await supabase
    .from('charts')
    .select('kundli_data')
    .eq('id', chartId)
    .single()

  if (chartErr || !chart) {
    return new Response(JSON.stringify({ error: 'Chart not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Return cached interpretation if it exists
  const { data: cached } = await supabase
    .from('interpretations')
    .select('content')
    .eq('chart_id', chartId)
    .eq('topic', topic)
    .single()

  if (cached) {
    // Return cached text in AI SDK data stream format so useCompletion parses it correctly
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(cached.content)}\n`))
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
      },
    })
  }

  // Generate new interpretation via Claude
  const kundliData = chart.kundli_data as KundliData
  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(),
    prompt: buildUserPrompt(kundliData, topic),
    onFinish: async ({ text }) => {
      // Cache the completed interpretation
      await supabase.from('interpretations').upsert({
        chart_id: chartId,
        topic,
        content: text,
        model: 'claude-sonnet-4-6',
      }, { onConflict: 'chart_id,topic' })
    },
  })

  return result.toDataStreamResponse()
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/kundli/interpret/
git commit -m "feat(kundli): add streaming interpretation API route with Supabase caching"
```

---

## Task 13: InterpretationPanel Component

**Files:**
- Create: `app/kundli/components/InterpretationPanel.tsx`

- [ ] **Step 1: Create app/kundli/components/InterpretationPanel.tsx**

```tsx
'use client'

import { useState } from 'react'
import { useCompletion } from 'ai/react'
import type { InterpretationTopic } from '@/lib/astro/types'

const TOPICS: { id: InterpretationTopic; label: string }[] = [
  { id: 'lagna',         label: 'Lagna' },
  { id: 'moon',          label: 'Moon Sign' },
  { id: 'career',        label: 'Career' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'health',        label: 'Health' },
]

type Props = { chartId: string; isAuthenticated: boolean }

export default function InterpretationPanel({ chartId, isAuthenticated }: Props) {
  const [activeTopic, setActiveTopic] = useState<InterpretationTopic>('lagna')

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/kundli/interpret',
  })

  function handleGenerate() {
    complete('', { body: { chartId, topic: activeTopic } })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Topic tabs */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTopic(t.id)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeTopic === t.id
                ? 'bg-[#68020d] text-white'
                : 'bg-[#f5ede0] text-[#68020d] hover:bg-[#ead5b5]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Output area */}
      <div className="min-h-[120px] border-l-4 border-[#9c6b2e] pl-4">
        {!isAuthenticated ? (
          <p className="text-sm text-gray-400 italic">
            Sign in to generate AI interpretations for your chart.
          </p>
        ) : completion ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{completion}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Click Generate to receive an interpretation for <strong>{activeTopic}</strong>.
          </p>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
      </div>

      {/* Generate button */}
      {isAuthenticated && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="self-start bg-[#68020d] text-white px-4 py-1.5 rounded text-xs tracking-wider uppercase hover:bg-[#4a0109] disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Generating...' : `Generate — ${TOPICS.find(t => t.id === activeTopic)?.label}`}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/kundli/components/InterpretationPanel.tsx
git commit -m "feat(kundli): add streaming interpretation panel with topic tabs"
```

---

## Task 14: Server Actions + Save/Load

**Files:**
- Create: `app/kundli/actions.ts`

- [ ] **Step 1: Create app/kundli/actions.ts**

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { KundliData } from '@/lib/astro/types'
import { revalidatePath } from 'next/cache'

export type SaveChartInput = {
  name?: string
  dob: string
  tob: string
  place: string
  latitude: number
  longitude: number
  timezone: string
  kundliData: KundliData
}

export type SavedChart = {
  id: string
  name: string | null
  dob: string
  tob: string
  place: string
  latitude: number
  longitude: number
  timezone: string
  kundli_data: KundliData
  created_at: string
}

export async function saveChart(input: SaveChartInput): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('charts')
    .insert({
      user_id: user.id,
      name: input.name ?? null,
      dob: input.dob,
      tob: input.tob,
      place: input.place,
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone,
      kundli_data: input.kundliData,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/kundli')
  return { id: data.id }
}

export async function getSavedCharts(): Promise<SavedChart[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('charts')
    .select('id, name, dob, tob, place, latitude, longitude, timezone, kundli_data, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (data ?? []) as SavedChart[]
}
```

- [ ] **Step 2: Commit**

```bash
git add app/kundli/actions.ts
git commit -m "feat(kundli): add save chart and load saved charts Server Actions"
```

---

## Task 15: Kundli Page — Wire Everything Together

**Files:**
- Create: `app/kundli/components/KundliPageClient.tsx`
- Create: `app/kundli/page.tsx`

- [ ] **Step 1: Create app/kundli/components/KundliPageClient.tsx**

```tsx
'use client'

import { useState } from 'react'
import BirthDetailsForm from './BirthDetailsForm'
import KundliChart from './KundliChart'
import PlanetTable from './PlanetTable'
import InterpretationPanel from './InterpretationPanel'
import { saveChart } from '@/app/kundli/actions'
import type { KundliData } from '@/lib/astro/types'
import type { SavedChart } from '@/app/kundli/actions'

type ChartResult = {
  kundliData: KundliData
  latitude: number
  longitude: number
  timezone: string
  formattedPlace: string
  name?: string
  dob: string
  tob: string
}

type Props = {
  isAuthenticated: boolean
  savedCharts: SavedChart[]
}

export default function KundliPageClient({ isAuthenticated, savedCharts }: Props) {
  const [result, setResult] = useState<ChartResult | null>(null)
  const [savedChartId, setSavedChartId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  function loadSavedChart(chart: SavedChart) {
    setResult({
      kundliData: chart.kundli_data,
      latitude: chart.latitude,
      longitude: chart.longitude,
      timezone: chart.timezone,
      formattedPlace: chart.place,
      name: chart.name ?? undefined,
      dob: chart.dob,
      tob: chart.tob,
    })
    setSavedChartId(chart.id)
    setSaveMsg(null)
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    setSaveMsg(null)
    const res = await saveChart({
      name: result.name,
      dob: result.dob,
      tob: result.tob,
      place: result.formattedPlace,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      kundliData: result.kundliData,
    })
    if ('error' in res) {
      setSaveMsg(res.error)
    } else {
      setSavedChartId(res.id)
      setSaveMsg('Chart saved!')
    }
    setSaving(false)
  }

  return (
    <div className="flex min-h-screen bg-[#fffaf5]">
      {/* Sidebar */}
      <aside className="w-64 min-w-[16rem] border-r border-[#e8d5b0] bg-[#fff8f0] p-5 flex flex-col gap-5">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">Birth Details</p>
          <BirthDetailsForm onResult={(r) => { setResult(r); setSavedChartId(null); setSaveMsg(null) }} />
        </div>

        {isAuthenticated && savedCharts.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Saved Charts</p>
            <ul className="flex flex-col gap-1">
              {savedCharts.map(chart => (
                <li key={chart.id}>
                  <button
                    onClick={() => loadSavedChart(chart)}
                    className="w-full text-left text-xs text-[#68020d] hover:underline py-1 border-b border-[#f0e0d0]"
                  >
                    {chart.name ?? 'Unnamed'} · {chart.dob}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {!result ? (
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <p className="text-gray-400 text-sm">Enter birth details to generate a Kundli</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Chart + Table */}
            <div className="flex flex-wrap gap-6">
              <KundliChart data={result.kundliData} name={result.name} />
              <div className="flex-1 min-w-[320px]">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Planet Positions</p>
                <PlanetTable data={result.kundliData} />
              </div>
            </div>

            {/* Save bar */}
            <div className="flex items-center gap-3 py-3 border-t border-[#e8d5b0]">
              {isAuthenticated && !savedChartId && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#68020d] text-white px-4 py-1.5 rounded text-xs tracking-wider uppercase hover:bg-[#4a0109] disabled:opacity-60 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Chart'}
                </button>
              )}
              {!isAuthenticated && (
                <p className="text-xs text-gray-400">Sign in to save this chart</p>
              )}
              {saveMsg && <p className="text-xs text-green-600">{saveMsg}</p>}
            </div>

            {/* AI Interpretation */}
            {savedChartId && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                  AI Interpretation{' '}
                  <span className="text-[#9c6b2e] normal-case tracking-normal">✦ Claude</span>
                </p>
                <InterpretationPanel chartId={savedChartId} isAuthenticated={isAuthenticated} />
              </div>
            )}
            {!savedChartId && isAuthenticated && (
              <p className="text-xs text-gray-400 italic">Save the chart to unlock AI interpretation</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Create app/kundli/page.tsx**

```tsx
import { createClient } from '@/lib/supabase/server'
import { getSavedCharts } from './actions'
import KundliPageClient from './components/KundliPageClient'

export const metadata = {
  title: "Free Kundli Generator — Deepa's Vision",
  description: 'Generate your Vedic birth chart (Kundli) with accurate sidereal calculations and AI-powered interpretation.',
}

export default async function KundliPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const savedCharts = user ? await getSavedCharts() : []

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#68020d] text-white py-3 px-6 text-center">
        <h1 className="text-lg font-bold tracking-widest uppercase">Free Kundli Generator</h1>
        <p className="text-[11px] text-white/70 mt-0.5">
          Sidereal Vedic chart · Lahiri Ayanamsa · North Indian style
        </p>
      </div>

      <KundliPageClient
        isAuthenticated={!!user}
        savedCharts={savedCharts}
      />
    </div>
  )
}
```

- [ ] **Step 3: Run the dev server and test the full flow**

```bash
npm run dev
```

Open http://localhost:3000/kundli in a browser.

Test the golden path:
1. Enter birth details (e.g. Date: 1990-08-15, Time: 14:30, Place: Mumbai, India)
2. Click **Generate Kundli**
3. Verify: chart renders with CCW house numbers, planet table shows 9 planets, all signs valid
4. Sign in (Supabase Auth) — click **Save Chart**
5. Verify: "Chart saved!" message appears, AI interpretation panel unlocks
6. Click a topic tab and **Generate** — verify text streams word by word
7. Click the same topic again — verify it returns instantly (cached)
8. Reload the page — verify saved chart appears in sidebar

- [ ] **Step 4: Commit**

```bash
git add app/kundli/
git commit -m "feat(kundli): complete /kundli page with chart, table, save, and AI interpretation"
```

---

## Task 16: Auth — Supabase Sign In / Sign Out

**Files:**
- Create: `app/kundli/components/AuthButton.tsx`
- Modify: `app/kundli/page.tsx` (add AuthButton to header)
- Create: `app/auth/callback/route.ts`

- [ ] **Step 1: Create app/auth/callback/route.ts**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/kundli'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, req.url))
}
```

- [ ] **Step 2: Create app/kundli/components/AuthButton.tsx**

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = { isAuthenticated: boolean; email?: string }

export default function AuthButton({ isAuthenticated, email }: Props) {
  const router = useRouter()
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/kundli` },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3 text-xs text-white/80">
        <span>{email}</span>
        <button onClick={signOut} className="underline hover:text-white">Sign out</button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
    >
      Sign in with Google
    </button>
  )
}
```

- [ ] **Step 3: Add AuthButton to app/kundli/page.tsx header**

Replace the header section in `app/kundli/page.tsx`:

```tsx
import AuthButton from './components/AuthButton'

// Replace the header div with:
<div className="bg-[#68020d] text-white py-3 px-6 flex items-center justify-between">
  <div className="text-center flex-1">
    <h1 className="text-lg font-bold tracking-widest uppercase">Free Kundli Generator</h1>
    <p className="text-[11px] text-white/70 mt-0.5">
      Sidereal Vedic chart · Lahiri Ayanamsa · North Indian style
    </p>
  </div>
  <AuthButton isAuthenticated={!!user} email={user?.email} />
</div>
```

- [ ] **Step 4: Test auth flow**

```bash
npm run dev
```

1. Go to http://localhost:3000/kundli
2. Click **Sign in with Google** — completes OAuth, redirects back to /kundli
3. Verify: email shows in header, "Save Chart" button appears after generating
4. Sign out — verify header returns to sign-in button

- [ ] **Step 5: Run all tests**

```bash
npm run test:run
```

Expected: all tests pass (nakshatra + engine tests).

- [ ] **Step 6: Final commit**

```bash
git add app/kundli/components/AuthButton.tsx app/auth/ app/kundli/page.tsx
git commit -m "feat(kundli): add Supabase Google OAuth sign in/out flow"
```

---

## Completion Checklist

- [ ] `npm run test:run` — all tests green
- [ ] `npm run build` — builds without errors
- [ ] `/kundli` loads with birth details form
- [ ] Calculation returns 9 planets, valid signs, CCW house numbers in chart
- [ ] Google sign-in works, redirects back to `/kundli`
- [ ] Save chart saves to Supabase, saved charts appear in sidebar
- [ ] AI interpretation streams for each topic, caches on second request
- [ ] Sign-out clears session
