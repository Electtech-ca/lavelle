#!/usr/bin/env bash
# Puts Supabase Studio (https://api.sparivier.ca/) behind the admin portal's
# login. Run it from your own computer:
#
#   ssh electTechOVH 'bash -s' < supabase/switch-studio-login.sh
#
# What it does, on the server:
#   1. backs up Supabase's .env and Caddy's Caddyfile;
#   2. gives the Studio dashboard password a new random value that nobody
#      types (the old shared one is retired), and binds the API gateway to
#      127.0.0.1:8000, so the gateway is reachable only through Caddy and
#      the login check cannot be bypassed on port 8000;
#   3. writes that credential into /etc/caddy/studio-auth.caddy (root:caddy,
#      640), which the Caddyfile imports; it never appears on screen;
#   4. recreates the gateway and replaces the api.sparivier.ca block with
#      supabase/caddy/studio-gate.caddy's, validates, reloads Caddy;
#   5. checks the API, the login redirect and the gateway credential, and
#      puts everything back as it was if any check fails.
# Needs the studio-gate function on the server (deployed 2026-10-14).
set -euo pipefail
cd /opt/supabase/docker

# Only from the original block; a second run stops here and changes nothing.
if ! sudo python3 -c "import sys; sys.exit(0 if 'api.sparivier.ca {\n\treverse_proxy 127.0.0.1:8000\n}\n' in open('/etc/caddy/Caddyfile').read() else 1)"; then
  echo "The api.sparivier.ca block is not the original one (already switched?). Nothing changed."
  exit 1
fi

TS=$(date +%Y%m%d-%H%M%S)
ENV_BAK=".env.bak-$TS-studio"
CADDY_BAK="/etc/caddy/Caddyfile.bak-$TS-studio"
cp -p .env "$ENV_BAK"
sudo cp -p /etc/caddy/Caddyfile "$CADDY_BAK"

rollback() {
  echo "!! $1 - putting everything back"
  cp -p "$ENV_BAK" .env
  sudo cp -p "$CADDY_BAK" /etc/caddy/Caddyfile
  sudo rm -f /etc/caddy/studio-auth.caddy
  docker compose up -d --no-deps --force-recreate api-gw >/dev/null 2>&1 || true
  sudo systemctl reload caddy || true
  echo "Restored. Nothing changed."
  exit 1
}

# ── 2. New dashboard password, gateway on localhost only ──
NEW=$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 40)
python3 - "$NEW" <<'PY' || rollback ".env was not as expected"
import sys, re
new = sys.argv[1]
s = open('.env').read()
s, n1 = re.subn(r'(?m)^DASHBOARD_PASSWORD=.*$', 'DASHBOARD_PASSWORD=' + new, s)
s, n2 = re.subn(r'(?m)^API_GW_HTTP_PORT=.*$', 'API_GW_HTTP_PORT=127.0.0.1:8000', s)
if n2 == 0:
    s = s.rstrip('\n') + '\nAPI_GW_HTTP_PORT=127.0.0.1:8000\n'
assert n1 == 1, 'DASHBOARD_PASSWORD not found'
open('.env', 'w').write(s)
PY

# ── 3. The credential Caddy adds after the login check ──
USER_NAME=$(grep -E '^DASHBOARD_USERNAME=' .env | cut -d= -f2-)
B64=$(printf '%s:%s' "$USER_NAME" "$NEW" | base64 -w0)
printf 'header_up Authorization "Basic %s"\n' "$B64" | sudo tee /etc/caddy/studio-auth.caddy >/dev/null
sudo chown root:caddy /etc/caddy/studio-auth.caddy
sudo chmod 640 /etc/caddy/studio-auth.caddy

# ── 4. Gateway, then Caddy ──
docker compose up -d --no-deps --force-recreate api-gw >/dev/null 2>&1 || rollback "the gateway did not restart"
for i in $(seq 1 30); do
  [ "$(docker inspect -f '{{.State.Health.Status}}' supabase-envoy 2>/dev/null)" = healthy ] && break
  sleep 2
done
code=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Basic $B64" http://127.0.0.1:8000/)
case "$code" in 200|301|302|307|308) ;; *) rollback "Studio did not accept the new dashboard credential ($code)" ;; esac

sudo python3 - <<'PY' || rollback "the Caddyfile was not as expected"
p = '/etc/caddy/Caddyfile'
s = open(p).read()
old = "api.sparivier.ca {\n\treverse_proxy 127.0.0.1:8000\n}\n"
new = """api.sparivier.ca {
\t# Supabase Studio opens only for admins with Studio access, through the
\t# admin portal's login (functions/studio-gate). The public API passes
\t# straight through. See the lavelle repo, supabase/caddy/studio-gate.caddy.
\t@api path /auth/v1/* /rest/v1/* /storage/v1/* /functions/v1/* /realtime/v1/* /graphql/v1* /pg/* /.well-known/*
\thandle @api {
\t\treverse_proxy 127.0.0.1:8000
\t}

\thandle {
\t\tforward_auth 127.0.0.1:8000 {
\t\t\turi /functions/v1/studio-gate
\t\t\tcopy_headers X-Studio-User
\t\t}
\t\treverse_proxy 127.0.0.1:8000 {
\t\t\timport /etc/caddy/studio-auth.caddy
\t\t}
\t}
}
"""
if old not in s:
    raise SystemExit('the api.sparivier.ca block is not as expected')
open(p, 'w').write(s.replace(old, new))
PY
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || rollback "Caddy rejected the new configuration"
sudo systemctl reload caddy || rollback "Caddy did not reload"
sleep 2

# ── 5. Checks ──
ANON=$(grep -E '^ANON_KEY=' .env | cut -d= -f2-)
api=$(curl -s -o /dev/null -w '%{http_code}' "https://api.sparivier.ca/rest/v1/site_text?select=key&limit=1" -H "apikey: $ANON")
gate=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -H 'Accept: text/html' https://api.sparivier.ca/project/default)
[ "$api" = 200 ] || rollback "the public API answered $api"
case "$gate" in
  "302 https://sparivier.ca/admin/studio"*) ;;
  *) rollback "Studio did not send the browser to the admin login ($gate)" ;;
esac

echo "Done."
echo "  API: $api"
echo "  Studio without a login: $gate"
echo "  Gateway now listens on: $(docker ps --filter name=supabase-envoy --format '{{.Ports}}')"
echo "  Backups: /opt/supabase/docker/$ENV_BAK and $CADDY_BAK"
