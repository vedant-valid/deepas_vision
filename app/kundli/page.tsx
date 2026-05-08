import KundliPageClient from './components/KundliPageClient'
import AuthButton from './components/AuthButton'

export const metadata = {
  title: "Free Kundli Generator — Deepa's Vision",
  description: 'Generate your Vedic birth chart (Kundli) with accurate sidereal calculations and AI-powered interpretation.',
}

export default function KundliPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-[#68020d] text-white py-3 px-6 flex items-center justify-between">
        <div className="text-center flex-1">
          <h1 className="text-lg font-bold tracking-widest uppercase">Free Kundli Generator</h1>
          <p className="text-[11px] text-white/70 mt-0.5">
            Sidereal Vedic chart · Lahiri Ayanamsa · North Indian style
          </p>
        </div>
        <AuthButton isAuthenticated={false} />
      </div>

      <KundliPageClient isAuthenticated={false} savedCharts={[]} />
    </div>
  )
}
