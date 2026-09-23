# Server-side pieces (self-hosted Supabase on the OVH VPS)

These files are copies of what runs on the server; the website build does not use them.

| File here | Lives on the server at |
|---|---|
| `functions/stripe-certificate-webhook/index.ts` | `/opt/supabase/docker/volumes/functions/stripe-certificate-webhook/index.ts` |
| `docker-compose.override.yml` | `/opt/supabase/docker/docker-compose.override.yml` |
| `set-certificate-secrets.sh` | `/opt/supabase/docker/set-certificate-secrets.sh` |

**What it does:** Stripe calls `https://api.sparivier.ca/functions/v1/stripe-certificate-webhook`
when a gift certificate is paid (`checkout.session.completed`). The function checks
Stripe's signature, marks the matching `gift_orders` row active, and emails the
certificate code to the recipient from `noreply@sparivier.ca`.

**Secrets** (mailbox password, Stripe signing secret) are never in this repo. They live
in `/opt/supabase/docker/.env.certificates` (mode 600), written by running
`set-certificate-secrets.sh` on the server. `/opt/supabase/docker/.env` sets
`COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml` so the override loads.

**After changing a secret or the override**, reload only the functions container:

    cd /opt/supabase/docker && docker compose up -d --no-deps --force-recreate functions
