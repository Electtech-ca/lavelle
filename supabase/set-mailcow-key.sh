#!/usr/bin/env bash
# Stores the mailcow API key the admin portal's "Email password" form needs
# (functions/mailbox-password), next to the certificate email's secrets.
# Make the key in mailcow: System > Configuration > Access > API, read-write,
# and allow API access from this server. It prompts without echoing, so the
# key never appears on screen, in shell history, or in any chat. Only the
# MAILCOW_API_KEY line of the file changes; safe to re-run.
set -euo pipefail
FILE="${CERT_SECRETS_FILE:-/opt/supabase/docker/.env.certificates}"
umask 077

read -rsp 'mailcow read-write API key: ' KEY; echo
if [[ ! "$KEY" =~ ^[A-Za-z0-9-]{20,}$ ]]; then
  echo 'That does not look like a mailcow API key. Nothing was saved.'; exit 1
fi

touch "$FILE"
grep -v '^MAILCOW_API_KEY=' "$FILE" > "$FILE.new" || true
printf "MAILCOW_API_KEY='%s'\n" "$KEY" >> "$FILE.new"
mv "$FILE.new" "$FILE"
chmod 600 "$FILE"
echo "Saved to $FILE. Now reload the functions container (see README)."
