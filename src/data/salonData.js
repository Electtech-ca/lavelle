/* ──────────────────────────────────────────────────────────────
   Salon & spa service menu — source of truth: WEB PRICING.xlsx
   Sheets: HAIR SERVICES, Enhancements, Nail Department, Foot Department
   ────────────────────────────────────────────────────────────── */

/* ── Hair Cuts & Styling (sheet: HAIR SERVICES) ── */
export const cutsStyles = [
  { service: "Women's Haircut & Style", price: '$59' },
  { service: "Women's Haircut Only", price: '$49' },
  { service: "Senior's & Student's Haircut & Style", price: '$49' },
  { service: "Senior's & Student's Haircut Only", price: '$39' },
  { service: "Men's Cut & Style", price: '$32' },
  { service: "Men's Quick Cut", price: '$25' },
  { service: "Pre-Teen's Cut & Style (8–12 years)", price: '$39' },
  { service: "Pre-Teen's Cut Only (8–12 years)", price: '$32' },
  { service: "Children's Cut Only (0–7 years)", price: '$20' },
]

/* ── Colours & Highlights (sheet: HAIR SERVICES) ── */
export const colourServices = [
  { service: 'Colour Retouch', price: '$80' },
  { service: 'Full Colour (Retouch + End Refresher)', price: '$95' },
  { service: 'Full Colour & Cut', price: '$144' },
  { service: 'Colour Retouch & Cut', price: '$129' },
  { service: 'Full Colour with Top Panel Foils', price: '$125' },
  { service: 'Lighten & Tone', price: '$125' },
  { service: 'Top Panel Foils with Toner', price: '$120' },
  { service: 'Top Panel Foils with Toner & Cut', price: '$169' },
  { service: 'Full Foils with Toner', price: '$150' },
  { service: 'Balayage with Toner', price: '$170' },
  { service: 'Long Hair Full Set Foils or Balayage with Toner', price: '$250' },
  { service: 'Toner Add-On', price: '$40' },
]

export const permsAndTreatments = {
  perms: [
    { service: 'Perm with Cut', price: '$129' },
    { service: 'Specialty Perm or Long Hair', price: '$169' },
  ],
  treatments: [
    { service: 'Various Hair Treatments', price: 'Starting at $15' },
  ],
}

/* ── Enhancements (sheet: Enhancements) ── */
export const lashBrow = {
  lashExtensions: [
    { service: 'Classic Lash Extensions', price: '$165' },
    { service: 'Classic Lash Extension — 2 Week Fill', price: '$74' },
    { service: 'Classic Lash Extension — 3 Week Fill', price: '$86' },
    { service: 'Volume Lash Extensions', price: '$265' },
    { service: 'Volume Lashes — 2 Week Fill', price: '$115' },
    { service: 'Volume Lashes — 3 Week Fill', price: '$165' },
    { service: 'Lash Perm', price: '$59' },
  ],
  brows: [
    { service: 'Brow Tint', price: '$29' },
    { service: 'Lash Tint', price: '$29' },
    { service: 'Brow & Lash Tint', price: '$49' },
    { service: 'Brow Lamination, Tint & Brow Shaping', price: '$79' },
  ],
  enhancements: [
    { service: 'Ear Piercing (earrings not included)', price: '$20' },
    { service: 'Nose Piercing', price: '$50' },
    { service: 'Specialty Makeup', price: '$79' },
  ],
}

/* ── Nail & Foot Departments (sheets: Nail Department, Foot Department) ── */
export const nailBar = {
  extensions: [
    { service: 'Acrylic or Gel Enhancements with Colour', price: '$106' },
    { service: 'Rebalancing', price: '$84' },
  ],
  hand: [
    { service: 'Express Manicure', price: '$45' },
    { service: 'Gel Polish Renewal', price: '$54' },
    { service: 'Signature Manicure with Gel or Polish', price: '$65' },
    { service: 'Deluxe Spa Manicure with Gel or Polish', price: '$75' },
    { service: 'Polish Add-On (Gel or Polish)', price: '$20' },
  ],
  foot: [
    { service: 'Toe Nail Trimming', price: '$24' },
    { service: 'Express Pedicure', price: '$59' },
    { service: 'Diabetic Pedicure', price: '$69' },
    { service: 'Classic Pedicure (no polish)', price: '$69' },
    { service: 'Signature Pedicure with Gel or Polish', price: '$79' },
    { service: 'Deluxe Spa Pedicure with Gel or Polish', price: '$89' },
  ],
}
