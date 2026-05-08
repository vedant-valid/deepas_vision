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
