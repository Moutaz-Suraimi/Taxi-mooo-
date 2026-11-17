-- ══════════════════════════════════════════════════════
-- TAXI MOOO: INLOGGEN & BEVEILIGING (SECURITY TABLES)
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/osxfmjqaezsjmajunjmc/sql
-- ══════════════════════════════════════════════════════

-- ── 1. USER SECURITY SETTINGS TABLE ───────────────────
CREATE TABLE IF NOT EXISTS public.user_security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT true,
    email_alerts BOOLEAN NOT NULL DEFAULT true,
    sms_alerts BOOLEAN NOT NULL DEFAULT false,
    last_password_change TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "security_settings_all" ON public.user_security_settings;
CREATE POLICY "security_settings_all" ON public.user_security_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 2. USER SESSIONS & DEVICES TABLE ─────────────────
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

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_sessions_email ON public.user_sessions(user_email);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_sessions_all" ON public.user_sessions;
CREATE POLICY "user_sessions_all" ON public.user_sessions
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ── 3. ENABLE REALTIME (Optional) ────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_security_settings;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions;
EXCEPTION WHEN others THEN NULL; END $$;

