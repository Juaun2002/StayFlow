import { Property, User } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'stayflow_token'

// ============================================
// HELPERS
// ============================================

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

interface ApiRequestOptions extends RequestInit {
  token?: string
}

async function apiCall(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<any> {
  const { token = getAuthToken(), ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    const message = error.detail || error.message || response.statusText
    throw new Error(message)
  }

  return response.json()
}

// ============================================
// AUTHENTICATION
// ============================================

export async function register(
  email: string,
  password: string,
  username: string
) {
  const data = await apiCall('/auth/register/', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  })

  if (data.access) {
    setAuthToken(data.access)
  }

  return data
}

export async function login(email: string, password: string) {
  const data = await apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (data.access) {
    setAuthToken(data.access)
  }

  return data
}

export async function logout() {
  removeAuthToken()
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken()
    if (!token) return null

    const data = await apiCall('/auth/me/', {
      method: 'GET',
    })

    return data as User
  } catch (error) {
    console.error('Erro ao obter usuário:', error)
    return null
  }
}

export async function updateProfile(updates: Partial<User>) {
  return apiCall('/auth/profile/update/', {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ============================================
// PROPERTIES
// ============================================

export async function getProperties(filters?: {
  city?: string
  property_type?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  page?: number
}) {
  const params = new URLSearchParams()

  if (filters?.city) params.append('city', filters.city)
  if (filters?.property_type) params.append('property_type', filters.property_type)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.minPrice) params.append('min_price', filters.minPrice.toString())
  if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString())
  if (filters?.page) params.append('page', filters.page.toString())

  const queryString = params.toString()
  const endpoint = queryString ? `/properties/?${queryString}` : '/properties/'

  const data = await apiCall(endpoint)
  return data
}

export async function getPropertyById(id: number): Promise<Property> {
  return apiCall(`/properties/${id}/`)
}

export async function createProperty(
  property: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'owner'>
) {
  return apiCall('/properties/', {
    method: 'POST',
    body: JSON.stringify(property),
  })
}

export async function updateProperty(
  id: number,
  updates: Partial<Property>
) {
  return apiCall(`/properties/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteProperty(id: number) {
  return apiCall(`/properties/${id}/`, {
    method: 'DELETE',
  })
}

export async function getUserProperties() {
  return apiCall('/properties/user_properties/')
}

export async function getPropertiesByCity(city: string) {
  return apiCall(`/properties/by_city/?city=${encodeURIComponent(city)}`)
}

// ============================================
// BOOKINGS
// ============================================

export async function getBookings(filters?: {
  property_id?: number
  status?: string
  page?: number
}) {
  const params = new URLSearchParams()

  if (filters?.property_id) params.append('property_id', filters.property_id.toString())
  if (filters?.status) params.append('status', filters.status)
  if (filters?.page) params.append('page', filters.page.toString())

  const queryString = params.toString()
  const endpoint = queryString ? `/bookings/?${queryString}` : '/bookings/'

  return apiCall(endpoint)
}

export async function getBookingById(id: number) {
  return apiCall(`/bookings/${id}/`)
}

export async function createBooking(booking: {
  property_id: number
  start_date: string
  end_date: string
  is_monthly_rental: boolean
  message?: string
}) {
  return apiCall('/bookings/', {
    method: 'POST',
    body: JSON.stringify(booking),
  })
}

export async function updateBooking(id: number, updates: any) {
  return apiCall(`/bookings/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteBooking(id: number) {
  return apiCall(`/bookings/${id}/`, {
    method: 'DELETE',
  })
}

export async function confirmBooking(id: number) {
  return apiCall(`/bookings/${id}/confirm/`, {
    method: 'POST',
  })
}

export async function cancelBooking(id: number) {
  return apiCall(`/bookings/${id}/cancel/`, {
    method: 'POST',
  })
}

export async function getAvailableDates(
  propertyId: number,
  startDate?: string,
  endDate?: string
) {
  const params = new URLSearchParams({ property_id: propertyId.toString() })
  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)

  return apiCall(`/bookings/available_dates/?${params.toString()}`)
}

export async function getUserBookings() {
  return apiCall('/bookings/user_bookings/')
}

export async function getPropertyBookings(propertyId: number) {
  return apiCall(`/bookings/property_bookings/?property_id=${propertyId}`)
}
