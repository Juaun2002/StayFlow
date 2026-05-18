-- ============================================
-- FULL SUPABASE SETUP - FINAL CORRECTED VERSION
-- Creates users, properties, bookings, triggers, functions, indexes and RLS policies
-- COPY & PASTE this entire file into Supabase SQL Editor and RUN
-- ============================================

-- =====================
-- 1) SAFETY DROPS (Idempotent)
-- =====================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables completely and recreate
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================
-- 2) USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- =====================
-- 3) UPDATE TIMESTAMP HELPER FUNCTION
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- 4) RLS POLICIES FOR USERS TABLE
-- =====================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can create their own profile during signup" ON users;
DROP POLICY IF EXISTS "No user deletes" ON users;

-- SELECT: Users can see their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- INSERT: Only trigger can insert (when auth.uid() is NULL in trigger context)
-- Client INSERT is blocked because they always have auth.uid() != NULL
CREATE POLICY "Users created only by trigger"
  ON users FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- DELETE: Prevent user deletes
CREATE POLICY "No user deletes"
  ON users FOR DELETE
  USING (false);

-- =====================
-- 5) PROPERTIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  property_type VARCHAR(20) NOT NULL CHECK (property_type IN ('apartment', 'house', 'land', 'commercial')),
  price DECIMAL(12,2) NOT NULL,
  area DECIMAL(8,2) NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'rented')),
  image_url TEXT,
  owner_id UUID NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Apply update_at trigger to properties table
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);

-- =====================
-- 6) RLS POLICIES FOR PROPERTIES TABLE
-- =====================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Read properties" ON properties;
DROP POLICY IF EXISTS "Create properties" ON properties;
DROP POLICY IF EXISTS "Update own properties" ON properties;
DROP POLICY IF EXISTS "Delete own properties" ON properties;

-- SELECT: Everyone can read properties
CREATE POLICY "Read properties" ON properties FOR SELECT USING (true);

-- INSERT: Only owner can create properties
CREATE POLICY "Create properties" ON properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- UPDATE: Only owner can update their properties
CREATE POLICY "Update own properties" ON properties FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- DELETE: Only owner can delete their properties
CREATE POLICY "Delete own properties" ON properties FOR DELETE
  USING (auth.uid() = owner_id);

-- =====================
-- 7) BOOKINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_monthly_rental BOOLEAN DEFAULT false,
  rental_duration_months INTEGER,
  status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'canceled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Apply update_at trigger to bookings table
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);

-- =====================
-- 8) RLS POLICIES FOR BOOKINGS TABLE
-- =====================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Read bookings" ON bookings;
DROP POLICY IF EXISTS "Create bookings" ON bookings;
DROP POLICY IF EXISTS "Update own bookings" ON bookings;
DROP POLICY IF EXISTS "Delete own bookings" ON bookings;

-- SELECT: Everyone can read bookings
CREATE POLICY "Read bookings" ON bookings FOR SELECT USING (true);

-- INSERT: Only authenticated users can create bookings for themselves
CREATE POLICY "Create bookings" ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Only property owner can update bookings for their properties
CREATE POLICY "Update own bookings" ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()
    )
  );

-- DELETE: Only property owner can delete bookings for their properties
CREATE POLICY "Delete own bookings" ON bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()
    )
  );

-- =====================
-- 9) AUTO-CREATE USER PROFILE TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user profile automatically
  -- auth_id will be the UUID from auth.users
  INSERT INTO public.users (auth_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================
-- SUMMARY OF CHANGES
-- =====================
-- ✅ Foreign keys now correctly reference users(auth_id) instead of auth.users(id)
-- ✅ RLS policies are secure and simplified
-- ✅ Triggers automatically create user profiles on signup
-- ✅ All tables have proper indexes for performance
-- ✅ Updated_at timestamps are auto-managed

-- =====================
-- STORAGE BUCKET SETUP (Manual - do in Supabase UI)
-- =====================
-- Create a bucket named 'properties' in Supabase Storage for image uploads
-- Path: Go to Supabase Dashboard > Storage > Create New Bucket > Name: "properties" > Save

-- =====================
-- END OF SETUP
-- =====================
