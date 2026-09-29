/* ──────────────────────────────────────────────────────────────
   Haircare — the professional hair brands we carry, as categories.

   Write-ups are the client's own ("Hair categories for website"), in
   the order the client listed them. French is in
   haircareBrandsTranslations.js, keyed by slug.

   `images`: the first is the tile photo. Moroccanoil's are the client's
   own (branding/web pics); Redken, AG Care and one Joico shot come from
   the client's Haircare banner (public/branding/Haircare.svg). A brand
   without photos gets a typographic tile.

   `lines` lists the brands inside a category that gathers several.
   No prices here — merchandise is sold in store only.
   ────────────────────────────────────────────────────────────── */

export const haircareBrands = [
  {
    slug: 'maria-nila',
    name: 'Maria Nila',
    images: ['/images/salon/maria-nila-heal.jpg'],
    tagline: 'Beautiful hair. Thoughtful choices. Exceptional performance.',
    body: [
      'Maria Nila is a brand we are genuinely excited to have at Spa Rivier. We were first drawn to what the brand stands for — but the products themselves made us believers.',
      'What makes Maria Nila exceptional is the strength of the entire collection. Their shampoos and conditioners deliver beautiful results, while their styling products are equally impressive — something we find surprisingly rare in one complete haircare line.',
      'Beautifully formulated, beautifully presented and designed to perform, Maria Nila has quickly become one of our favourite professional haircare collections.',
    ],
  },
  {
    slug: 'moroccanoil',
    name: 'Moroccanoil',
    images: ['/images/haircare/moroccanoil-1.webp', '/images/haircare/moroccanoil-2.webp', '/images/haircare/moroccanoil-3.webp', '/images/haircare/moroccanoil-4.webp'],
    tagline: 'Argan oil. Iconic performance. Pure luxury.',
    body: [
      'Moroccanoil built its reputation around antioxidant-rich argan oil, an ingredient naturally rich in vitamins, essential fatty acids and nutrients that help nourish, soften and add beautiful shine to the hair.',
      'This is a true luxury haircare collection, with products designed to leave hair feeling polished, healthy and beautifully manageable. It is also an especially strong choice for curly and textured hair, with nourishing formulas that help enhance softness, definition and control.',
      'And the luxury doesn’t stop with hair. Moroccanoil’s body collection brings that same signature feel and fragrance into beautifully indulgent body care.',
    ],
  },
  {
    slug: 'joico',
    name: 'Joico',
    images: ['/images/salon/joico-k-pak.jpg', '/images/salon/joico-youthlock.jpg', '/images/haircare/joico-3.webp'],
    tagline: 'Professional performance. Exceptional value. A true salon legacy.',
    body: [
      'Joico has earned its place as one of our favourite professional haircare brands because it does so many things well.',
      'This is one of the most balanced legacy brands we carry — offering excellent value, an extensive selection of shampoos and conditioners, and some of the strongest styling products in our professional collection. Joico also brings award-winning scalp care to the table, making it a great choice for clients looking beyond beautiful hair to overall scalp and hair health.',
      'Reliable, innovative and consistently high-performing, Joico has been trusted by stylists for decades — and it remains one of our personal favourites at Spa Rivier.',
    ],
  },
  {
    slug: 'redken',
    name: 'Redken',
    images: ['/images/haircare/redken-1.webp'],
    tagline: 'Science-led haircare. Proven solutions. Trusted performance.',
    body: [
      'Redken has built its reputation on a scientific, solution-focused approach to professional haircare.',
      'Its greatest strength is in its shampoos, conditioners and treatments, with targeted options for virtually every hair type and concern. Whether the goal is strength, moisture, repair, colour care, volume or scalp support, Redken offers a well-developed system designed to address specific needs.',
      'It is a brand with a loyal following for good reason — dependable, professional and backed by decades of salon expertise.',
    ],
  },
  {
    slug: 'ag-care',
    name: 'AG Care',
    images: ['/images/haircare/ag-care-1.webp'],
    tagline: 'Canadian made. Professional performance. Standout haircare.',
    body: [
      'AG Care is one of our favourite Canadian haircare brands — proudly made right here in British Columbia.',
      'Produced in its own state-of-the-art facility, AG has earned a strong place in the professional haircare industry with beautifully formulated products that simply perform. The collection includes some true hero products — the kind our clients discover, love and come back for again and again.',
      'Innovative, dependable and distinctly its own, AG stands out in a very crowded world of professional haircare.',
      'And we have to admit, we love that one of our strongest professional brands is Canadian.',
    ],
  },
  {
    slug: 'design-me',
    name: 'Design.Me',
    images: [],
    tagline: 'Canadian haircare with a little more personality.',
    body: [
      'Design.Me is our second Canadian professional haircare brand, and it brings a fresh, fun energy to the department.',
      'The collection is built around three easy-to-understand families: Gloss.Me for moisture and shine, Bounce.Me for curls, and Puff.Me for volume. Each category includes its own shampoos, conditioners, treatments and styling products, making it simple to build a complete routine around what your hair needs most.',
      'It’s a smaller, focused line with playful packaging and a youthful personality — but the products are serious about performance.',
    ],
  },
  {
    slug: 'sebastian',
    name: 'Sebastian',
    images: [],
    tagline: 'Create. Re-create. Style without limits.',
    body: [
      'Sebastian is a true legacy styling brand, built for women who see their hair as part of their personal style.',
      'Its strength is styling — products designed to help you create one look, then completely rework it into another. The collection is relatively focused, but within it are some true hero products that have earned a loyal following for their performance, versatility and staying power.',
      'Sebastian speaks to the woman who loves beautiful hair, but also loves changing it up.',
    ],
  },
  {
    slug: 'targeted',
    name: 'Targeted Hair Solutions',
    images: [],
    tagline: 'Sometimes your hair needs more than everyday care.',
    body: [
      'Our Targeted Hair Solutions collection brings together specialized professional products chosen to address specific hair and scalp concerns.',
      'From thinning hair and hard-water buildup to intensive repair, colour maintenance and instant problem-solving, these are the products we reach for when a more focused solution is needed.',
    ],
    lines: [
      { name: 'Nioxin',       focus: 'thinning hair & scalp support' },
      { name: 'K18',          focus: 'intensive repair' },
      { name: 'Malibu C',     focus: 'hard water & mineral buildup' },
      { name: 'Color Wow',    focus: 'targeted, trend-forward problem solving' },
      { name: 'Celeb Luxury', focus: 'colour maintenance & enhancement' },
    ],
  },
]
