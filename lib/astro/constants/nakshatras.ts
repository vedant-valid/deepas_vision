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
