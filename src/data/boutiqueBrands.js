/* ──────────────────────────────────────────────────────────────
   Boutique Rivier — the fashion brands we carry.

   Write-ups are the client's own (notes/docs/writeup.md, public
   sections only), in the order the client listed them. French is
   in boutiqueBrandsTranslations.js, keyed by slug.

   `types` drives the clothing-type filter on the Boutique page.
   Outerwear is not a type of its own: it is jackets + cardigans.
   The tagging below is inferred from each write-up and the brand
   photos, so the boutique should confirm it.

   `images` live in /public/images/boutique/brands; the first is the
   tile photo. A brand without photos gets a typographic tile.
   No prices here — merchandise is sold in store only.
   ────────────────────────────────────────────────────────────── */

const img = (slug, n) => Array.from({ length: n }, (_, i) => `/images/boutique/brands/${slug}-${i + 1}.webp`)

export const clothingTypes = ['tops', 'bottoms', 'jackets', 'cardigans', 'dresses', 'pjs']
export const outerwearTypes = ['jackets', 'cardigans']

export const boutiqueBrands = [
  {
    slug: 'fdj',
    name: 'French Dressing Jeans',
    types: ['tops', 'bottoms', 'jackets', 'cardigans'],
    images: img('fdj', 4),
    tagline: 'Great fit. Easy comfort. Everyday confidence.',
    body: [
      'FDJ has been a favourite at Boutique Rivier because it understands how real women want their clothes to feel — comfortable, flattering and easy to wear. Known for exceptional-fitting denim and beautifully coordinated separates, FDJ makes getting dressed simple without sacrificing style.',
    ],
  },
  {
    slug: 'liverpool',
    name: 'Liverpool Los Angeles',
    types: ['tops', 'bottoms', 'jackets'],
    images: img('liverpool', 4),
    tagline: 'Polished style. Incredible comfort. A fit you’ll reach for again and again.',
    body: [
      'We love Liverpool for its modern, pulled-together style and the way it combines great fit with genuine comfort. From beautifully cut denim to easy, polished separates, these are pieces that make getting dressed feel effortless.',
      'And the Gia Glider® is a standout for us — the ease of a pull-on with the look of a classic five-pocket jean. Its encased elastic waistband gives you that smooth, comfortable fit without sacrificing the finished look of traditional denim.',
    ],
  },
  {
    slug: 'joseph-ribkoff',
    name: 'Joseph Ribkoff',
    types: ['tops', 'bottoms', 'jackets', 'dresses'],
    images: [],
    tagline: 'Timeless style. Beautifully made. Effortlessly sophisticated.',
    body: [
      'Joseph Ribkoff is our premier designer collection — chosen for women who appreciate exceptional style, beautiful fabrics and pieces with staying power. These are the clothes you invest in, wear for years and continue to feel wonderful in.',
      'From polished everyday pieces to something special for an occasion, Joseph Ribkoff brings sophistication without sacrificing comfort or wearability. Sometimes it’s the perfect event piece; sometimes it’s simply something beautiful you decide to treat yourself to.',
    ],
  },
  {
    slug: 'renuar',
    name: 'Renuar',
    types: ['tops', 'cardigans'],
    images: img('renuar', 1),
    tagline: 'The pieces that pull your wardrobe together.',
    body: [
      'Renuar is all about effortless dressing — beautiful sweaters, cardigans, blouses and easy layers that work perfectly with the denim you already love. We carry it because the pieces are comfortable, polished and incredibly wearable, with those dependable wardrobe favourites you reach for again and again.',
    ],
  },
  {
    slug: 'sorella',
    name: 'Sorella',
    types: ['tops', 'bottoms', 'jackets', 'dresses'],
    images: [],
    tagline: 'Natural fabrics. Effortless style. A little European flair.',
    body: [
      'Sorella is a favourite for its relaxed, beautifully wearable pieces in natural fabrics like linen and cotton. We especially love it in the warmer months for easy dresses, summer trousers and light layers that feel as good as they look.',
      'Throughout the cooler seasons, the collection often surprises us with beautiful jackets, coats and layering pieces that carry that same effortless style. It’s an easy, feminine line with a distinctly European feel — and one we look forward to every season.',
    ],
  },
  {
    slug: 'julia-divina',
    name: 'Julia Divina',
    types: ['tops', 'bottoms', 'dresses'],
    images: img('julia-divina', 2),
    tagline: 'Easy to wear. Easy to coordinate. Easy to love.',
    body: [
      'Julia Divina is one of those wonderfully wearable collections that makes getting dressed simple. Comfortable fabrics, flattering pull-on trousers and coordinating tops and layers make it easy to mix, match and create a wardrobe that works together.',
      'With sizing through 2X, it also offers one of the broadest size ranges in our boutique — something we truly value. We love Julia Divina for its comfortable fit, approachable price and polished, uncomplicated style that our customers can wear again and again.',
    ],
  },
  {
    slug: 'wit-wisdom',
    name: 'Wit & Wisdom',
    types: ['bottoms', 'tops'],
    images: img('wit-wisdom', 3),
    tagline: 'Denim designed with comfort in mind.',
    body: [
      'Wit & Wisdom is a newer addition to Boutique Rivier, chosen for women who want the look of great denim with a little extra comfort built in. Their signature stretch fabrics and specially designed waistbands create a fit that feels supportive, flexible and easy to wear all day.',
      'We brought the line in because it offers something a little different from our other denim brands — comfortable, flattering jeans and trousers with plenty of stretch and an easy fit. And while denim is what they’re best known for, we’ve also been enjoying some of their seasonal sweaters and tops when they appear in the collection.',
    ],
  },
  {
    slug: 'papa',
    name: 'Papa Fashions',
    types: ['tops', 'jackets', 'cardigans', 'dresses'],
    images: img('papa', 2),
    tagline: 'Versatile style for everyday life.',
    body: [
      'Papa Fashions is one of the most diverse collections in our boutique, with an ever-changing mix of fabrics, colours and easy-to-wear styles. We love it because there is always something useful to add to your wardrobe — a comfortable cardigan, a great jacket, an easy tank or a seasonal piece that works beautifully with denim.',
      'From summer dresses to fall sweaters and cozy layers, Papa Fashions offers plenty of choice at an approachable mid-range price. It is one of those dependable brands that helps pull a wardrobe together, season after season.',
    ],
  },
  {
    slug: 'wanakome',
    name: 'Wanakome',
    types: ['tops'],
    images: [],
    tagline: 'Fleece that’s in a class of its own.',
    body: [
      'Wanakome is one of our favourite casual brands because the quality of the fleece is truly second to none. Soft, substantial and beautifully made, these are hoodies and sweatshirts that feel luxurious without losing that easy, everyday comfort.',
      'We love Wanakome for its distinctive styling, exceptional construction and the kind of quality you can feel the moment you put it on. These are casual pieces you’ll reach for again and again.',
    ],
  },
  {
    slug: 'irish-merino',
    name: 'Irish Merino Wool',
    types: ['tops'],
    images: [],
    tagline: 'Timeless warmth. Natural beauty. Made to be loved for years.',
    body: [
      'Our Irish merino wool sweaters are chosen for their beautiful quality, natural warmth and timeless appeal. Soft, breathable and wonderfully wearable, they’re the kind of pieces that feel special the moment you put them on — and only get better with time.',
      'From classic knits to beautiful seasonal colours, these are investment pieces designed to become favourites in your wardrobe for years to come.',
    ],
  },
]
