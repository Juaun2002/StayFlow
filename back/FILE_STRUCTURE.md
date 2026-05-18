# 📋 Mapa Completo do Backend Django

## Estrutura de Diretórios Criada

```
APS/back/
│
├── 📁 core/                              # Configuração principal do Django
│   ├── __init__.py                      # Python package
│   ├── asgi.py                          # ASGI config
│   ├── settings.py                      # ⭐ Arquivo principal de configuração
│   ├── urls.py                          # ⭐ URLs principais da aplicação
│   └── wsgi.py                          # WSGI config
│
├── 📁 apps/                              # Aplicações Django
│   │
│   ├── 📁 users/                        # App de Autenticação e Usuários
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   └── 0001_initial.py          # Migration inicial do User
│   │   ├── management/
│   │   │   ├── __init__.py
│   │   │   └── commands/
│   │   │       ├── __init__.py
│   │   │       └── createsuperuser_if_not_exists.py
│   │   ├── __init__.py
│   │   ├── admin.py                     # Admin customizado
│   │   ├── apps.py                      # Config da app
│   │   ├── models.py                    # Custom User model
│   │   ├── serializers.py               # DRF Serializers
│   │   ├── urls.py                      # URLs de auth
│   │   └── views.py                     # ViewSets de usuários
│   │
│   ├── 📁 properties/                   # App de Propriedades/Imóveis
│   │   ├── migrations/
│   │   │   ├── __init__.py
│   │   │   └── 0001_initial.py          # Migration do Property
│   │   ├── __init__.py
│   │   ├── admin.py                     # Admin customizado
│   │   ├── apps.py                      # Config da app
│   │   ├── models.py                    # Property model
│   │   ├── serializers.py               # DRF Serializers
│   │   ├── urls.py                      # URLs
│   │   └── views.py                     # PropertyViewSet
│   │
│   └── 📁 bookings/                     # App de Agendamentos/Reservas
│       ├── migrations/
│       │   ├── __init__.py
│       │   └── 0001_initial.py          # Migration do Booking
│       ├── __init__.py
│       ├── admin.py                     # Admin customizado
│       ├── apps.py                      # Config da app
│       ├── models.py                    # Booking model
│       ├── serializers.py               # DRF Serializers
│       ├── urls.py                      # URLs
│       └── views.py                     # BookingViewSet
│
├── 📄 manage.py                         # Django management CLI
├── 📄 requirements.txt                  # Dependências Python (pip)
│
├── 🐳 Dockerfile                        # Container Docker
├── 🐳 docker-compose.yml                # Orquestração (Django + PostgreSQL)
├── 📄 entrypoint.sh                     # Script de entrada do container
│
├── 📄 .env                              # Variáveis de ambiente (NÃO COMMITAR)
├── 📄 .env.example                      # Template de .env
├── 📄 .gitignore                        # Arquivos ignorados pelo git
├── 📄 .dockerignore                     # Arquivos ignorados pelo Docker
│
├── 📚 Documentação
│   ├── 📘 README.md                     # Documentação geral completa
│   ├── 📘 QUICK_START.md                # Guia de início rápido (5 min)
│   ├── 📘 API_DOCS.md                   # Documentação de todos endpoints
│   ├── 📘 INTEGRATION_GUIDE.md          # Como integrar com frontend
│   ├── 📘 PROJECT_SUMMARY.md            # Resumo do projeto
│   └── 📘 FILE_STRUCTURE.md             # Este arquivo
│
├── 🛠️ Setup Scripts
│   ├── init.sh                          # Setup automático (Linux/Mac)
│   ├── init.bat                         # Setup automático (Windows)
│   ├── setup.sh                         # Setup local (Linux/Mac)
│   └── setup.bat                        # Setup local (Windows)
│
└── 📋 Makefile                          # Comandos úteis (make)
```

---

## 📊 Detalhamento por App

### 1️⃣ App: users (Autenticação)

**Arquivo**: [apps/users/](apps/users/)

**Modelos**:
- `User` - Custom user com roles (owner, buyer, admin)

**Endpoints**:
- `POST /auth/register/` - Novo usuário
- `POST /auth/login/` - Login
- `GET /auth/me/` - Perfil atual
- `PUT /auth/profile/update/` - Atualizar perfil

**Recursos**:
- Autenticação JWT
- Roles de usuário
- Profile customizado

---

### 2️⃣ App: properties (Imóveis)

**Arquivo**: [apps/properties/](apps/properties/)

**Modelos**:
- `Property` - Propriedade com todos detalhes

**Endpoints**:
- `GET /properties/` - Listar com filtros
- `POST /properties/` - Criar
- `GET /properties/{id}/` - Detalhes
- `PUT /properties/{id}/` - Atualizar
- `DELETE /properties/{id}/` - Deletar
- `GET /properties/user_properties/` - Minhas propriedades
- `GET /properties/by_city/` - Por cidade

**Recursos**:
- Filtros: cidade, tipo, status, preço
- Busca por título/descrição
- Ordenação por preço/data/área
- Paginação automática

---

### 3️⃣ App: bookings (Reservas)

**Arquivo**: [apps/bookings/](apps/bookings/)

**Modelos**:
- `Booking` - Agendamento com datas e preço

**Endpoints**:
- `GET /bookings/` - Listar
- `POST /bookings/` - Criar
- `POST /bookings/{id}/confirm/` - Confirmar
- `POST /bookings/{id}/cancel/` - Cancelar
- `GET /bookings/available_dates/` - Datas livres

**Recursos**:
- Validação de datas
- Cálculo automático de preço
- Status: pending, confirmed, cancelled, completed
- Datas bloqueadas

---

## 🔧 Arquivos de Configuração

### Docker

**[Dockerfile](Dockerfile)**
- Build em duas etapas (builder + runtime)
- Python 3.11-slim
- Gunicorn configurado
- Ports: 8000

**[docker-compose.yml](docker-compose.yml)**
- Serviço: `web` (Django backend)
- Serviço: `db` (PostgreSQL 15)
- Volumes: dados, estáticos, mídia
- Networks: comunicação interna
- Health checks

### Django

**[core/settings.py](core/settings.py)**
- 300+ linhas de configuração
- JWT authentication
- CORS setup
- Database PostgreSQL
- Static/Media files
- Email (console em dev)

**[core/urls.py](core/urls.py)**
- Router DRF automático
- Endpoints API organizados
- Admin django.admin

---

## 📦 Dependências (requirements.txt)

| Pacote | Versão | Função |
|--------|--------|--------|
| Django | 4.2.11 | Framework web |
| djangorestframework | 3.14.0 | API REST |
| django-cors-headers | 4.3.1 | CORS support |
| psycopg2-binary | 2.9.9 | Driver PostgreSQL |
| djangorestframework-simplejwt | 5.3.2 | JWT auth |
| gunicorn | 21.2.0 | WSGI server |
| Pillow | 10.1.0 | Image handling |
| python-decouple | 3.8 | Environment vars |
| PyJWT | 2.8.1 | JWT encoding |
| django-environ | 0.11.2 | .env support |

---

## 🔐 Segurança

✅ **Implementado**:
- JWT authentication
- CORS configurado
- Permissões nível objeto
- Validação de entrada
- Admin Django
- Password hashing (Django default)
- CSRF protection

⚠️ **Para Produção**:
- Mudar `SECRET_KEY`
- `DEBUG=False`
- Nova senha admin
- HTTPS/SSL
- Banco de dados seguro

---

## 📖 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [README.md](README.md) | Visão geral completa |
| [QUICK_START.md](QUICK_START.md) | Começar em 5 minutos |
| [API_DOCS.md](API_DOCS.md) | Todos os endpoints (60+ endpoints) |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Integração com Next.js |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Resumo executivo |
| [FILE_STRUCTURE.md](FILE_STRUCTURE.md) | Este arquivo |

---

## 🚀 Como Usar

### Inicializar Rápido

```bash
# Linux/Mac
bash init.sh

# Windows
init.bat
```

### Comandos Make

```bash
make help              # Listar todos
make up                # Iniciar
make down              # Parar
make migrate           # Migrations
make logs              # Ver logs
```

### Docker Direto

```bash
docker-compose up -d   # Iniciar
docker-compose down    # Parar
docker-compose logs -f # Logs
```

---

## ✨ Features Implementadas

### ✅ Autenticação
- [x] Register
- [x] Login
- [x] Logout
- [x] JWT tokens
- [x] Profile
- [x] Roles

### ✅ Propriedades
- [x] CRUD completo
- [x] Filtros avançados
- [x] Busca por texto
- [x] Ordenação
- [x] Paginação
- [x] Permissões

### ✅ Bookings
- [x] Criar reserva
- [x] Confirmar/Cancelar
- [x] Validação de datas
- [x] Cálculo de preço
- [x] Datas disponíveis
- [x] Status tracking

### ✅ Infraestrutura
- [x] Docker + Compose
- [x] PostgreSQL
- [x] Migrations automáticas
- [x] Admin Django
- [x] CORS
- [x] Logging

### ✅ Documentação
- [x] README
- [x] API docs
- [x] Integration guide
- [x] Quick start
- [x] Code comments

---

## 📊 Modelo ER

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ email       │
│ role        │
│ ...         │
└──────┬──────┘
       │
       │ 1..N
       │
┌──────▼───────────┐
│   Property      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ price           │
│ owner_id (FK)   │◄─────┐
│ ...             │      │
└──────┬──────────┘      │
       │                 │
       │ 1..N            │
       │                 │
┌──────▼──────────┐      │
│   Booking       │      │
├─────────────────┤      │
│ id (PK)         │      │
│ property_id(FK) │      │
│ user_id (FK)    │◄─────┘
│ start_date      │
│ end_date        │
│ total_price     │
│ status          │
└─────────────────┘
```

---

## 🎯 Status

| Item | Status |
|------|--------|
| Modelos | ✅ Completo |
| APIs | ✅ Completo |
| Autenticação | ✅ Completo |
| Docker | ✅ Completo |
| Documentação | ✅ Completo |
| Testes | ⏳ Em andamento |
| Deploy | ⏳ Próximo |

---

## 🔗 Links Rápidos

- API: `http://localhost:8000/api/v1`
- Admin: `http://localhost:8000/admin`
- Docs: [API_DOCS.md](API_DOCS.md)
- Setup: [QUICK_START.md](QUICK_START.md)
- Integração: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

## 📝 Notas

- Arquivo `.env` criado com valores padrão
- Admin padrão: `admin` / `admin123456`
- Mude senha e configurações em produção
- PostgreSQL em container (porta 5432)
- Backend em Gunicorn (porta 8000)
- Todos os endpoints requerem autenticação (exceto public)

**✨ Backend completo e pronto para integração com frontend! ✨**
