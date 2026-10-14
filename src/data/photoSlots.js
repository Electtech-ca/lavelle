/* ──────────────────────────────────────────────────────────────
   The page photos the admin's Photos page can replace, by page, in the
   order they appear. `slot` is the photo's address in the code; the
   pages show it through usePhoto() (lib/siteContent.js), which swaps in
   the admin's replacement from the site_photos table.

   Brand, team, article and promotion photos are not here: they are
   edited with their brand, profile, article or promotion.
   ────────────────────────────────────────────────────────────── */

export const photoGroups = [
  { page: 'Homepage', path: '/', photos: [
    { slot: '/branding/Web%20page.svg',              label: 'Slideshow 1 — Welcome' },
    { slot: '/branding/Spa-page-no-nail-bar.svg',     label: 'Slideshow 2 — Spa (also the Spa page’s top photo)' },
    { slot: '/branding/Haircare.svg',                 label: 'Slideshow 3 — Haircare (also the Haircare page’s top photo)' },
    { slot: '/images/salon/maria-nila-heal.jpg',      label: 'Slideshow 4 — Salon, left (also the Salon page’s Hair tab)' },
    { slot: '/images/home/salon-service.jpg',         label: 'Slideshow 4 — Salon, right (also the Salon box and the Team page)' },
    { slot: '/branding/Fashion.svg',                  label: 'Slideshow 5 — Quesnel (also the Boutique page’s top photo)' },
    { slot: '/images/home/gift-display.jpg',          label: 'Slideshow 6 — Gifts, left' },
    { slot: '/images/home/gift-certificates.jpg',     label: 'Slideshow 6 — Gifts, right (also the Gift Certificates box)' },
    { slot: '/images/home/spa-treatment.jpg',         label: 'Spa box (also the Team page)' },
    { slot: '/images/home/medispa-laser.jpg',         label: 'MediSpa box' },
    { slot: '/images/home/boutique-display.jpg',      label: 'Boutique box' },
    { slot: '/images/home/giftware-display.jpg',      label: 'Giftware box' },
    { slot: '/images/team/family-smiling.jpg',        label: 'Family First photo' },
  ] },
  { page: 'Spa', path: '/spa', photos: [
    { slot: '/images/spa/bath-ritual.jpg',            label: 'Waxing — banner' },
    { slot: '/images/spa/aromatherapy-diffuser.jpg',  label: 'Waxing — side photo, and the FAQ banner' },
    { slot: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=500&fit=crop&q=85', label: 'Enhancements — banner' },
    { slot: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&h=600&fit=crop&q=80',  label: 'Enhancements — side photo' },
    { slot: '/images/salon/nails-art.jpg',            label: 'Nail Bar — banner' },
    { slot: '/images/salon/nails-glitter.jpg',        label: 'Nail Bar — side photo' },
    { slot: '/images/spa/bath-tray.jpg',              label: 'Foot Care — banner' },
    { slot: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop&q=80',  label: 'Foot Care — side photo' },
    { slot: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=360&fit=crop&q=80',  label: 'FAQ — side photo' },
  ] },
  { page: 'Salon', path: '/salon', photos: [
    { slot: '/images/salon/salon-hero.jpg',            label: 'Top photo' },
    { slot: '/images/salon/moroccanoil-collection.jpg', label: 'Hair — banner (also What’s Happening’s top photo)' },
    { slot: '/images/salon/colour-care-collection.jpg', label: 'Colour & Perms — banner' },
    { slot: '/images/salon/joico-youthlock.jpg',        label: 'Colour & Perms — side photo' },
  ] },
  { page: 'MediSpa', path: '/medispa', photos: [
    { slot: '/branding/Skincare.svg',                            label: 'Top photo (also the Skincare page’s top photo)' },
    { slot: '/images/medispa/eminence-strawberry-rhubarb.jpg',   label: 'Facials — banner, and OxyGeneo — side photo' },
    { slot: '/images/medispa/noon-aesthetics-collection.png',    label: 'Facials — side photo' },
    { slot: '/images/medispa/oxygeneo-treatment.jpg',            label: 'OxyGeneo — banner' },
    { slot: '/images/medispa/clinical-skincare-range.jpg',       label: 'Clinical Facials — banner' },
    { slot: '/images/medispa/noon-anti-aging-range.png',         label: 'Clinical Facials — side photo' },
    { slot: '/images/medispa/skin-rejuvenation-before-after.jpg', label: 'Micro-Needling — banner; Clinical Facials and Skin Rejuvenation — before & after' },
    { slot: '/images/medispa/micro-needling-before-after.jpg',   label: 'Micro-Needling — before & after' },
    { slot: '/images/medispa/led-light-therapy.jpg',             label: 'Skin Rejuvenation — banner' },
    { slot: '/images/medispa/trilipo-body-before-after.jpg',     label: 'TriLipo — banner' },
    { slot: '/images/medispa/trilipo-face-before-after.jpg',     label: 'TriLipo — before & after' },
    { slot: '/branding/Body.svg',                                label: 'Cryotherapy — banner (also the Bath & Body page’s top photo)' },
    { slot: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&h=440&fit=crop&q=80', label: 'Cryotherapy — side photo' },
    { slot: '/images/medispa/laser-before-after.jpg',            label: 'Laser — banner' },
  ] },
  { page: 'Giftware', path: '/giftware', photos: [
    { slot: '/branding/Gifts.svg',                      label: 'Top photo' },
    { slot: '/images/gifts/floral-greenery.jpg',        label: 'Floral & Greenery' },
    { slot: '/images/gifts/candles-home-fragrance.jpg', label: 'Candles & Home Fragrance' },
    { slot: '/images/gifts/home-decor.jpg',             label: 'Home Décor' },
    { slot: '/images/gifts/kitchen-entertaining.jpg',   label: 'Kitchen & Entertaining' },
    { slot: '/images/gifts/gourmet-food-beverages.jpg', label: 'Gourmet Food & Beverages' },
    { slot: '/images/gifts/seasonal-collections.jpg',   label: 'Seasonal Collections' },
    { slot: '/images/gifts/plush-keepsakes.jpg',        label: 'Plush & Keepsakes' },
    { slot: '/images/gifts/gifts-every-occasion.jpg',   label: 'Gifts for Every Occasion' },
  ] },
]
