export type BirthInput = {
  date: string       // "YYYY-MM-DD"
  time: string       // "HH:MM" 24h
  latitude: number
  longitude: number
  timezone: string   // IANA e.g. "Asia/Kolkata"
}

export type LagnaData = {
  sign: string
  degree: number     // 0–29.99 within sign
  nakshatra: string
  pada: number       // 1–4
}

export type PlanetData = {
  name: string       // "Sun"|"Moon"|"Mars"|"Mercury"|"Jupiter"|"Venus"|"Saturn"|"Rahu"|"Ketu"
  sign: string
  degree: number     // 0–29.99 within sign
  house: number      // 1–12
  nakshatra: string
  pada: number       // 1–4
  retrograde: boolean
  dignity: 'exalted' | 'debilitated' | 'own' | 'neutral'
}

export type HouseData = {
  house: number      // 1–12
  sign: string
  degree: number     // cusp sidereal longitude
}

export type KundliData = {
  lagna: LagnaData
  planets: PlanetData[]
  houses: HouseData[]
}

export type GeocodeResult = {
  latitude: number
  longitude: number
  timezone: string
  formattedPlace: string
}

export type InterpretationTopic = 'lagna' | 'moon' | 'career' | 'relationships' | 'health'
