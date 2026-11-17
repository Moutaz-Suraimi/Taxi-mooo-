-- ══════════════════════════════════════════════════════════════════════
-- TAXI MOOO DATABASE SCHEMA (Supabase / PostgreSQL)
-- Production-Ready Schema for Dispatch, Client & Admin Dashboards
-- ══════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PROFILES (Users & Customers) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'dispatcher')),
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0.00),
    rides_count INTEGER NOT NULL DEFAULT 0 CHECK (rides_count >= 0),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 2. DRIVERS & FLEET ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_code VARCHAR(20) UNIQUE, -- e.g. 'DRV-01'
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    vehicle_model VARCHAR(150) NOT NULL, -- e.g. 'Mercedes-Benz E-Klasse'
    vehicle_plate VARCHAR(30) NOT NULL, -- e.g. 'K-921-BV'
    vehicle_type VARCHAR(20) NOT NULL DEFAULT 'klein' CHECK (vehicle_type IN ('klein', 'groot')),
    status VARCHAR(20) NOT NULL DEFAULT 'beschikbaar' CHECK (status IN ('beschikbaar', 'bezig', 'offline')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    total_trips INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 3. BOOKING ORDERS & DISPATCH ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'TXM-2026-001'
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'nieuw' 
        CHECK (status IN ('nieuw', 'bevestigd', 'toegewezen', 'onderweg', 'voltooid', 'geannuleerd')),
    
    -- Route details
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    estimated_km NUMERIC(8, 2) NOT NULL,
    estimated_duration_mins INTEGER,
    
    -- Dates & times
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    is_return_trip BOOLEAN NOT NULL DEFAULT false,
    return_date DATE,
    return_time TIME,
    flight_number VARCHAR(50),
    
    -- Vehicle & passenger specs
    vehicle_type VARCHAR(20) NOT NULL DEFAULT 'klein' CHECK (vehicle_type IN ('klein', 'groot')),
    passengers INTEGER NOT NULL DEFAULT 1 CHECK (passengers BETWEEN 1 AND 8),
    has_luggage BOOLEAN NOT NULL DEFAULT false,
    
    -- Pricing
    km_rate NUMERIC(6, 2) NOT NULL,
    total_fare NUMERIC(10, 2) NOT NULL CHECK (total_fare >= 0.00),
    
    -- Customer contact snapshot
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_notes TEXT,
    
    -- Payment
    payment_method VARCHAR(30) NOT NULL DEFAULT 'ideal' 
        CHECK (payment_method IN ('cash', 'ideal', 'pin', 'creditcard', 'factuur')),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'openstaand' 
        CHECK (payment_status IN ('betaald', 'bij_chauffeur', 'openstaand')),
        
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 4. ORDER INTERMEDIATE STOPS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.booking_orders(id) ON DELETE CASCADE,
    stop_order INTEGER NOT NULL DEFAULT 1,
    address TEXT NOT NULL
);

-- ── 5. SAVED FAVORITE LOCATIONS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL, -- e.g. 'Thuis', 'Werk', 'Schiphol'
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 6. PRICING SETTINGS (System Config) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.pricing_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    klein_km_rate NUMERIC(6, 2) NOT NULL DEFAULT 2.39,
    groot_km_rate NUMERIC(6, 2) NOT NULL DEFAULT 3.04,
    minimum_fare NUMERIC(6, 2) NOT NULL DEFAULT 25.00,
    night_surcharge_pct NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    return_discount_pct NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    stop_fee NUMERIC(6, 2) NOT NULL DEFAULT 4.50,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 7. CONTACT INQUIRIES & MESSAGES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ── 8. INDEXES FOR HIGH-PERFORMANCE DISPATCH & SEARCH ────────────────
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.booking_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.booking_orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_date ON public.booking_orders(pickup_date DESC);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON public.booking_orders(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON public.saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_unread ON public.contact_inquiries(is_read) WHERE is_read = false;

-- ── 9. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: users read & update their own; public can insert upon signup
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Booking Orders: customers view their own orders; public/anon can insert bookings
CREATE POLICY "Customers view own orders" ON public.booking_orders
    FOR SELECT TO authenticated USING (customer_id = auth.uid());

CREATE POLICY "Anyone can book a ride" ON public.booking_orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Saved Places: user only
CREATE POLICY "Users manage own places" ON public.saved_places
    FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Pricing Settings: everyone can read (to calculate fares); only admin updates
CREATE POLICY "Public read pricing" ON public.pricing_settings
    FOR SELECT TO anon, authenticated USING (true);

-- Contact Inquiries: anyone can submit; admins read
CREATE POLICY "Anyone can submit inquiry" ON public.contact_inquiries
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Drivers: active drivers readable by all authenticated
CREATE POLICY "Authenticated read drivers" ON public.drivers
    FOR SELECT TO authenticated USING (true);

-- ── 10. INITIAL SEED DATA (Default Pricing & Demo Drivers) ───────────
INSERT INTO public.pricing_settings (klein_km_rate, groot_km_rate, minimum_fare, night_surcharge_pct, return_discount_pct, stop_fee)
VALUES (2.39, 3.04, 25.00, 15.00, 10.00, 4.50)
ON CONFLICT DO NOTHING;

INSERT INTO public.drivers (driver_code, full_name, phone, vehicle_model, vehicle_plate, vehicle_type, status, rating)
VALUES
    ('DRV-01', 'Jan de Vries', '+31 6 1234 5678', 'Mercedes-Benz E-Klasse (Sedan)', 'K-921-BV', 'klein', 'beschikbaar', 4.9),
    ('DRV-02', 'Moutaz Wael', '+31 6 4121 2427', 'Mercedes-Benz S-Klasse (VIP)', 'G-344-TX', 'klein', 'bezig', 5.0),
    ('DRV-03', 'Lars van der Meer', '+31 6 9876 5432', 'Mercedes-Benz V-Klasse (Bus)', 'T-819-NN', 'groot', 'beschikbaar', 4.8)
ON CONFLICT (driver_code) DO NOTHING;

