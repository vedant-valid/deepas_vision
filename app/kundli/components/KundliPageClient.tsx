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
            <div className="flex flex-wrap gap-6">
              <KundliChart data={result.kundliData} name={result.name} />
              <div className="flex-1 min-w-[320px]">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Planet Positions</p>
                <PlanetTable data={result.kundliData} />
              </div>
            </div>

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
