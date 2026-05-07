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
