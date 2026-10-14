import en from '../../i18n/en.json'
import fr from '../../i18n/fr.json'
import { supabase } from '../../lib/supabase'
import { applyText } from '../../lib/siteContent'

/* ──────────────────────────────────────────────────────────────
   Reading and saving the admin's page text (site_text). The wording in
   src/i18n/en.json and fr.json is the default; a row holds only what
   was changed, and a language left as the default is stored blank.
   ────────────────────────────────────────────────────────────── */

export const DEFAULTS = { en, fr }

/* The site's pages, by the start of their text's keys. Keys for parts of
   the site that are switched off (cart, checkout, Gourmet, member
   accounts) are left out. */
export const TEXT_GROUPS = [
  { id: 'menus',     label: 'Menus, buttons & search', prefixes: ['nav.', 'cta.', 'search.', 'app.', 'a11y.', 'modal.', 'service.', 'steps.'] },
  { id: 'home',      label: 'Homepage',                prefixes: ['hero.', 'home.', 'grid.', 'awards.'] },
  { id: 'spa',       label: 'Spa',                     prefixes: ['spa.'] },
  { id: 'salon',     label: 'Salon',                   prefixes: ['salon.'] },
  { id: 'medispa',   label: 'MediSpa',                 prefixes: ['medispa.'] },
  { id: 'boutique',  label: 'Boutique',                prefixes: ['boutique.'] },
  { id: 'haircare',  label: 'Haircare',                prefixes: ['haircare.'] },
  { id: 'skincare',  label: 'Skincare',                prefixes: ['skincare.'] },
  { id: 'bathbody',  label: 'Bath & Body',             prefixes: ['bathbody.'] },
  { id: 'giftware',  label: 'Giftware & gift certificates', prefixes: ['gifts.', 'giftCert.', 'certConfirm.', 'certView.'] },
  { id: 'happening', label: "What's Happening",        prefixes: ['blog.', 'featured.'] },
  { id: 'team',      label: 'Team',                    prefixes: ['team.'] },
  { id: 'footer',    label: 'Footer & newsletter',     prefixes: ['footer.', 'newsletter.'] },
  { id: 'booking',   label: 'Booking window',          prefixes: ['booking.meevo.', 'booking.header', 'booking.heading', 'booking.dialogLabel'] },
  { id: 'contact',   label: 'Contact details & hours', prefixes: ['contact.'] },
]

export const groupOf = key => TEXT_GROUPS.find(g => g.prefixes.some(p => key.startsWith(p)))
export const ALL_KEYS = Object.keys(en).filter(groupOf)

/* Words written once and used in many places appear in the editor as
   [phone], [street], [area] and [hours]. */
const TOKENS = [
  ['[phone]',  '$t(contact.phone)'],
  ['[street]', '$t(contact.street)'],
  ['[area]',   '$t(contact.area)'],
  ['[hours]',  '$t(contact.hoursSummary)'],
]
export const toEditable   = text => TOKENS.reduce((s, [shown, stored]) => s.split(stored).join(shown), text || '')
export const fromEditable = text => TOKENS.reduce((s, [shown, stored]) => s.split(shown).join(stored), text || '')
export const hasTokens    = text => /\[(phone|street|area|hours)\]|\{\{\w+\}\}/.test(toEditable(text))

export async function loadTextOverrides() {
  const { data, error } = await supabase.from('site_text').select('key, en, fr, updated_at')
  if (error) throw error
  return Object.fromEntries(data.map(r => [r.key, r]))
}

/* Saves one key's wording, as the admin typed it (with [phone] etc.).
   Wording equal to the default is stored blank; a key with nothing
   changed loses its row. Returns the saved row, or null. */
export async function saveText(key, typed) {
  const value = lng => {
    const v = fromEditable(typed[lng] ?? '').replace(/\r\n/g, '\n')
    return v.trim() === '' || v === DEFAULTS[lng][key] ? '' : v
  }
  const row = { key, en: value('en'), fr: value('fr'), updated_at: new Date().toISOString() }
  if (!row.en && !row.fr) {
    const { error } = await supabase.from('site_text').delete().eq('key', key)
    if (error) throw error
    applyText(key, row)
    return null
  }
  const { data, error } = await supabase.from('site_text').upsert(row).select().single()
  if (error) throw error
  applyText(key, row)
  return data
}

/* "hero.welcome.headline" → "Welcome · Headline" */
export function keyLabel(key) {
  const group = groupOf(key)
  const prefix = group?.prefixes.find(p => key.startsWith(p)) || ''
  const rest = key.slice(prefix.endsWith('.') ? prefix.length : 0) || key
  return rest.split('.').map(part => part
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/_/g, ' ')
    .replace(/^./, c => c.toUpperCase())).join(' · ')
}
