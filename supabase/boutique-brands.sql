-- =============================================================================
-- Spa Rivier: Boutique brands are added, edited and deleted in the admin (2026-10-14)
--
-- The brands on the Boutique page used to live only in code
-- (src/data/boutiqueBrands.js, French in boutiqueBrandsTranslations.js);
-- only their clothing-type tags were in the database (boutique_brand_tags).
-- This file:
--   1. creates public.boutique_brands, one row per brand: name, write-up
--      (English and French), clothing types, photos, shown or hidden, order;
--   2. copies in the ten brands the site showed on 2026-10-14, with the tags
--      saved in boutique_brand_tags, which the site no longer reads;
--   3. adds a public "boutique" storage bucket that admins upload photos to.
--
-- Safe to run more than once: the brands are copied in only while the table
-- is empty, so later admin edits are kept.
-- Run it BEFORE deploying the site that reads the table:
--   docker exec -i supabase-db psql -U postgres -d postgres < boutique-brands.sql
-- =============================================================================

SET client_encoding = 'UTF8';

BEGIN;

-- ── 1. Table ─────────────────────────────────────────────────────────────────
-- body and body_fr hold paragraphs separated by a blank line. images are photo
-- addresses (site paths or storage URLs); the first is the brand's tile.
CREATE TABLE IF NOT EXISTS public.boutique_brands (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        NOT NULL UNIQUE,
  name        text        NOT NULL,
  tagline     text        NOT NULL DEFAULT '',
  body        text        NOT NULL DEFAULT '',
  tagline_fr  text        NOT NULL DEFAULT '',
  body_fr     text        NOT NULL DEFAULT '',
  types       text[]      NOT NULL DEFAULT '{}',
  images      text[]      NOT NULL DEFAULT '{}',
  active      boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT boutique_brands_types_valid
    CHECK (types <@ ARRAY['tops','bottoms','jackets','cardigans','dresses','pjs']::text[])
);

ALTER TABLE public.boutique_brands ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.boutique_brands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.boutique_brands TO authenticated;

DROP POLICY IF EXISTS "boutique_brands: public read shown" ON public.boutique_brands;
DROP POLICY IF EXISTS "boutique_brands: admins all"        ON public.boutique_brands;
CREATE POLICY "boutique_brands: public read shown" ON public.boutique_brands FOR SELECT USING (active = true);
CREATE POLICY "boutique_brands: admins all"        ON public.boutique_brands FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── 2. Rows ──────────────────────────────────────────────────────────────────
-- Generated from src/data/boutiqueBrands.js and boutiqueBrandsTranslations.js.
DO $seed$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.boutique_brands) THEN
    INSERT INTO public.boutique_brands (slug, name, tagline, body, tagline_fr, body_fr, types, images, sort_order) VALUES
      ('fdj', 'French Dressing Jeans', 'Great fit. Easy comfort. Everyday confidence.', 'FDJ has been a favourite at Boutique Rivier because it understands how real women want their clothes to feel — comfortable, flattering and easy to wear. Known for exceptional-fitting denim and beautifully coordinated separates, FDJ makes getting dressed simple without sacrificing style.', 'Une coupe parfaite. Un confort naturel. Une assurance au quotidien.', 'FDJ est un favori de la Boutique Rivier parce que la marque comprend comment les femmes veulent se sentir dans leurs vêtements : à l’aise, mises en valeur et bien dans leur peau. Reconnue pour ses jeans à la coupe exceptionnelle et ses pièces coordonnées élégantes, FDJ simplifie l’art de s’habiller sans rien sacrifier au style.', ARRAY['tops', 'bottoms', 'jackets', 'cardigans']::text[], ARRAY['/images/boutique/brands/fdj-1.webp', '/images/boutique/brands/fdj-2.webp', '/images/boutique/brands/fdj-3.webp', '/images/boutique/brands/fdj-4.webp']::text[], 0),
      ('liverpool', 'Liverpool Los Angeles', 'Polished style. Incredible comfort. A fit you’ll reach for again and again.', 'We love Liverpool for its modern, pulled-together style and the way it combines great fit with genuine comfort. From beautifully cut denim to easy, polished separates, these are pieces that make getting dressed feel effortless.

And the Gia Glider® is a standout for us — the ease of a pull-on with the look of a classic five-pocket jean. Its encased elastic waistband gives you that smooth, comfortable fit without sacrificing the finished look of traditional denim.', 'Un style soigné. Un confort incroyable. Une coupe que vous adopterez encore et encore.', 'Nous aimons Liverpool pour son style moderne et soigné, et pour la façon dont la marque allie une excellente coupe à un vrai confort. Des jeans magnifiquement coupés aux pièces coordonnées faciles à porter, ce sont des vêtements qui rendent l’habillage sans effort.

Et le Gia Glider® se démarque vraiment : l’aisance d’un modèle à enfiler avec l’allure d’un jean classique à cinq poches. Sa taille élastique dissimulée offre un ajustement lisse et confortable, sans sacrifier la finition d’un denim traditionnel.', ARRAY['tops', 'bottoms', 'jackets']::text[], ARRAY['/images/boutique/brands/liverpool-1.webp', '/images/boutique/brands/liverpool-2.webp', '/images/boutique/brands/liverpool-3.webp', '/images/boutique/brands/liverpool-4.webp']::text[], 1),
      ('joseph-ribkoff', 'Joseph Ribkoff', 'Timeless style. Beautifully made. Effortlessly sophisticated.', 'Joseph Ribkoff is our premier designer collection — chosen for women who appreciate exceptional style, beautiful fabrics and pieces with staying power. These are the clothes you invest in, wear for years and continue to feel wonderful in.

From polished everyday pieces to something special for an occasion, Joseph Ribkoff brings sophistication without sacrificing comfort or wearability. Sometimes it’s the perfect event piece; sometimes it’s simply something beautiful you decide to treat yourself to.', 'Un style intemporel. Une confection soignée. Une élégance naturelle.', 'Joseph Ribkoff est notre collection de créateur par excellence, choisie pour les femmes qui apprécient un style exceptionnel, de beaux tissus et des pièces qui durent. Ce sont des vêtements dans lesquels on investit, que l’on porte pendant des années et dans lesquels on continue de se sentir merveilleusement bien.

Des pièces élégantes du quotidien aux tenues pour les grandes occasions, Joseph Ribkoff apporte la sophistication sans sacrifier le confort ni la facilité à porter. Parfois, c’est la tenue idéale pour un événement; parfois, c’est simplement une belle pièce que l’on décide de s’offrir.', ARRAY['tops', 'bottoms', 'jackets', 'dresses']::text[], ARRAY['/images/boutique/brands/joseph-ribkoff-1.webp', '/images/boutique/brands/joseph-ribkoff-2.webp', '/images/boutique/brands/joseph-ribkoff-3.webp', '/images/boutique/brands/joseph-ribkoff-4.webp', '/images/boutique/brands/joseph-ribkoff-5.webp', '/images/boutique/brands/joseph-ribkoff-6.webp']::text[], 2),
      ('renuar', 'Renuar', 'The pieces that pull your wardrobe together.', 'Renuar is all about effortless dressing — beautiful sweaters, cardigans, blouses and easy layers that work perfectly with the denim you already love. We carry it because the pieces are comfortable, polished and incredibly wearable, with those dependable wardrobe favourites you reach for again and again.', 'Les pièces qui unissent votre garde-robe.', 'Renuar, c’est l’élégance sans effort : de beaux chandails, des cardigans, des chemisiers et des superpositions faciles qui s’agencent parfaitement avec les jeans que vous aimez déjà. Nous la proposons parce que ses pièces sont confortables, soignées et incroyablement faciles à porter — ces valeurs sûres de la garde-robe que l’on choisit encore et encore.', ARRAY['tops', 'cardigans']::text[], ARRAY['/images/boutique/brands/renuar-1.webp']::text[], 3),
      ('sorella', 'Sorella', 'Natural fabrics. Effortless style. A little European flair.', 'Sorella is a favourite for its relaxed, beautifully wearable pieces in natural fabrics like linen and cotton. We especially love it in the warmer months for easy dresses, summer trousers and light layers that feel as good as they look.

Throughout the cooler seasons, the collection often surprises us with beautiful jackets, coats and layering pieces that carry that same effortless style. It’s an easy, feminine line with a distinctly European feel — and one we look forward to every season.', 'Des fibres naturelles. Un style décontracté. Une touche européenne.', 'Sorella est une favorite pour ses pièces décontractées et si faciles à porter, en fibres naturelles comme le lin et le coton. Nous l’aimons tout particulièrement pendant les mois chauds pour ses robes légères, ses pantalons d’été et ses superpositions légères, aussi agréables à porter qu’à regarder.

Pendant les saisons plus fraîches, la collection nous surprend souvent avec de magnifiques vestes, manteaux et pièces à superposer qui conservent ce même style naturel. C’est une ligne féminine et facile à vivre, à la touche résolument européenne — une collection que nous attendons avec impatience chaque saison.', ARRAY['tops', 'bottoms', 'jackets', 'dresses']::text[], '{}'::text[], 4),
      ('julia-divina', 'Julia Divina', 'Easy to wear. Easy to coordinate. Easy to love.', 'Julia Divina is one of those wonderfully wearable collections that makes getting dressed simple. Comfortable fabrics, flattering pull-on trousers and coordinating tops and layers make it easy to mix, match and create a wardrobe that works together.

With sizing through 2X, it also offers one of the broadest size ranges in our boutique — something we truly value. We love Julia Divina for its comfortable fit, approachable price and polished, uncomplicated style that our customers can wear again and again.', 'Facile à porter. Facile à agencer. Facile à aimer.', 'Julia Divina fait partie de ces collections si faciles à porter qu’elles simplifient l’art de s’habiller. Des tissus confortables, des pantalons à enfiler flatteurs ainsi que des hauts et superpositions coordonnés permettent de mélanger, d’agencer et de créer une garde-robe cohérente.

Offerte jusqu’à la taille 2X, elle propose aussi l’une des gammes de tailles les plus étendues de notre boutique — ce qui compte beaucoup pour nous. Nous aimons Julia Divina pour sa coupe confortable, son prix abordable et son style soigné et sans complication, que nos clientes peuvent porter encore et encore.', ARRAY['tops', 'bottoms', 'dresses']::text[], ARRAY['/images/boutique/brands/julia-divina-1.webp', '/images/boutique/brands/julia-divina-2.webp']::text[], 5),
      ('wit-wisdom', 'Wit & Wisdom', 'Denim designed with comfort in mind.', 'Wit & Wisdom is a newer addition to Boutique Rivier, chosen for women who want the look of great denim with a little extra comfort built in. Their signature stretch fabrics and specially designed waistbands create a fit that feels supportive, flexible and easy to wear all day.

We brought the line in because it offers something a little different from our other denim brands — comfortable, flattering jeans and trousers with plenty of stretch and an easy fit. And while denim is what they’re best known for, we’ve also been enjoying some of their seasonal sweaters and tops when they appear in the collection.', 'Un denim pensé pour le confort.', 'Wit & Wisdom est un ajout récent à la Boutique Rivier, choisi pour les femmes qui veulent l’allure d’un beau denim avec un confort supplémentaire. Ses tissus extensibles signature et ses tailles spécialement conçues offrent un ajustement qui soutient, suit vos mouvements et se porte facilement toute la journée.

Nous avons ajouté cette ligne parce qu’elle offre quelque chose de différent de nos autres marques de denim : des jeans et pantalons confortables et flatteurs, bien extensibles et faciles à porter. Et si le denim fait sa réputation, nous apprécions aussi ses chandails et hauts saisonniers lorsqu’ils font leur apparition dans la collection.', ARRAY['bottoms', 'tops']::text[], ARRAY['/images/boutique/brands/wit-wisdom-1.webp', '/images/boutique/brands/wit-wisdom-2.webp', '/images/boutique/brands/wit-wisdom-3.webp']::text[], 6),
      ('papa', 'Papa Fashions', 'Versatile style for everyday life.', 'Papa Fashions is one of the most diverse collections in our boutique, with an ever-changing mix of fabrics, colours and easy-to-wear styles. We love it because there is always something useful to add to your wardrobe — a comfortable cardigan, a great jacket, an easy tank or a seasonal piece that works beautifully with denim.

From summer dresses to fall sweaters and cozy layers, Papa Fashions offers plenty of choice at an approachable mid-range price. It is one of those dependable brands that helps pull a wardrobe together, season after season.', 'Un style polyvalent pour le quotidien.', 'Papa Fashions est l’une des collections les plus variées de notre boutique, avec un assortiment toujours renouvelé de tissus, de couleurs et de styles faciles à porter. Nous l’aimons parce qu’on y trouve toujours une pièce utile à ajouter à sa garde-robe : un cardigan confortable, une belle veste, une camisole facile ou une pièce saisonnière qui s’agence à merveille avec le denim.

Des robes d’été aux chandails d’automne en passant par les superpositions douillettes, Papa Fashions offre un grand choix à un prix intermédiaire abordable. C’est l’une de ces marques fiables qui aident à bâtir une garde-robe, saison après saison.', ARRAY['tops', 'jackets', 'cardigans', 'dresses']::text[], ARRAY['/images/boutique/brands/papa-1.webp', '/images/boutique/brands/papa-2.webp']::text[], 7),
      ('wanakome', 'Wanakome', 'Fleece that’s in a class of its own.', 'Wanakome is one of our favourite casual brands because the quality of the fleece is truly second to none. Soft, substantial and beautifully made, these are hoodies and sweatshirts that feel luxurious without losing that easy, everyday comfort.

We love Wanakome for its distinctive styling, exceptional construction and the kind of quality you can feel the moment you put it on. These are casual pieces you’ll reach for again and again.', 'Un molleton dans une classe à part.', 'Wanakome est l’une de nos marques décontractées préférées, car la qualité de son molleton est vraiment inégalée. Doux, consistants et magnifiquement confectionnés, ses kangourous et pulls molletonnés ont une sensation luxueuse tout en conservant un confort décontracté au quotidien.

Nous aimons Wanakome pour son style distinctif, sa confection exceptionnelle et une qualité que l’on ressent dès qu’on enfile la pièce. Ce sont des vêtements décontractés que vous choisirez encore et encore.', ARRAY['tops']::text[], ARRAY['/images/boutique/brands/wanakome-1.webp', '/images/boutique/brands/wanakome-2.webp', '/images/boutique/brands/wanakome-3.webp', '/images/boutique/brands/wanakome-4.webp', '/images/boutique/brands/wanakome-5.webp']::text[], 8),
      ('irish-merino', 'Irish Merino Wool', 'Timeless warmth. Natural beauty. Made to be loved for years.', 'Our Irish merino wool sweaters are chosen for their beautiful quality, natural warmth and timeless appeal. Soft, breathable and wonderfully wearable, they’re the kind of pieces that feel special the moment you put them on — and only get better with time.

From classic knits to beautiful seasonal colours, these are investment pieces designed to become favourites in your wardrobe for years to come.', 'Une chaleur intemporelle. Une beauté naturelle. Faits pour être aimés longtemps.', 'Nos chandails en laine mérinos irlandaise sont choisis pour leur grande qualité, leur chaleur naturelle et leur charme intemporel. Doux, respirants et merveilleusement agréables à porter, ce sont des pièces qui semblent spéciales dès qu’on les enfile — et qui ne font que s’embellir avec le temps.

Des tricots classiques aux belles couleurs saisonnières, ce sont des pièces de qualité conçues pour devenir vos favorites pendant des années.', ARRAY['tops', 'cardigans']::text[], ARRAY['/images/boutique/brands/irish-merino-1.webp', '/images/boutique/brands/irish-merino-2.webp', '/images/boutique/brands/irish-merino-3.webp', '/images/boutique/brands/irish-merino-4.webp', '/images/boutique/brands/irish-merino-5.webp', '/images/boutique/brands/irish-merino-6.webp']::text[], 9);

    -- The tags the boutique saved in the admin win over the ones in code.
    UPDATE public.boutique_brands b SET types = t.types
      FROM public.boutique_brand_tags t WHERE t.slug = b.slug;
  END IF;
END
$seed$;

-- ── 3. Brand photos ──────────────────────────────────────────────────────────
-- Public to read; only admins may add, replace or remove files.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('boutique', 'boutique', true, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "boutique bucket: admins insert" ON storage.objects;
DROP POLICY IF EXISTS "boutique bucket: admins update" ON storage.objects;
DROP POLICY IF EXISTS "boutique bucket: admins delete" ON storage.objects;
CREATE POLICY "boutique bucket: admins insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'boutique' AND public.is_admin());
CREATE POLICY "boutique bucket: admins update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'boutique' AND public.is_admin());
CREATE POLICY "boutique bucket: admins delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'boutique' AND public.is_admin());

COMMIT;
