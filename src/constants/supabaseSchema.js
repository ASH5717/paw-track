// PAW TRACK — the SQL a deployer pastes into Supabase to switch the app from
// local demo data to one shared database. Also rendered (with a copy button)
// in Settings → Database Schema.

export const SUPABASE_SCHEMA_SQL = `-- ============================================================
-- PAW TRACK — shared database setup
-- Run this ONCE in your Supabase project: Dashboard → SQL Editor → New query
-- → paste everything below → Run.
--
-- Every visitor and every device then reads and writes the same data:
-- dog profiles, community ratings, volunteers, adoption applications,
-- feeding groups, notifications and activity logs.
-- ============================================================

-- ---------------------------------------------------------------
-- 1. Records tables. Each row is one app record: a text id plus the
--    record itself in a jsonb document.
-- ---------------------------------------------------------------
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

-- ---------------------------------------------------------------
-- 2. Community ratings. One row per vote, so a dog's rating is the
--    average of every rating submitted by every user.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.animal_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id TEXT NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  rated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS animal_ratings_animal_id_idx
  ON public.animal_ratings (animal_id);

-- ---------------------------------------------------------------
-- 3. Admin access allow-list (owner managed)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email TEXT PRIMARY KEY,
  granted_by UUID REFERENCES auth.users ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- 4. Row Level Security.
--    Everyone (including signed-out visitors) can read the shared data,
--    so the public site shows live dogs. Only signed-in users can change
--    it. Signed-out visitors may still submit an adoption application or
--    an incident report.
-- ---------------------------------------------------------------
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
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (true)',
      t || '_write', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_update', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)',
      t || '_update', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_remove', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (true)',
      t || '_remove', t
    );
  END LOOP;
END $$;

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only the owner address may grant or revoke admin access
CREATE OR REPLACE FUNCTION public.is_registry_owner()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT lower(auth.jwt() ->> 'email') = 'akashhabib577@gmail.com';
$$;

-- True when the signed-in address currently holds admin rights
CREATE OR REPLACE FUNCTION public.is_registry_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails WHERE email = lower(auth.jwt() ->> 'email')
  );
$$;

DROP POLICY IF EXISTS "Read own row, or all rows as admin" ON public.admin_emails;
CREATE POLICY "Read own row, or all rows as admin" ON public.admin_emails FOR SELECT
  USING (email = lower(auth.jwt() ->> 'email') OR public.is_registry_admin());

DROP POLICY IF EXISTS "Owner grants admin" ON public.admin_emails;
CREATE POLICY "Owner grants admin" ON public.admin_emails FOR INSERT
  WITH CHECK (public.is_registry_owner());

DROP POLICY IF EXISTS "Owner revokes admin" ON public.admin_emails;
CREATE POLICY "Owner revokes admin" ON public.admin_emails FOR DELETE
  USING (public.is_registry_owner());

-- Bootstrap the owner account
INSERT INTO public.admin_emails (email) VALUES ('akashhabib577@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------
-- 5. Live updates: changes made on one device appear on the others
--    without a refresh.
-- ---------------------------------------------------------------
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
      NULL; -- already published
    END;
  END LOOP;
END $$;

-- Done. Next: put your Project URL and anon key in .env (see .env.example),
-- then restart the dev server — the app switches to the shared database
-- automatically and uploads the starter data on first run.
`;

// CURATED HIGH-RESOLUTION ANIMAL PHOTOGRAPHY & INITIAL DATABASE STATE
