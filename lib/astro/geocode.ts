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
