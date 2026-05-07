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
