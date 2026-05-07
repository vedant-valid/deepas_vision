// Only import on server side — swisseph is a native Node.js addon
// @ts-ignore — swisseph has no TypeScript types
import swisseph from 'swisseph'

type SweCalcResult = { longitude: number; latitude: number; distance: number; longitudeSpeed: number; latitudeSpeed: number; distanceSpeed: number; rflag: number }
type SweCalcError = { error: string }
type SweCalcRaw = SweCalcResult | { rectAscension: number; declination: number; distance: number; rectAscensionSpeed: number; declinationSpeed: number; distanceSpeed: number; rflag: number } | { x: number; y: number; z: number; dx: number; dy: number; dz: number; rflag: number } | SweCalcError
import { fromZonedTime } from 'date-fns-tz'
import type { BirthInput, KundliData, LagnaData, PlanetData, HouseData } from './types'
import { SIGNS, signFromLongitude, degreeWithinSign, signIndex } from './constants/signs'
import { getNakshatra } from './constants/nakshatras'
import { getDignity } from './constants/dignity'

const PLANET_DEFS = [
  { name: 'Sun',     id: swisseph.SE_SUN },
  { name: 'Moon',    id: swisseph.SE_MOON },
  { name: 'Mars',    id: swisseph.SE_MARS },
  { name: 'Mercury', id: swisseph.SE_MERCURY },
  { name: 'Jupiter', id: swisseph.SE_JUPITER },
  { name: 'Venus',   id: swisseph.SE_VENUS },
  { name: 'Saturn',  id: swisseph.SE_SATURN },
  { name: 'Rahu',    id: swisseph.SE_MEAN_NODE },
] as const

const SIDEREAL_FLAG = swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED

export function calculate(input: BirthInput): KundliData {
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)

  // Convert local birth time to UTC
  const localStr = `${input.date}T${input.time}:00`
  const utcDate = fromZonedTime(localStr, input.timezone)

  const year = utcDate.getUTCFullYear()
  const month = utcDate.getUTCMonth() + 1
  const day = utcDate.getUTCDate()
  const hourUt =
    utcDate.getUTCHours() +
    utcDate.getUTCMinutes() / 60 +
    utcDate.getUTCSeconds() / 3600

  const jd = swisseph.swe_julday(year, month, day, hourUt, swisseph.SE_GREG_CAL)

  // Ascendant via Whole Sign ('W') house system
  // swe_houses returns the TROPICAL ascendant — must subtract Lahiri ayanamsa to get sidereal
  const housesResult = swisseph.swe_houses(jd, input.latitude, input.longitude, 'W')
  if ('error' in housesResult) throw new Error(String((housesResult as any).error))
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd)
  const ascLon = ((housesResult.ascendant - ayanamsa) % 360 + 360) % 360
  const lagnaSignIdx = Math.floor(ascLon / 30)
  const lagnaSign = SIGNS[lagnaSignIdx]
  const { nakshatra: lagnaNak, pada: lagnaPada } = getNakshatra(ascLon)

  const lagna: LagnaData = {
    sign: lagnaSign,
    degree: degreeWithinSign(ascLon),
    nakshatra: lagnaNak,
    pada: lagnaPada,
  }

  // 12 house cusps (Whole Sign: each house = one full sign)
  // house[i] contains the cusp of house i+1; use the ascendant-derived sign for each house
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    sign: SIGNS[(lagnaSignIdx + i) % 12],
    degree: housesResult.house[i] ?? (lagnaSignIdx + i) * 30,
  }))

  // Compute the 7 classical planets + Rahu
  const planets: PlanetData[] = []

  for (const def of PLANET_DEFS) {
    const res = swisseph.swe_calc_ut(jd, def.id, SIDEREAL_FLAG) as SweCalcRaw
    if ('error' in res) throw new Error(String((res as SweCalcError).error))
    const calcRes = res as SweCalcResult
    const lon = ((calcRes.longitude % 360) + 360) % 360
    const sign = signFromLongitude(lon)
    const degree = degreeWithinSign(lon)
    const { nakshatra, pada } = getNakshatra(lon)
    const retrograde = def.name === 'Rahu' ? true : (calcRes.longitudeSpeed < 0)
    const house = ((signIndex(sign) - lagnaSignIdx + 12) % 12) + 1
    const dignity = getDignity(def.name, sign)

    planets.push({ name: def.name, sign, degree, house, nakshatra, pada, retrograde, dignity })
  }

  // Ketu is always exactly opposite Rahu
  const rahuRes = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, SIDEREAL_FLAG) as SweCalcRaw
  if ('error' in rahuRes) throw new Error(String((rahuRes as SweCalcError).error))
  const rahuCalc = rahuRes as SweCalcResult
  const rahuRawLon = ((rahuCalc.longitude % 360) + 360) % 360
  const ketuLon = (rahuRawLon + 180) % 360
  const ketuSign = signFromLongitude(ketuLon)
  const ketuDegree = degreeWithinSign(ketuLon)
  const { nakshatra: ketuNak, pada: ketuPada } = getNakshatra(ketuLon)
  const ketuHouse = ((signIndex(ketuSign) - lagnaSignIdx + 12) % 12) + 1

  planets.push({
    name: 'Ketu',
    sign: ketuSign,
    degree: ketuDegree,
    house: ketuHouse,
    nakshatra: ketuNak,
    pada: ketuPada,
    retrograde: true,
    dignity: 'neutral',
  })

  return { lagna, planets, houses }
}
