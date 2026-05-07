import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/kundli'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/kundli'
  return NextResponse.redirect(new URL(safeNext, req.url))
}
