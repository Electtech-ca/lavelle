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
  const [role, setRole]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      // Fail closed: without a configured backend, nobody is signed in.
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      // With a session we stay loading until the role resolves below.
      if (!session?.user) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) { setRole(null); setLoading(false) }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Admin status comes ONLY from a trusted role claim stored server-side.
  // No email allowlists baked into client code.
  //
  // `loading` must stay true until this resolves: a guarded route that renders
  // while the role is still in flight sees isAdmin === false and redirects away
  // before the answer arrives.
  const userId = user?.id

  useEffect(() => {
    if (!supabase || !userId) { setRole(null); return }

    let cancelled = false
    setLoading(true)

    supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) console.error('[useAuth] role lookup failed:', error.message)
        setRole(data?.role ?? null)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [userId])

  async function signIn(email, password) {
    if (!supabase) {
      return { data: null, error: { message: 'Authentication is not configured.' } }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  const isAdmin = role === 'admin'

  return { user, loading, signIn, signOut, isAdmin }
}
