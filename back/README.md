# APS Backend - Django REST API

API backend para o sistema de gerenciamento de imóveis (APS) desenvolvido com Django e PostgreSQL.

## Características

- ✅ Autenticação com JWT (JSON Web Tokens)
- ✅ Sistema completo de Propriedades (CRUD)
- ✅ Sistema de Agendamentos/Reservas (Bookings)
- ✅ Gerenciamento de Usuários com perfis
- ✅ Banco de dados PostgreSQL
- ✅ Docker & Docker Compose para fácil deployment
- ✅ API REST com DRF (Django REST Framework)
- ✅ CORS configurado para integração com frontend

## Requisitos

- Docker & Docker Compose (recomendado)
- Python 3.11+ (para desenvolvimento local)
- PostgreSQL 15+ (se não usar Docker)

## Quick Start com Docker

### 1. Clonar o repositório

```bash
git clone <repo-url>
cd APS/back
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário (valores padrão funcionam para desenvolvimento).

### 3. Iniciar os contêineres

```bash
docker-compose up -d
```

O backend estará disponível em `http://localhost:8000`

### 4. Acessar o admin

```
URL: http://localhost:8000/admin
Username: admin
Password: admin123456
```

## Desenvolvimento Local (sem Docker)

### 1. Criar ambiente virtual

```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar banco de dados

```bash
# Copiar exemplo de variáveis de ambiente
cp .env.example .env

# Editar .env e configurar DATABASE_HOST para localhost
```

### 4. Executar migrations

```bash
python manage.py migrate
```

### 5. Criar superusuário

```bash
python manage.py createsuperuser
```

### 6. Executar servidor

```bash
python manage.py runserver
```

## Estrutura do Projeto

```
back/
├── apps/
│   ├── users/              # Autenticação e gerenciamento de usuários
│   ├── properties/         # Gerenciamento de propriedades/imóveis
│   └── bookings/           # Sistema de agendamentos/reservas
├── core/
│   ├── settings.py         # Configurações do Django
│   ├── urls.py            # URLs principais
│   ├── wsgi.py            # WSGI config
│   └── asgi.py            # ASGI config
├── Dockerfile              # Container da aplicação
├── docker-compose.yml      # Orquestração de containers
├── manage.py              # CLI do Django
└── requirements.txt        # Dependências Python
```

## API Endpoints

### Autenticação

- `POST /api/v1/auth/register/` - Registrar novo usuário
- `POST /api/v1/auth/login/` - Fazer login
- `POST /api/v1/auth/logout/` - Fazer logout
- `GET /api/v1/auth/me/` - Obter perfil atual
- `PUT /api/v1/auth/profile/update/` - Atualizar perfil

### Propriedades

- `GET /api/v1/properties/` - Listar propriedades
- `POST /api/v1/properties/` - Criar propriedade
- `GET /api/v1/properties/{id}/` - Obter detalhes
- `PUT /api/v1/properties/{id}/` - Atualizar propriedade
- `DELETE /api/v1/properties/{id}/` - Deletar propriedade
- `GET /api/v1/properties/user_properties/` - Propriedades do usuário
- `GET /api/v1/properties/by_city/` - Filtrar por cidade

### Agendamentos

- `GET /api/v1/bookings/` - Listar agendamentos
- `POST /api/v1/bookings/` - Criar agendamento
- `GET /api/v1/bookings/{id}/` - Obter detalhes
- `PUT /api/v1/bookings/{id}/` - Atualizar agendamento
- `DELETE /api/v1/bookings/{id}/` - Deletar agendamento
- `GET /api/v1/bookings/user_bookings/` - Agendamentos do usuário
- `GET /api/v1/bookings/property_bookings/` - Agendamentos da propriedade
- `POST /api/v1/bookings/{id}/confirm/` - Confirmar agendamento
- `POST /api/v1/bookings/{id}/cancel/` - Cancelar agendamento
- `GET /api/v1/bookings/available_dates/` - Datas disponíveis

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após fazer login, você receberá dois tokens:

- `access`: Token de acesso (válido por 60 minutos)
- `refresh`: Token de refresh (válido por 7 dias)

### Usando o token

Inclua o token no header `Authorization`:

```
Authorization: Bearer <seu_access_token>
```

## Filtros e Buscas

### Propriedades

- `?city=Sao Paulo` - Filtrar por cidade
- `?property_type=apartment` - Filtrar por tipo
- `?status=available` - Filtrar por status
- `?min_price=100000` - Preço mínimo
- `?max_price=500000` - Preço máximo
- `?search=apartamento` - Buscar por título/descrição
- `?ordering=-price` - Ordenar por preço (decrescente)

### Agendamentos

- `?property={id}` - Filtrar por propriedade
- `?status=confirmed` - Filtrar por status
- `?user={id}` - Filtrar por usuário

## Comandos úteis com Docker

```bash
# Ver logs
docker-compose logs -f web

# Executar comando no container
docker-compose exec web python manage.py <comando>

# Parar containers
docker-compose down

# Remover tudo (cuidado!)
docker-compose down -v
```

## Variáveis de Ambiente

```
DEBUG=True                          # Debug mode
SECRET_KEY=your-secret-key         # Chave secreta do Django
DATABASE_NAME=aps_db               # Nome do banco
DATABASE_USER=aps_user             # Usuário do banco
DATABASE_PASSWORD=aps_password     # Senha do banco
DATABASE_HOST=db                   # Host do banco (db para Docker)
DATABASE_PORT=5432                 # Porta do banco
ALLOWED_HOSTS=localhost,127.0.0.1  # Hosts permitidos
CORS_ALLOWED_ORIGINS=http://localhost:3000  # Origins CORS
JWT_SECRET_KEY=your-jwt-secret     # Chave JWT
```

## Documentação da API

Swagger UI: `http://localhost:8000/swagger/` (se configurado)

## Problemas Comuns

### Erro de conexão com banco de dados

- Verifique se o container do PostgreSQL está rodando: `docker-compose ps`
- Verifique as credenciais no `.env`
- Verifique os logs: `docker-compose logs db`

### Erro na migration

```bash
docker-compose exec web python manage.py migrate --fake-initial
```

### Resetar banco de dados

```bash
docker-compose down -v
docker-compose up -d
```

## Deploy em Produção

Para deploy em produção:

1. Mude `DEBUG=False` no `.env`
2. Gere novas chaves secretas
3. Configure `ALLOWED_HOSTS` apropriadamente
4. Use um servidor WSGI robusto (Gunicorn está configurado)
5. Configure HTTPS
6. Use um proxy reverso (Nginx)

## Contribuindo

1. Crie uma branch para sua feature
2. Commit suas mudanças
3. Push para a branch
4. Abra um Pull Request

## Licença

MIT
