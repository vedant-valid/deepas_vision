import type { KundliData } from '@/lib/astro/types'

const DIGNITY_STYLE: Record<string, string> = {
  exalted:     'text-emerald-700 font-semibold',
  debilitated: 'text-red-700 font-semibold',
  own:         'text-emerald-700 font-semibold',
  neutral:     'text-[#9c7a6a]',
}

type Props = { data: KundliData }

export default function PlanetTable({ data }: Props) {
  const rows = [
    { label: 'Ascendant', sign: data.lagna.sign, degree: data.lagna.degree, house: 1, nakshatra: data.lagna.nakshatra, pada: data.lagna.pada, retrograde: false, dignity: 'neutral' as const },
    ...data.planets,
  ]

  return (
    <div className="overflow-x-auto rounded-sm border border-[#e8d5c4] bg-white shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#68020d]">
            {['Graha', 'Rashi', 'Deg', 'House', 'Nakshatra', 'Pada', 'State'].map(h => (
              <th key={h} className="text-left px-3 py-2.5 text-[11px] text-white/80 uppercase tracking-wider font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={'label' in row ? row.label : row.name}
              className={`border-b border-[#f0e4d8] hover:bg-[#fdf5ee] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fffaf5]'}`}
            >
              <td className="px-3 py-2.5 text-[#3d1a0a] font-semibold text-[13px]">
                {'label' in row ? row.label : row.name}
                {'retrograde' in row && row.retrograde && (row as any).name !== 'Rahu' && (row as any).name !== 'Ketu'
                  ? <span className="ml-1 text-[11px] text-orange-600 font-normal">℞</span>
                  : null}
              </td>
              <td className="px-3 py-2.5 text-[#5c3020] text-[13px]">{row.sign}</td>
              <td className="px-3 py-2.5 text-[#7a4030] text-[13px]">{row.degree.toFixed(2)}°</td>
              <td className="px-3 py-2.5 text-[#68020d] font-medium text-[13px]">{row.house}</td>
              <td className="px-3 py-2.5 text-[#5c3020] text-[13px]">{row.nakshatra}</td>
              <td className="px-3 py-2.5 text-[#7a4030] text-[13px]">{row.pada}</td>
              <td className={`px-3 py-2.5 capitalize text-[12px] ${DIGNITY_STYLE[row.dignity]}`}>
                {row.dignity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
