import type { KundliData } from '@/lib/astro/types'

const DIGNITY_STYLE: Record<string, string> = {
  exalted:     'text-[#80d080]',
  debilitated: 'text-[#e07050]',
  own:         'text-[#80d080]',
  neutral:     'text-[#c9a84c]/40',
}

type Props = { data: KundliData }

export default function PlanetTable({ data }: Props) {
  const rows = [
    { label: 'Ascendant', sign: data.lagna.sign, degree: data.lagna.degree, house: 1, nakshatra: data.lagna.nakshatra, pada: data.lagna.pada, retrograde: false, dignity: 'neutral' as const },
    ...data.planets,
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr style={{ background: 'rgba(201,168,76,0.06)' }}>
            {['Graha', 'Rashi', 'Deg', 'House', 'Nakshatra', 'Pada', 'State'].map(h => (
              <th key={h} className="text-left p-2 text-[8px] text-[#c9a84c]/60 uppercase tracking-[2px] font-normal border-b border-[#c9a84c]/15">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={'label' in row ? row.label : row.name}
              className="border-b border-[#c9a84c]/[0.08] hover:bg-[#c9a84c]/5 transition-colors"
              style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)' }}
            >
              <td className="p-2 text-[#e8d5a0] font-medium">
                {'label' in row ? row.label : row.name}
                {'retrograde' in row && row.retrograde && (row as any).name !== 'Rahu' && (row as any).name !== 'Ketu'
                  ? <span className="ml-1 text-[9px] text-[#e07050]">℞</span>
                  : null}
              </td>
              <td className="p-2 text-[#e8d5a0]/80">{row.sign}</td>
              <td className="p-2 text-[#e8d5a0]/70">{row.degree.toFixed(2)}°</td>
              <td className="p-2 text-[#c9a84c]/60">{row.house}</td>
              <td className="p-2 text-[#e8d5a0]/70">{row.nakshatra}</td>
              <td className="p-2 text-[#c9a84c]/50">{row.pada}</td>
              <td className={`p-2 capitalize text-[11px] ${DIGNITY_STYLE[row.dignity]}`}>
                {row.dignity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
