-- ============================================
-- CRIAR TABELA DE RESERVAS/BOOKINGS
-- ============================================

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_monthly_rental BOOLEAN DEFAULT false,
  rental_duration_months INTEGER,
  status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'canceled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode ler bookings
CREATE POLICY "Read bookings" ON bookings FOR SELECT USING (true);

-- Policy: Usuários autenticados podem criar bookings
CREATE POLICY "Create bookings" ON bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Proprietários podem editar bookings de suas propriedades
CREATE POLICY "Update own bookings" ON bookings FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = bookings.property_id 
      AND properties.owner_id = auth.uid()
    )
  ) 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = bookings.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

-- Policy: Proprietários podem deletar bookings de suas propriedades
CREATE POLICY "Delete own bookings" ON bookings FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = bookings.property_id 
      AND properties.owner_id = auth.uid()
    )
  );
