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

    const geo = await geocodePlace(place)

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
