# Server-side pieces (self-hosted Supabase on the OVH VPS)

These files are copies of what runs on the server; the website build does not use them.

| File here | Lives on the server at |
|---|---|
| `functions/stripe-certificate-webhook/index.ts` | `/opt/supabase/docker/volumes/functions/stripe-certificate-webhook/index.ts` |
| `functions/stripe-certificate-webhook/email.ts` | `/opt/supabase/docker/volumes/functions/stripe-certificate-webhook/email.ts` |
| `docker-compose.override.yml` | `/opt/supabase/docker/docker-compose.override.yml` |
| `set-certificate-secrets.sh` | `/opt/supabase/docker/set-certificate-secrets.sh` |
| `certificate-link.sql` | applied once to the database (see below) |

**What it does:** Stripe calls `https://api.sparivier.ca/functions/v1/stripe-certificate-webhook`
when a gift certificate is paid (`checkout.session.completed`). The function checks
Stripe's signature, marks the matching `gift_orders` row active, and emails the
certificate from `noreply@sparivier.ca`: to the recipient, and a copy to the buyer.
Each email shows the certificate as a card and links to
`https://sparivier.ca/certificate?code=…&k=…`, where it can be viewed and printed.

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
