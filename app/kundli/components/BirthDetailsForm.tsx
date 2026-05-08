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
