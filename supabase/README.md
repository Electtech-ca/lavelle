# Server-side pieces (self-hosted Supabase on the OVH VPS)

These files are copies of what runs on the server; the website build does not use them.

| File here | Lives on the server at |
|---|---|
| `functions/stripe-certificate-webhook/index.ts` | `/opt/supabase/docker/volumes/functions/stripe-certificate-webhook/index.ts` |
| `functions/stripe-certificate-webhook/email.ts` | `/opt/supabase/docker/volumes/functions/stripe-certificate-webhook/email.ts` |
| `docker-compose.override.yml` | `/opt/supabase/docker/docker-compose.override.yml` |
| `set-certificate-secrets.sh` | `/opt/supabase/docker/set-certificate-secrets.sh` |
| `certificate-link.sql` | applied once to the database (see below) |
| `admin-content.sql` | applied once to the database (see the end) |
| `boutique-brands.sql` | applied once to the database (see the end) |
| `site-editing.sql` | applied once to the database (see the end) |
| `functions/_shared/admin.ts` | `/opt/supabase/docker/volumes/functions/_shared/admin.ts` |
| `functions/admin-users/index.ts` | `/opt/supabase/docker/volumes/functions/admin-users/index.ts` |
| `functions/mailbox-password/index.ts` | `/opt/supabase/docker/volumes/functions/mailbox-password/index.ts` |
| `functions/studio-gate/index.ts` | `/opt/supabase/docker/volumes/functions/studio-gate/index.ts` |
| `set-mailcow-key.sh` | `/opt/supabase/docker/set-mailcow-key.sh` |
| `caddy/studio-gate.caddy` | the `api.sparivier.ca` block of the server's Caddyfile |

**What it does:** Stripe calls `https://api.sparivier.ca/functions/v1/stripe-certificate-webhook`
when a gift certificate is paid (`checkout.session.completed`). The function checks
Stripe's signature, marks the matching `gift_orders` row active, and emails the
certificate from `noreply@sparivier.ca`: to the recipient, and a copy to the buyer.
Each email shows the certificate as a card and links to
`https://sparivier.ca/certificate?code=…&k=…`, where it can be viewed and printed.
The spa gets its own email for each certificate, with the code and the order
details, at `STAFF_EMAIL` in `docker-compose.override.yml` (deanna@sparivier.ca).

**The link's token:** every order has a private `view_token`. The site sends Stripe
`<code>_<token>` as `client_reference_id`, and the webhook activates only the order
holding both. The certificate page reads through the `certificate_view(code, token)`
database function, which answers only when both match. `certificate-link.sql` adds the
column and the function, and limits the website to creating pending orders. It is safe
to re-run:

    docker exec -i supabase-db psql -U postgres -d postgres < certificate-link.sql

Deploy in this order: the SQL, then the webhook files, then the website.

**Secrets** (mailbox password, Stripe signing secret) are never in this repo. They live
in `/opt/supabase/docker/.env.certificates` (mode 600), written by running
`set-certificate-secrets.sh` on the server. `/opt/supabase/docker/.env` sets
`COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml` so the override loads.

**After changing the function, a secret or the override**, reload only the functions container:

    cd /opt/supabase/docker && docker compose up -d --no-deps --force-recreate functions

**Services and promotions from the admin** (`admin-content.sql`, applied 2026-10-14): the
Salon and Spa price lists and the Current Promotions are read from the `services` and
`promotions` tables, which the admin's Services and Promotions pages edit. The file adds
their French columns, a promotion's graphic and end date, copies in the lists and
promotions the site showed on 2026-10-14, and creates the public `promotions` storage
bucket (admins only may upload). The copy in `src/data/` is now only the fallback the
pages show when the database can't be read. Re-running the file is safe: rows are copied
in only while the tables still hold the old template data.

    docker exec -i supabase-db psql -U postgres -d postgres < admin-content.sql

**Boutique brands from the admin** (`boutique-brands.sql`, applied 2026-10-14): the Boutique
page reads its brands from `boutique_brands`, which the admin's Boutique Brands page adds to,
edits and deletes from. The file creates the table, copies in the ten brands the site showed
on 2026-10-14 (with the tags saved in `boutique_brand_tags`, which nothing reads any more), and
creates the public `boutique` storage bucket for brand photos (admins only may upload). Safe to
re-run: brands are copied in only while the table is empty.

    docker exec -i supabase-db psql -U postgres -d postgres < boutique-brands.sql

**The whole site from the admin** (`site-editing.sql`, written 2026-10-14): everything that
used to need a code change is edited in the admin.

| Admin page | Table | What it changes |
|---|---|---|
| Page Text | `site_text` | any heading, paragraph, button or label, English and French |
| Contact & Hours | `site_text` (`contact.*`, `footer.hours.*`) | address, phone, hours, social links, used everywhere |
| Photos | `site_photos` | the page photos listed in `src/data/photoSlots.js` |
| Services & Prices | `services` | now MediSpa too (category `medispa`, with `price_series`) |
| Product Brands, Team, What's Happening, Spa FAQ | `site_items` | Haircare, Skincare and Bath & Body brands, team profiles, articles, events, promo of the day, FAQ |
| Admin Users | `profiles`, auth users | add, reset, remove admins; Supabase Studio access (`profiles.studio_access`) |
| My Account | auth, mailcow | own portal password (also Studio's), a mailbox's password |

A changed text or photo is stored as an override; the wording and photos in the code stay the
default, and "Restore original" deletes the override. The file copies in the brands, profiles,
FAQ, articles and MediSpa prices the site showed on 2026-10-14, and creates the public `site`
storage bucket for uploaded photos. Safe to re-run: a list is copied in only while it is empty.
The site falls back to the copy in code until the file has run, so either order is safe, but run
the SQL first so the admin pages work as soon as the site is deployed.

    docker exec -i supabase-db psql -U postgres -d postgres < site-editing.sql

**Admin accounts and passwords** (functions `admin-users`, `mailbox-password`, `studio-gate`,
all sharing `_shared/admin.ts`). Copy the four folders to `volumes/functions/`, then reload the
functions container (above). They need nothing new except the mailcow key:

- `admin-users`: Admin Users. Creates and deletes accounts with the service role; roles and
  Studio access are written as the calling admin, so the database's own checks apply.
- `mailbox-password`: My Account ▸ Email password. Checks the mailbox's current password by
  signing in to SMTP, then sets the new one through mailcow's API. Make a read-write API key in
  mailcow (System ▸ Configuration ▸ Access ▸ API), allow API access from the server's own
  address, then store the key with `set-mailcow-key.sh` (it prompts; the key stays off screen).
  Without the key the form says to use the mail server's own page, which also changes passwords.
- `studio-gate`: Supabase Studio opens with the admin portal's login instead of the shared
  dashboard password. Switch it on from your own computer with

      ssh electTechOVH 'bash -s' < supabase/switch-studio-login.sh

  It backs up `.env` and the Caddyfile, gives `DASHBOARD_PASSWORD` a new random value nobody
  types, binds the gateway (Envoy, service `api-gw`) to `127.0.0.1:8000` so Studio cannot be
  reached around Caddy, writes the credential to `/etc/caddy/studio-auth.caddy` (root:caddy, 640),
  installs `caddy/studio-gate.caddy` as the `api.sparivier.ca` block, and checks the result,
  restoring both files if any check fails. Who may open Studio is `profiles.studio_access`,
  given on Admin Users by someone who has it; `site-editing.sql` gives it to the admins of
  2026-10-14. The script runs once: it stops, changing nothing, if the block is already switched.
  To change the dashboard password later, update `DASHBOARD_PASSWORD` in `.env` and the line in
  `studio-auth.caddy` together, recreate `api-gw`, and reload Caddy.

"Forgot your password?" on the admin login sends GoTrue's recovery email, which links to
`/admin/reset-password`. It needs GoTrue's SMTP settings and `https://sparivier.ca/admin/reset-password`
among its allowed redirect URLs (`ADDITIONAL_REDIRECT_URLS`). Without them, another admin sets a
new password on Admin Users.
