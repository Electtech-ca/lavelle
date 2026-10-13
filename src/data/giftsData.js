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
