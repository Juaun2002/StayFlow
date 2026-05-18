-- ============================================
-- SUPABASE SETUP - SIMPLE & CLEAN
-- Copy ALL of this and paste into SQL Editor
-- ============================================

-- Step 1: Delete everything old
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Step 2: Create Users Table
CREATE TABLE users (
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

-- Step 3: Create function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Add trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Create indexes on users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);

-- Step 6: Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Users created only by trigger"
  ON users FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

CREATE POLICY "No user deletes"
  ON users FOR DELETE
  USING (false);

-- Step 8: Create Properties Table
CREATE TABLE properties (
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

-- Step 9: Add trigger to properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Create indexes on properties
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);

-- Step 11: Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Step 12: Create RLS Policies for properties
CREATE POLICY "Read properties" 
  ON properties FOR SELECT USING (true);

CREATE POLICY "Create properties" 
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Update own properties" 
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Delete own properties" 
  ON properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Step 13: Create Bookings Table
CREATE TABLE bookings (
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

-- Step 14: Add trigger to bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 15: Create indexes on bookings
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

-- Step 16: Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 17: Create RLS Policies for bookings
CREATE POLICY "Read bookings"
  ON bookings FOR SELECT USING (true);

CREATE POLICY "Create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own bookings"
  ON bookings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()));

CREATE POLICY "Delete own bookings"
  ON bookings FOR DELETE
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.owner_id = auth.uid()));

-- Step 18: Create trigger for auto-creating user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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

-- Step 19: Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================
-- SETUP COMPLETE ✅
-- =====================
