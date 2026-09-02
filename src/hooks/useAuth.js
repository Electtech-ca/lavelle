import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/* ─────────────────────────────────────────────────────────
   Authentication hook — Supabase only.

   There is NO hardcoded credential fallback. Admin accounts
   are created in the Supabase dashboard and gated by a
   `role: 'admin'` claim in user_metadata (and enforced
   server-side via Row Level Security — see notes).

   If Supabase is not configured, auth simply fails closed:
   no user, no admin access. This is intentional.
──────────────────────────────────────────────────────────── */

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      // Fail closed: without a configured backend, nobody is signed in.
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    if (!supabase) {
      return { data: null, error: { message: 'Authentication is not configured.' } }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
  }

  // Admin status comes ONLY from a trusted role claim set in Supabase.
  // No email allowlists baked into client code.
  const isAdmin = user?.user_metadata?.role === 'admin'

  return { user, loading, signIn, signOut, isAdmin }
}
