/* ──────────────────────────────────────────────────────────────
   Spa Rivier — the login in front of Supabase Studio.

   Studio (https://api.sparivier.ca/) used to ask for one shared
   username and password in a browser box, which nobody could change
   without the server. Now the admin portal's own login opens it:

     1. the admin portal's /admin/studio page (or its "Open Supabase
        Studio" button) puts the signed-in admin's session token in a
        cookie, sr_studio, for .sparivier.ca, and keeps it fresh while
        the portal is open;
     2. Caddy asks this function about every Studio request
        (forward_auth, see ../../caddy/studio-gate.caddy);
     3. this function answers 200 for an admin whose profile has
        studio_access, and otherwise sends the browser to the admin
        login, which comes back to Studio after signing in.

   So Studio's password is the admin's own portal password, changed on
   the portal's My Account page, and Admin Users decides who may open
   it. Caddy adds Studio's internal username and password (Kong's
   basic-auth) after this check, so nobody types them any more.
   ────────────────────────────────────────────────────────────── */

import { adminFromToken } from '../_shared/admin.ts'

const LOGIN = 'https://sparivier.ca/admin/studio'

function cookie(req: Request, name: string): string {
  const all = req.headers.get('Cookie') ?? ''
  const found = all.split(/;\s*/).find(c => c.startsWith(`${name}=`))
  return found ? decodeURIComponent(found.slice(name.length + 1)) : ''
}

const page = (status: number, title: string, text: string) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
  `<body style="font-family:system-ui,sans-serif;background:#2E3350;color:#F6F5ED;display:grid;place-items:center;min-height:100vh;margin:0">` +
  `<main style="max-width:420px;padding:24px;text-align:center"><h1 style="font-weight:400">${title}</h1><p style="line-height:1.6">${text}</p>` +
  `<p><a style="color:#E9B0B9" href="https://sparivier.ca/admin">Back to the admin portal</a></p></main>`,
  { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
)

Deno.serve(async req => {
  const caller = await adminFromToken(cookie(req, 'sr_studio'))

  if (caller?.studio) {
    return new Response('ok', { status: 200, headers: { 'X-Studio-User': caller.email, 'Cache-Control': 'no-store' } })
  }
  if (caller) {
    return page(403, 'No Studio access',
      'Your admin account cannot open Supabase Studio. An admin who has Studio access can give it to you on the Admin Users page.')
  }

  // Not signed in, or the session ran out: sign in, then come back here.
  const back = `https://api.sparivier.ca${req.headers.get('X-Forwarded-Uri') ?? '/'}`
  const wantsPage = (req.headers.get('X-Forwarded-Method') ?? 'GET') === 'GET' &&
    (req.headers.get('Accept') ?? '').includes('text/html')
  if (!wantsPage) return new Response('Sign in to the Spa Rivier admin portal again.', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  return new Response(null, { status: 302, headers: { Location: `${LOGIN}?next=${encodeURIComponent(back)}`, 'Cache-Control': 'no-store' } })
})
