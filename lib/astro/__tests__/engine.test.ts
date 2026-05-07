import { describe, it, expect } from 'vitest'
import { calculate } from '../engine'
import { SIGNS } from '../constants/signs'

const DELHI_INPUT = {
  date: '1990-08-15',
  time: '14:30',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
}

describe('calculate', () => {
  it('returns a KundliData with lagna, planets, and houses', () => {
    const result = calculate(DELHI_INPUT)
    expect(result).toHaveProperty('lagna')
    expect(result).toHaveProperty('planets')
    expect(result).toHaveProperty('houses')
  })

  it('lagna has a valid sign, degree, nakshatra, and pada', () => {
    const { lagna } = calculate(DELHI_INPUT)
    expect(SIGNS).toContain(lagna.sign)
    expect(lagna.degree).toBeGreaterThanOrEqual(0)
    expect(lagna.degree).toBeLessThan(30)
    expect(typeof lagna.nakshatra).toBe('string')
    expect([1, 2, 3, 4]).toContain(lagna.pada)
  })

  it('returns exactly 9 planets (7 + Rahu + Ketu)', () => {
    const { planets } = calculate(DELHI_INPUT)
    expect(planets).toHaveLength(9)
    const names = planets.map(p => p.name)
    expect(names).toContain('Sun')
    expect(names).toContain('Moon')
    expect(names).toContain('Rahu')
    expect(names).toContain('Ketu')
  })

  it('all planets have valid house numbers 1–12', () => {
    const { planets } = calculate(DELHI_INPUT)
    planets.forEach(p => {
      expect(p.house).toBeGreaterThanOrEqual(1)
      expect(p.house).toBeLessThanOrEqual(12)
    })
  })

  it('all planets have valid signs', () => {
    const { planets } = calculate(DELHI_INPUT)
    planets.forEach(p => expect(SIGNS).toContain(p.sign))
  })

  it('returns exactly 12 houses', () => {
    const { houses } = calculate(DELHI_INPUT)
    expect(houses).toHaveLength(12)
    houses.forEach(h => {
      expect(h.house).toBeGreaterThanOrEqual(1)
      expect(h.house).toBeLessThanOrEqual(12)
      expect(SIGNS).toContain(h.sign)
    })
  })

  it('Rahu and Ketu are always marked retrograde', () => {
    const { planets } = calculate(DELHI_INPUT)
    const rahu = planets.find(p => p.name === 'Rahu')!
    const ketu = planets.find(p => p.name === 'Ketu')!
    expect(rahu.retrograde).toBe(true)
    expect(ketu.retrograde).toBe(true)
  })

  it('Rahu and Ketu are in opposite signs', () => {
    const { planets } = calculate(DELHI_INPUT)
    const rahu = planets.find(p => p.name === 'Rahu')!
    const ketu = planets.find(p => p.name === 'Ketu')!
    const rahuIdx = SIGNS.indexOf(rahu.sign as any)
    const ketuIdx = SIGNS.indexOf(ketu.sign as any)
    expect((rahuIdx + 6) % 12).toBe(ketuIdx)
  })
})
