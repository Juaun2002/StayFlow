# API Documentation

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

A API usa JWT (JSON Web Tokens). Após fazer login, você receberá dois tokens:

- **access**: Token de acesso (válido por 60 minutos)
- **refresh**: Token de refresh (válido por 7 dias)

### Usando o Token

Inclua o token no header `Authorization`:

```bash
curl -H "Authorization: Bearer <seu_access_token>" \
  http://localhost:8000/api/v1/properties/
```

### Refresh Token

Para obter um novo access token usando o refresh token:

```bash
curl -X POST http://localhost:8000/api/v1/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<seu_refresh_token>"}'
```

---

## Endpoints

### 1. Autenticação (Auth)

#### Registrar Novo Usuário

```http
POST /auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword123",
  "password2": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "first_name": "John",
    "last_name": "Doe",
    "role": "buyer",
    "is_verified": false,
    "created_at": "2026-05-18T10:00:00Z"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login

```http
POST /auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "user": { ... },
  "access": "...",
  "refresh": "..."
}
```

#### Logout

```http
POST /auth/logout/
Authorization: Bearer <access_token>
```

#### Get Current User Profile

```http
GET /auth/me/
Authorization: Bearer <access_token>
```

#### Update Profile

```http
PUT /auth/profile/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+5511987654321",
  "bio": "Real estate agent"
}
```

---

### 2. Properties

#### List Properties

```http
GET /properties/
```

**Query Parameters:**

- `?city=São Paulo` - Filtrar por cidade
- `?property_type=apartment` - Filtrar por tipo (apartment, house, land, commercial)
- `?status=available` - Filtrar por status (available, sold, rented)
- `?min_price=100000` - Preço mínimo
- `?max_price=500000` - Preço máximo
- `?search=apartamento` - Buscar por título/descrição
- `?ordering=-price` - Ordenar por campo

**Response (200 OK):**

```json
{
  "count": 25,
  "next": "http://localhost:8000/api/v1/properties/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Apartamento moderno em SP",
      "price": "250000.00",
      "city": "São Paulo",
      "area": 95.5,
      "bedrooms": 2,
      "bathrooms": 1,
      "property_type": "apartment",
      "status": "available",
      "image_url": null,
      "featured_image": null,
      "owner_name": "John Doe",
      "created_at": "2026-05-18T10:00:00Z"
    }
  ]
}
```

#### Get Property Details

```http
GET /properties/{id}/
```

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Apartamento moderno em SP",
  "description": "Apartamento com 2 quartos...",
  "property_type": "apartment",
  "address": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "price": "250000.00",
  "area": 95.5,
  "bedrooms": 2,
  "bathrooms": 1,
  "status": "available",
  "image_url": null,
  "featured_image": null,
  "owner": 1,
  "owner_name": "John Doe",
  "owner_email": "john@example.com",
  "created_at": "2026-05-18T10:00:00Z",
  "updated_at": "2026-05-18T10:00:00Z"
}
```

#### Create Property

```http
POST /properties/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Casa com 3 quartos",
  "description": "Casa bem localizada...",
  "property_type": "house",
  "address": "Av. Paulista, 1000",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01311-100",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "price": "450000.00",
  "area": 150.0,
  "bedrooms": 3,
  "bathrooms": 2,
  "status": "available"
}
```

**Response (201 Created):**

```json
{
  "id": 2,
  "title": "Casa com 3 quartos",
  ...
}
```

#### Update Property

```http
PUT /properties/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "price": "440000.00",
  "status": "available"
}
```

#### Delete Property

```http
DELETE /properties/{id}/
Authorization: Bearer <access_token>
```

**Response (204 No Content):**

#### Get User Properties

```http
GET /properties/user_properties/
Authorization: Bearer <access_token>
```

#### Get Properties by City

```http
GET /properties/by_city/?city=São Paulo
```

---

### 3. Bookings

#### List Bookings

```http
GET /bookings/
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `?property={id}` - Filtrar por propriedade
- `?status=confirmed` - Filtrar por status
- `?user={id}` - Filtrar por usuário

#### Create Booking

```http
POST /bookings/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "property": 1,
  "start_date": "2026-06-01",
  "end_date": "2026-06-15",
  "is_monthly_rental": false,
  "message": "Gostaria de agendar uma visita"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "property": 1,
  "property_title": "Apartamento moderno em SP",
  "property_price": "250000.00",
  "user": 2,
  "user_name": "Jane Doe",
  "user_email": "jane@example.com",
  "start_date": "2026-06-01",
  "end_date": "2026-06-15",
  "is_monthly_rental": false,
  "rental_duration_months": 0,
  "total_price": "3750000.00",
  "status": "pending",
  "message": "Gostaria de agendar uma visita",
  "days_count": 14,
  "created_at": "2026-05-18T10:00:00Z",
  "updated_at": "2026-05-18T10:00:00Z"
}
```

#### Get Booking Details

```http
GET /bookings/{id}/
Authorization: Bearer <access_token>
```

#### Update Booking

```http
PUT /bookings/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "start_date": "2026-06-05",
  "end_date": "2026-06-20"
}
```

#### Delete Booking

```http
DELETE /bookings/{id}/
Authorization: Bearer <access_token>
```

#### Confirm Booking

```http
POST /bookings/{id}/confirm/
Authorization: Bearer <access_token>
```

**Response (200 OK):**

```json
{
  "id": 1,
  "status": "confirmed",
  ...
}
```

#### Cancel Booking

```http
POST /bookings/{id}/cancel/
Authorization: Bearer <access_token>
```

#### Get User Bookings

```http
GET /bookings/user_bookings/
Authorization: Bearer <access_token>
```

#### Get Property Bookings

```http
GET /bookings/property_bookings/?property_id=1
Authorization: Bearer <access_token>
```

#### Get Available Dates

```http
GET /bookings/available_dates/?property_id=1
```

**Response (200 OK):**

```json
{
  "property_id": 1,
  "booked_dates": [
    "2026-06-01",
    "2026-06-02",
    "2026-06-03"
  ]
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "detail": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error

```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Não há rate limiting configurado atualmente. Para produção, considere adicionar.

## Paginação

Padrão: 20 itens por página

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/v1/properties/?page=2",
  "previous": null,
  "results": [...]
}
```

## Filtros e Busca

### Properties

- Campo: `search` - Busca em title, description, address, city
- Campo: `city` - Filtro exato
- Campo: `property_type` - Filtro exato
- Campo: `status` - Filtro exato
- Campo: `min_price` - Preço mínimo
- Campo: `max_price` - Preço máximo
- Ordenação: `price`, `created_at`, `area`

### Bookings

- Campo: `property` - Filtro por ID
- Campo: `status` - Filtro exato
- Campo: `user` - Filtro por ID
- Ordenação: `start_date`, `created_at`, `total_price`
