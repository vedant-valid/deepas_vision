import type { KundliData } from '@/lib/astro/types'

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
}

const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1:  { x: 210, y: 58 },
  2:  { x: 108, y: 55 },
  3:  { x: 44,  y: 108 },
  4:  { x: 58,  y: 170 },
  5:  { x: 44,  y: 232 },
  6:  { x: 108, y: 285 },
  7:  { x: 210, y: 298 },
  8:  { x: 312, y: 285 },
  9:  { x: 376, y: 232 },
  10: { x: 362, y: 170 },
  11: { x: 376, y: 108 },
  12: { x: 312, y: 55 },
}

type Props = { data: KundliData; name?: string }

export default function KundliChart({ data, name }: Props) {
  const planetsByHouse: Record<number, typeof data.planets> = {}
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = []
  data.planets.forEach(p => planetsByHouse[p.house]?.push(p))

  return (
    <div className="flex flex-col items-center gap-3">
      <p
        className="text-[11px] text-[#68020d] uppercase tracking-[3px] pb-2 border-b border-[#e8d5c4] w-full text-center font-medium"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Birth Chart (Lagna)
      </p>
      {name && (
        <p className="text-[12px] text-[#68020d]/60 tracking-wider">{name}</p>
      )}
      <svg
        viewBox="0 0 420 340"
        width="420"
        height="340"
        className="max-w-full drop-shadow-sm"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Outer border */}
        <rect x="10" y="10" width="400" height="320" fill="white" stroke="#68020d" strokeWidth="1.5" rx="2" />

        {/* Corner-to-center lines */}
        <line x1="10"  y1="10"  x2="210" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="410" y1="10"  x2="210" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="10"  y1="330" x2="210" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="410" y1="330" x2="210" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>

        {/* Midpoint-to-midpoint lines */}
        <line x1="210" y1="10"  x2="10"  y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="210" y1="10"  x2="410" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="210" y1="330" x2="10"  y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>
        <line x1="210" y1="330" x2="410" y2="170" stroke="#68020d" strokeWidth="1" strokeOpacity="0.35"/>

        {Array.from({ length: 12 }, (_, i) => {
          const house = i + 1
          const pos = HOUSE_LABEL_POS[house]
          const housePlanets = planetsByHouse[house] ?? []
          const isLagna = house === 1

          return (
            <g key={house}>
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle"
                fontSize="11"
                fill={isLagna ? '#68020d' : '#9c5050'}
                fontWeight={isLagna ? '700' : '400'}
              >
                {isLagna ? 'As' : house}
              </text>
              {isLagna && (
                <text x={pos.x} y={pos.y + 13} textAnchor="middle" fontSize="10" fill="#68020d" fontWeight="600">
                  {data.lagna.sign.slice(0, 3)} {Math.floor(data.lagna.degree)}°
                </text>
              )}
              {housePlanets.map((planet, pi) => (
                <text
                  key={planet.name}
                  x={pos.x}
                  y={pos.y + (isLagna ? 26 : 14) + pi * 13}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#3d1a0a"
                  fontWeight="500"
                >
                  {PLANET_ABBR[planet.name] ?? planet.name.slice(0, 2)}
                  {planet.retrograde && planet.name !== 'Rahu' && planet.name !== 'Ketu' ? '℞' : ''}
                  {' '}{Math.floor(planet.degree)}°
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
