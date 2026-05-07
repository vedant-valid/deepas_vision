import type { KundliData } from '@/lib/astro/types'

const PLANET_ABBR: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
}

// Approximate text anchor positions for each house cell (CCW from top)
// SVG: 420×340, center at (210, 170)
const HOUSE_LABEL_POS: Record<number, { x: number; y: number }> = {
  1:  { x: 210, y: 58 },   // top diamond
  2:  { x: 108, y: 55 },   // upper-left corner
  3:  { x: 44,  y: 108 },  // left side, upper
  4:  { x: 58,  y: 170 },  // left diamond
  5:  { x: 44,  y: 232 },  // left side, lower
  6:  { x: 108, y: 285 },  // lower-left corner
  7:  { x: 210, y: 298 },  // bottom diamond
  8:  { x: 312, y: 285 },  // lower-right corner
  9:  { x: 376, y: 232 },  // right side, lower
  10: { x: 362, y: 170 },  // right diamond
  11: { x: 376, y: 108 },  // right side, upper
  12: { x: 312, y: 55 },   // upper-right corner
}

type Props = { data: KundliData; name?: string }

export default function KundliChart({ data, name }: Props) {
  const planetsByHouse: Record<number, typeof data.planets> = {}
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = []
  data.planets.forEach(p => planetsByHouse[p.house]?.push(p))

  return (
    <div className="flex flex-col items-center">
      {name && (
        <p className="text-xs text-[#888] mb-2 tracking-wider uppercase">{name}</p>
      )}
      <svg
        viewBox="0 0 420 340"
        width="420"
        height="340"
        className="max-w-full"
        style={{ fontFamily: 'serif' }}
      >
        {/* Outer border */}
        <rect
          x="10" y="10" width="400" height="320"
          fill="#fffaf5" stroke="#9c6b2e" strokeWidth="2" rx="3"
        />

        {/* Corner-to-center lines */}
        <line x1="10"  y1="10"  x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="410" y1="10"  x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="10"  y1="330" x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="410" y1="330" x2="210" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>

        {/* Midpoint-to-midpoint lines (inner diamond) */}
        <line x1="210" y1="10"  x2="10"  y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="10"  x2="410" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="330" x2="10"  y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>
        <line x1="210" y1="330" x2="410" y2="170" stroke="#9c6b2e" strokeWidth="1.2"/>

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
                fontSize="10"
                fill={isLagna ? '#68020d' : '#888'}
                fontWeight={isLagna ? 'bold' : 'normal'}
              >
                {isLagna ? 'As' : house}
              </text>
              {isLagna && (
                <text x={pos.x} y={pos.y + 12} textAnchor="middle" fontSize="9" fill="#68020d">
                  {data.lagna.sign.slice(0, 3)} {Math.floor(data.lagna.degree)}°
                </text>
              )}
              {housePlanets.map((planet, pi) => (
                <text
                  key={planet.name}
                  x={pos.x}
                  y={pos.y + (isLagna ? 24 : 13) + pi * 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#333"
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
