import { useSyncExternalStore } from 'react'
import i18n from '../i18n'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'
import { supabase } from './supabase'

/* ──────────────────────────────────────────────────────────────
   The page text and photos the admin has changed.

   site_text holds a row per changed piece of text: `key` is its key in
   src/i18n/en.json and fr.json, `en` and `fr` the new wording (blank =
   the wording in the file). site_photos holds a row per replaced photo:
   `slot` is the photo's address in the code (src/data/photoSlots.js),
   `url` the photo shown instead.

   Both are read once when the site opens. Until they arrive, and when
   the database can't be read, the site shows the files' own text and
   photos. The admin calls applyText()/applyPhoto() after a save, so the
   change shows without a reload.
   ────────────────────────────────────────────────────────────── */

const FILES = { en, fr }

let photos = {}
const listeners = new Set()
const notify = () => listeners.forEach(fn => fn())

// One change of text, in both languages. A blank value puts back the file's.
export function applyText(key, values) {
  for (const lng of ['en', 'fr']) {
    const value = values[lng]?.trim() ? values[lng] : FILES[lng][key]
    if (value !== undefined) i18n.addResource(lng, 'translation', key, value)
  }
}

export function applyPhoto(slot, url) {
  photos = { ...photos }
  if (url) photos[slot] = url
  else delete photos[slot]
  notify()
}

export async function loadSiteContent() {
  if (!supabase) return
  const [text, pics] = await Promise.all([
    supabase.from('site_text').select('key, en, fr'),
    supabase.from('site_photos').select('slot, url'),
  ])
  if (text.error) console.error('[site_text] read failed, showing the text in code:', text.error.message)
  else text.data.forEach(row => applyText(row.key, row))

  if (pics.error) console.error('[site_photos] read failed, showing the photos in code:', pics.error.message)
  else if (pics.data.length) {
    photos = Object.fromEntries(pics.data.filter(r => r.url).map(r => [r.slot, r.url]))
    notify()
  }
}

/* The photo to show for an address in the code: the admin's replacement,
   or the address itself. Components call usePhoto() to get `photo` and
   re-render when a photo changes. */
export const photo = src => photos[src] || src

const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn) }
const snapshot = () => photos

export function usePhoto() {
  const current = useSyncExternalStore(subscribe, snapshot)
  return src => current[src] || src
}

export function usePhotoOverrides() {
  return useSyncExternalStore(subscribe, snapshot)
}

/* "250-992-8084" → "tel:+12509928084" (North American numbers get +1). */
export function telHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  return `tel:+${digits.length === 10 ? '1' + digits : digits}`
}
