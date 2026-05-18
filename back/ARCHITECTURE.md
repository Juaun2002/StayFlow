# 🏗️ Arquitetura do Sistema APS

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND NEXT.JS                         │
│                                                                   │
│  - Login/Register (AuthContainer)                                │
│  - Dashboard                                                      │
│  - Propriedades (List, Create, Edit)                             │
│  - Bookings/Reservas                                             │
│  - Animações (Framer Motion)                                     │
│                                                                   │
│  Porta: 3000                                                      │
│  Tech: Next.js, React, TypeScript, Tailwind, Framer Motion       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST │ JSON
                              │
         ┌────────────────────▼──────────────────────┐
         │   CORS Middleware                          │
         │   (localhost:3000 ↔ localhost:8000)        │
         └────────────────────┬──────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                    DJANGO REST API BACKEND                       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Django 4.2                           │  │
│  │                                                            │  │
│  │  ┌─────────────────┬──────────────┬────────────────────┐ │  │
│  │  │   Users App     │ Properties   │   Bookings App     │ │  │
│  │  │   (Auth)        │   App        │   (Reservas)       │ │  │
│  │  ├─────────────────┼──────────────┼────────────────────┤ │  │
│  │  │ • User Model    │ • Property   │ • Booking Model    │ │  │
│  │  │ • JWT Auth      │   Model      │ • Date Validation  │ │  │
│  │  │ • Profile       │ • Filters    │ • Status Tracking  │ │  │
│  │  │ • Roles (3)     │ • Search     │ • Price Calc       │ │  │
│  │  │                 │ • Ordering   │ • Available Dates  │ │  │
│  │  └─────────────────┴──────────────┴────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         Django REST Framework                         │ │  │
│  │  │                                                        │ │  │
│  │  │  • ViewSets                                           │ │  │
│  │  │  • Serializers com Validação                          │ │  │
│  │  │  • Permissions & Authentication                       │ │  │
│  │  │  • Filtering, Searching, Ordering                     │ │  │
│  │  │  • Pagination                                         │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │         Admin Django                                 │ │  │
│  │  │  - Gerenciar usuários, propriedades, reservas         │ │  │
│  │  │  - URL: http://localhost:8000/admin                   │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Porta: 8000                                                      │
│  Server: Gunicorn                                                │
│  ASGI: Daphne (futuro para WebSocket)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                    TCP/IP    │
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                      POSTGRESQL DATABASE                         │
│                                                                   │
│  ┌──────────────────┬───────────────┬──────────────────────┐   │
│  │   auth_user      │ properties_    │  bookings_booking    │   │
│  │   (extended)     │ property       │                      │   │
│  ├──────────────────┼───────────────┼──────────────────────┤   │
│  │ • id (PK)        │ • id (PK)     │ • id (PK)            │   │
│  │ • email          │ • title       │ • property_id (FK)   │   │
│  │ • username       │ • description │ • user_id (FK)       │   │
│  │ • role           │ • price       │ • start_date         │   │
│  │ • phone          │ • area        │ • end_date           │   │
│  │ • bio            │ • city        │ • total_price        │   │
│  │ • is_verified    │ • bedrooms    │ • status             │   │
│  │ • created_at     │ • bathrooms   │ • created_at         │   │
│  │                  │ • owner_id FK │                      │   │
│  │                  │ • status      │                      │   │
│  └──────────────────┴───────────────┴──────────────────────┘   │
│                                                                   │
│  Porta: 5432                                                      │
│  Usuário: aps_user                                               │
│  Database: aps_db                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Requisição

```
┌──────────────────┐
│ Frontend         │
│ (Next.js)        │
└────────┬─────────┘
         │
         │ HTTP POST /api/v1/auth/login/
         │ {email, password}
         │
         ▼
┌──────────────────────────────────┐
│ Django Backend (Gunicorn)        │
│                                  │
│ 1. CORS Middleware               │
│    └─ Verifica origin             │
│                                  │
│ 2. Auth Middleware               │
│    └─ Não requer token (login)   │
│                                  │
│ 3. LoginSerializer               │
│    └─ Valida credenciais         │
│                                  │
│ 4. UserViewSet.login()           │
│    └─ Autentica usuário          │
│                                  │
│ 5. RefreshToken.for_user()       │
│    └─ Gera JWT tokens            │
│                                  │
│ 6. Resposta JSON                 │
│    {access, refresh, user}       │
└────────┬──────────────────────────┘
         │
         │ HTTP 200 OK
         │ {access: JWT, refresh: JWT}
         │
         ▼
┌──────────────────┐
│ Frontend         │
│ localStorage     │
│ (tokens)         │
└──────────────────┘
```

---

## 📊 Fluxo Autenticado

```
┌──────────────────┐
│ Frontend         │
│ Authorization:   │
│ Bearer <token>   │
└────────┬─────────┘
         │
         │ HTTP GET /api/v1/properties/
         │ Header: Authorization: Bearer eyJ...
         │
         ▼
┌──────────────────────────────────┐
│ Django Backend                   │
│                                  │
│ 1. CORS Middleware               │
│    └─ OK                         │
│                                  │
│ 2. JWTAuthentication             │
│    └─ Extrai user do token      │
│    └─ Valida assinatura          │
│    └─ Popula request.user        │
│                                  │
│ 3. Permission Classes            │
│    └─ IsAuthenticated (OK)       │
│                                  │
│ 4. PropertyViewSet.list()        │
│    └─ Retorna propriedades       │
│    └─ Paginadas (20/página)      │
│                                  │
│ 5. PropertySerializer            │
│    └─ Serializa dados            │
│                                  │
│ 6. Resposta JSON                 │
└────────┬──────────────────────────┘
         │
         │ HTTP 200 OK
         │ {count, next, results: [...]}
         │
         ▼
┌──────────────────────────────────┐
│ Frontend                         │
│ Renderiza lista de propriedades  │
│ ComponentPropertyCard x 20       │
└──────────────────────────────────┘
```

---

## 🐳 Stack de Containers

```
Docker Compose Network: aps_network
│
├─── Container: aps_backend
│    ├─ Image: python:3.11-slim
│    ├─ Service: Django + Gunicorn
│    ├─ Porta: 8000 → localhost:8000
│    ├─ Volume: ./code → /app
│    ├─ Depends On: db (health check)
│    └─ Env: .env
│
└─── Container: aps_db
     ├─ Image: postgres:15-alpine
     ├─ Service: PostgreSQL
     ├─ Porta: 5432 → localhost:5432
     ├─ Volume: postgres_data (persistente)
     ├─ Env: POSTGRES_DB, USER, PASSWORD
     └─ Health Check: pg_isready
```

---

## 🔐 Fluxo de Segurança

```
Usuário    ┌─────────────────────────────────────────┐
           │ 1. Submete credenciais (HTTPS em prod)  │
           └────────────────┬────────────────────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ CORS Validation    │
                   │ Origin check       │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ Valida credenciais │
                   │ Hash password      │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ Gera JWT tokens    │
                   │ Assinado com SECRET│
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ Resposta com tokens│
                   │ localStorage save  │
                   └────────┬───────────┘
                            │
                    Para próximas requisições:
                            │
                            ▼
                   ┌────────────────────┐
                   │ Header validação   │
                   │ Verifica signature │
                   │ Extrai user info   │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │ Permission check   │
                   │ Autorização em nível
                   │ objeto (owner only) │
                   └────────────────────┘
```

---

## 📈 Escalabilidade Futura

```
Current Setup (Development):
┌──────────┐
│ Frontend │
└────┬─────┘
     │
     ▼
┌──────────────────┐    ┌──────────────┐
│ Django (1 inst)  │───▶│ PostgreSQL   │
└──────────────────┘    └──────────────┘

Production Setup (Futuro):
┌──────────┐
│ Frontend │
└────┬─────┘
     │
     ▼
┌────────────────────┐
│ Nginx (reverse proxy)
├─ Cache
├─ HTTPS termination
└────┬───────────────┘
     │
     ├──▶ ┌──────────────────┐
     │    │ Django (inst 1)  │
     ├──▶ └──────────────────┘
     │    ┌──────────────────┐
     │    │ Django (inst 2)  │
     └──▶ └──────────────────┘
         ┌──────────────────┐
         │ PostgreSQL       │
         │ (replicação)     │
         └──────────────────┘
         ┌──────────────────┐
         │ Redis (cache)    │
         └──────────────────┘
         ┌──────────────────┐
         │ Celery (tasks)   │
         └──────────────────┘
```

---

## 🔄 Ciclo de Desenvolvimento

```
1. Ambiente Local
   └─ Docker Compose (Django + PostgreSQL)
   └─ Hot reload em desenvolvimento
   └─ Admin Django para testes

2. Integração com Frontend
   └─ CORS configurado
   └─ JWT tokens
   └─ API documentation (Swagger futuro)

3. Testing
   └─ test_api.py (10 testes)
   └─ Pytest (adicionar)
   └─ Coverage (adicionar)

4. Deploy em Produção
   └─ CI/CD (GitHub Actions)
   └─ Container registry
   └─ Kubernetes (futuro)
   └─ Monitoring & Logging
```

---

## 📝 Endpoints Principais

```
Authentication:
  POST   /auth/register/      └─ Novo usuário
  POST   /auth/login/         └─ Login JWT
  GET    /auth/me/            └─ Perfil
  PUT    /auth/profile/       └─ Update

Properties:
  GET    /properties/         └─ Listar (filtros)
  POST   /properties/         └─ Criar
  GET    /properties/{id}/    └─ Detalhes
  PUT    /properties/{id}/    └─ Update
  DELETE /properties/{id}/    └─ Delete
  GET    /properties/user_properties/  └─ Minhas
  GET    /properties/by_city/         └─ Por cidade

Bookings:
  GET    /bookings/           └─ Listar
  POST   /bookings/           └─ Criar
  GET    /bookings/{id}/      └─ Detalhes
  PUT    /bookings/{id}/      └─ Update
  DELETE /bookings/{id}/      └─ Delete
  POST   /bookings/{id}/confirm/      └─ Confirmar
  POST   /bookings/{id}/cancel/       └─ Cancelar
  GET    /bookings/available_dates/   └─ Datas livres
```

---

## 🎯 Performance

```
Request Time (aproximado):
  - CORS check: 1ms
  - Auth validation: 2ms
  - DB query: 10-50ms
  - Serialization: 5ms
  - Response: 20-70ms total

Database Queries:
  - Indexed: city, status, owner, created_at
  - Pagination: 20 items default
  - Caching: Redis (futuro)

Concurrent Users:
  - Desenvolvimento: 50+ (Docker)
  - Produção: 1000+ (com Nginx + múltiplas instâncias)
```

---

## 🛡️ Segurança

```
Camadas de Proteção:

1. Transport
   └─ HTTPS (TLS/SSL) em produção

2. Authentication
   └─ JWT (tokens com expiração)
   └─ Password hashing (PBKDF2)

3. Authorization
   └─ Roles (owner, buyer, admin)
   └─ Permissões nível objeto

4. Input Validation
   └─ Serializer validation
   └─ Type checking
   └─ SQL injection prevention (ORM)

5. API Protection
   └─ CORS validation
   └─ CSRF protection
   └─ Rate limiting (futuro)

6. Data Protection
   └─ No sensitive data em logs
   └─ Encryption em repouso (futuro)
   └─ Backup automático
```

---

**Arquitetura robusta, escalável e seguida de boas práticas Django! 🚀**
