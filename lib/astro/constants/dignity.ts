import type { PlanetData } from '../types'

type Dignity = PlanetData['dignity']

const EXALTATION: Record<string, string> = {
  Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
  Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra',
}

const DEBILITATION: Record<string, string> = {
  Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
  Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries',
}

const OWN_SIGNS: Record<string, readonly string[]> = {
  Sun: ['Leo'],
  Moon: ['Cancer'],
  Mars: ['Aries', 'Scorpio'],
  Mercury: ['Gemini', 'Virgo'],
  Jupiter: ['Sagittarius', 'Pisces'],
  Venus: ['Taurus', 'Libra'],
  Saturn: ['Capricorn', 'Aquarius'],
}

export function getDignity(planet: string, sign: string): Dignity {
  if (planet === 'Rahu' || planet === 'Ketu') return 'neutral'
  if (EXALTATION[planet] === sign) return 'exalted'
  if (DEBILITATION[planet] === sign) return 'debilitated'
  if (OWN_SIGNS[planet]?.includes(sign)) return 'own'
  return 'neutral'
}
