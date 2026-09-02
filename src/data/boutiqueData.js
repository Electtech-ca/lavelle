/**
 * Boutique Rivier — 24 luxury designer clothing pieces.
 * This file is the FALLBACK used when Supabase is not configured.
 * When Supabase IS connected, the `products` table is the live source of truth
 * and these items are managed through the Admin Portal → Products.
 */
export const boutiqueProducts = [
  // ── Dresses ──────────────────────────────────────────────────────────────
  {
    id: 1, name: 'The Plum Silk Midi Dress',
    price: '$582', priceInCents: 58200, stock: 4,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&q=85',
    description: '100% pure silk, bias-cut with adjustable straps. Our Sparivier house signature. Available in plum, ivory, and champagne.',
  },
  {
    id: 2, name: 'Velvet Evening Gown',
    price: '$890', priceInCents: 89000, stock: 2,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop&q=85',
    description: 'Deep plum stretch velvet, floor-length column silhouette with a low back. The kind of dress that silences a room.',
  },
  {
    id: 3, name: 'Knit Maxi Dress in Gold',
    price: '$408', priceInCents: 40800, stock: 3,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&q=85',
    description: 'Ribbed lurex-knit, floor-length with a side split. Made for evenings that deserve to be remembered.',
  },
  {
    id: 4, name: 'Satin Draped Wrap Dress',
    price: '$444', priceInCents: 44400, stock: 5,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=85',
    description: 'Champagne-hued hammered satin, front wrap closure with a cascading tie. Universally flattering.',
  },
  {
    id: 5, name: 'Embroidered Occasion Dress',
    price: '$660', priceInCents: 66000, stock: 2,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop&q=85',
    description: 'Floral embroidery on tulle overlay. Limited edition. A dress with a memory.',
  },
  {
    id: 6, name: 'Asymmetric Cocktail Dress',
    price: '$576', priceInCents: 57600, stock: 4,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=500&fit=crop&q=85',
    description: 'Midnight navy structured crepe, asymmetric hem, one-shoulder neckline. Effortlessly elevated.',
  },
  {
    id: 7, name: 'Merino Wool Turtleneck Dress',
    price: '$396', priceInCents: 39600, stock: 5,
    image: 'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=400&h=500&fit=crop&q=85',
    description: 'Chocolate brown extra-fine merino, knee-length with subtle ribbing. The chicest way to be warm.',
  },

  // ── Separates — Tops & Blouses ────────────────────────────────────────────
  {
    id: 8, name: 'Sparivier Floral Blouse',
    price: '$234', priceInCents: 23400, stock: 8,
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d253?w=400&h=500&fit=crop&q=85',
    description: 'Deadstock French floral print on georgette. Flutter sleeves. Effortlessly romantic.',
  },
  {
    id: 9, name: 'Crystal-Embellished Organza Blouse',
    price: '$318', priceInCents: 31800, stock: 4,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=85',
    description: 'Sheer ivory organza with hand-set crystal buttons along the cuff. Polished, precise, unmistakable.',
  },
  {
    id: 10, name: 'Feather-Trim Silk Evening Blouse',
    price: '$462', priceInCents: 46200, stock: 3,
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=500&fit=crop&q=85',
    description: 'Ivory 16mm silk charmeuse with a marabou feather hem. Reserved for moments that deserve grandeur.',
  },
  {
    id: 11, name: 'Cashmere Fine-Knit Turtleneck',
    price: '$276', priceInCents: 27600, stock: 7,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop&q=85',
    description: '100% Grade-A cashmere, slim-fit, ribbed cuffs and hem. In camel, oatmeal, and deep plum.',
  },

  // ── Separates — Skirts ────────────────────────────────────────────────────
  {
    id: 12, name: 'Leather Pencil Skirt',
    price: '$342', priceInCents: 34200, stock: 4,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop&q=85',
    description: 'Italian vegan leather, knee-length, hidden side zip. Sleek and unapologetically bold.',
  },
  {
    id: 13, name: 'Silk Slip Skirt',
    price: '$210', priceInCents: 21000, stock: 6,
    image: 'https://images.unsplash.com/photo-1583744946564-b52d01e7f922?w=400&h=500&fit=crop&q=85',
    description: 'Bias-cut satin, midi length, delicate lace hem. Pairs perfectly with a blazer or turtleneck.',
  },
  {
    id: 14, name: 'Silk Wide-Leg Palazzo Pants',
    price: '$384', priceInCents: 38400, stock: 5,
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop&q=85',
    description: 'Ivory hammered silk, high-waisted wide-leg silhouette. The definitive power pant.',
  },
  {
    id: 15, name: 'Wide-Leg Tailored Trousers',
    price: '$318', priceInCents: 31800, stock: 6,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=400&h=500&fit=crop&q=85',
    description: 'Italian crepe, high waist, impeccable drape. From boardroom to evening, without compromise.',
  },

  // ── Jackets & Blazers ─────────────────────────────────────────────────────
  {
    id: 16, name: 'Structured Blazer in Ivory',
    price: '$474', priceInCents: 47400, stock: 3,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop&q=85',
    description: 'Single-button, nipped-waist blazer. Fully silk-lined. Power dressing — redefined.',
  },
  {
    id: 17, name: 'Gold-Button Bouclé Jacket',
    price: '$612', priceInCents: 61200, stock: 3,
    image: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400&h=500&fit=crop&q=85',
    description: 'Ivory bouclé with gilt brass double-row buttons. An unmistakable nod to classic French couture.',
  },
  {
    id: 18, name: 'Cropped Linen Blazer',
    price: '$294', priceInCents: 29400, stock: 7,
    image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=500&fit=crop&q=85',
    description: 'Summer-weight linen, 3/4 sleeves. Relaxed yet refined. In sage, blush, and stone.',
  },
  {
    id: 19, name: 'Brocade Evening Jacket',
    price: '$720', priceInCents: 72000, stock: 2,
    image: 'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=400&h=500&fit=crop&q=85',
    description: 'Gold jacquard brocade, collarless with a mandarin neck. The statement piece for every occasion.',
  },

  // ── Suits & Sets ──────────────────────────────────────────────────────────
  {
    id: 20, name: 'Double-Breasted Power Suit',
    price: '$960', priceInCents: 96000, stock: 2,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop&q=85',
    description: 'Charcoal Italian wool-blend, double-breasted jacket with matching straight-leg trousers. Authority, beautifully dressed.',
  },
  {
    id: 21, name: 'Tailored Shorts Suit',
    price: '$510', priceInCents: 51000, stock: 4,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop&q=85',
    description: 'Two-piece matching set in ivory structured crepe. Sophisticated warm-weather power dressing.',
  },

  // ── Outerwear ─────────────────────────────────────────────────────────────
  {
    id: 22, name: 'The Sparivier Trench',
    price: '$750', priceInCents: 75000, stock: 3,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=85',
    description: 'Double-breasted, belted, water-resistant gabardine. The forever coat you have been searching for.',
  },
  {
    id: 23, name: 'Belted Bouclé Wool Overcoat',
    price: '$840', priceInCents: 84000, stock: 2,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&q=85',
    description: 'Ivory Italian bouclé wool, wide lapels, self-belt. The outerwear statement that defines the season.',
  },

  // ── Knitwear ──────────────────────────────────────────────────────────────
  {
    id: 24, name: 'Cashmere Wrap Cardigan',
    price: '$384', priceInCents: 38400, stock: 5,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&q=85',
    description: 'Grade-A Scottish cashmere. Oversized wrap silhouette with satin self-belt. In camel, plum, and oatmeal.',
  },
]
