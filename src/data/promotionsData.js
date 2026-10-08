export const promotions = [
  // `image` is the promotion's own graphic: it then takes a whole row of Current Promotions (PromotionFeature).
  { id: 9, title: 'Rivier Royalty Loyalty Program', value: '5% back',         expiry: 'Ongoing',        description: 'Our way of thanking you for your support. Every purchase is recorded, before tax, on your Rivier Royalty card. After 6 visits we total them and give you 5% back in Rivier dollars to spend with us. We keep your card in store for you.',
    image: { src: '/images/promos/rivier-royalty.webp', width: 940, height: 788 } },
  { id: 10, title: '5th Saturday Rivier Royalty Event', value: 'Members only',   expiry: 'Every month with a 5th Saturday', description: 'We’re celebrating our Rivier Royalty members! Join us for a sip & shop experience: exclusive discounts and giveaways, a gift bag with purchase for the first 18 purchasers, and a gift basket draw.',
    image: { src: '/images/promos/fifth-saturday.webp', width: 940, height: 788 } },
  { id: 1, title: 'New Member Welcome Gift',       value: '$75 value',        expiry: 'Ongoing',        description: 'First-time clients receive a complimentary Spa Rivier Mini Gift Set with first booking over $144.' },
  { id: 2, title: 'The Birthday Ritual',           value: '20% off',          expiry: 'Birthday month', description: 'Celebrate your birthday month with 20% off any spa or salon service.' },
  { id: 3, title: 'Refer a Friend',                value: '$60 credit each',  expiry: 'Ongoing',        description: 'When a friend books their first visit using your referral code, you both receive $60 credit.' },
  { id: 4, title: "Wednesday Women's Luncheon",    value: '$66 fixed menu',   expiry: 'Weekly',         description: 'Every Wednesday, a 3-course prix fixe lunch for the Spa Rivier Woman. Reserve by Tuesday.' },
  { id: 5, title: 'Spa & Salon Bundle',            value: 'Save $72',         expiry: 'Monthly',        description: 'Book a signature facial + hair service in one visit and save $72 off the combined price.' },
  { id: 7, title: 'Bridal Inner Circle Package',   value: 'Bespoke pricing',  expiry: 'Year-round',     description: 'Complete bridal preparation: bridal shower high tea, pre-wedding spa day, wedding hair & makeup.' },
  { id: 8, title: 'Fashion Promotion',             value: 'Second one free',  expiry: 'While stocks last', description: 'Buy one sale item at Boutique Rivier and get the second one free. All sales final.' },
]

export const loyaltyTiers = [
  { tier: 'Champagne', emoji: '🥂', range: '0–500 points',   benefits: ['Earn 1 point per $1 spent', 'Birthday bonus points', 'Member newsletter & exclusive previews'] },
  { tier: 'Gold',      emoji: '👑', range: '501–2,000 points', benefits: ['All Champagne benefits', 'Priority booking access', 'Complimentary welcome drink on arrival', '10% off all retail purchases'] },
  { tier: 'Diamond',   emoji: '💎', range: '2,001+ points',  benefits: ['All Gold benefits', 'Annual complimentary Royal Indulgence Spa Package', 'Personal style consultation with Donna', 'Exclusive invitation to Spa Rivier members-only events'] },
]
