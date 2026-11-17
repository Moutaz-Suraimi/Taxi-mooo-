-- ══════════════════════════════════════════════════════
-- TAXI MOOO — COMPLETE RLS FIX + REALTIME SETUP
-- Run this ENTIRE script in Supabase SQL Editor
-- https://supabase.com/dashboard/project/osxfmjqaezsjmajunjmc/sql
-- ══════════════════════════════════════════════════════

-- ── 1. BOOKING ORDERS ─────────────────────────────────
-- Drop ALL existing policies on booking_orders
DROP POLICY IF EXISTS "Customers view own orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow dispatch read orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow dispatch update orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow dispatch delete orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow anon insert orders" ON public.booking_orders;
DROP POLICY IF EXISTS "Allow all booking_orders" ON public.booking_orders;

-- Create open policies (anon + authenticated can do everything)
CREATE POLICY "booking_orders_select" ON public.booking_orders
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "booking_orders_insert" ON public.booking_orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "booking_orders_update" ON public.booking_orders
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "booking_orders_delete" ON public.booking_orders
    FOR DELETE TO anon, authenticated USING (true);

-- ── 2. DRIVERS ────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated read drivers" ON public.drivers;
DROP POLICY IF EXISTS "Allow all drivers" ON public.drivers;
DROP POLICY IF EXISTS "drivers_all" ON public.drivers;

CREATE POLICY "drivers_all" ON public.drivers
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 3. CONTACT INQUIRIES ──────────────────────────────
DROP POLICY IF EXISTS "Allow read contact inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow update contact inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow insert contact inquiries" ON public.contact_inquiries;

CREATE POLICY "inquiries_all" ON public.contact_inquiries
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 4. PRICING SETTINGS ───────────────────────────────
DROP POLICY IF EXISTS "pricing_read" ON public.pricing_settings;
DROP POLICY IF EXISTS "pricing_update" ON public.pricing_settings;

CREATE POLICY "pricing_all" ON public.pricing_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 5. ORDER STOPS ────────────────────────────────────
DROP POLICY IF EXISTS "stops_all" ON public.order_stops;

CREATE POLICY "stops_all" ON public.order_stops
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 6. ENABLE REALTIME ────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;

-- ── 7. SEED DRIVERS (if empty) ────────────────────────
INSERT INTO public.drivers (driver_code, full_name, phone, vehicle_model, vehicle_plate, vehicle_type, status, rating)
VALUES
    ('DRV-01', 'Jan de Vries',      '+31 6 1234 5678', 'Mercedes-Benz E-Klasse (Sedan)',       'K-921-BV', 'klein', 'beschikbaar', 4.9),
    ('DRV-02', 'Moutaz Wael',       '+31 6 4121 2427', 'Mercedes-Benz S-Klasse (VIP Limousine)','G-344-TX', 'klein', 'bezig',       5.0),
    ('DRV-03', 'Lars van der Meer', '+31 6 9876 5432', 'Mercedes-Benz V-Klasse (Taxibus 8p)',  'T-819-NN', 'groot', 'beschikbaar', 4.8),
    ('DRV-04', 'Tarik El Amrani',   '+31 6 5544 3322', 'Mercedes-Benz E-Klasse (Sedan)',       'X-102-LL', 'klein', 'offline',     4.9)
ON CONFLICT (driver_code) DO NOTHING;

-- ── 8. VERIFY ─────────────────────────────────────────
-- After running, test with:
-- SELECT COUNT(*) FROM public.booking_orders;
-- SELECT COUNT(*) FROM public.drivers;
-- SELECT COUNT(*) FROM public.pricing_settings;

