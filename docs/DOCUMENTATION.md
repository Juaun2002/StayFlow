# Documentacao do StayFlow

## 1. Objetivo

StayFlow e um sistema de gerenciamento de imoveis com autenticacao, cadastro de propriedades e controle de reservas. A aplicacao combina uma interface web em Next.js com uma API REST em Django.

## 2. Arquitetura

```text
Usuario
  -> Frontend Next.js
    -> API REST Django
      -> PostgreSQL
```

### Frontend

Local: `front/`

Responsabilidades:

- Exibir telas de login, cadastro, dashboard, propriedades e reservas.
- Armazenar o token JWT no `localStorage`.
- Consumir a API Django por meio de `front/lib/api.ts`.
- Proteger rotas com componentes/hooks de autenticacao.

Principais arquivos:

- `app/page.tsx`: tela inicial com login e cadastro.
- `app/dashboard/page.tsx`: dashboard protegido.
- `app/bookings/page.tsx`: tela de reservas.
- `app/properties/new/page.tsx`: cadastro de imovel.
- `lib/api.ts`: cliente HTTP para a API Django.
- `hooks/useAuth.ts`: hooks de autenticacao e propriedades.

### Backend

Local: `back/`

Responsabilidades:

- Autenticacao e emissao de tokens JWT.
- CRUD de usuarios, propriedades e reservas.
- Validacao de permissoes por usuario.
- Persistencia em PostgreSQL.
- Disponibilizacao de media e arquivos estaticos em desenvolvimento.

Principais arquivos:

- `core/settings.py`: configuracoes Django, REST Framework, JWT, CORS e banco.
- `core/urls.py`: rotas principais.
- `apps/users/`: usuario customizado, registro, login e perfil.
- `apps/properties/`: propriedades, filtros e endpoints publicos/protegidos.
- `apps/bookings/`: reservas, disponibilidade e alteracao de status.

## 3. Variaveis de Ambiente

### Backend

Arquivo sugerido: `back/.env`

```env
DEBUG=True
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-too

DATABASE_NAME=aps_db
DATABASE_USER=aps_user
DATABASE_PASSWORD=aps_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

No Docker Compose, `DATABASE_HOST` e definido como `db` para apontar para o servico PostgreSQL.

### Frontend

Arquivo sugerido: `front/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_TOKEN_KEY=stayflow_token
```

## 4. Modelos Principais

### User

Modelo customizado baseado em `AbstractUser`.

Campos relevantes:

- `email`: unico.
- `role`: `owner`, `buyer` ou `admin`.
- `phone`, `bio`, `profile_image`.
- `is_verified`.
- `created_at`, `updated_at`.

### Property

Representa um imovel.

Campos relevantes:

- `title`, `description`.
- `property_type`: `apartment`, `house`, `land`, `commercial`.
- `address`, `city`, `state`, `zip_code`, `latitude`, `longitude`.
- `price`, `area`, `bedrooms`, `bathrooms`.
- `status`: `available`, `sold`, `rented`.
- `image_url`, `featured_image`.
- `owner`: usuario dono do imovel.

### Booking

Representa uma reserva ou agendamento.

Campos relevantes:

- `property`: propriedade reservada.
- `user`: usuario que fez a reserva.
- `start_date`, `end_date`.
- `is_monthly_rental`, `rental_duration_months`.
- `total_price`.
- `status`: `pending`, `confirmed`, `cancelled`, `completed`.
- `message`.

Regras:

- `end_date` deve ser maior ou igual a `start_date`.
- `start_date` nao pode estar no passado.
- O preco total e calculado automaticamente quando nao enviado.

## 5. API

Base URL padrao:

```text
http://localhost:8000/api/v1
```

Autenticacao:

```http
Authorization: Bearer <access_token>
```

### Autenticacao e Usuarios

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| POST | `/auth/register/` | Registra um usuario e retorna tokens JWT. |
| POST | `/auth/login/` | Autentica usuario e retorna tokens JWT. |
| POST | `/auth/logout/` | Encerra sessao no cliente. |
| GET | `/auth/me/` | Retorna o usuario autenticado. |
| PUT | `/auth/profile/update/` | Atualiza perfil do usuario autenticado. |
| GET | `/auth/users/` | Lista usuarios, autenticado. |
| GET | `/auth/users/{id}/` | Detalha usuario, autenticado. |

Exemplo de registro:

```json
{
  "email": "user@example.com",
  "username": "user",
  "password": "secret123",
  "password2": "secret123",
  "first_name": "User",
  "last_name": "Example"
}
```

Resposta esperada:

```json
{
  "user": {},
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token"
}
```

### Propriedades

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| GET | `/properties/` | Lista propriedades publicamente. |
| POST | `/properties/` | Cria propriedade, autenticado. |
| GET | `/properties/{id}/` | Detalha propriedade. |
| PUT/PATCH | `/properties/{id}/` | Atualiza propriedade, autenticado. |
| DELETE | `/properties/{id}/` | Remove propriedade, autenticado. |
| GET | `/properties/user_properties/` | Lista propriedades do usuario autenticado. |
| GET | `/properties/by_city/?city=...` | Lista propriedades por cidade. |
| GET | `/properties/{id}/details/` | Retorna detalhes da propriedade. |

Filtros aceitos:

```text
?city=Sao Paulo
?property_type=apartment
?status=available
?min_price=100000
?max_price=500000
?search=centro
?ordering=-price
?page=2
```

Exemplo de criacao:

```json
{
  "title": "Apartamento no centro",
  "description": "Imovel perto de comercio e transporte.",
  "property_type": "apartment",
  "address": "Rua Exemplo, 123",
  "city": "Sao Paulo",
  "state": "SP",
  "zip_code": "01000-000",
  "price": "250000.00",
  "area": 80,
  "bedrooms": 2,
  "bathrooms": 1,
  "status": "available"
}
```

### Reservas

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| GET | `/bookings/` | Lista reservas visiveis para o usuario. |
| POST | `/bookings/` | Cria reserva, autenticado. |
| GET | `/bookings/{id}/` | Detalha reserva. |
| PUT/PATCH | `/bookings/{id}/` | Atualiza reserva. |
| DELETE | `/bookings/{id}/` | Remove reserva. |
| GET | `/bookings/user_bookings/` | Lista reservas feitas pelo usuario. |
| GET | `/bookings/property_bookings/?property_id=...` | Lista reservas de uma propriedade do usuario. |
| POST | `/bookings/{id}/confirm/` | Confirma reserva, dono do imovel. |
| POST | `/bookings/{id}/cancel/` | Cancela reserva, usuario ou dono do imovel. |
| GET | `/bookings/available_dates/?property_id=...` | Retorna datas ja ocupadas. |

Exemplo de criacao:

```json
{
  "property": 1,
  "start_date": "2026-06-01",
  "end_date": "2026-06-05",
  "is_monthly_rental": false,
  "message": "Gostaria de reservar este periodo."
}
```

## 6. Permissoes

- Qualquer usuario pode listar e detalhar propriedades.
- Apenas usuarios autenticados podem criar, atualizar ou remover propriedades.
- `perform_create` define o dono da propriedade como o usuario autenticado.
- Reservas exigem autenticacao.
- Usuarios comuns veem apenas as proprias reservas ou reservas feitas em suas propriedades.
- Staff e superusuarios veem todas as reservas.
- Apenas o dono do imovel pode confirmar uma reserva.
- O dono do imovel ou o usuario da reserva pode cancelar uma reserva.

## 7. Execucao e Testes

### Subir backend com Docker

```bash
cd back
docker-compose up --build
```

### Rodar frontend

```bash
cd front
npm install
npm run dev
```

### Testar API

Com o backend em execucao:

```bash
cd back
python test_api.py
```

O script executa um fluxo com registro, login, perfil, criacao/listagem de propriedades, criacao/listagem de reservas e consulta de disponibilidade.

## 8. Integracao Frontend/Backend

O cliente principal de API fica em `front/lib/api.ts`.

Fluxo esperado:

1. Usuario faz login ou cadastro.
2. Backend retorna `access` e `refresh`.
3. Frontend salva `access` no `localStorage` usando `stayflow_token`.
4. Requisicoes autenticadas enviam `Authorization: Bearer <token>`.
5. Rotas protegidas validam usuario atual em `/auth/me/`.

