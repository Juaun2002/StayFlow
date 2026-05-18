# Quick Start Guide

## 🚀 Iniciar Rápido com Docker

### 1. Verificar pré-requisitos

```bash
# Verificar Docker
docker --version
docker-compose --version
```

### 2. Clonar/navegar para a pasta do projeto

```bash
cd APS/back
```

### 3. Iniciar os contêineres

```bash
# Opção 1: Com docker-compose direto
docker-compose up -d

# Opção 2: Com Make (recomendado)
make up
```

### 4. Verificar se está rodando

```bash
# Verificar containers
docker-compose ps

# Ver logs
docker-compose logs -f web
```

### 5. Acessar a API

- **API**: http://localhost:8000/api/v1
- **Admin**: http://localhost:8000/admin
  - Usuário: `admin`
  - Senha: `admin123456`

---

## 📝 Configuração Inicial

### Variáveis de Ambiente

O arquivo `.env` já está criado com valores padrão para desenvolvimento. Se precisar ajustar:

```bash
# Editar arquivo .env
# Linux/Mac:
vim .env

# Windows:
notepad .env
```

### Criar um novo usuário admin

```bash
docker-compose exec web python manage.py createsuperuser
```

### Executar migrations manualmente

```bash
docker-compose exec web python manage.py migrate
```

---

## 🧪 Testando a API

### Com curl:

```bash
# 1. Registrar usuário
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "password2": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'

# 2. Fazer login
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# 3. Usar token para acessar endpoint protegido
curl http://localhost:8000/api/v1/auth/me/ \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_AQUI"
```

### Com Postman/Insomnia:

1. Importe a collection: [API_DOCS.md](API_DOCS.md)
2. Configure a variável `base_url = http://localhost:8000/api/v1`
3. Comece pelos endpoints de auth

---

## 📦 Estrutura do Projeto

```
back/
├── apps/
│   ├── users/              ✅ Autenticação e usuários
│   ├── properties/         ✅ Gerenciamento de imóveis
│   └── bookings/           ✅ Sistema de reservas
├── core/
│   ├── settings.py         ✅ Configurações Django
│   ├── urls.py            ✅ URLs principais
│   └── wsgi.py            ✅ WSGI config
├── Dockerfile              ✅ Container
├── docker-compose.yml      ✅ Orquestração
├── requirements.txt        ✅ Dependências
├── .env                    ✅ Variáveis (não commitar!)
├── API_DOCS.md            📖 Documentação da API
├── INTEGRATION_GUIDE.md   📖 Guia de integração frontend
└── Makefile               🛠️ Comandos úteis
```

---

## 🔧 Comandos Úteis

### Com Make (recomendado)

```bash
make help              # Listar todos os comandos
make build             # Construir imagem
make up                # Iniciar containers
make down              # Parar containers
make logs              # Ver logs
make migrate           # Rodar migrations
make createsuperuser   # Criar admin
make clean             # Limpar cache
```

### Com docker-compose

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f web

# Executar comando
docker-compose exec web python manage.py <comando>

# Acessar banco de dados
docker-compose exec db psql -U aps_user -d aps_db
```

### Desenvolvimento Local (sem Docker)

```bash
# 1. Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Configurar .env
cp .env.example .env
# Editar .env e colocar DATABASE_HOST=localhost

# 4. Migrations
python manage.py migrate

# 5. Criar admin
python manage.py createsuperuser

# 6. Rodar servidor
python manage.py runserver
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao conectar com banco de dados

```bash
# Verificar se containers estão rodando
docker-compose ps

# Reiniciar
docker-compose restart db
```

### Erro: "Port 8000 is already in use"

```bash
# Usar porta diferente
docker-compose up -d -p 8001:8000

# Ou parar o que está usando porta 8000
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows
```

### Erro: "ModuleNotFoundError"

```bash
# Reinstalar dependências
docker-compose exec web pip install -r requirements.txt
```

### Resetar banco de dados completamente

```bash
docker-compose down -v
docker-compose up -d
# Aguarde alguns segundos...
docker-compose logs -f web  # Ver progresso das migrations
```

---

## 🔗 Integração Frontend

Ver [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) para detalhes de como conectar o Next.js ao backend.

Quick summary:

```env
# .env.local do frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 📊 Admin Django

Acesse em http://localhost:8000/admin:

- **Username**: admin
- **Password**: admin123456

Aqui você pode:
- Ver/criar/editar usuários
- Gerenciar propriedades
- Gerenciar bookings
- Configurar permissões

**⚠️ Mude a senha em produção!**

---

## 🚀 Deploy para Produção

Para deploy em produção:

1. Criar arquivo `.env.prod` com configurações de prod
2. Mudar `DEBUG=False`
3. Gerar novas chaves secretas
4. Configurar HTTPS
5. Usar proxy reverso (Nginx)
6. Configurar banco de dados em servidor separado
7. Usar gunicorn/uWSGI em produção

Consulte [README.md](README.md) para mais detalhes.

---

## 📞 Suporte

Para mais informações:

- [API_DOCS.md](API_DOCS.md) - Documentação completa da API
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Integração com frontend
- [README.md](README.md) - Visão geral do projeto
