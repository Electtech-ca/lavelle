/**
 * Daily promo — the promo graphic at the top of the What's Happening page.
 *
 * One promo shows each day and they take turns, so a single entry shows
 * every day. To add one, put the image in public/images/promos/ and add:
 *   id       unique
 *   image    path under public/
 *   width, height   the image's size in pixels, so the page doesn't jump while it loads
 *   alt      { en, fr } — what the graphic says, for screen readers
 */
export const dailyPromos = [
  {
    id: 'rivier-royalty',
    image: '/images/promos/rivier-royalty.webp',
    width: 940,
    height: 788,
    alt: {
      en: 'Rivier Royalty Loyalty Program: our way of thanking you for your support. Every time you make a purchase, we record the amount before tax on your Rivier Royalty card. After 6 visits, we total your purchases and give you 5% back in Rivier dollars to spend with us. For your convenience, we keep your card in store.',
      fr: 'Programme de fidélité Rivier Royalty : notre façon de vous remercier de votre soutien. À chaque achat, nous inscrivons le montant avant taxes sur votre carte Rivier Royalty. Après 6 visites, nous additionnons vos achats et vous remettons 5 % en dollars Rivier à dépenser chez nous. Pour votre commodité, nous conservons votre carte en boutique.',
    },
  },
]

/* Today's promo by the visitor's calendar date, or null when there are none. */
export function promoOfTheDay(date = new Date()) {
  if (dailyPromos.length === 0) return null
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
  return dailyPromos[day % dailyPromos.length]
}
