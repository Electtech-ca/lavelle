/**
 * Daily promo — the promo graphic at the top of the What's Happening page.
 *
 * One promo shows each day and they take turns, so a single entry shows
 * every day; with none, the section is hidden. Ongoing offers belong in
 * promotionsData.js (Current Promotions) instead. To add a daily promo, put
 * the image in public/images/promos/ and add:
 *   id       unique
 *   image    path under public/
 *   width, height   the image's size in pixels, so the page doesn't jump while it loads
 *   alt      { en, fr } — what the graphic says, for screen readers
 */
export const dailyPromos = [
  // Example of the expected shape — uncomment and edit, or add alongside:
  // {
  //   id: 'autumn-facial',
  //   image: '/images/promos/autumn-facial.webp',
  //   width: 940,
  //   height: 788,
  //   alt: { en: 'What the graphic says…', fr: 'Ce que dit le visuel…' },
  // },
]

/* Today's promo by the visitor's calendar date, or null when there are none. */
export function promoOfTheDay(date = new Date()) {
  if (dailyPromos.length === 0) return null
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
  return dailyPromos[day % dailyPromos.length]
}
