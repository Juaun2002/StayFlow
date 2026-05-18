import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser | null

export interface Property {
  id: number
  title: string
  description: string | null
  property_type: 'apartment' | 'house' | 'land' | 'commercial'
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  state: string
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  status: 'available' | 'sold' | 'rented'
  image_url: string | null
  owner_id: string
  created_at: string
  updated_at: string
}
