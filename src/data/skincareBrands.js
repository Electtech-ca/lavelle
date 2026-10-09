/* ──────────────────────────────────────────────────────────────
   Skincare — the skincare and makeup brands we carry.

   Write-ups are the client's own, in the order the client listed them;
   more brands are to come. French is in skincareBrandsTranslations.js,
   keyed by slug.

   `images`: the first is the tile photo. Eminence's first is the one
   MediSpa uses; the client's Skincare heading (public/branding/
   Skincare.svg) gave Eminence's other two, NOON's lineup and Jane
   Iredale's flat lay. The rest are from the client's Brand Photos
   folders. `shortName` is the name in the tile's "Explore … at Spa
   Rivier" line, as the client wrote it.
   No prices here — merchandise is sold in store only.
   ────────────────────────────────────────────────────────────── */

const img = (slug, n) => Array.from({ length: n }, (_, i) => `/images/skincare/${slug}-${i + 1}.webp`)

export const skincareBrands = [
  {
    slug: 'eminence',
    name: 'Eminence Organic Skin Care',
    shortName: 'Eminence',
    images: img('eminence', 3),
    tagline: 'Trusted for 20 years. Loved from the very beginning.',
    body: [
      'Eminence is one of those rare brands that has truly stood the test of time at Spa Rivier. We have carried it for 20 years, and we love it just as much today as we did when we first brought it in.',
      'Known for its Hungarian roots, organic ingredients and B Corp certification, Eminence offers beautiful, effective skincare that is easy to understand and easy to use. It works just as well for someone beginning a skincare routine as it does for someone looking for more advanced, results-focused care.',
      'Over the years, many brands have come and gone. Eminence is different. It is trusted, dependable and wonderfully versatile — a brand we believe in completely and one we cannot imagine Spa Rivier without.',
    ],
  },
  {
    slug: 'noon',
    name: 'NOON Aesthetics',
    images: img('noon', 5),
    tagline: 'Advanced skincare. Targeted results. Powerful, yet gentle.',
    body: [
      'NOON Aesthetics is the clinical skincare line we use when women are ready to take a more focused approach to their skin. Highly concentrated and results-driven, it is designed to target specific concerns with advanced formulations that feel sophisticated without being harsh.',
      'We love NOON because it bridges the gap between powerful clinical skincare and everyday usability. It is ideal for women who want a more personalized, prescription-oriented approach to concerns such as aging, pigmentation, texture and overall skin quality.',
      'For the woman who is serious about her skin and wants to age later, age better, NOON is a true game changer.',
    ],
  },
  {
    slug: 'jane-iredale',
    name: 'Jane Iredale',
    images: img('jane-iredale', 2),
    tagline: 'Makeup that cares for your skin.',
    body: [
      'Jane Iredale is where skincare and makeup truly come together. Known for beautiful mineral formulas, healthy-looking coverage and easy application, it gives you the freedom to choose everything from a light, natural finish to fuller coverage — without feeling heavy on the skin.',
      'We love Jane Iredale because it does more than make skin look beautiful. Many of its complexion products also offer broad-spectrum mineral SPF protection, with several recommended by The Skin Cancer Foundation.',
      'With foundations, powders, blushes, eye colour, lip products and more, it is a wonderfully complete makeup collection that is simple to use and easy to love. For many of our clients, once they experience how Jane Iredale looks and feels on their skin, it becomes very hard to go back.',
    ],
  },
]
