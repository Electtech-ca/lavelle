/* ──────────────────────────────────────────────────────────────
   Shared by the admin portal's functions (admin-users,
   mailbox-password, studio-gate): who is calling, and the replies.

   Configuration (provided by Supabase in the functions container):
     SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   ────────────────────────────────────────────────────────────── */

export const env = (k: string) => Deno.env.get(k) ?? ''

export const DB_URL   = env('SUPABASE_URL')
export const ANON_KEY = env('SUPABASE_ANON_KEY')
export const SERVICE  = env('SUPABASE_SERVICE_ROLE_KEY')

// The admin portal runs on the site; localhost is for development.
const ORIGINS = ['https://sparivier.ca', 'https://www.sparivier.ca', 'http://localhost:5173', 'http://localhost:5179']

export function cors(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? ''
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

export const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), 'Content-Type': 'application/json' } })

export type Caller = { id: string; email: string; token: string; studio: boolean }

/* The signed-in user behind a token, if they are an admin. */
export async function adminFromToken(token: string): Promise<Caller | null> {
  if (!token) return null
  const res = await fetch(`${DB_URL}/auth/v1/user`, { headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  const user = await res.json()
  const profile = await fetch(`${DB_URL}/rest/v1/profiles?id=eq.${user.id}&select=role,studio_access`, {
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` },
  }).then(r => (r.ok ? r.json() : []))
  if (profile[0]?.role !== 'admin') return null
  return { id: user.id, email: user.email, token, studio: Boolean(profile[0].studio_access) }
}

export async function adminFromRequest(req: Request): Promise<Caller | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  return adminFromToken(token)
}

/* PostgREST as the caller, so row-level security and the database's own
   checks (only admins change roles; only Studio users change Studio
   access) apply to them. */
export function asCaller(caller: Caller, path: string, init: RequestInit = {}) {
  return fetch(`${DB_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: ANON_KEY, Authorization: `Bearer ${caller.token}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  })
}

/* GoTrue's admin API, with the service role. */
export function authAdmin(path: string, init: RequestInit = {}) {
  return fetch(`${DB_URL}/auth/v1/admin/${path}`, {
    ...init,
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
}

export const MIN_PASSWORD = 10

export async function errorText(res: Response): Promise<string> {
  const body = await res.text()
  try {
    const j = JSON.parse(body)
    return j.msg || j.message || j.error_description || j.error || body
  } catch {
    return body || `HTTP ${res.status}`
  }
}
