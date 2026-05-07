export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const

export type SignName = typeof SIGNS[number]

export function signFromLongitude(longitude: number): string {
  const lon = ((longitude % 360) + 360) % 360
  return SIGNS[Math.floor(lon / 30)]
}

export function degreeWithinSign(longitude: number): number {
  const lon = ((longitude % 360) + 360) % 360
  return lon % 30
}

export function signIndex(sign: string): number {
  return SIGNS.indexOf(sign as SignName)
}
