-- ══════════════════════════════════════════════════════════════════
-- TAXI MOOO: CLIENT & ADMIN AUTHENTICATION + SECURITY TABLES
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/osxfmjqaezsjmajunjmc/sql
-- ══════════════════════════════════════════════════════════════════

-- ── 1. CLIENT ACCOUNTS (Klant accounts) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.client_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rides_count INTEGER NOT NULL DEFAULT 0,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "client_accounts_all" ON public.client_accounts;
CREATE POLICY "client_accounts_all" ON public.client_accounts
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 2. ADMIN ACCOUNTS (Beheerders accounts) ──────────────────────
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL DEFAULT 'Taxi Mooo Centrale Beheer',
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_accounts_all" ON public.admin_accounts;
CREATE POLICY "admin_accounts_all" ON public.admin_accounts
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed default admin account with password 'admin123' (and accepts 'admin')
INSERT INTO public.admin_accounts (email, password_hash, full_name, role)
VALUES ('admin@taximooo.nl', 'admin123', 'Taxi Mooo Centrale Beheer', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = 'admin123';

-- ── 3. USER SECURITY SETTINGS (Inloggen & beveiliging) ───────────
CREATE TABLE IF NOT EXISTS public.user_security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT true,
    email_alerts BOOLEAN NOT NULL DEFAULT true,
    sms_alerts BOOLEAN NOT NULL DEFAULT false,
    last_password_change TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "security_settings_all" ON public.user_security_settings;
CREATE POLICY "security_settings_all" ON public.user_security_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 4. USER ACTIVE SESSIONS & DEVICES ────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    device_name VARCHAR(150) NOT NULL,
    browser VARCHAR(100) NOT NULL,
    ip_address VARCHAR(60),
    location VARCHAR(150) NOT NULL DEFAULT 'Nederland',
    is_current BOOLEAN NOT NULL DEFAULT false,
    last_active TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON public.user_sessions(user_email);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_sessions_all" ON public.user_sessions;
CREATE POLICY "user_sessions_all" ON public.user_sessions
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 5. REALTIME (Optional) ───────────────────────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_accounts;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.client_accounts;
EXCEPTION WHEN others THEN NULL; END $$;

-- ── 6. CONTACT INQUIRIES ADMIN REPLY COLUMNS ─────────────────────
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE public.contact_inquiries ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;

