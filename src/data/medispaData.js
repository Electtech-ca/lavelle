/* ──────────────────────────────────────────────────────────────
   MediSpa pricing — source of truth: WEB PRICING.xlsx
   Sheets: Medi Spa, TRILIPO, Laser Hair Removal
   "Series of 8" = buy 6 sessions, get 2 free.
   ────────────────────────────────────────────────────────────── */

export const facialPricing = [
  { name: 'Rebalancing Facial', single: '$95',  series: '$570' },
  { name: 'Anti-Aging Facial',  single: '$125', series: '$750' },
]

export const oxygeneoPricing = [
  { name: 'OxyGeneo',   single: '$150', series: '$900'   },
  { name: 'OxyGeneo X', single: '$250', series: '$1,500' },
]

export const clinicalFacialPricing = [
  { name: 'Clinical Facial', single: '$150', series: '$900' },
]

export const microNeedlingPricing = [
  { name: 'Micro-Needling', single: '$350', series: '$2,100' },
]

export const skinRejuvenationPricing = [
  { name: 'Photo Facial — including Neck & Décolleté', single: '$250', series: '$2,640' },
  { name: 'Photo Facial — Cheeks',                     single: '$100', series: '$600'   },
  { name: 'Photo Facial — Hands',                      single: '$100', series: '$600'   },
]

export const cryotherapyPricing = [
  { name: 'Cryotherapy Treatment', single: '$70', series: '$420' },
]

export const trilipoPricing = [
  { name: 'TriLipo — Arms',                       single: '$150', series: '$900'   },
  { name: 'TriLipo — Love Handles & Abdomen',     single: '$250', series: '$1,500' },
  { name: 'TriLipo — Thighs',                     single: '$250', series: '$1,500' },
  { name: 'TriLipo — Butt Lift',                  single: '$250', series: '$1,500' },
  { name: 'TriLipo — Butt Lift & Thighs',         single: '$350', series: '$2,100' },
  { name: 'TriLipo — Face with Neck & Décolleté', single: '$300', series: '$1,800' },
  { name: 'TriLipo — Bra Back',                   single: '$200', series: '$1,200' },
]

/* ── Laser hair removal — SharpLight™ (sheet: Laser Hair Removal) ── */
export const laserFacePricing = [
  { name: 'Upper Lip',        single: '$40',  series: '$240' },
  { name: 'Chin',             single: '$60',  series: '$360' },
  { name: 'Upper Lip & Chin', single: '$90',  series: '$540' },
  { name: 'Cheeks',           single: '$70',  series: '$420' },
  { name: 'Chin & Neck',      single: '$110', series: '$660' },
  { name: 'Full Face',        single: '$140', series: '$840' },
]

export const laserBodyPricing = [
  { name: 'Under Arms',         single: '$90',  series: '$540'   },
  { name: 'Upper Arms',         single: '$140', series: '$840'   },
  { name: 'Lower Arms',         single: '$140', series: '$840'   },
  { name: 'Full Arms',          single: '$160', series: '$960'   },
  { name: 'Shoulders',          single: '$130', series: '$780'   },
  { name: 'Full Chest',         single: '$150', series: '$900'   },
  { name: 'Abdomen',            single: '$140', series: '$840'   },
  { name: 'Linea (Navel Line)', single: '$60',  series: '$360'   },
  { name: 'Lower Back',         single: '$150', series: '$900'   },
  { name: 'Full Back',          single: '$200', series: '$1,200' },
]

export const laserLegPricing = [
  { name: 'Bikini Line', single: '$100', series: '$600'   },
  { name: 'Brazilian',   single: '$150', series: '$900'   },
  { name: 'Inner Thigh', single: '$130', series: '$780'   },
  { name: 'Upper Legs',  single: '$200', series: '$1,200' },
  { name: 'Lower Legs',  single: '$200', series: '$1,200' },
  { name: 'Full Legs',   single: '$300', series: '$1,800' },
]

export const laserSkinPricing = [
  { treatment: 'Skin Rejuvenation',     price: 'From $120 / session' },
  { treatment: 'Vascular Treatment',    price: 'From $150 / session' },
  { treatment: 'Rosacea',               price: 'From $150 / session' },
  { treatment: 'Sun Spots & Age Spots', price: 'From $100 / session' },
]
