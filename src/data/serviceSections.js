import { cutsStyles, colourServices, permsAndTreatments, lashBrow, nailBar } from './salonData'
import { waxingServices } from './spaData'
import {
  cutsStylesTranslations, colourTranslations, permTranslations, treatmentTranslations,
  waxingTranslations, lashExtensionsTranslations, browsTranslations, enhancementsTranslations,
  nailHandTranslations, nailExtensionsTranslations, nailFootTranslations,
} from './salonTranslations'

/* ──────────────────────────────────────────────────────────────
   Every price list on the Salon and Spa pages, in page order.

   The lists live in the `services` table, one row per service, with
   `subcategory` = the section's `key`; the admin's Services page edits
   them. `items` and `fr` are the copy kept in code: the table's first
   rows came from it (supabase/admin-content.sql), and the pages show it
   when the database can't be read. `page`, `tab` and `label` name the
   list in the admin.
   ────────────────────────────────────────────────────────────── */

export const serviceSections = [
  { key: 'cuts_styles',     page: 'salon', tab: 'Hair',           label: 'Cuts & Styling',              items: cutsStyles,                  fr: cutsStylesTranslations },
  { key: 'colour',          page: 'salon', tab: 'Colour & Perms', label: 'Colour Services',             items: colourServices,              fr: colourTranslations },
  { key: 'perms',           page: 'salon', tab: 'Colour & Perms', label: 'Perms',                       items: permsAndTreatments.perms,    fr: permTranslations },
  { key: 'treatments',      page: 'salon', tab: 'Colour & Perms', label: 'Hair Treatments',             items: permsAndTreatments.treatments, fr: treatmentTranslations },
  { key: 'waxing',          page: 'spa',   tab: 'Waxing',         label: 'Waxing',                      items: waxingServices,              fr: waxingTranslations },
  { key: 'lash_extensions', page: 'spa',   tab: 'Enhancements',   label: 'Lash Extensions',             items: lashBrow.lashExtensions,     fr: lashExtensionsTranslations },
  { key: 'brows',           page: 'spa',   tab: 'Enhancements',   label: 'Brows & Tinting',             items: lashBrow.brows,              fr: browsTranslations },
  { key: 'enhancements',    page: 'spa',   tab: 'Enhancements',   label: 'Piercing & Makeup',           items: lashBrow.enhancements,       fr: enhancementsTranslations },
  { key: 'nail_hand',       page: 'spa',   tab: 'Nail Bar',       label: 'Manicures',                   items: nailBar.hand,                fr: nailHandTranslations },
  { key: 'nail_extensions', page: 'spa',   tab: 'Nail Bar',       label: 'Nail Enhancements',           items: nailBar.extensions,          fr: nailExtensionsTranslations },
  { key: 'foot',            page: 'spa',   tab: 'Foot Care',      label: 'Foot Treatments & Pedicures', items: nailBar.foot,                fr: nailFootTranslations },
]
