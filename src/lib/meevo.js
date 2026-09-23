/* ──────────────────────────────────────────────────────────────
   Meevo online booking hand-off.

   Spa Rivier's appointments live in Meevo, so the site does not take
   bookings itself — it hands the guest to Meevo's Customer Portal.

   Configure with EITHER of the following:

   1. Meevo's published slug link (preferred):
        VITE_MEEVO_BOOKING_URL=https://login.meevo.com/sparivier/ob?locationId=301012

      This 302s to the tenant's regional node, so it survives Meevo
      moving the tenant between nodes. Spa Rivier currently lands on
      https://ca0.meevo.com/CustomerPortal/onlinebooking?tenantId=31011&locationId=301012

   2. A direct regional link, or the three identifiers to build one:
        VITE_MEEVO_REGION=ca0
        VITE_MEEVO_TENANT_ID=31011
        VITE_MEEVO_LOCATION_ID=301012

      Pin the region carefully. Tenants are hosted per region (ca0 for
      Canada, na0/na1/na2 for the US, and so on) and the Customer Portal
      validates entirely client-side: pointing a valid tenant at the
      wrong regional node serves a 200 and a blank white page, not an
      error. Prefer option 1 so the region is never guessed.

   Both identifiers are found in Meevo under Business Settings ▸ Online
   Booking Settings ▸ Main, which is also where the slug link is shown.

   Until one of these is set, isMeevoConfigured() is false and the site
   falls back to its own booking request form.
   ────────────────────────────────────────────────────────────── */

const env = import.meta.env

const RAW_URL   = (env.VITE_MEEVO_BOOKING_URL  || '').trim()
const REGION    = (env.VITE_MEEVO_REGION       || '').trim()
const TENANT_ID = (env.VITE_MEEVO_TENANT_ID    || '').trim()
const LOCATION_ID = (env.VITE_MEEVO_LOCATION_ID || '').trim()

/* Meevo hosts each tenant on a regional node: na0, na1, na2, … */
const REGION_PATTERN = /^[a-z]{2,4}\d{0,2}$/i
const MEEVO_HOST_PATTERN = /^[a-z0-9-]+\.meevo\.com$/i

/* Attribution is OFF by default and the configured link is used verbatim.
   Meevo documents meevo_channel only for its own Google Book Now flow
   (meevo_channel=GoogleBookNow); the set of values it accepts is not
   published, and the Customer Portal validates everything client-side, so
   a bad parameter shows as a blank page rather than an error we could
   detect. The booking path is not worth risking for analytics.

   Turn it on with VITE_MEEVO_ATTRIBUTION=true once a real booking has
   been completed through a tagged link. */
const ATTRIBUTION_ENABLED = String(env.VITE_MEEVO_ATTRIBUTION || '').trim().toLowerCase() === 'true'

const ATTRIBUTION = {
  utm_source: 'sparivier.ca',
  utm_medium: 'website',
  utm_campaign: 'meevo_onlinebooking',
}

function baseUrl() {
  if (RAW_URL) {
    try {
      const url = new URL(RAW_URL)
      if (url.protocol !== 'https:') return null
      if (!MEEVO_HOST_PATTERN.test(url.hostname)) return null
      return url
    } catch {
      return null
    }
  }

  if (!REGION || !TENANT_ID || !LOCATION_ID) return null
  if (!REGION_PATTERN.test(REGION)) return null

  const url = new URL(`https://${REGION.toLowerCase()}.meevo.com/CustomerPortal/onlinebooking`)
  url.searchParams.set('tenantId', TENANT_ID)
  url.searchParams.set('locationId', LOCATION_ID)
  return url
}

const BASE = baseUrl()

/** True once the Meevo identifiers are supplied and well-formed. */
export function isMeevoConfigured() {
  return BASE !== null
}

/**
 * The Meevo booking link to send a guest to.
 *
 * By default this is the configured link unchanged, so what the guest
 * opens is exactly what Meevo published. Meevo's Customer Portal has no
 * documented parameter for preselecting a service, so `service` is never
 * more than campaign attribution; the guest picks the treatment in Meevo.
 */
export function meevoBookingUrl(service = '') {
  if (!BASE) return null
  if (!ATTRIBUTION_ENABLED) return BASE.toString()

  const url = new URL(BASE.toString())
  for (const [key, value] of Object.entries(ATTRIBUTION)) {
    url.searchParams.set(key, value)
  }
  if (service) url.searchParams.set('utm_content', service)
  return url.toString()
}

/** Exposed for the admin panel and diagnostics. */
export function meevoConfigSummary() {
  return {
    configured: isMeevoConfigured(),
    source: RAW_URL ? 'VITE_MEEVO_BOOKING_URL' : (REGION ? 'region + ids' : 'none'),
    host: BASE ? BASE.hostname : null,
    tenantId: BASE ? BASE.searchParams.get('tenantId') : null,
    locationId: BASE ? BASE.searchParams.get('locationId') : null,
  }
}
