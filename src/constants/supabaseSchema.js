// PAW TRACK — Production PostgreSQL / Supabase RLS schema (documentation string)

export const SUPABASE_SCHEMA_SQL = `-- PAW TRACK: Production PostgreSQL & Supabase RLS Architecture
-- 1. Profiles & Role Management
CREATE TYPE user_role AS ENUM ('admin', 'volunteer', 'user');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  organization TEXT,
  phone TEXT,
  assigned_zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Animals Registry
CREATE TABLE animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_code TEXT UNIQUE NOT NULL, -- e.g. PT-2026-0001
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  estimated_age TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Unknown')),
  colour TEXT,
  identifying_marks TEXT,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  rescue_details TEXT,
  health_status TEXT CHECK (health_status IN ('Healthy', 'Under Treatment', 'Critical Attention', 'Recovering')),
  vaccination_status TEXT CHECK (vaccination_status IN ('Vaccinated', 'Partially Vaccinated', 'Not Vaccinated', 'Overdue', 'Verification Required')),
  behaviour_status TEXT CHECK (behaviour_status IN ('Friendly', 'Calm', 'Shy', 'Fearful', 'Aggressive', 'Unknown')),
  adoption_status TEXT CHECK (adoption_status IN ('Available for Adoption', 'Pending Adoption', 'Adopted', 'Under Medical Treatment', 'Not Available')),
  sterilized BOOLEAN DEFAULT FALSE,
  dewormed BOOLEAN DEFAULT FALSE,
  photos TEXT[] DEFAULT '{}',
  assigned_volunteer_id UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Medical Records (Veterinarian / Admin Restricted Write)
CREATE TABLE medical_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  symptoms TEXT,
  treatment_plan TEXT,
  medications TEXT,
  vet_notes TEXT,
  disease_surveillance_flag TEXT CHECK (disease_surveillance_flag IN ('None', 'Suspected Rabies - Isolate', 'Suspected Parvovirus - Isolate', 'Vector-Borne')),
  veterinarian_name TEXT NOT NULL,
  next_checkup_date DATE,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vaccinations
CREATE TABLE vaccinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_type TEXT NOT NULL, -- Rabies, DHPPi / Parvovirus, etc.
  batch_number TEXT,
  administered_date DATE NOT NULL,
  next_due_date DATE NOT NULL,
  veterinarian_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('Verified', 'Pending Verification')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Behaviour Observations
CREATE TABLE behaviour_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  behaviour_label TEXT NOT NULL,
  notes TEXT NOT NULL,
  safety_precautions TEXT,
  observer_name TEXT NOT NULL,
  verified_by_admin BOOLEAN DEFAULT FALSE,
  observed_at DATE DEFAULT CURRENT_DATE
);

-- 6. Adoption Applications
CREATE TABLE adoption_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  home_environment TEXT,
  experience_notes TEXT,
  status TEXT DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

-- Policies: Public reads approved animals; Only Admins/Vets write medical records
CREATE POLICY "Public view animals" ON animals FOR SELECT USING (true);
CREATE POLICY "Admins full access animals" ON animals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins write medical" ON medical_records FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Admin Access Allow-List (owner-managed, server-enforced)
CREATE TABLE admin_emails (
  email TEXT PRIMARY KEY,
  granted_by UUID REFERENCES auth.users ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;

-- Only the owner address may grant or revoke admin access
CREATE OR REPLACE FUNCTION is_registry_owner()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT lower(auth.jwt() ->> 'email') = 'akashhabib577@gmail.com';
$$;

-- True when the signed-in address currently holds admin rights
CREATE OR REPLACE FUNCTION is_registry_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_emails WHERE email = lower(auth.jwt() ->> 'email')
  );
$$;

CREATE POLICY "Read own row, or all rows as admin" ON admin_emails FOR SELECT
  USING (email = lower(auth.jwt() ->> 'email') OR is_registry_admin());
CREATE POLICY "Owner grants admin" ON admin_emails FOR INSERT
  WITH CHECK (is_registry_owner());
CREATE POLICY "Owner revokes admin" ON admin_emails FOR DELETE
  USING (is_registry_owner());

-- Bootstrap the owner account
INSERT INTO admin_emails (email) VALUES ('akashhabib577@gmail.com')
ON CONFLICT (email) DO NOTHING;`;

// CURATED HIGH-RESOLUTION ANIMAL PHOTOGRAPHY & INITIAL DATABASE STATE
