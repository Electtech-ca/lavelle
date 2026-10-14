import { supabase } from './supabase'

/* ──────────────────────────────────────────────────────────────
   Supabase Studio opens with the admin portal's login (see
   supabase/functions/studio-gate). The portal puts the admin's session
   token in the sr_studio cookie for .sparivier.ca, which the server
   checks in front of Studio, and keeps it fresh while signed in. It is
   set only when an admin opens Studio, and cleared on sign-out.
   ────────────────────────────────────────────────────────────── */

export const STUDIO_URL = import.meta.env.VITE_STUDIO_URL || 'https://api.sparivier.ca/project/default'
const STUDIO_ORIGIN = new URL(STUDIO_URL).origin
const NAME = 'sr_studio'

const domain = () => (location.hostname.endsWith('sparivier.ca') ? '; Domain=.sparivier.ca' : '')
const secure = () => (location.protocol === 'https:' ? '; Secure' : '')
const hasCookie = () => document.cookie.split(/;\s*/).some(c => c.startsWith(`${NAME}=`))

function write(session) {
  const maxAge = Math.max(60, (session.expires_at ?? 0) - Math.floor(Date.now() / 1000))
  document.cookie = `${NAME}=${encodeURIComponent(session.access_token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${domain()}${secure()}`
}

export function clearStudioCookie() {
  document.cookie = `${NAME}=; Path=/; Max-Age=0; SameSite=Lax${domain()}${secure()}`
}

/* Sets the cookie from the current session; false when signed out. */
export async function startStudioSession() {
  if (!supabase) return false
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return false
  write(session)
  return true
}

/* Only addresses on Studio's own site may be returned to after signing in. */
export function studioReturnUrl(next) {
  try {
    const url = new URL(next)
    if (url.origin === STUDIO_ORIGIN) return url.href
  } catch { /* not an address */ }
  return STUDIO_URL
}

// Keep an open Studio session in step with the portal's.
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') clearStudioCookie()
    else if (session && hasCookie()) write(session)
  })
}
