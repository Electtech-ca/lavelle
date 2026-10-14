-- =============================================================================
-- Spa Rivier: the admin's Services and Promotions pages drive the site (2026-10-14)
--
-- The Salon and Spa price lists and the promotions used to live only in code
-- (src/data/), so the admin pages edited tables the site never read. The
-- pages now read these tables, and fall back to the copy in code when the
-- database can't be reached. This file:
--   1. adds French text to services and promotions, and a graphic and an
--      end date to promotions;
--   2. replaces the old template rows (and the "Test" promotion) with the
--      price lists and promotions the site showed on 2026-10-14;
--   3. adds a public "promotions" storage bucket that admins upload
--      promotion graphics to.
--
-- Safe to run more than once: the rows are copied in only while the tables
-- still hold the old template data, so later admin edits are kept.
-- Run it BEFORE deploying the site that reads these tables:
--   docker exec -i supabase-db psql -U postgres -d postgres < admin-content.sql
-- =============================================================================

SET client_encoding = 'UTF8';

BEGIN;

-- ── 1. Columns ───────────────────────────────────────────────────────────────
-- services.subcategory is the price list a service sits in, e.g. 'cuts_styles'
-- (src/data/serviceSections.js). price_fr is only for prices with words in
-- them ("Starting at $15"); otherwise the French menu shows the same price.
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS name_fr  text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price_fr text NOT NULL DEFAULT '';

-- image is the promotion's graphic (a site path or a storage URL); with one,
-- the promotion takes a whole row. until takes it down after that day.
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS title_fr       text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS value_fr       text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS expiry_fr      text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_fr text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image          text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_width    integer,
  ADD COLUMN IF NOT EXISTS image_height   integer,
  ADD COLUMN IF NOT EXISTS until          date;

-- A promotion may have no "Valid" line.
ALTER TABLE public.promotions ALTER COLUMN expiry SET DEFAULT '';

-- ── 2. Rows ──────────────────────────────────────────────────────────────────
-- Generated from src/data/salonData.js, spaData.js, salonTranslations.js,
-- promotionsData.js and promotionTranslations.js.
DO $seed$
BEGIN
  -- The old template used none of these lists, so finding one means the
  -- price lists were already copied in.
  IF NOT EXISTS (SELECT 1 FROM public.services
                 WHERE subcategory IN ('perms','treatments','lash_extensions','brows',
                                       'enhancements','nail_hand','nail_extensions','foot')) THEN
    DELETE FROM public.services;
    INSERT INTO public.services (category, subcategory, name, name_fr, price, price_fr, sort_order) VALUES
      ('salon', 'cuts_styles', 'Women''s Haircut & Style', 'Coupe & Mise en Plis Femme', '$59', '', 0),
      ('salon', 'cuts_styles', 'Women''s Haircut Only', 'Coupe Femme Seulement', '$49', '', 1),
      ('salon', 'cuts_styles', 'Senior''s & Student''s Haircut & Style', 'Coupe & Mise en Plis Aîné(e)s & Étudiant(e)s', '$49', '', 2),
      ('salon', 'cuts_styles', 'Senior''s & Student''s Haircut Only', 'Coupe Seulement Aîné(e)s & Étudiant(e)s', '$39', '', 3),
      ('salon', 'cuts_styles', 'Men''s Cut & Style', 'Coupe & Mise en Plis Homme', '$32', '', 4),
      ('salon', 'cuts_styles', 'Men''s Quick Cut', 'Coupe Rapide Homme', '$25', '', 5),
      ('salon', 'cuts_styles', 'Pre-Teen''s Cut & Style (8–12 years)', 'Coupe & Mise en Plis Préado (8–12 ans)', '$39', '', 6),
      ('salon', 'cuts_styles', 'Pre-Teen''s Cut Only (8–12 years)', 'Coupe Seulement Préado (8–12 ans)', '$32', '', 7),
      ('salon', 'cuts_styles', 'Children''s Cut Only (0–7 years)', 'Coupe Enfant Seulement (0–7 ans)', '$20', '', 8),
      ('salon', 'colour', 'Colour Retouch', 'Retouche de Couleur', '$80', '', 0),
      ('salon', 'colour', 'Full Colour (Retouch + End Refresher)', 'Couleur Complète (Retouche + Rafraîchissement des Pointes)', '$95', '', 1),
      ('salon', 'colour', 'Full Colour & Cut', 'Couleur Complète & Coupe', '$144', '', 2),
      ('salon', 'colour', 'Colour Retouch & Cut', 'Retouche de Couleur & Coupe', '$129', '', 3),
      ('salon', 'colour', 'Full Colour with Top Panel Foils', 'Couleur Complète avec Mèches Panneau Supérieur', '$125', '', 4),
      ('salon', 'colour', 'Lighten & Tone', 'Éclaircissement & Tonalisation', '$125', '', 5),
      ('salon', 'colour', 'Top Panel Foils with Toner', 'Mèches Panneau Supérieur avec Toner', '$120', '', 6),
      ('salon', 'colour', 'Top Panel Foils with Toner & Cut', 'Mèches Panneau Supérieur avec Toner & Coupe', '$169', '', 7),
      ('salon', 'colour', 'Full Foils with Toner', 'Mèches Complètes avec Toner', '$150', '', 8),
      ('salon', 'colour', 'Balayage with Toner', 'Balayage avec Toner', '$170', '', 9),
      ('salon', 'colour', 'Long Hair Full Set Foils or Balayage with Toner', 'Cheveux Longs — Mèches Complètes ou Balayage avec Toner', '$250', '', 10),
      ('salon', 'colour', 'Toner Add-On', 'Ajout de Toner', '$40', '', 11),
      ('salon', 'perms', 'Perm with Cut', 'Permanente avec Coupe', '$129', '', 0),
      ('salon', 'perms', 'Specialty Perm or Long Hair', 'Permanente Spécialisée ou Cheveux Longs', '$169', '', 1),
      ('salon', 'treatments', 'Various Hair Treatments', 'Traitements Capillaires Variés', 'Starting at $15', 'À partir de 15 $', 0),
      ('spa', 'waxing', 'Brow Shaping', 'Épilation des Sourcils', '$19', '', 0),
      ('spa', 'waxing', 'Lip', 'Lèvre', '$18', '', 1),
      ('spa', 'waxing', 'Chin', 'Menton', '$18', '', 2),
      ('spa', 'waxing', 'Lip & Chin Combo', 'Combo Lèvre & Menton', '$30', '', 3),
      ('spa', 'waxing', 'Brow & Lip Combo', 'Combo Sourcils & Lèvre', '$32', '', 4),
      ('spa', 'waxing', 'Brow, Lip & Chin Combo', 'Combo Sourcils, Lèvre & Menton', '$47', '', 5),
      ('spa', 'waxing', 'Face', 'Visage', '$60', '', 6),
      ('spa', 'waxing', 'Bikini', 'Maillot', '$33', '', 7),
      ('spa', 'waxing', 'Bikini Plus', 'Maillot Plus', '$45', '', 8),
      ('spa', 'waxing', 'Brazilian', 'Brésilienne', '$59', '', 9),
      ('spa', 'waxing', 'Half Leg', 'Demi-Jambe', '$49', '', 10),
      ('spa', 'waxing', 'Full Leg', 'Jambe Complète', '$79', '', 11),
      ('spa', 'waxing', 'Full Leg & Bikini', 'Jambe Complète & Maillot', '$100', '', 12),
      ('spa', 'waxing', 'Arm', 'Bras', '$55', '', 13),
      ('spa', 'waxing', 'Back', 'Dos', '$55', '', 14),
      ('spa', 'waxing', 'Stomach', 'Ventre', '$55', '', 15),
      ('spa', 'waxing', 'Chest', 'Poitrine', '$55', '', 16),
      ('spa', 'lash_extensions', 'Classic Lash Extensions', 'Extensions de Cils Classiques', '$165', '', 0),
      ('spa', 'lash_extensions', 'Classic Lash Extension — 2 Week Fill', 'Extensions de Cils Classiques — Remplissage 2 Semaines', '$74', '', 1),
      ('spa', 'lash_extensions', 'Classic Lash Extension — 3 Week Fill', 'Extensions de Cils Classiques — Remplissage 3 Semaines', '$86', '', 2),
      ('spa', 'lash_extensions', 'Volume Lash Extensions', 'Extensions de Cils Volume', '$265', '', 3),
      ('spa', 'lash_extensions', 'Volume Lashes — 2 Week Fill', 'Cils Volume — Remplissage 2 Semaines', '$115', '', 4),
      ('spa', 'lash_extensions', 'Volume Lashes — 3 Week Fill', 'Cils Volume — Remplissage 3 Semaines', '$165', '', 5),
      ('spa', 'lash_extensions', 'Lash Perm', 'Permanente de Cils', '$59', '', 6),
      ('spa', 'brows', 'Brow Tint', 'Teinture Sourcils', '$29', '', 0),
      ('spa', 'brows', 'Lash Tint', 'Teinture Cils', '$29', '', 1),
      ('spa', 'brows', 'Brow & Lash Tint', 'Teinture Sourcils & Cils', '$49', '', 2),
      ('spa', 'brows', 'Brow Lamination, Tint & Brow Shaping', 'Laminage des Sourcils, Teinture & Épilation', '$79', '', 3),
      ('spa', 'enhancements', 'Ear Piercing (earrings not included)', 'Perçage d''Oreilles (boucles non incluses)', '$20', '', 0),
      ('spa', 'enhancements', 'Nose Piercing', 'Perçage du Nez', '$50', '', 1),
      ('spa', 'enhancements', 'Specialty Makeup', 'Maquillage Spécialisé', '$79', '', 2),
      ('spa', 'nail_hand', 'Express Manicure', 'Manucure Express', '$45', '', 0),
      ('spa', 'nail_hand', 'Gel Polish Renewal', 'Renouvellement de Vernis Gel', '$54', '', 1),
      ('spa', 'nail_hand', 'Signature Manicure with Gel or Polish', 'Manucure Signature avec Gel ou Vernis', '$65', '', 2),
      ('spa', 'nail_hand', 'Deluxe Spa Manicure with Gel or Polish', 'Manucure Spa Deluxe avec Gel ou Vernis', '$75', '', 3),
      ('spa', 'nail_hand', 'Polish Add-On (Gel or Polish)', 'Ajout de Vernis (Gel ou Vernis)', '$20', '', 4),
      ('spa', 'nail_extensions', 'Acrylic or Gel Enhancements with Colour', 'Renforcements Acrylique ou Gel avec Couleur', '$106', '', 0),
      ('spa', 'nail_extensions', 'Rebalancing', 'Rééquilibrage', '$84', '', 1),
      ('spa', 'foot', 'Toe Nail Trimming', 'Coupe des Ongles d''Orteils', '$24', '', 0),
      ('spa', 'foot', 'Express Pedicure', 'Pédicure Express', '$59', '', 1),
      ('spa', 'foot', 'Diabetic Pedicure', 'Pédicure Diabétique', '$69', '', 2),
      ('spa', 'foot', 'Classic Pedicure (no polish)', 'Pédicure Classique (sans vernis)', '$69', '', 3),
      ('spa', 'foot', 'Signature Pedicure with Gel or Polish', 'Pédicure Signature avec Gel ou Vernis', '$79', '', 4),
      ('spa', 'foot', 'Deluxe Spa Pedicure with Gel or Polish', 'Pédicure Spa Deluxe avec Gel ou Vernis', '$89', '', 5);
  END IF;

  -- Every current promotion has a graphic; the template rows had none.
  IF NOT EXISTS (SELECT 1 FROM public.promotions WHERE image <> '') THEN
    DELETE FROM public.promotions;
    INSERT INTO public.promotions (title, value, expiry, description, title_fr, value_fr, expiry_fr, description_fr, image, image_width, image_height, until, active, sort_order) VALUES
      ('It’s Our Birthday Month — And the Gifts Are for You!', 'Over $1,500 in prizes', 'October 1–31', 'We’re celebrating 41 wonderful years of style, beauty, and community, and we want to share the excitement with you! Throughout October, every $50 spent at Spa Rivier earns you an entry into the prize draw of your choice. With three beautiful prize packages valued at over $1,500 combined, there’s plenty to celebrate! Our lucky winners will be drawn October 31st during our Rivier Royalty Event.', 'C’est notre mois d’anniversaire — et les cadeaux sont pour vous!', 'Plus de 1 500 $ en prix', 'Du 1er au 31 octobre', 'Nous célébrons 41 merveilleuses années de style, de beauté et de communauté, et nous voulons partager cette joie avec vous! Tout au long du mois d’octobre, chaque tranche de 50 $ dépensée chez Spa Rivier vous donne droit à une participation au tirage de votre choix. Avec trois magnifiques lots d’une valeur totale de plus de 1 500 $, il y a de quoi célébrer! Nos heureux gagnants seront tirés au sort le 31 octobre, lors de notre événement Rivier Royalty.', '/images/promos/birthday-month.webp', 940, 788, '2026-10-31', true, 0),
      ('Discover Maria Nila — New at Spa Rivier!', 'Buy two, get one free', '', 'We’re excited to introduce Maria Nila, a premium Swedish haircare brand known for its innovative, 100% vegan formulas, beautiful results, and commitment to sustainability. To celebrate its arrival, we’re offering Buy Two, Get One FREE! It’s the perfect opportunity to discover a new favourite or build your own haircare routine.', 'Découvrez Maria Nila — nouveau chez Spa Rivier!', 'Achetez-en deux, obtenez-en un gratuit', '', 'Nous sommes ravis de vous présenter Maria Nila, une marque suédoise de soins capillaires haut de gamme reconnue pour ses formules novatrices 100 % véganes, ses résultats magnifiques et son engagement envers le développement durable. Pour célébrer son arrivée, nous vous offrons : achetez-en deux, obtenez-en un GRATUIT! C’est l’occasion idéale de découvrir un nouveau favori ou de composer votre propre routine de soins capillaires.', '/images/promos/maria-nila.webp', 940, 788, NULL, true, 1),
      ('Rivier Royalty Loyalty Program', '5% back', 'Ongoing', 'Our way of thanking you for your support. Every purchase is recorded, before tax, on your Rivier Royalty card. After 6 visits we total them and give you 5% back in Rivier dollars to spend with us. We keep your card in store for you.', 'Programme de Fidélité Rivier Royalty', 'Remise de 5 %', 'En continu', 'Notre façon de vous remercier de votre soutien. Chaque achat est inscrit, avant taxes, sur votre carte Rivier Royalty. Après 6 visites, nous en faisons le total et vous remettons 5 % en dollars Rivier à dépenser chez nous. Nous conservons votre carte en boutique.', '/images/promos/rivier-royalty.webp', 940, 788, NULL, true, 2),
      ('5th Saturday Rivier Royalty Event', 'Members only', 'Every month with a 5th Saturday', 'We’re celebrating our Rivier Royalty members! Join us for a sip & shop experience: exclusive discounts and giveaways, a gift bag with purchase for the first 18 purchasers, and a gift basket draw.', 'Événement Rivier Royalty du 5e Samedi', 'Réservé aux membres', 'Chaque mois comptant un 5e samedi', 'Nous célébrons nos membres Rivier Royalty! Joignez-vous à nous pour une expérience « sip & shop » : rabais exclusifs et cadeaux, un sac-cadeau à l’achat pour les 18 premières clientes, et un tirage d’un panier-cadeau.', '/images/promos/fifth-saturday.webp', 940, 788, NULL, true, 3);
  END IF;
END
$seed$;

-- ── 3. Promotion graphics ────────────────────────────────────────────────────
-- Public to read; only admins may add, replace or remove files.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('promotions', 'promotions', true, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "promotions bucket: admins insert" ON storage.objects;
DROP POLICY IF EXISTS "promotions bucket: admins update" ON storage.objects;
DROP POLICY IF EXISTS "promotions bucket: admins delete" ON storage.objects;
CREATE POLICY "promotions bucket: admins insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'promotions' AND public.is_admin());
CREATE POLICY "promotions bucket: admins update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'promotions' AND public.is_admin());
CREATE POLICY "promotions bucket: admins delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'promotions' AND public.is_admin());

COMMIT;
