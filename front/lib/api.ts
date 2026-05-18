import { supabase } from './supabase'
import { Property } from './types'

// ============================================
// PROPERTIES
// ============================================

export async function getProperties(filters?: {
  city?: string
  property_type?: string
  status?: string
  minPrice?: number
  maxPrice?: number
}) {
  let query = supabase.from('properties').select('*')

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Property[]
}

export async function getPropertyById(id: number) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Property
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('properties')
    .insert([property])
    .select()

  if (error) throw error
  return data[0] as Property
}

export async function updateProperty(id: number, updates: Partial<Property>) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Property
}

export async function deleteProperty(id: number) {
  const { error } = await supabase.from('properties').delete().eq('id', id)

  if (error) throw error
}

export async function getUserProperties(userId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Property[]
}

// ============================================
// AUTHENTICATION
// ============================================

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) throw error
  return user
}

export async function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
}

// ============================================
// STORAGE (Images)
// ============================================

export async function uploadPropertyImage(file: File, propertyId: number) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${propertyId}-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('properties')
    .upload(`images/${fileName}`, file)

  if (error) throw error

  const publicUrl = supabase.storage
    .from('properties')
    .getPublicUrl(`images/${fileName}`).data.publicUrl

  return publicUrl
}
