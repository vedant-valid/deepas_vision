import KundliPageClient from './components/KundliPageClient'
import AuthButton from './components/AuthButton'
import { createClient } from '@/lib/supabase/server'
import { getSavedCharts } from './actions'
import Link from 'next/link'

export const metadata = {
  title: "Free Kundli Generator — Deepa's Vision",
  description: 'Generate your Vedic birth chart (Kundli) with accurate sidereal calculations and AI-powered interpretation.',
}

export default async function KundliPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user
  const savedCharts = isAuthenticated ? await getSavedCharts() : []

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <header className="bg-[#68020d] px-6 py-4 flex items-center justify-between shadow-md">
        <Link
          href="/"
          className="text-white/60 text-[11px] tracking-widest uppercase hover:text-white transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          ← Home
        </Link>

        <div className="text-center flex-1">
          <h1
            className="text-white text-base tracking-[5px] uppercase font-normal"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Free Kundli Generator
          </h1>
          <p className="text-white/50 text-[10px] tracking-[2px] mt-0.5">
            Sidereal Vedic chart · Lahiri Ayanamsa · North Indian style
          </p>
        </div>

        <AuthButton isAuthenticated={isAuthenticated} email={user?.email} />
      </header>

      <KundliPageClient isAuthenticated={isAuthenticated} savedCharts={savedCharts} />
    </div>
  )
}
