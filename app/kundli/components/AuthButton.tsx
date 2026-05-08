'use client'

import { useRouter } from 'next/navigation'

type Props = { isAuthenticated: boolean; email?: string }

export default function AuthButton({ isAuthenticated, email }: Props) {
  const router = useRouter()

  async function signInWithGoogle() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/kundli` },
    })
  }

  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-[#c9a84c]/60 tracking-wide hidden sm:block">{email}</span>
        <button
          onClick={signOut}
          className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/40 px-3 py-1.5 tracking-widest hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
        >
          SIGN OUT
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-[10px] text-[#c9a84c] border border-[#c9a84c]/40 px-3 py-1.5 tracking-widest hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors whitespace-nowrap"
    >
      SIGN IN
    </button>
  )
}
