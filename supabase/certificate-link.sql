-- =============================================================================
-- Spa Rivier: emailed certificate links (2026-09-29)
--
-- Each certificate gets a private token. The email links to
--   https://sparivier.ca/certificate?code=LV-0100-4823&k=<token>
-- and that page reads the certificate through certificate_view(), which
-- answers only when the code AND the token match, so certificates cannot be
-- listed or found by guessing codes.
--
-- Also: the website may now only create PENDING orders. Only the Stripe
-- webhook (service role, which bypasses row-level security) marks an order
-- paid, so nobody can insert an "active" certificate that was never bought.
--
-- Safe to run more than once. Run it BEFORE deploying the webhook and the
-- site that use the token:
--   docker exec -i supabase-db psql -U postgres -d postgres < certificate-link.sql
-- =============================================================================

-- Existing rows are filled with their own random token.
ALTER TABLE public.gift_orders
  ADD COLUMN IF NOT EXISTS view_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_gift_orders_view_token ON public.gift_orders(view_token);

DROP POLICY IF EXISTS "gift_orders: public insert" ON public.gift_orders;
CREATE POLICY "gift_orders: public insert" ON public.gift_orders
  FOR INSERT WITH CHECK (status = 'pending');

-- face_cents is the value Stripe charged (the webhook records it on payment).
CREATE OR REPLACE FUNCTION public.certificate_view(p_code text, p_token uuid)
RETURNS TABLE (
  cert_code      text,
  face_cents     integer,
  recipient_name text,
  sender_name    text,
  message        text,
  status         text,
  created_at     timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT g.cert_code, g.cert_amount, g.recipient_name, g.sender_name,
         g.message, g.status, g.created_at
  FROM public.gift_orders g
  WHERE g.type = 'certificate'
    AND g.cert_code = p_code
    AND g.view_token = p_token;
$$;

REVOKE ALL ON FUNCTION public.certificate_view(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.certificate_view(text, uuid) TO anon, authenticated;

-- Let the API see the new column and function straight away.
NOTIFY pgrst, 'reload schema';
