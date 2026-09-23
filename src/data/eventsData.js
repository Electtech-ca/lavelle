/**
 * Spa Rivier events — shown on the Featured page.
 *
 * Shape mirrors promotionsData.js so the two render as sibling cards:
 *   id       unique, used as the translation key in eventsTranslations.js
 *   title    the event name
 *   when     human-readable date or recurrence ('14 November 2026', 'Monthly')
 *   where    location, if it is not the spa itself
 *   detail   one or two sentences
 *   cta      optional { text, href } — omit for an information-only listing
 *
 * The list is intentionally empty until real dates are supplied. The Featured
 * page shows an empty state rather than a blank space when there is nothing
 * scheduled, so an empty list is a valid state, not a broken one.
 */
export const events = [
  // Example of the expected shape — uncomment and edit, or add alongside:
  // {
  //   id: 1,
  //   title: 'Christmas Open House',
  //   when: '28 November 2026, 5–8pm',
  //   where: '353 Reid Street, Quesnel',
  //   detail: 'Mulled wine, 15% off the boutique, and first look at the seasonal collection.',
  //   cta: { text: 'Reserve your place', href: 'tel:+12509928084' },
  // },
]
