import { cutsStyles, colourServices, permsAndTreatments, lashBrow, nailBar } from './salonData'
import { waxingServices } from './spaData'
import {
  cutsStylesTranslations, colourTranslations, permTranslations, treatmentTranslations,
  waxingTranslations, lashExtensionsTranslations, browsTranslations, enhancementsTranslations,
  nailHandTranslations, nailExtensionsTranslations, nailFootTranslations,
} from './salonTranslations'
import {
  facialPricing, oxygeneoPricing, clinicalFacialPricing, microNeedlingPricing,
  skinRejuvenationPricing, cryotherapyPricing, trilipoPricing,
  laserFacePricing, laserBodyPricing, laserLegPricing, laserSkinPricing,
} from './medispaData'
import { medispaFrench } from './medispaTranslations'

// MediSpa's lists in the same shape: `series` is the price of a series of 8.
const medi = (rows, names = []) => ({
  items: rows.map(r => ({ service: r.name ?? r.treatment, price: r.single ?? r.price, series: r.series ?? '' })),
  fr:    rows.map((_, i) => ({ service: names[i] || '' })),
})
const F = medispaFrench

/* ──────────────────────────────────────────────────────────────
   Every price list on the Salon, Spa and MediSpa pages, in page order.

   The lists live in the `services` table, one row per service, with
   `subcategory` = the section's `key`; the admin's Services page edits
   them. `items` and `fr` are the copy kept in code: the table's first
   rows came from it (supabase/admin-content.sql), and the pages show it
   when the database can't be read. `page`, `tab` and `label` name the
   list in the admin. A list with `series` also has a "Series of 8" price
   per line (MediSpa).
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
  { key: 'medispa_facials',    page: 'medispa', tab: 'Facials',           label: 'Facials',                series: true, ...medi(facialPricing, F.facials.names) },
  { key: 'medispa_oxygeneo',   page: 'medispa', tab: 'OxyGeneo',          label: 'OxyGeneo',               series: true, ...medi(oxygeneoPricing, F.oxygeneo.names) },
  { key: 'medispa_clinical',   page: 'medispa', tab: 'Clinical Facials',  label: 'Clinical Facials',       series: true, ...medi(clinicalFacialPricing, F.peels.names) },
  { key: 'medispa_needling',   page: 'medispa', tab: 'Micro-Needling',    label: 'Micro-Needling',         series: true, ...medi(microNeedlingPricing, F.needling.names) },
  { key: 'medispa_skin_rejuv', page: 'medispa', tab: 'Skin Rejuvenation', label: 'Skin Rejuvenation',      series: true, ...medi(skinRejuvenationPricing, F.skinRejuv.names) },
  { key: 'medispa_trilipo',    page: 'medispa', tab: 'TriLipo',           label: 'TriLipo',                series: true, ...medi(trilipoPricing, F.trilipo.names) },
  { key: 'medispa_cryo',       page: 'medispa', tab: 'Cryotherapy',       label: 'Cryotherapy',            series: true, ...medi(cryotherapyPricing, F.freezpen.names) },
  { key: 'medispa_laser_skin', page: 'medispa', tab: 'Laser',             label: 'Laser Skin Treatments',  ...medi(laserSkinPricing, F.laser.skinNames) },
  { key: 'medispa_laser_face', page: 'medispa', tab: 'Laser',             label: 'Laser Hair Removal — Face', series: true, ...medi(laserFacePricing, F.laser.faceNames) },
  { key: 'medispa_laser_body', page: 'medispa', tab: 'Laser',             label: 'Laser Hair Removal — Arms & Body', series: true, ...medi(laserBodyPricing, F.laser.bodyNames) },
  { key: 'medispa_laser_legs', page: 'medispa', tab: 'Laser',             label: 'Laser Hair Removal — Bikini & Legs', series: true, ...medi(laserLegPricing, F.laser.legNames) },
]
