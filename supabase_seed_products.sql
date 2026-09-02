-- =============================================================================
--  LA VELLE — SEED PRODUCTS TABLE
--  Run this in Supabase SQL Editor AFTER the main schema has been applied.
--  This inserts all 24 designer clothing items into the live products table.
--  Existing rows with the same name are skipped (ON CONFLICT DO NOTHING).
-- =============================================================================

INSERT INTO public.products (name, description, price, price_cents, stock, image, category, active, sort_order)
VALUES

-- ── Dresses ──────────────────────────────────────────────────────────────────
(
  'The Plum Silk Midi Dress',
  '100% pure silk, bias-cut with adjustable straps. Our La Velle house signature. Available in plum, ivory, and champagne.',
  '$582', 58200, 4,
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&q=85',
  'boutique', true, 1
),
(
  'Velvet Evening Gown',
  'Deep plum stretch velvet, floor-length column silhouette with a low back. The kind of dress that silences a room.',
  '$890', 89000, 2,
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop&q=85',
  'boutique', true, 2
),
(
  'Knit Maxi Dress in Gold',
  'Ribbed lurex-knit, floor-length with a side split. Made for evenings that deserve to be remembered.',
  '$408', 40800, 3,
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop&q=85',
  'boutique', true, 3
),
(
  'Satin Draped Wrap Dress',
  'Champagne-hued hammered satin, front wrap closure with a cascading tie. Universally flattering.',
  '$444', 44400, 5,
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=85',
  'boutique', true, 4
),
(
  'Embroidered Occasion Dress',
  'Floral embroidery on tulle overlay. Limited edition. A dress with a memory.',
  '$660', 66000, 2,
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop&q=85',
  'boutique', true, 5
),
(
  'Asymmetric Cocktail Dress',
  'Midnight navy structured crepe, asymmetric hem, one-shoulder neckline. Effortlessly elevated.',
  '$576', 57600, 4,
  'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&h=500&fit=crop&q=85',
  'boutique', true, 6
),
(
  'Merino Wool Turtleneck Dress',
  'Chocolate brown extra-fine merino, knee-length with subtle ribbing. The chicest way to be warm.',
  '$396', 39600, 5,
  'https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?w=400&h=500&fit=crop&q=85',
  'boutique', true, 7
),

-- ── Tops & Blouses ────────────────────────────────────────────────────────────
(
  'La Velle Floral Blouse',
  'Deadstock French floral print on georgette. Flutter sleeves. Effortlessly romantic.',
  '$234', 23400, 8,
  'https://images.unsplash.com/photo-1564257631407-4deb1f99d253?w=400&h=500&fit=crop&q=85',
  'boutique', true, 8
),
(
  'Crystal-Embellished Organza Blouse',
  'Sheer ivory organza with hand-set crystal buttons along the cuff. Polished, precise, unmistakable.',
  '$318', 31800, 4,
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=85',
  'boutique', true, 9
),
(
  'Feather-Trim Silk Evening Blouse',
  'Ivory 16mm silk charmeuse with a marabou feather hem. Reserved for moments that deserve grandeur.',
  '$462', 46200, 3,
  'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=500&fit=crop&q=85',
  'boutique', true, 10
),
(
  'Cashmere Fine-Knit Turtleneck',
  '100% Grade-A cashmere, slim-fit, ribbed cuffs and hem. In camel, oatmeal, and deep plum.',
  '$276', 27600, 7,
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400&h=500&fit=crop&q=85',
  'boutique', true, 11
),

-- ── Skirts & Trousers ─────────────────────────────────────────────────────────
(
  'Leather Pencil Skirt',
  'Italian vegan leather, knee-length, hidden side zip. Sleek and unapologetically bold.',
  '$342', 34200, 4,
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop&q=85',
  'boutique', true, 12
),
(
  'Silk Slip Skirt',
  'Bias-cut satin, midi length, delicate lace hem. Pairs perfectly with a blazer or turtleneck.',
  '$210', 21000, 6,
  'https://images.unsplash.com/photo-1583744946564-b52d01e7f922?w=400&h=500&fit=crop&q=85',
  'boutique', true, 13
),
(
  'Silk Wide-Leg Palazzo Pants',
  'Ivory hammered silk, high-waisted wide-leg silhouette. The definitive power pant.',
  '$384', 38400, 5,
  'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop&q=85',
  'boutique', true, 14
),
(
  'Wide-Leg Tailored Trousers',
  'Italian crepe, high waist, impeccable drape. From boardroom to evening, without compromise.',
  '$318', 31800, 6,
  'https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=400&h=500&fit=crop&q=85',
  'boutique', true, 15
),

-- ── Blazers & Jackets ─────────────────────────────────────────────────────────
(
  'Structured Blazer in Ivory',
  'Single-button, nipped-waist blazer. Fully silk-lined. Power dressing — redefined.',
  '$474', 47400, 3,
  'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop&q=85',
  'boutique', true, 16
),
(
  'Gold-Button Bouclé Jacket',
  'Ivory bouclé with gilt brass double-row buttons. An unmistakable nod to classic French couture.',
  '$612', 61200, 3,
  'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=400&h=500&fit=crop&q=85',
  'boutique', true, 17
),
(
  'Cropped Linen Blazer',
  'Summer-weight linen, 3/4 sleeves. Relaxed yet refined. In sage, blush, and stone.',
  '$294', 29400, 7,
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=500&fit=crop&q=85',
  'boutique', true, 18
),
(
  'Brocade Evening Jacket',
  'Gold jacquard brocade, collarless with a mandarin neck. The statement piece for every occasion.',
  '$720', 72000, 2,
  'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?w=400&h=500&fit=crop&q=85',
  'boutique', true, 19
),

-- ── Suits & Sets ──────────────────────────────────────────────────────────────
(
  'Double-Breasted Power Suit',
  'Charcoal Italian wool-blend, double-breasted jacket with matching straight-leg trousers. Authority, beautifully dressed.',
  '$960', 96000, 2,
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop&q=85',
  'boutique', true, 20
),
(
  'Tailored Shorts Suit',
  'Two-piece matching set in ivory structured crepe. Sophisticated warm-weather power dressing.',
  '$510', 51000, 4,
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop&q=85',
  'boutique', true, 21
),

-- ── Outerwear ─────────────────────────────────────────────────────────────────
(
  'The La Velle Trench',
  'Double-breasted, belted, water-resistant gabardine. The forever coat you have been searching for.',
  '$750', 75000, 3,
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=85',
  'boutique', true, 22
),
(
  'Belted Bouclé Wool Overcoat',
  'Ivory Italian bouclé wool, wide lapels, self-belt. The outerwear statement that defines the season.',
  '$840', 84000, 2,
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop&q=85',
  'boutique', true, 23
),

-- ── Knitwear ──────────────────────────────────────────────────────────────────
(
  'Cashmere Wrap Cardigan',
  'Grade-A Scottish cashmere. Oversized wrap silhouette with satin self-belt. In camel, plum, and oatmeal.',
  '$384', 38400, 5,
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop&q=85',
  'boutique', true, 24
)

ON CONFLICT DO NOTHING;
