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
    <div className="min-h-screen bg-[#0d0500]">
      <header
        className="relative flex items-center justify-between px-6 py-3 border-b border-[#c9a84c]"
        style={{ background: 'linear-gradient(90deg, #1a0800 0%, #3d1000 50%, #1a0800 100%)' }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #f0d080 50%, #c9a84c 70%, transparent)' }}
        />
        <Link href="/" className="text-[#c9a84c]/60 text-[10px] tracking-widest hover:text-[#c9a84c] transition-colors">
          ← HOME
        </Link>
        <div className="text-center flex-1">
          <h1
            className="text-sm tracking-[4px] uppercase text-[#c9a84c]"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            ✦ Free Kundli Generator ✦
          </h1>
          <p className="text-[9px] text-[#c9a84c]/45 mt-1 tracking-[2px]">
            Sidereal Vedic chart &nbsp;·&nbsp; Lahiri Ayanamsa &nbsp;·&nbsp; North Indian style
          </p>
        </div>
        <AuthButton isAuthenticated={isAuthenticated} email={user?.email} />
      </header>
      <KundliPageClient isAuthenticated={isAuthenticated} savedCharts={savedCharts} />
    </div>
  )
}
