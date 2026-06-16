import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/* ─────────────────────────────────────────────────────────
   Dev bypass credentials (active ONLY when Supabase is not
   yet configured). Once VITE_SUPABASE_URL and
   VITE_SUPABASE_ANON_KEY are filled in .env, Supabase auth
   takes over and these are ignored automatically.

   Dev admin login:
     Email:    admin@sparivier.ca
     Password: LaVelle@2025!
──────────────────────────────────────────────────────────── */

const DEV_ADMIN_EMAIL    = 'admin@sparivier.ca'
const DEV_ADMIN_PASSWORD = 'LaVelle@2025!'
const DEV_SESSION_KEY    = '__lavelle_dev_admin__'

const DEV_USER = {
  email: DEV_ADMIN_EMAIL,
  user_metadata: { role: 'admin', full_name: 'Sparivier Admin' },
  id: 'dev-admin-001',
}

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /* ── Live Supabase auth ── */
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => subscription.unsubscribe()
    }

    /* ── Dev bypass (no Supabase configured) ── */
    const stored = sessionStorage.getItem(DEV_SESSION_KEY)
    if (stored === 'true') setUser(DEV_USER)
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    /* Live Supabase */
    if (supabase) return supabase.auth.signInWithPassword({ email, password })

    /* Dev bypass */
    if (
      email.trim().toLowerCase() === DEV_ADMIN_EMAIL &&
      password === DEV_ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(DEV_SESSION_KEY, 'true')
      setUser(DEV_USER)
      return { data: { user: DEV_USER }, error: null }
    }
    return { data: null, error: { message: 'Invalid email or password.' } }
  }

  async function signOut() {
    if (supabase) { await supabase.auth.signOut(); return }
    sessionStorage.removeItem(DEV_SESSION_KEY)
    setUser(null)
  }

  const isAdmin =
    user?.user_metadata?.role === 'admin' ||
    user?.email === 'solomon2@electtech.ca' ||
    user?.email === DEV_ADMIN_EMAIL

  return { user, loading, signIn, signOut, isAdmin }
}
