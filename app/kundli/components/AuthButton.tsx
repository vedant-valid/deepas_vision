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
        <span className="text-white/60 text-[11px] hidden sm:block">{email}</span>
        <button
          onClick={signOut}
          className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-sm tracking-wider transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-sm tracking-wider transition-colors whitespace-nowrap"
    >
      Sign in with Google
    </button>
  )
}
