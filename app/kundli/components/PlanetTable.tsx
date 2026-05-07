import type { KundliData } from '@/lib/astro/types'

const DIGNITY_COLORS: Record<string, string> = {
  exalted:     'text-yellow-600 font-semibold',
  debilitated: 'text-red-700 font-semibold',
  own:         'text-green-700 font-semibold',
  neutral:     'text-gray-500',
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
          <tr className="bg-[#f5ede0] text-[#68020d]">
            <th className="text-left p-2 font-semibold">Graha</th>
            <th className="text-left p-2 font-semibold">Rashi</th>
            <th className="text-left p-2 font-semibold">Deg</th>
            <th className="text-left p-2 font-semibold">House</th>
            <th className="text-left p-2 font-semibold">Nakshatra</th>
            <th className="text-left p-2 font-semibold">Pada</th>
            <th className="text-left p-2 font-semibold">State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={'label' in row ? row.label : row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf5ee]'}>
              <td className="p-2 font-medium text-[#4a3728]">
                {'label' in row ? row.label : row.name}
                {'retrograde' in row && row.retrograde && (row as any).name !== 'Rahu' && (row as any).name !== 'Ketu'
                  ? <span className="ml-1 text-[10px] text-orange-600">℞</span>
                  : null}
              </td>
              <td className="p-2">{row.sign}</td>
              <td className="p-2">{row.degree.toFixed(2)}°</td>
              <td className="p-2">{row.house}</td>
              <td className="p-2">{row.nakshatra}</td>
              <td className="p-2">{row.pada}</td>
              <td className={`p-2 capitalize ${DIGNITY_COLORS[row.dignity]}`}>
                {row.dignity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
