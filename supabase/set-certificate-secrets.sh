#!/usr/bin/env bash
# Stores the two secrets the gift-certificate email sender needs:
#   the noreply@sparivier.ca mailbox password and the Stripe webhook signing secret.
# It prompts without echoing, so neither value appears on screen, in shell
# history, or in any chat. Safe to re-run to change either value.
set -euo pipefail
FILE="${CERT_SECRETS_FILE:-/opt/supabase/docker/.env.certificates}"
umask 077

read -rsp 'noreply@sparivier.ca password: ' SMTP_PASSWORD; echo
read -rsp 'Stripe signing secret (starts with whsec_): ' STRIPE_WEBHOOK_SECRET; echo

if [[ -z "$SMTP_PASSWORD" ]]; then
  echo 'The password was empty. Nothing was saved.'; exit 1
fi
if [[ "$SMTP_PASSWORD" == *"'"* ]]; then
  echo "The password contains a ' character, which this file format cannot hold."
  echo 'Change the mailbox password in mailcow to one without it, then run this again.'; exit 1
fi
if [[ "$STRIPE_WEBHOOK_SECRET" != whsec_* ]]; then
  echo 'That does not look like a Stripe signing secret (it starts with whsec_). Nothing was saved.'; exit 1
fi

# Single-quoted so characters like $ or # in the password are kept exactly.
printf "SMTP_PASSWORD='%s'\nSTRIPE_WEBHOOK_SECRET='%s'\n" "$SMTP_PASSWORD" "$STRIPE_WEBHOOK_SECRET" > "$FILE"
chmod 600 "$FILE"
echo "Saved to $FILE (readable only by the server's ubuntu account)."
echo 'You can close this window and tell Claude it is done.'
