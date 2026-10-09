/* ──────────────────────────────────────────────────────────────
   Bath & Body — the body care brands we carry, then the accessories
   shown as a subsection beneath them.

   Write-ups are the client's own ("Spa Rivier – Bath & Body"), in the
   order the client numbered them, which keeps the Margot Elena
   collections (Library of Flowers, The Cottage Greenhouse, TokyoMilk)
   together. French is in bathBodyBrandsTranslations.js, keyed by slug.

   `images`: the first is the tile photo. The Cottage Greenhouse's and
   Moroccanoil Body's come from the client's Body heading (public/
   branding/Body.svg), HoneyLux's from their Brand Photos folder, and
   Library of Flowers' and TokyoMilk's are the ones Giftware uses. The
   client is sending photos for the rest; until then a brand gets a
   typographic tile. No prices here — merchandise is sold in store only.
   ────────────────────────────────────────────────────────────── */

const img = (slug, n) => Array.from({ length: n }, (_, i) => `/images/bathbody/${slug}-${i + 1}.webp`)

export const bathBodyBrands = [
  {
    slug: 'toasted-crumpet',
    name: 'Toasted Crumpet',
    images: [],
    tagline: 'British charm, inspired by nature',
    body: [
      'Discover the beauty of the British countryside with Toasted Crumpet, a charming collection of bath and body essentials proudly made in Britain.',
      'Known for its exquisite hand-painted botanical designs, Toasted Crumpet brings together beautiful fragrances, luxurious hand creams, and richly moisturizing soaps. Every product feels like a little indulgence, combining everyday practicality with thoughtful presentation.',
      'At Spa Rivier, we love how Toasted Crumpet turns simple moments of self-care into something special. Beautiful to use and equally lovely to give.',
    ],
  },
  {
    slug: 'library-of-flowers',
    name: 'Library of Flowers',
    images: img('library-of-flowers', 2),
    tagline: 'A little luxury, inspired by the garden',
    body: [
      'Step into a garden of beautiful fragrances with Library of Flowers, a delightful collection created by Margot Elena.',
      'Inspired by nature’s most captivating scents, this collection features beautiful perfumes, luxurious hand creams, and indulgent bath and body products. Each fragrance is thoughtfully layered, creating a sensory experience that feels both familiar and wonderfully special.',
      'At Spa Rivier, we love Library of Flowers for its feminine charm, beautiful packaging, and timeless appeal. A lovely way to treat yourself or someone special.',
    ],
  },
  {
    slug: 'cottage-greenhouse',
    name: 'The Cottage Greenhouse',
    images: img('cottage-greenhouse', 1),
    tagline: 'Garden-inspired goodness for everyday self-care',
    body: [
      'Inspired by the beauty and goodness of nature, The Cottage Greenhouse is a delightful bath and body collection created by Margot Elena.',
      'Combining botanical-inspired ingredients with beautiful fragrances, the collection offers nourishing body butters, rich hand creams, refreshing body washes, and indulgent treatments for hands, feet, and body. Each collection brings a fresh approach to everyday self-care.',
      'At Spa Rivier, we love The Cottage Greenhouse for its garden-inspired simplicity, beautiful presentation, and wonderfully nourishing products. A little everyday luxury, inspired by nature.',
    ],
  },
  {
    slug: 'tokyomilk',
    name: 'TokyoMilk',
    images: img('tokyomilk', 3),
    tagline: 'Fragrance with an unexpected twist',
    body: [
      'For those who appreciate something a little different, TokyoMilk is a world of intriguing fragrances, artistic expression, and unexpected combinations.',
      'Created by Margot Elena, TokyoMilk blends distinctive scent combinations with imaginative packaging and a touch of mystery. From captivating perfumes to luxurious hand creams, every product invites you to express your individuality.',
      'At Spa Rivier, we love TokyoMilk for its originality and personality. It’s a collection for women who enjoy discovering something beautiful, unexpected, and uniquely their own.',
    ],
  },
  {
    slug: 'moroccanoil-body',
    name: 'Moroccanoil Body',
    images: img('moroccanoil-body', 1),
    tagline: 'Luxurious care, from head to toe',
    body: [
      'Bring the luxury of Moroccanoil into your everyday body care routine with a beautiful collection inspired by the nourishing benefits of argan oil.',
      'From moisturizing body lotions and hand creams to refreshing shower gels and fragrant body oils, Moroccanoil Body combines effective care with beautiful textures and captivating fragrances.',
      'At Spa Rivier, we’ve long appreciated Moroccanoil for its quality and performance. The Body Collection brings that same experience beyond haircare, making everyday moments feel a little more luxurious.',
    ],
  },
  {
    slug: 'well-kept',
    name: 'Well Kept',
    images: [],
    tagline: 'Thoughtful self-care, made in Canada',
    body: [
      'Beautifully simple and thoughtfully designed, Well Kept is a Canadian brand bringing a fresh perspective to everyday personal care.',
      'With an emphasis on sustainability, quality ingredients, and products made to last, Well Kept offers beautifully crafted shaving essentials, bath products, and personal care accessories. Their reusable safety razors are a wonderful alternative to disposable plastic, combining practical design with a more mindful approach to self-care.',
      'At Spa Rivier, we appreciate Canadian brands that make thoughtful choices without compromising quality. Well Kept reminds us that caring for ourselves and our environment can go hand in hand.',
    ],
  },
  {
    slug: 'hempz',
    name: 'Hempz',
    images: [],
    tagline: 'Everyday hydration that feels wonderful',
    body: [
      'Healthy-looking, beautifully moisturized skin starts with everyday care, and Hempz makes it easy to enjoy.',
      'Known for its nourishing, hemp seed oil-enriched body moisturizers, Hempz combines effective hydration with an irresistible collection of fragrances. From fresh and fruity to warm and comforting, there’s something to suit every preference.',
      'At Spa Rivier, we love Hempz for its dependable everyday moisturizing care, generous selection, and approachable price point. A simple pleasure that makes caring for your skin feel wonderful.',
    ],
  },
]

export const bathBodyAccessories = [
  {
    slug: 'lovoh',
    name: 'Lovoh Cloths',
    images: [],
    tagline: 'A thoughtful addition to your daily routine',
    body: [
      'Sometimes the simplest accessories make the biggest difference in our everyday routines.',
      'Lovoh cloths bring a practical touch to personal care, offering a convenient addition to your cleansing and bathing essentials.',
      'At Spa Rivier, we believe that thoughtful details can make even the simplest daily rituals more enjoyable.',
    ],
  },
  {
    slug: 'honeylux',
    name: 'HoneyLux Silk',
    images: img('honeylux', 7),
    tagline: 'A touch of luxury for your hair and skin',
    body: [
      'Experience the beautiful simplicity of silk with HoneyLux, a Canadian brand dedicated to luxurious, thoughtfully designed beauty accessories.',
      'Featuring premium organic mulberry silk, the collection includes pillowcases, sleep masks, and hair accessories designed to be gentle on your skin and hair. Silk’s naturally smooth surface helps reduce friction, making it a lovely addition to your nighttime beauty routine.',
      'At Spa Rivier, we appreciate products that combine everyday function with a little luxury. HoneyLux offers beautiful finishing touches for your personal care routine and thoughtful gifts for someone special.',
    ],
  },
]
