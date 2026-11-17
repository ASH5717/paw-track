-- ============================================================
-- PAW TRACK — Complete Supabase Database Setup Script
-- Run this in Supabase: Dashboard -> SQL Editor -> New query -> Paste & Run.
-- ============================================================

-- 1. Main Document/Entity Tables (Dual pattern: structured ID with JSONB payload & standard query columns)
CREATE TABLE IF NOT EXISTS public.animals (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.adoptions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feeding_groups (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteer_reports (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteers (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Community Ratings Table (Relational: 1 row per rating submitted)
CREATE TABLE IF NOT EXISTS public.animal_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id TEXT NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  rated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS animal_ratings_animal_id_idx ON public.animal_ratings(animal_id);

-- 3. Admin Emails Allowlist Table
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email TEXT PRIMARY KEY,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Row Level Security (RLS) Configuration
DO $$
DECLARE
  t TEXT;
  shared_tables TEXT[] := ARRAY[
    'animals', 'animal_ratings', 'adoptions', 'feeding_groups',
    'notifications', 'volunteer_reports', 'volunteers', 'activity_logs'
  ];
BEGIN
  FOREACH t IN ARRAY shared_tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_read', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true)', t || '_read', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_write', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO public WITH CHECK (true)', t || '_write', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_update', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO public USING (true) WITH CHECK (true)', t || '_update', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_remove', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO public USING (true)', t || '_remove', t);
  END LOOP;
END $$;

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_emails_read" ON public.admin_emails;
CREATE POLICY "admin_emails_read" ON public.admin_emails FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_emails_write" ON public.admin_emails;
CREATE POLICY "admin_emails_write" ON public.admin_emails FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "admin_emails_delete" ON public.admin_emails;
CREATE POLICY "admin_emails_delete" ON public.admin_emails FOR DELETE USING (true);

-- Seed Owner Email
INSERT INTO public.admin_emails (email) VALUES ('akashhabib577@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 5. Realtime Publication
DO $$
DECLARE
  t TEXT;
  shared_tables TEXT[] := ARRAY[
    'animals', 'animal_ratings', 'adoptions', 'feeding_groups',
    'notifications', 'volunteer_reports', 'volunteers', 'activity_logs'
  ];
BEGIN
  FOREACH t IN ARRAY shared_tables LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;
