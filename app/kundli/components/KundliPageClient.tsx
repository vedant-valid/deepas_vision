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
    <div className="flex min-h-screen bg-[#fffaf5]">
      {/* Sidebar */}
      <aside className="w-64 min-w-[16rem] bg-white border-r border-[#e8d5c4] p-6 flex flex-col gap-7 shadow-sm">

        <div>
          <p
            className="text-[11px] text-[#68020d] uppercase tracking-[3px] mb-5 pb-2 border-b border-[#e8d5c4] font-medium"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Birth Details
          </p>
          <BirthDetailsForm onResult={(r) => { setResult(r); setSavedChartId(null); setSaveMsg(null) }} />
        </div>

        {isAuthenticated && savedCharts.length > 0 && (
          <div>
            <p
              className="text-[11px] text-[#68020d] uppercase tracking-[3px] mb-3 pb-2 border-b border-[#e8d5c4] font-medium"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              Saved Charts
            </p>
            <ul className="flex flex-col gap-1">
              {savedCharts.map(chart => (
                <li key={chart.id}>
                  <button
                    onClick={() => loadSavedChart(chart)}
                    className="w-full text-left text-[12px] text-[#68020d]/70 hover:text-[#68020d] hover:bg-[#fdf0eb] py-2 px-3 rounded transition-colors"
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
      <main className="flex-1 overflow-auto p-8 bg-[#fffaf5]">
        {!result ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-3">
            <div className="w-12 h-px bg-[#68020d]/20" />
            <p className="text-[#68020d]/40 text-sm tracking-widest">
              Enter birth details to generate a Kundli
            </p>
            <div className="w-12 h-px bg-[#68020d]/20" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap gap-8">
              <KundliChart data={result.kundliData} name={result.name} />
              <div className="flex-1 min-w-[320px]">
                <p
                  className="text-[11px] text-[#68020d] uppercase tracking-[3px] mb-4 pb-2 border-b border-[#e8d5c4] font-medium"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  Planet Positions
                </p>
                <PlanetTable data={result.kundliData} />
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-t border-[#e8d5c4]">
              {isAuthenticated && !savedChartId && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#68020d] hover:bg-[#4a0109] text-white text-[12px] tracking-wider px-5 py-2.5 rounded-sm uppercase transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Chart'}
                </button>
              )}
              {!isAuthenticated && (
                <p className="text-[12px] text-[#68020d]/50 italic">Sign in to save this chart</p>
              )}
              {saveMsg && <p className="text-[12px] text-emerald-700 font-medium">{saveMsg}</p>}
            </div>

            {savedChartId && (
              <div className="bg-white rounded-sm border border-[#e8d5c4] p-6 shadow-sm">
                <p
                  className="text-[11px] text-[#68020d] uppercase tracking-[3px] mb-5 pb-2 border-b border-[#e8d5c4] font-medium"
                  style={{ fontFamily: 'var(--font-cinzel)' }}
                >
                  AI Interpretation{' '}
                  <span className="text-[#9c6b2e] normal-case tracking-normal text-[10px]">✦ Claude</span>
                </p>
                <InterpretationPanel chartId={savedChartId} isAuthenticated={isAuthenticated} />
              </div>
            )}
            {!savedChartId && isAuthenticated && (
              <p className="text-[12px] text-[#68020d]/40 italic">Save the chart to unlock AI interpretation</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
