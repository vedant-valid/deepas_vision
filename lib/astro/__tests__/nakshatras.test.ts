import { describe, it, expect } from 'vitest'
import { getNakshatra } from '../constants/nakshatras'

describe('getNakshatra', () => {
  it('returns Ashwini pada 1 for 0°', () => {
    expect(getNakshatra(0)).toEqual({ nakshatra: 'Ashwini', pada: 1 })
  })

  it('returns Ashwini pada 2 for 3.334°', () => {
    expect(getNakshatra(3.334)).toEqual({ nakshatra: 'Ashwini', pada: 2 })
  })

  it('returns Ashwini pada 4 for 10°', () => {
    expect(getNakshatra(10)).toEqual({ nakshatra: 'Ashwini', pada: 4 })
  })

  it('returns Bharani pada 1 at nakshatra boundary 13.334°', () => {
    expect(getNakshatra(13.334)).toEqual({ nakshatra: 'Bharani', pada: 1 })
  })

  it('returns Revati pada 4 for 359°', () => {
    const result = getNakshatra(359)
    expect(result.nakshatra).toBe('Revati')
    expect(result.pada).toBe(4)
  })

  it('wraps correctly for longitude > 360', () => {
    expect(getNakshatra(360)).toEqual({ nakshatra: 'Ashwini', pada: 1 })
  })
})
