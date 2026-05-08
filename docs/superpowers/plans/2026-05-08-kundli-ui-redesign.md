# Kundli UI Redesign — Sacred/Temple Theme

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the `/kundli` page to a Sacred/Temple aesthetic — deep burgundy backgrounds, gold (#c9a84c) accents, ornate borders, and serif typography.

**Architecture:** Pure styling pass across 7 components. No logic changes. Each task is one file, self-contained.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS, inline styles for gradient/rgba values Tailwind can't express, SVG for the chart.

---

## Task 1: Restyle `app/kundli/page.tsx` — Header

**Files:**
- Modify: `app/kundli/page.tsx`

- [ ] **Replace the file content:**

```tsx
import KundliPageClient from './components/KundliPageClient'
import AuthButton from './components/AuthButton'
import { createClient } from '@/lib/supabase/server'
import { getSavedCharts } from './actions'
import Link from 'next/link'

export const metadata = {
  title: "Free Kundli Generator — Deepa's Vision",
  description: 'Generate your Vedic birth chart (Kundli) with accurate sidereal calculations and AI-powered interpretation.',
}

export default async function KundliPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user
  const savedCharts = isAuthenticated ? await getSavedCharts() : []

  return (
    <div className="min-h-screen bg-[#0d0500]">
      <header
        className="relative flex items-center justify-between px-6 py-3 border-b border-[#c9a84c]"
        style={{ background: 'linear-gradient(90deg, #1a0800 0%, #3d1000 50%, #1a0800 100%)' }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #f0d080 50%, #c9a84c 70%, transparent)' }}
        />
        <Link href="/" className="text-[#c9a84c]/60 text-[10px] tracking-widest hover:text-[#c9a84c] transition-colors">
          ← HOME
        </Link>
        <div className="text-center flex-1">
          <h1
            className="text-sm tracking-[4px] uppercase text-[#c9a84c]"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            ✦ Free Kundli Generator ✦
          </h1>
          <p className="text-[9px] text-[#c9a84c]/45 mt-1 tracking-[2px]">
            Sidereal Vedic chart &nbsp;·&nbsp; Lahiri Ayanamsa &nbsp;·&nbsp; North Indian style
          </p>
        </div>
        <AuthButton isAuthenticated={isAuthenticated} email={user?.email} />
      </header>
      <KundliPageClient isAuthenticated={isAuthenticated} savedCharts={savedCharts} />
    </div>
  )
}
```

- [ ] **Verify it compiles:** Check the dev server terminal for errors on `http://localhost:3001/kundli`

- [ ] **Commit:**
```bash
git add app/kundli/page.tsx
git commit -m "style(kundli): sacred/temple header — gold gradient, back link, Cinzel title"
```

---

## Task 2: Restyle `AuthButton.tsx` — Gold bordered auth button

**Files:**
- Modify: `app/kundli/components/AuthButton.tsx`

- [ ] **Replace the file content:**

```tsx
'use client'

import { useRouter } from 'next/navigation'

type Props = { isAuthenticated: boolean; email?: string }

export default function AuthButton({ isAuthenticated, email }: Props) {
  const router = useRouter()

  async function signInWithGoogle() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/kundli` },
    })
  }

  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#c9a84c]/60 tracking-wide hidden sm:block">{email}</span>
        <button
          onClick={signOut}
          className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/40 px-3 py-1.5 tracking-widest hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/40 px-3 py-1.5 tracking-widest hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors whitespace-nowrap"
    >
      SIGN IN
    </button>
  )
}
```

- [ ] **Commit:**
```bash
git add app/kundli/components/AuthButton.tsx
git commit -m "style(kundli): sacred auth button — gold border, tracked caps"
```

---

## Task 3: Restyle `KundliPageClient.tsx` — Dark body, sidebar, save bar

**Files:**
- Modify: `app/kundli/components/KundliPageClient.tsx`

- [ ] **Replace the file content:**

```tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BirthDetailsForm from './BirthDetailsForm'
import KundliChart from './KundliChart'
import PlanetTable from './PlanetTable'
import { saveChart } from '@/app/kundli/actions'
import type { KundliData } from '@/lib/astro/types'
import type { SavedChart } from '@/app/kundli/actions'

const InterpretationPanel = dynamic(() => import('./InterpretationPanel'), { ssr: false })

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
    <div className="flex min-h-screen bg-[#0d0500]">
      {/* Sidebar */}
      <aside
        className="w-64 min-w-[16rem] border-r border-[#c9a84c]/20 p-5 flex flex-col gap-6"
        style={{ background: 'rgba(201,168,76,0.03)' }}
      >
        <div>
          <p className="text-[8px] text-[#c9a84c] uppercase tracking-[3px] mb-4 text-center border-b border-[#c9a84c]/20 pb-2">
            — Birth Details —
          </p>
          <BirthDetailsForm onResult={(r) => { setResult(r); setSavedChartId(null); setSaveMsg(null) }} />
        </div>

        {isAuthenticated && savedCharts.length > 0 && (
          <div>
            <p className="text-[8px] text-[#c9a84c] uppercase tracking-[3px] mb-3 text-center border-b border-[#c9a84c]/20 pb-2">
              — Saved Charts —
            </p>
            <ul className="flex flex-col gap-1">
              {savedCharts.map(chart => (
                <li key={chart.id}>
                  <button
                    onClick={() => loadSavedChart(chart)}
                    className="w-full text-left text-[10px] text-[#c9a84c]/70 hover:text-[#c9a84c] py-1.5 px-2 border border-[#c9a84c]/10 hover:border-[#c9a84c]/40 transition-colors"
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
            <p className="text-[#c9a84c]/30 text-sm tracking-widest italic">
              Enter birth details to generate a Kundli
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6">
              <KundliChart data={result.kundliData} name={result.name} />
              <div className="flex-1 min-w-[320px]">
                <p className="text-[8px] text-[#c9a84c] uppercase tracking-[3px] mb-3 border-b border-[#c9a84c]/20 pb-2">
                  — Planet Positions —
                </p>
                <PlanetTable data={result.kundliData} />
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-[#c9a84c]/15">
              {isAuthenticated && !savedChartId && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="border border-[#c9a84c]/60 text-[#c9a84c] px-5 py-2 text-[8px] tracking-[2px] uppercase hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : '✦ Save Chart'}
                </button>
              )}
              {!isAuthenticated && (
                <p className="text-[10px] text-[#c9a84c]/35 italic">Sign in to save this chart</p>
              )}
              {saveMsg && <p className="text-[10px] text-[#c9a84c]">{saveMsg}</p>}
            </div>

            {savedChartId && (
              <div
                className="border border-[#c9a84c]/20 p-5"
                style={{ background: 'rgba(201,168,76,0.02)' }}
              >
                <p className="text-[8px] text-[#c9a84c] uppercase tracking-[3px] mb-4 border-b border-[#c9a84c]/20 pb-2">
                  — AI Interpretation &nbsp;<span className="text-[#c9a84c]/50 normal-case tracking-normal">✦ Claude</span> —
                </p>
                <InterpretationPanel chartId={savedChartId} isAuthenticated={isAuthenticated} />
              </div>
            )}
            {!savedChartId && isAuthenticated && (
              <p className="text-[10px] text-[#c9a84c]/30 italic">Save the chart to unlock AI interpretation</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Commit:**
```bash
git add app/kundli/components/KundliPageClient.tsx
git commit -m "style(kundli): sacred page body — dark bg, gold sidebar, section titles"
```

---

## Task 4: Restyle `BirthDetailsForm.tsx` — Sacred form inputs

**Files:**
- Modify: `app/kundli/components/BirthDetailsForm.tsx`

- [ ] **Replace the file content:**

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

  const inputStyle = { background: 'rgba(255,255,255,0.03)' }
  const inputClass =
    'w-full text-[11px] text-[#e8d5a0] px-3 py-2 border border-[#c9a84c]/25 outline-none focus:border-[#c9a84c]/60 transition-colors font-serif placeholder:text-[#c9a84c]/20'
  const labelClass = 'block text-[8px] text-[#c9a84c]/55 uppercase tracking-[2px] mb-1'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className={labelClass}>Full Name (optional)</label>
        <input className={inputClass} style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Arjun Sharma" />
      </div>
      <div>
        <label className={labelClass}>Date of Birth</label>
        <input className={inputClass} style={inputStyle} type="date" value={dob} onChange={e => setDob(e.target.value)} required />
      </div>
      <div>
        <label className={labelClass}>Time of Birth (24h)</label>
        <input className={inputClass} style={inputStyle} type="time" value={tob} onChange={e => setTob(e.target.value)} required />
      </div>
      <div>
        <label className={labelClass}>Place of Birth</label>
        <input className={inputClass} style={inputStyle} value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. Mumbai, India" required />
      </div>

      {error && (
        <p
          className="text-[10px] text-[#e07050] border border-[#e07050]/30 px-3 py-2"
          style={{ background: 'rgba(224,112,80,0.05)' }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 text-[8px] tracking-[3px] uppercase font-bold font-serif disabled:opacity-60 transition-opacity relative"
        style={{ background: 'linear-gradient(90deg, #8b1a00, #c9a84c 50%, #8b1a00)', color: '#0d0500' }}
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px]">✦</span>
        {loading ? 'Calculating...' : 'Generate Kundli'}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px]">✦</span>
      </button>
    </form>
  )
}
```

- [ ] **Commit:**
```bash
git add app/kundli/components/BirthDetailsForm.tsx
git commit -m "style(kundli): sacred form — gold inputs, gradient generate button with ornaments"
```

---

## Task 5: Restyle `KundliChart.tsx` — Dark SVG with gold lines

**Files:**
- Modify: `app/kundli/components/KundliChart.tsx`

- [ ] **Replace the file content:**

```tsx
import type { KundliData } from '@/lib/astro/types'

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
}

const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1:  { x: 210, y: 58 },
  2:  { x: 108, y: 55 },
  3:  { x: 44,  y: 108 },
  4:  { x: 58,  y: 170 },
  5:  { x: 44,  y: 232 },
  6:  { x: 108, y: 285 },
  7:  { x: 210, y: 298 },
  8:  { x: 312, y: 285 },
  9:  { x: 376, y: 232 },
  10: { x: 362, y: 170 },
  11: { x: 376, y: 108 },
  12: { x: 312, y: 55 },
}

type Props = { data: KundliData; name?: string }

export default function KundliChart({ data, name }: Props) {
  const planetsByHouse: Record<number, typeof data.planets> = {}
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = []
  data.planets.forEach(p => planetsByHouse[p.house]?.push(p))

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[8px] text-[#c9a84c] uppercase tracking-[3px] border-b border-[#c9a84c]/20 pb-2 w-full text-center">
        — Birth Chart (Lagna) —
      </p>
      {name && (
        <p className="text-[10px] text-[#c9a84c]/50 tracking-wider uppercase">{name}</p>
      )}
      <svg
        viewBox="0 0 420 340"
        width="420"
        height="340"
        className="max-w-full"
        style={{ fontFamily: 'serif', filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.1))' }}
      >
        {/* Outer border */}
        <rect
          x="10" y="10" width="400" height="320"
          fill="#0d0500" stroke="#c9a84c" strokeWidth="1.5" rx="2"
        />

        {/* Corner-to-center lines */}
        <line x1="10"  y1="10"  x2="210" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="410" y1="10"  x2="210" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="10"  y1="330" x2="210" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="410" y1="330" x2="210" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>

        {/* Midpoint-to-midpoint lines (inner diamond) */}
        <line x1="210" y1="10"  x2="10"  y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="210" y1="10"  x2="410" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="210" y1="330" x2="10"  y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="210" y1="330" x2="410" y2="170" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>

        {Array.from({ length: 12 }, (_, i) => {
          const house = i + 1
          const pos = HOUSE_LABEL_POS[house]
          const housePlanets = planetsByHouse[house] ?? []
          const isLagna = house === 1

          return (
            <g key={house}>
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle"
                fontSize="10"
                fill={isLagna ? '#f0d080' : 'rgba(201,168,76,0.5)'}
                fontWeight={isLagna ? 'bold' : 'normal'}
              >
                {isLagna ? 'As' : house}
              </text>
              {isLagna && (
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize="9" fill="#f0d080">
                  {data.lagna.sign.slice(0, 3)} {Math.floor(data.lagna.degree)}°
                </text>
              )}
              {housePlanets.map((planet, pi) => (
                <text
                  key={planet.name}
                  x={pos.x}
                  y={pos.y + (isLagna ? 24 : 13) + pi * 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#e8d5a0"
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
      <p className="text-[#c9a84c]/25 text-xs tracking-[6px]">✦ &nbsp; ✦ &nbsp; ✦</p>
    </div>
  )
}
```

- [ ] **Commit:**
```bash
git add app/kundli/components/KundliChart.tsx
git commit -m "style(kundli): sacred chart — dark SVG, gold lines and labels, lagna highlight"
```

---

## Task 6: Restyle `PlanetTable.tsx` — Dark table with gold headers

**Files:**
- Modify: `app/kundli/components/PlanetTable.tsx`

- [ ] **Replace the file content:**

```tsx
import type { KundliData } from '@/lib/astro/types'

const DIGNITY_STYLE: Record<string, string> = {
  exalted:     'text-[#80d080]',
  debilitated: 'text-[#e07050]',
  own:         'text-[#80d080]',
  neutral:     'text-[#c9a84c]/40',
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
          <tr style={{ background: 'rgba(201,168,76,0.06)' }}>
            {['Graha', 'Rashi', 'Deg', 'House', 'Nakshatra', 'Pada', 'State'].map(h => (
              <th key={h} className="text-left p-2 text-[8px] text-[#c9a84c]/60 uppercase tracking-[2px] font-normal border-b border-[#c9a84c]/15">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={'label' in row ? row.label : row.name}
              className="border-b border-[#c9a84c]/08 hover:bg-[#c9a84c]/05 transition-colors"
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)' }}
            >
              <td className="p-2 text-[#e8d5a0] font-medium">
                {'label' in row ? row.label : row.name}
                {'retrograde' in row && row.retrograde && (row as any).name !== 'Rahu' && (row as any).name !== 'Ketu'
                  ? <span className="ml-1 text-[9px] text-[#e07050]">℞</span>
                  : null}
              </td>
              <td className="p-2 text-[#e8d5a0]/80">{row.sign}</td>
              <td className="p-2 text-[#e8d5a0]/70">{row.degree.toFixed(2)}°</td>
              <td className="p-2 text-[#c9a84c]/60">{row.house}</td>
              <td className="p-2 text-[#e8d5a0]/70">{row.nakshatra}</td>
              <td className="p-2 text-[#c9a84c]/50">{row.pada}</td>
              <td className={`p-2 capitalize text-[11px] ${DIGNITY_STYLE[row.dignity]}`}>
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

- [ ] **Commit:**
```bash
git add app/kundli/components/PlanetTable.tsx
git commit -m "style(kundli): sacred planet table — dark rows, gold headers, colored dignity"
```

---

## Task 7: Restyle `InterpretationPanel.tsx` — Sacred topic tabs and text

**Files:**
- Modify: `app/kundli/components/InterpretationPanel.tsx`

- [ ] **Replace the file content:**

```tsx
'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
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
  const [topicResults, setTopicResults] = useState<Partial<Record<InterpretationTopic, string>>>({})

  const { completion, complete, isLoading, error, setCompletion } = useCompletion({
    api: '/api/kundli/interpret',
    onFinish: (_prompt, completion) => {
      setTopicResults(prev => ({ ...prev, [activeTopic]: completion }))
    },
  })

  function handleTopicChange(topic: InterpretationTopic) {
    setActiveTopic(topic)
    setCompletion(topicResults[topic] ?? '')
  }

  function handleGenerate() {
    complete('', { body: { chartId, topic: activeTopic } })
  }

  const displayText = completion || topicResults[activeTopic] || ''

  return (
    <div className="flex flex-col gap-4">
      {/* Topic tabs */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTopicChange(t.id)}
            className={`px-3 py-1.5 text-[8px] tracking-[2px] uppercase transition-colors border ${
              activeTopic === t.id
                ? 'border-[#c9a84c]/60 text-[#c9a84c]'
                : 'border-[#c9a84c]/15 text-[#c9a84c]/40 hover:border-[#c9a84c]/35 hover:text-[#c9a84c]/70'
            }`}
            style={activeTopic === t.id ? { background: 'rgba(201,168,76,0.08)' } : {}}
          >
            {t.label}
            {topicResults[t.id] ? ' ✓' : ''}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="min-h-[120px] border-l-2 border-[#c9a84c]/30 pl-4">
        {!isAuthenticated ? (
          <p className="text-[11px] text-[#c9a84c]/35 italic leading-relaxed">
            Sign in to generate AI interpretations for your chart.
          </p>
        ) : displayText ? (
          <p className="text-[11px] text-[#e8d5a0]/70 leading-[1.8] whitespace-pre-wrap italic">{displayText}</p>
        ) : (
          <p className="text-[11px] text-[#c9a84c]/30 italic">
            Click Generate to receive an interpretation for <span className="text-[#c9a84c]/50">{activeTopic}</span>.
          </p>
        )}
        {error && <p className="text-[10px] text-[#e07050] mt-2">{error.message}</p>}
      </div>

      {/* Generate button */}
      {isAuthenticated && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="self-start border border-[#c9a84c]/50 text-[#c9a84c] px-5 py-2 text-[8px] tracking-[2px] uppercase hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Generating...' : `✦ Generate — ${TOPICS.find(t => t.id === activeTopic)?.label}`}
        </button>
      )}
    </div>
  )
}
```

- [ ] **Commit:**
```bash
git add app/kundli/components/InterpretationPanel.tsx
git commit -m "style(kundli): sacred interpretation panel — gold tabs, dark text area, square buttons"
```

---

## Task 8: Final check

- [ ] Open `http://localhost:3001/kundli` in the browser
- [ ] Verify: dark burgundy background across the full page
- [ ] Verify: gold header with shimmer line, ← HOME link, Cinzel title
- [ ] Verify: sidebar has gold borders, dark inputs, gradient Generate button with ✦ ornaments
- [ ] Verify: chart SVG has dark fill, gold lines, gold house labels
- [ ] Verify: planet table has dark rows, gold headers, green/red dignity indicators
- [ ] Verify: interpretation panel has square gold tabs and gold-bordered Generate button
- [ ] Check browser console for errors
