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
      <div className="flex items-center gap-3 text-xs text-white/80">
        <span>{email}</span>
        <button onClick={signOut} className="underline hover:text-white">Sign out</button>
      </div>
    )
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
    >
      Sign in with Google
    </button>
  )
}
