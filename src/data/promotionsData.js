export const promotions = [
  // `image` is the promotion's own graphic: it then takes a whole row of Current Promotions (PromotionFeature).
  // A promotion with an `image` may leave out `expiry` when there is no end date; its Valid line is then left off.
  // `until` (YYYY-MM-DD) takes a promotion down by itself after that day (see currentPromotions below).
  { id: 11, title: 'It’s Our Birthday Month — And the Gifts Are for You!', value: 'Over $1,500 in prizes', expiry: 'October 1–31', until: '2026-10-31', description: 'We’re celebrating 41 wonderful years of style, beauty, and community, and we want to share the excitement with you! Throughout October, every $50 spent at Spa Rivier earns you an entry into the prize draw of your choice. With three beautiful prize packages valued at over $1,500 combined, there’s plenty to celebrate! Our lucky winners will be drawn October 31st during our Rivier Royalty Event.',
    image: { src: '/images/promos/birthday-month.webp', width: 940, height: 788 } },
  { id: 12, title: 'Discover Maria Nila — New at Spa Rivier!', value: 'Buy two, get one free', description: 'We’re excited to introduce Maria Nila, a premium Swedish haircare brand known for its innovative, 100% vegan formulas, beautiful results, and commitment to sustainability. To celebrate its arrival, we’re offering Buy Two, Get One FREE! It’s the perfect opportunity to discover a new favourite or build your own haircare routine.',
    image: { src: '/images/promos/maria-nila.webp', width: 940, height: 788 } },
  { id: 9, title: 'Rivier Royalty Loyalty Program', value: '5% back',         expiry: 'Ongoing',        description: 'Our way of thanking you for your support. Every purchase is recorded, before tax, on your Rivier Royalty card. After 6 visits we total them and give you 5% back in Rivier dollars to spend with us. We keep your card in store for you.',
    image: { src: '/images/promos/rivier-royalty.webp', width: 940, height: 788 } },
  { id: 10, title: '5th Saturday Rivier Royalty Event', value: 'Members only',   expiry: 'Every month with a 5th Saturday', description: 'We’re celebrating our Rivier Royalty members! Join us for a sip & shop experience: exclusive discounts and giveaways, a gift bag with purchase for the first 18 purchasers, and a gift basket draw.',
    image: { src: '/images/promos/fifth-saturday.webp', width: 940, height: 788 } },
  { id: 5, title: 'Spa & Salon Bundle',            value: 'Save $72',         expiry: 'Monthly',        description: 'Book a signature facial + hair service in one visit and save $72 off the combined price.' },
  { id: 7, title: 'Bridal Inner Circle Package',   value: 'Bespoke pricing',  expiry: 'Year-round',     description: 'Complete bridal preparation: bridal shower high tea, pre-wedding spa day, wedding hair & makeup.' },
  { id: 8, title: 'Fashion Promotion',             value: 'Second one free',  expiry: 'While stocks last', description: 'Buy one sale item at Boutique Rivier and get the second one free. All sales final.' },
]

/* The promotions still running on `date`: one with an `until` date shows
   through the end of that day, in the visitor's time zone. */
export function currentPromotions(date = new Date()) {
  return promotions.filter(p => !p.until || date <= new Date(`${p.until}T23:59:59.999`))
}

export const loyaltyTiers = [
  { tier: 'Champagne', emoji: '🥂', range: '0–500 points',   benefits: ['Earn 1 point per $1 spent', 'Birthday bonus points', 'Member newsletter & exclusive previews'] },
  { tier: 'Gold',      emoji: '👑', range: '501–2,000 points', benefits: ['All Champagne benefits', 'Priority booking access', 'Complimentary welcome drink on arrival', '10% off all retail purchases'] },
  { tier: 'Diamond',   emoji: '💎', range: '2,001+ points',  benefits: ['All Gold benefits', 'Annual complimentary Royal Indulgence Spa Package', 'Personal style consultation with Donna', 'Exclusive invitation to Spa Rivier members-only events'] },
]
