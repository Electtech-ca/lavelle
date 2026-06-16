-- =============================================================================
--  LA VELLE — COMPLETE SUPABASE SCHEMA
--  Run this entire script in the Supabase SQL Editor (once, on a fresh project).
--  Each section is idempotent (DROP IF EXISTS → CREATE) so it is safe to re-run.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fast text search on names/emails


-- =============================================================================
-- 1. PROFILES
--    One row per registered user. Auto-created by trigger on auth.users INSERT.
--    AdminMembers reads: id, email, full_name, loyalty_tier, loyalty_points,
--                        role, created_at
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text        UNIQUE,
  full_name       text,
  phone           text,
  avatar_url      text,
  role            text        NOT NULL DEFAULT 'member'  CHECK (role IN ('member','admin')),
  loyalty_tier    text        NOT NULL DEFAULT 'Champagne' CHECK (loyalty_tier IN ('Champagne','Gold','Diamond')),
  loyalty_points  integer     NOT NULL DEFAULT 0  CHECK (loyalty_points >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Auto-stamp updated_at
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_updated_at();

-- Auto-create a profile row whenever a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- 2. HELPER — is_admin()
--    Reusable in every RLS policy; avoids duplicating the role check.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- =============================================================================
-- 3. BOOKINGS
--    Written by: BookingModal.jsx
--    Read by:    AdminBookings.jsx, AdminDashboard.jsx (count)
--
--    Canonical column names (code updated to match):
--      first_name, last_name → generated column `name` for admin display
--      booking_date (date)   → previously called `preferred_date` in old code
--      booking_time (text)   → previously called `preferred_time` in old code
--      notes (text)          → previously called `special_requests` in old code
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        REFERENCES auth.users(id) ON DELETE SET NULL,  -- null = guest
  first_name     text        NOT NULL,
  last_name      text        NOT NULL,
  name           text        GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  email          text        NOT NULL,
  phone          text,
  service        text        NOT NULL,
  booking_date   date        NOT NULL,
  booking_time   text        NOT NULL,
  payment_method text        NOT NULL DEFAULT 'in_store' CHECK (payment_method IN ('in_store','online')),
  notes          text,
  status         text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id     ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status       ON public.bookings(status);


-- =============================================================================
-- 4. NEWSLETTER SUBSCRIBERS
--    Written by: NewsletterSignup.jsx  (upsert on email conflict)
--    Read by:    AdminNewsletter.jsx, AdminDashboard.jsx (count)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        UNIQUE NOT NULL,
  language    text        NOT NULL DEFAULT 'en' CHECK (language IN ('en','fr')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);


-- =============================================================================
-- 5. PAYMENTS
--    Written by: Checkout.jsx
--    Read by:    AdminPayments.jsx, AdminDashboard.jsx (count via gift_orders join)
--
--    type values:   'cart-order' | 'gift-certificate' | 'gift-item' | 'booking-deposit'
--    status values: 'pending' | 'succeeded' | 'failed' | 'refunded'
--    method values: 'card' | 'in_store' | 'invoice'
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reference              text        UNIQUE NOT NULL,
  user_id                uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name          text        NOT NULL,
  customer_email         text        NOT NULL,
  phone                  text,
  type                   text        NOT NULL DEFAULT 'cart-order',
  description            text,
  amount                 integer     NOT NULL CHECK (amount >= 0),   -- cents
  payment_method         text        NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card','in_store','invoice')),
  status                 text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded')),
  notes                  text,
  line_items             jsonb,          -- array of cart items
  stripe_payment_intent  text,           -- filled when Stripe is live
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_status         ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_reference      ON public.payments(reference);


-- =============================================================================
-- 6. PRODUCTS  (Boutique)
--    Written/Read by: AdminProducts.jsx via ProductsContext
--    Read by:         Boutique.jsx via ProductsContext
--    Real-time enabled below.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  price       text        NOT NULL,           -- display string e.g. "$128"
  price_cents integer     NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  stock       integer     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image       text        NOT NULL DEFAULT '',
  category    text        NOT NULL DEFAULT 'boutique',
  active      boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_active     ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);


-- =============================================================================
-- 7. GIFT ORDERS
--    Written by: GiftCertificates.jsx PurchaseModal (cert purchases)
--                GiftCard.jsx / Checkout.jsx (physical gift item orders)
--    Read by:    AdminGifts.jsx, AdminDashboard.jsx (count)
--
--    type: 'certificate' = monetary gift voucher
--          'gift_item'   = physical gift product from Gifts page
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.gift_orders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type             text        NOT NULL DEFAULT 'certificate' CHECK (type IN ('certificate','gift_item')),

  -- Certificate fields
  cert_code        text        UNIQUE,          -- e.g. LV-0100-4823 ; null for gift items
  cert_amount      integer,                     -- denomination in cents
  cert_label       text,                        -- 'Rose Quartz', 'Gold Prestige', etc.

  -- Physical gift item fields
  item_name        text,                        -- product name for gift items

  -- Shared order fields
  amount           integer     NOT NULL CHECK (amount >= 0),  -- amount paid, in cents
  sender_name      text        NOT NULL,
  sender_email     text        NOT NULL,
  recipient_name   text,
  recipient_email  text,
  message          text,
  delivery         text        NOT NULL DEFAULT 'email' CHECK (delivery IN ('email','physical')),
  status           text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','redeemed','expired')),

  -- Link to payment record once paid
  payment_id       uuid        REFERENCES public.payments(id) ON DELETE SET NULL,

  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gift_orders_sender_email    ON public.gift_orders(sender_email);
CREATE INDEX IF NOT EXISTS idx_gift_orders_recipient_email ON public.gift_orders(recipient_email);
CREATE INDEX IF NOT EXISTS idx_gift_orders_cert_code       ON public.gift_orders(cert_code);
CREATE INDEX IF NOT EXISTS idx_gift_orders_status          ON public.gift_orders(status);


-- =============================================================================
-- 8. SERVICES  (Spa & Salon — currently static in spaData.js / salonData.js)
--    Read by:    AdminServices.jsx (currently static; will be live once seeded)
--    Public:     Spa.jsx, Salon.jsx (still use static data until context is wired)
--
--    category:    'spa' | 'salon'
--    subcategory: 'package' | 'massage' | 'waxing' | 'organic_facial' |
--                 'cuts_styles' | 'colour' | 'nails' | 'lashes' | 'makeup'
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  category     text    NOT NULL CHECK (category IN ('spa','salon')),
  subcategory  text    NOT NULL,
  name         text    NOT NULL,
  price        text    NOT NULL,          -- display string e.g. "$90+"
  price_cents  integer,                   -- base price in cents; NULL = "from" price
  description  text    NOT NULL DEFAULT '',
  duration     text,                      -- e.g. "60 min"
  active       boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_active   ON public.services(active);

-- ── Seed with existing static data ───────────────────────────────────────────
INSERT INTO public.services (category, subcategory, name, price, price_cents, description, sort_order) VALUES
  -- Spa Packages
  ('spa','package','Berries With a Twist',  '$144', 14400, 'Berries & Cream Manicure + Winter Delight Pedicure', 1),
  ('spa','package','Uplift & Refresh',       '$162', 16200, 'Berry Delight Pedicure + Arctic Berry Fresh Facial', 2),
  ('spa','package','Time Out',               '$180', 18000, 'Arctic Berry Fresh Facial + No Blues Massage', 3),
  ('spa','package','Refresh & Delight',      '$162', 16200, 'Berry Delight Pedicure + No Blues Massage', 4),
  ('spa','package','Me TIME',                '$228', 22800, 'Arctic Berry Fresh Facial + Berries & Cream Manicure + Berry Delight Pedicure', 5),
  ('spa','package','Rebalance & Rejuvenate', '$252', 25200, 'Arctic Berry Fresh Facial + Berry Delight Pedicure + No Blues Massage', 6),
  -- Massage
  ('spa','massage','Personalized Massage (30 min)', '$66',  6600,  '', 10),
  ('spa','massage','Personalized Massage (45 min)', '$90',  9000,  '', 11),
  ('spa','massage','Personalized Massage (60 min)', '$120', 12000, '', 12),
  ('spa','massage','Personalized Massage (75 min)', '$144', 14400, '', 13),
  ('spa','massage','Personalized Massage (90 min)', '$168', 16800, '', 14),
  -- Organic Facials
  ('spa','organic_facial','Personalized Eminence Organic Facial', '$90+',  9000,  'A deeply cleansing journey through nature''s most powerful botanicals.', 20),
  ('spa','organic_facial','Anti-Aging Custom Facial',             '$112+', 11200, 'Turn back the clock — beautifully. This transformative facial.', 21),
  -- Waxing (abbreviated — extend as needed)
  ('spa','waxing','Eyebrow Shaping', '$18', 1800, '', 30),
  ('spa','waxing','Lip Wax',         '$12', 1200, '', 31),
  ('spa','waxing','Full Leg Wax',    '$60', 6000, '', 32),
  -- Salon — Cuts & Styles
  ('salon','cuts_styles','Women''s Haircut & Style',     '$55+', 5500,  '', 1),
  ('salon','cuts_styles','Ladies Cut',                   '$47+', 4700,  '', 2),
  ('salon','cuts_styles','Men''s Haircut',               '$29+', 2900,  '', 3),
  ('salon','cuts_styles','Male Student / Senior',        '$22+', 2200,  '', 4),
  ('salon','cuts_styles','Child''s Haircut (under 7)',   '$14+', 1400,  '', 5),
  ('salon','cuts_styles','Special Occasion Style',       '$66+', 6600,  '', 6),
  ('salon','cuts_styles','Shampoo & Blow-Dry',           '$32+', 3200,  '', 7),
  -- Salon — Colour
  ('salon','colour','Colour Retouch',                    '$73+',  7300,  '', 10),
  ('salon','colour','Colour with End Refresher',         '$89+',  8900,  '', 11),
  ('salon','colour','Lighten & Tone',                    '$132+', 13200, '', 12),
  ('salon','colour','Colour with Highlights',            '$144+', 14400, '', 13),
  ('salon','colour','Balayage & Highlights',             '$180+', 18000, '', 14),
  ('salon','colour','Keratin Smoothing',                 '$240+', 24000, '', 15)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- 9. PROMOTIONS  (currently static in promotionsData.js)
--    Read by: AdminPromotions.jsx, Gifts.jsx
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text    NOT NULL,
  description text    NOT NULL,
  value       text    NOT NULL,     -- display string: '20% off', '$75 value', etc.
  expiry      text    NOT NULL,     -- display string: 'Birthday month', 'Weekly', etc.
  active      boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Seed with existing static data ───────────────────────────────────────────
INSERT INTO public.promotions (title, description, value, expiry, sort_order) VALUES
  ('New Member Welcome Gift',    'First-time clients receive a complimentary La Velle Mini Gift Set with first booking over $144.',  '$75 value',         'Ongoing',        1),
  ('The Birthday Ritual',        'Celebrate your birthday month with 20% off any spa or salon service.',                             '20% off',           'Birthday month', 2),
  ('Refer a Friend',             'When a friend books their first visit using your referral code, you both receive $60 credit.',     '$60 credit each',   'Ongoing',        3),
  ('Wednesday Women''s Luncheon','Every Wednesday, a 3-course prix fixe lunch for the La Velle Woman. Reserve by Tuesday.',         '$66 fixed menu',    'Weekly',         4),
  ('Spa & Salon Bundle',         'Book a signature facial + hair service in one visit and save $72 off the combined price.',         'Save $72',          'Monthly',        5),
  ('The Quarterly La Velle Box', 'Curated box of 6 full-size luxury products. Delivered quarterly to members.',                     '$264 for $192',     'Subscribe',      6),
  ('Bridal Inner Circle Package','Complete bridal preparation: bridal shower high tea, pre-wedding spa day, wedding hair & makeup.', 'Bespoke pricing',   'Year-round',     7),
  ('Monday Mindfulness',         'All massage bookings on Mondays receive 15% off as our gift to starting the week right.',         '15% off massages',  'Weekly',         8)
ON CONFLICT DO NOTHING;


-- =============================================================================
-- 10. LOYALTY TRANSACTIONS
--     Tracks every time a member earns or spends loyalty points.
--     Positive points_change = earned; negative = redeemed.
--     The profile's loyalty_points column is the running total (updated by trigger).
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_change integer NOT NULL,      -- +100 = earned 100 pts, -50 = redeemed 50 pts
  reason        text    NOT NULL,      -- 'Booking confirmed', 'Order #LV-XXXX', 'Referral bonus', etc.
  reference     text,                  -- optional: booking id / payment reference
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_user_id ON public.loyalty_transactions(user_id);

-- Trigger: keep profiles.loyalty_points in sync automatically
CREATE OR REPLACE FUNCTION public.sync_loyalty_points()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles
  SET
    loyalty_points = GREATEST(0, loyalty_points + NEW.points_change),
    loyalty_tier = CASE
      WHEN (loyalty_points + NEW.points_change) >= 2001 THEN 'Diamond'
      WHEN (loyalty_points + NEW.points_change) >= 501  THEN 'Gold'
      ELSE 'Champagne'
    END
  WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_sync_loyalty ON public.loyalty_transactions;
CREATE TRIGGER trg_sync_loyalty
  AFTER INSERT ON public.loyalty_transactions
  FOR EACH ROW EXECUTE FUNCTION public.sync_loyalty_points();


-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
--    Every table has RLS enabled.
--    Public users can read/insert where appropriate.
--    Admins (role = 'admin' in profiles) can do everything.
-- =============================================================================

-- ── profiles ─────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: users read own"    ON public.profiles;
DROP POLICY IF EXISTS "profiles: users update own"  ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins read all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles: admins update all" ON public.profiles;

CREATE POLICY "profiles: users read own"    ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: users update own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: admins read all"   ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "profiles: admins update all" ON public.profiles FOR UPDATE USING (public.is_admin());

-- ── bookings ─────────────────────────────────────────────────────────────────
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings: public insert"    ON public.bookings;
DROP POLICY IF EXISTS "bookings: users read own"   ON public.bookings;
DROP POLICY IF EXISTS "bookings: admins all"       ON public.bookings;

CREATE POLICY "bookings: public insert"    ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings: users read own"   ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings: admins all"       ON public.bookings FOR ALL USING (public.is_admin());

-- ── newsletter_subscribers ───────────────────────────────────────────────────
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter: public upsert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter: admins all"    ON public.newsletter_subscribers;

CREATE POLICY "newsletter: public upsert" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter: admins all"    ON public.newsletter_subscribers FOR ALL USING (public.is_admin());

-- ── payments ─────────────────────────────────────────────────────────────────
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments: public insert"  ON public.payments;
DROP POLICY IF EXISTS "payments: users read own" ON public.payments;
DROP POLICY IF EXISTS "payments: admins all"     ON public.payments;

CREATE POLICY "payments: public insert"  ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments: users read own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments: admins all"     ON public.payments FOR ALL USING (public.is_admin());

-- ── products ─────────────────────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products: public read active" ON public.products;
DROP POLICY IF EXISTS "products: admins all"         ON public.products;

CREATE POLICY "products: public read active" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "products: admins all"         ON public.products FOR ALL USING (public.is_admin());

-- ── gift_orders ───────────────────────────────────────────────────────────────
ALTER TABLE public.gift_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gift_orders: public insert"     ON public.gift_orders;
DROP POLICY IF EXISTS "gift_orders: users read own"    ON public.gift_orders;
DROP POLICY IF EXISTS "gift_orders: admins all"        ON public.gift_orders;

CREATE POLICY "gift_orders: public insert"     ON public.gift_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "gift_orders: users read own"    ON public.gift_orders FOR SELECT USING (sender_email = auth.email());
CREATE POLICY "gift_orders: admins all"        ON public.gift_orders FOR ALL USING (public.is_admin());

-- ── services ─────────────────────────────────────────────────────────────────
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "services: public read active" ON public.services;
DROP POLICY IF EXISTS "services: admins all"         ON public.services;

CREATE POLICY "services: public read active" ON public.services FOR SELECT USING (active = true);
CREATE POLICY "services: admins all"         ON public.services FOR ALL USING (public.is_admin());

-- ── promotions ───────────────────────────────────────────────────────────────
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "promotions: public read active" ON public.promotions;
DROP POLICY IF EXISTS "promotions: admins all"         ON public.promotions;

CREATE POLICY "promotions: public read active" ON public.promotions FOR SELECT USING (active = true);
CREATE POLICY "promotions: admins all"         ON public.promotions FOR ALL USING (public.is_admin());

-- ── loyalty_transactions ─────────────────────────────────────────────────────
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "loyalty: users read own" ON public.loyalty_transactions;
DROP POLICY IF EXISTS "loyalty: admins all"     ON public.loyalty_transactions;

CREATE POLICY "loyalty: users read own" ON public.loyalty_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "loyalty: admins all"     ON public.loyalty_transactions FOR ALL USING (public.is_admin());


-- =============================================================================
-- REAL-TIME REPLICATION
--    Enable for tables that need live push to connected clients.
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gift_orders;


-- =============================================================================
-- ADMIN USER SETUP
--    After running this script, create the admin user in Supabase Auth Dashboard
--    (Authentication → Users → Invite User) using:
--        Email:    admin@lavelle.ca
--        Password: LaVelle@2025!
--
--    Then run this to grant admin role (replace the UUID with the real one):
--    UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@lavelle.ca';
--
--    OR use the Supabase Dashboard → Table Editor → profiles → edit the row.
-- =============================================================================
