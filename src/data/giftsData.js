export const giftItems = [
  { id: 2,  name: 'Pure Cashmere Throw Blanket',          price: '$264',      priceInCents: 26400, stock: 5,  image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', description: 'Grade-A Scottish cashmere in champagne. Cloud-soft and endlessly elegant.' },
  { id: 3,  name: 'Artisan Candle Collection (Set of 3)', price: '$114',      priceInCents: 11400, stock: 18, image: '/images/gifts/voluspa-japonica-set.jpg', description: 'Hand-poured soy wax in Jasmine & Tuberose, Rose Oud, and Champagne & Fig.' },
  { id: 4,  name: 'Luxury Skincare Ritual Set',           price: '$330',      priceInCents: 33000, stock: 7,  image: '/images/medispa/eminence-strawberry-rhubarb.jpg', description: '5-piece French skincare: cleanser, toner, serum, eye cream, moisturizer in keepsake tray.' },
  { id: 5,  name: 'Silk Robe & Eye Mask Set',             price: '$198',      priceInCents: 19800, stock: 8,  image: 'https://images.unsplash.com/photo-1583492629548-ae5e58ad0b82?w=400&h=400&fit=crop', description: '22mm mulberry silk robe and matching sleep mask. In champagne, ivory, or blush.' },
  { id: 6,  name: 'French Linen Napkin Set',              price: '$102',      priceInCents: 10200, stock: 15, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', description: '6 hand-hemmed stonewashed linen napkins. An everyday luxury for the entertaining woman.' },
  { id: 7,  name: 'Gold-Dipped Rose',                     price: '$72',       priceInCents: 7200,  stock: 20, image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&h=400&fit=crop', description: 'A real rose preserved and dipped in 24k gold. An eternal symbol of beauty.' },
  { id: 9,  name: 'Monogrammed Leather Cardholder',       price: '$132',      priceInCents: 13200, stock: 9,  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', description: 'Italian full-grain leather, 6 cards. Personalized with 2-letter initials in gold.' },
  { id: 12, name: 'Gold Jewellery Organiser',             price: '$156',      priceInCents: 15600, stock: 8,  image: '/images/boutique/jewellery-case.jpg', description: 'Velvet-lined stackable jewellery case with mirror.' },
  { id: 13, name: 'Personalised Photo Album',             price: '$108',      priceInCents: 10800, stock: 14, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', description: 'Linen-bound with gold-foil name embossing. Holds 60 photos, 4×6 format.' },
  { id: 14, name: 'Herbal Tea Ceremony Set',              price: '$138',      priceInCents: 13800, stock: 11, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', description: 'Japanese ceramic teapot + 2 cups + 5 artisan loose-leaf blends in a lacquered box.' },
  { id: 16, name: 'Handmade Truffle Chocolate Box',       price: '$90',       priceInCents: 9000,  stock: 16, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', description: '24 hand-crafted Belgian truffles: champagne, raspberry, dark espresso, salted caramel.' },
  { id: 17, name: 'Silk Satin Pillowcase Set',            price: '$114',      priceInCents: 11400, stock: 12, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop', description: 'Two 22mm silk pillowcases. Reduces hair breakage and skin creasing. Ivory or blush.' },
  { id: 19, name: 'Wellness Journal & Pen Set',           price: '$78',       priceInCents: 7800,  stock: 20, image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop', description: 'Gold-foil embossed leather journal + rollerball pen. 240 cream pages with guided prompts.' },

  /* ── Gourmet ──────────────────────────────────────────────────────────────
     Moved across from the Gourmet page while that page is hidden. */
  { id: 23, name: 'Gimber N°1 Ginger Concentrate',        price: '$34',       priceInCents: 3400,  stock: 24, image: '/images/gourmet/gimber-ginger.jpg', description: 'Organic Peruvian ginger, lemon and herbs, cold-pressed and unsweetened. Mix with sparkling water, or with champagne.' },
]

export const giftCertificates = [
  {
    amount: 50,
    label: 'Rose Quartz',
    subtitle: 'The Graceful Beginning',
    gradient: 'linear-gradient(135deg, #f8e8f0 0%, #f0d0de 50%, #e8c4d2 100%)',
    bg: '#f8e8f0',
    accentColor: '#a0506a',
    goldColor: '#c87890',
    textColor: '#6a2840',
    borderColor: 'rgba(168,80,106,0.35)',
    shimmer: 'rgba(212,160,180,0.6)',
  },
  {
    amount: 100,
    label: 'Champagne',
    subtitle: 'The Signature Gift',
    gradient: 'linear-gradient(135deg, #faf3e0 0%, #f0e0b0 50%, #e8d090 100%)',
    bg: '#faf3e0',
    accentColor: '#b83020',
    goldColor: '#c4a040',
    textColor: '#6a4a10',
    borderColor: 'rgba(196,160,64,0.4)',
    shimmer: 'rgba(228,62,45,0.6)',
  },
  {
    amount: 150,
    label: 'Sage & Gold',
    subtitle: 'The Serene Choice',
    gradient: 'linear-gradient(135deg, #e8f4ec 0%, #c8e0d0 50%, #b0d0bc 100%)',
    bg: '#e8f4ec',
    accentColor: '#3a7050',
    goldColor: '#5a9070',
    textColor: '#2a5038',
    borderColor: 'rgba(90,144,112,0.35)',
    shimmer: 'rgba(138,170,122,0.6)',
  },
  {
    amount: 200,
    label: 'Lavender Royale',
    subtitle: 'The Elegant Statement',
    gradient: 'linear-gradient(135deg, #f0eaf8 0%, #ddd0f0 50%, #c8b8e8 100%)',
    bg: '#f0eaf8',
    accentColor: '#6040a0',
    goldColor: '#8060c0',
    textColor: '#3a2068',
    borderColor: 'rgba(128,96,192,0.35)',
    shimmer: 'rgba(192,160,232,0.6)',
  },
  {
    amount: 300,
    label: 'Imperial Plum',
    subtitle: 'The Distinguished Gift',
    gradient: 'linear-gradient(135deg, #313a4d 0%, #3a4560 50%, #2e3850 100%)',
    bg: '#313a4d',
    accentColor: '#e43e2d',
    goldColor: '#f0d090',
    textColor: '#ffffff',
    borderColor: 'rgba(228,62,45,0.45)',
    shimmer: 'rgba(228,62,45,0.5)',
    dark: true,
  },
  {
    amount: 500,
    label: 'Midnight Diamond',
    subtitle: 'The Collector\'s Edition',
    gradient: 'linear-gradient(135deg, #0a0818 0%, #180a28 50%, #100818 100%)',
    bg: '#0a0818',
    accentColor: '#e43e2d',
    goldColor: '#f5e0a0',
    textColor: '#ffffff',
    borderColor: 'rgba(228,62,45,0.6)',
    shimmer: 'rgba(245,224,160,0.5)',
    dark: true,
    featured: true,
  },
  {
    amount: 1000,
    label: 'Spa Rivier Prestige',
    subtitle: 'The Ultimate Experience',
    gradient: 'linear-gradient(135deg, #050510 0%, #0f0820 50%, #050510 100%)',
    bg: '#050510',
    accentColor: '#f5e0a0',
    goldColor: '#ffffff',
    textColor: '#ffffff',
    borderColor: 'rgba(245,224,160,0.7)',
    shimmer: 'rgba(255,255,255,0.4)',
    dark: true,
    prestige: true,
  },
]

/* The amounts offered on the Giftware page. Every certificate is the same
   gift — the freedom to choose — so the cards carry no tier names, only the
   amount; a soft tint tells them apart, with a deep ink of the same hue for
   strong contrast. (The issued certificate still draws on the palettes above.) */
export const certificateAmounts = [
  { amount: 50,   tint: ['#f8e8f0', '#efd3df'], ink: '#5c2338' },
  { amount: 100,  tint: ['#faf3e0', '#f0e2b8'], ink: '#5a3e0c' },
  { amount: 150,  tint: ['#e8f4ec', '#cfe5d6'], ink: '#23472f' },
  { amount: 200,  tint: ['#f0eaf8', '#ddd2f0'], ink: '#33205f' },
  { amount: 300,  tint: ['#e9edf5', '#d3dae9'], ink: '#2e3350' },
  { amount: 500,  tint: ['#fbeee6', '#f2d8c8'], ink: '#5e3020' },
  { amount: 1000, tint: ['#f7f3ea', '#e8dfcc'], ink: '#3d3420' },
]

/* The colours a certificate is drawn in, for an amount in dollars: its own
   palette for a standard amount, the nearest one below for a custom amount.
   The tier names are not shown — every certificate is the same gift — so the
   sheet reads simply "Spa Rivier" and the amount. */
export function certificateTier(amount) {
  const exact = giftCertificates.find(c => c.amount === amount)
  const base = exact || [...giftCertificates].reverse().find(c => c.amount <= amount) || giftCertificates[0]
  return { ...base, label: null, subtitle: null }
}
