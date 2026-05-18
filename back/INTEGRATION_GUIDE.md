# Integração Frontend com Backend

Guia para integrar o frontend Next.js com o backend Django.

## 1. Configuração do Frontend

### 1.1 Atualizar arquivo de configuração (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### 1.2 Criar serviço de API

Atualize o arquivo `lib/api.ts` para usar o backend Django em vez do Supabase:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Interfaces para tokens
interface AuthTokens {
  access: string
  refresh: string
}

// Gerenciar tokens no localStorage
const getStoredTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null
  const tokens = localStorage.getItem('authTokens')
  return tokens ? JSON.parse(tokens) : null
}

const setStoredTokens = (tokens: AuthTokens) => {
  localStorage.setItem('authTokens', JSON.stringify(tokens))
}

// Headers com autenticação
const getAuthHeaders = () => {
  const tokens = getStoredTokens()
  if (!tokens?.access) return {}
  return {
    'Authorization': `Bearer ${tokens.access}`,
    'Content-Type': 'application/json',
  }
}

// ============================================
// AUTHENTICATION
// ============================================

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      username: email,
      password,
      password2: password,
      first_name: firstName || '',
      last_name: lastName || '',
    }),
  })

  if (!response.ok) throw new Error(await response.text())
  
  const data = await response.json()
  setStoredTokens({
    access: data.access,
    refresh: data.refresh,
  })
  
  return data
}

export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) throw new Error(await response.text())
  
  const data = await response.json()
  setStoredTokens({
    access: data.access,
    refresh: data.refresh,
  })
  
  return data
}

export async function signOut() {
  await fetch(`${API_URL}/auth/logout/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  
  localStorage.removeItem('authTokens')
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me/`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
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
}) {
  let url = `${API_URL}/properties/`
  const params = new URLSearchParams()

  if (filters?.city) params.append('city', filters.city)
  if (filters?.property_type) params.append('property_type', filters.property_type)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.minPrice) params.append('min_price', filters.minPrice.toString())
  if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString())

  if (params.toString()) url += `?${params.toString()}`

  const response = await fetch(url)
  if (!response.ok) throw new Error(await response.text())
  
  const data = await response.json()
  return data.results
}

export async function getPropertyById(id: number) {
  const response = await fetch(`${API_URL}/properties/${id}/`)
  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

export async function createProperty(property: any) {
  const response = await fetch(`${API_URL}/properties/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(property),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

export async function updateProperty(id: number, updates: any) {
  const response = await fetch(`${API_URL}/properties/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

export async function deleteProperty(id: number) {
  const response = await fetch(`${API_URL}/properties/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error(await response.text())
}

export async function getUserProperties() {
  const response = await fetch(`${API_URL}/properties/user_properties/`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

// ============================================
// BOOKINGS
// ============================================

export async function getBookings() {
  const response = await fetch(`${API_URL}/bookings/`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error(await response.text())
  const data = await response.json()
  return data.results
}

export async function createBooking(booking: any) {
  const response = await fetch(`${API_URL}/bookings/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(booking),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

export async function getAvailableDates(propertyId: number) {
  const response = await fetch(`${API_URL}/bookings/available_dates/?property_id=${propertyId}`)
  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}

export async function confirmBooking(id: number) {
  const response = await fetch(`${API_URL}/bookings/${id}/confirm/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })

  if (!response.ok) throw new Error(await response.text())
  return await response.json()
}
```

## 2. Atualizar useAuth Hook

```typescript
// lib/userService.ts
import { getCurrentUser } from './api'

export async function getUserProfile() {
  try {
    return await getCurrentUser()
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}
```

## 3. Variáveis de Ambiente

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Backend (.env)

```env
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 4. Fluxo de Login

1. Usuário entra credenciais
2. Frontend faz POST para `/auth/login/`
3. Backend retorna `access` e `refresh` tokens
4. Frontend armazena tokens no `localStorage`
5. Para requisições autenticadas, incluir header:
   ```
   Authorization: Bearer <access_token>
   ```

## 5. Tratamento de Token Expirado

```typescript
async function apiRequest(url: string, options: RequestInit = {}) {
  let response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(),
  })

  // Se token expirado (401), tentar refresh
  if (response.status === 401) {
    const tokens = getStoredTokens()
    if (tokens?.refresh) {
      const refreshResponse = await fetch(`${API_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      })

      if (refreshResponse.ok) {
        const newTokens = await refreshResponse.json()
        setStoredTokens({
          access: newTokens.access,
          refresh: tokens.refresh, // Manter refresh anterior se novo não foi fornecido
        })

        // Tentar requisição novamente
        response = await fetch(url, {
          ...options,
          headers: getAuthHeaders(),
        })
      } else {
        // Logout se refresh falhar
        signOut()
      }
    }
  }

  return response
}
```

## 6. CORS

O backend está configurado para aceitar requisições de:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

Se o frontend está em outra porta/URL, adicione em `.env` do backend:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://seu-dominio.com
```

## 7. Testando a Integração

```bash
# Terminal 1: Iniciar backend
cd back
docker-compose up

# Terminal 2: Iniciar frontend
cd front
npm run dev
```

Acesse `http://localhost:3000` e teste o fluxo de login/registro.

## 8. Troubleshooting

### CORS Error

- Verifique `CORS_ALLOWED_ORIGINS` no `.env` do backend
- Reinicie o container Docker

### Token Inválido

- Limpe `localStorage` (DevTools > Application > Storage)
- Faça login novamente

### 404 no endpoint

- Verifique se `NEXT_PUBLIC_API_URL` está correto
- Verifique se o backend está rodando em `localhost:8000`

## Próximos Passos

1. Implementar interceptadores de erro globais
2. Adicionar loading states
3. Implementar refresh automático de token
4. Adicionar testes de integração
5. Configurar deploy em produção
