/* ──────────────────────────────────────────────────────────────
   Spa Rivier — admin accounts, for the admin portal's Admin Users page.

   POST with the signed-in admin's token and { action, … }:
     list                                      → { users: [...] }
     add      { email, password, full_name, studio_access }
              a new account, or an existing one made admin
     password { user_id, password }            a new password for an admin
     studio   { user_id, studio_access }       Supabase Studio access on or off
     remove   { user_id }                      deletes the account

   Only admins may call it. Accounts are created and deleted with the
   service role, but roles and Studio access are written as the calling
   admin, so the database's own rules still apply: only an admin changes
   a role, and only someone with Studio access gives it to another.
   Nobody can remove their own account or the last admin.
   ────────────────────────────────────────────────────────────── */

import {
  json, cors, adminFromRequest, asCaller, authAdmin, errorText, MIN_PASSWORD, type Caller,
} from '../_shared/admin.ts'

type Body = { action?: string; email?: string; password?: string; full_name?: string; user_id?: string; studio_access?: boolean }

async function listAdmins(caller: Caller) {
  const profiles = await asCaller(caller, 'profiles?role=eq.admin&select=id,email,full_name,studio_access,created_at&order=created_at')
  if (!profiles.ok) throw new Error(await errorText(profiles))
  const rows = await profiles.json()
  const users = await authAdmin('users?per_page=1000').then(r => (r.ok ? r.json() : { users: [] }))
  const byId = new Map((users.users ?? []).map((u: { id: string }) => [u.id, u]))
  return rows.map((p: Record<string, unknown>) => {
    const u = byId.get(p.id as string) as Record<string, unknown> | undefined
    return { ...p, last_sign_in_at: u?.last_sign_in_at ?? null, you: p.id === caller.id }
  })
}

async function setProfile(caller: Caller, id: string, fields: Record<string, unknown>) {
  const res = await asCaller(caller, `profiles?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(fields) })
  if (!res.ok) throw new Error(await errorText(res))
  const rows = await res.json()
  if (!rows.length) throw new Error('That account has no profile.')
}

async function isAdmin(caller: Caller, id: string) {
  const res = await asCaller(caller, `profiles?id=eq.${id}&role=eq.admin&select=id`)
  return res.ok && (await res.json()).length > 0
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(req) })
  if (req.method !== 'POST') return json(req, 405, { error: 'POST only' })

  const caller = await adminFromRequest(req)
  if (!caller) return json(req, 401, { error: 'Sign in to the admin portal as an admin first.' })

  let body: Body
  try { body = await req.json() } catch { return json(req, 400, { error: 'Bad request' }) }

  try {
    switch (body.action) {
      case 'list':
        return json(req, 200, { users: await listAdmins(caller) })

      case 'add': {
        const email = (body.email ?? '').trim().toLowerCase()
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(req, 400, { error: 'Enter a valid email address.' })
        if ((body.password ?? '').length < MIN_PASSWORD) return json(req, 400, { error: `The password needs at least ${MIN_PASSWORD} characters.` })
        if (body.studio_access && !caller.studio) return json(req, 403, { error: 'Only someone with Supabase Studio access can give it.' })

        // A new account, already confirmed, or the existing one with that email.
        let id: string
        const created = await authAdmin('users', {
          method: 'POST',
          body: JSON.stringify({ email, password: body.password, email_confirm: true, user_metadata: { full_name: body.full_name ?? '' } }),
        })
        if (created.ok) {
          id = (await created.json()).id
        } else {
          const users = await authAdmin('users?per_page=1000').then(r => r.json())
          const existing = (users.users ?? []).find((u: { email?: string }) => u.email?.toLowerCase() === email)
          if (!existing) throw new Error(await errorText(created))
          id = existing.id
          const pw = await authAdmin(`users/${id}`, { method: 'PUT', body: JSON.stringify({ password: body.password, email_confirm: true, ban_duration: 'none' }) })
          if (!pw.ok) throw new Error(await errorText(pw))
        }
        await setProfile(caller, id, { role: 'admin', ...(body.full_name ? { full_name: body.full_name } : {}) })
        if (body.studio_access) await setProfile(caller, id, { studio_access: true })
        return json(req, 200, { users: await listAdmins(caller) })
      }

      case 'password': {
        if (!body.user_id) return json(req, 400, { error: 'Which account?' })
        if ((body.password ?? '').length < MIN_PASSWORD) return json(req, 400, { error: `The password needs at least ${MIN_PASSWORD} characters.` })
        if (!(await isAdmin(caller, body.user_id))) return json(req, 404, { error: 'That is not an admin account.' })
        const res = await authAdmin(`users/${body.user_id}`, { method: 'PUT', body: JSON.stringify({ password: body.password }) })
        if (!res.ok) throw new Error(await errorText(res))
        return json(req, 200, { ok: true })
      }

      case 'studio': {
        if (!body.user_id) return json(req, 400, { error: 'Which account?' })
        if (!caller.studio) return json(req, 403, { error: 'Only someone with Supabase Studio access can change it.' })
        await setProfile(caller, body.user_id, { studio_access: Boolean(body.studio_access) })
        return json(req, 200, { users: await listAdmins(caller) })
      }

      case 'remove': {
        if (!body.user_id) return json(req, 400, { error: 'Which account?' })
        if (body.user_id === caller.id) return json(req, 400, { error: 'You cannot remove your own account. Ask another admin.' })
        const admins = await listAdmins(caller)
        if (!admins.some((a: { id: string }) => a.id === body.user_id)) return json(req, 404, { error: 'That is not an admin account.' })
        if (admins.length <= 1) return json(req, 400, { error: 'The last admin cannot be removed.' })

        // Admin rights go first, so a failed delete still leaves no access.
        await setProfile(caller, body.user_id, { role: 'member' })
        const res = await authAdmin(`users/${body.user_id}`, { method: 'DELETE' })
        if (!res.ok) {
          // Kept by other records (orders, bookings): sign-in is blocked instead.
          const ban = await authAdmin(`users/${body.user_id}`, { method: 'PUT', body: JSON.stringify({ ban_duration: '876000h' }) })
          if (!ban.ok) throw new Error(await errorText(ban))
        }
        return json(req, 200, { users: await listAdmins(caller) })
      }

      default:
        return json(req, 400, { error: 'Unknown action' })
    }
  } catch (err) {
    console.error('[admin-users]', body.action, err)
    return json(req, 500, { error: err instanceof Error ? err.message : String(err) })
  }
})
