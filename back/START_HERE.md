# 🚀 COMECE AGORA - Backend Django Completo

## ⏱️ Tempo Total: ~5 minutos

---

## 📋 Checklist de Inicialização

### ✅ Pré-requisitos

Você precisa de:
- [ ] Docker instalado
- [ ] Docker Compose instalado
- [ ] Porta 8000 disponível (ou mude em docker-compose.yml)
- [ ] Porta 5432 disponível (PostgreSQL)

### ✅ Começar

1. **Abra um terminal** na pasta `back/`

2. **Rode o script de inicialização:**

   ```bash
   # Linux/Mac
   bash init.sh

   # Windows
   init.bat
   ```

   OU manualmente:

   ```bash
   # Copie as variáveis de ambiente
   cp .env.example .env

   # Inicie os containers
   docker-compose up -d

   # Aguarde 10-15 segundos...
   ```

3. **Pronto! 🎉 Acesse:**
   - API: http://localhost:8000/api/v1
   - Admin: http://localhost:8000/admin
   - Login padrão: `admin` / `admin123456`

---

## 🧪 Testar a API

### Opção 1: Script Python (Recomendado)

```bash
python test_api.py
```

Executa 10 testes completos:
- ✅ Registrar usuário
- ✅ Login
- ✅ Criar propriedade
- ✅ Criar agendamento
- ✅ E mais...

### Opção 2: Curl

```bash
# Registrar
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "password2": "testpass123"
  }'

# Pegar token de resposta e usar em:
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:8000/api/v1/auth/me/
```

### Opção 3: Postman/Insomnia

1. Abra o app
2. Importe URL: `http://localhost:8000/api/v1/`
3. Siga os exemplos em [API_DOCS.md](API_DOCS.md)

---

## 📊 O que foi criado

### 🔐 Autenticação JWT
- Login/Register com email
- Tokens de acesso e refresh
- Perfil de usuário customizável

### 🏠 Propriedades
- CRUD completo
- Filtros avançados (cidade, tipo, preço)
- Busca por texto
- Paginação automática

### 📅 Agendamentos
- Criar reserva com datas
- Confirmar/cancelar
- Ver datas disponíveis
- Cálculo automático de preço

### 🛠️ Infraestrutura
- Docker + PostgreSQL
- Admin Django
- Migrations automáticas
- CORS para frontend

---

## 🔧 Comandos Úteis

### Com Make (recomendado)

```bash
make up              # Iniciar containers
make down            # Parar containers
make logs            # Ver logs em tempo real
make migrate         # Rodar migrations
make createsuperuser # Criar novo admin
make clean           # Limpar arquivos cache
help                 # Listar todos
```

### Docker direto

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f web

# Executar comando
docker-compose exec web python manage.py shell

# Parar
docker-compose down
```

### Desenvolvimento local

```bash
# Ambiente virtual
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate no Windows

# Instalar
pip install -r requirements.txt

# Migrations
python manage.py migrate

# Admin
python manage.py createsuperuser_if_not_exists

# Rodar
python manage.py runserver
```

---

## 📂 Estrutura Rápida

```
back/
├── core/              → Configurações Django
├── apps/
│   ├── users/         → Autenticação
│   ├── properties/    → Imóveis
│   └── bookings/      → Reservas
├── Dockerfile         → Container
├── docker-compose.yml → Orquestração
├── .env              → Variáveis (já criado!)
└── README.md         → Documentação
```

---

## 🔗 Integração com Frontend

Seu frontend Next.js já está pronto! Basta:

1. **Atualizar `.env.local` do frontend:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

2. **Consultar [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** para:
   - Como usar tokens JWT
   - Exemplos de integração
   - Tratamento de erro

---

## 🆘 Problemas?

### Erro: "Connection refused"

```bash
# Verifique se containers estão rodando
docker-compose ps

# Se não estão, inicie
docker-compose up -d
```

### Erro: "Port 8000 already in use"

```bash
# Use porta diferente
docker-compose up -d -p 8001:8000
```

### Erro: "Database connection failed"

```bash
# Aguarde banco inicializar (30-60 segundos)
docker-compose logs db

# Ou resete tudo
docker-compose down -v
docker-compose up -d
```

### Ver logs detalhados

```bash
docker-compose logs -f web    # Backend
docker-compose logs -f db     # Banco de dados
```

---

## 📚 Documentação Completa

- **[README.md](README.md)** - Visão geral
- **[QUICK_START.md](QUICK_START.md)** - Guia detalhado
- **[API_DOCS.md](API_DOCS.md)** - Documentação de endpoints
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Frontend
- **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - Mapa do projeto

---

## 🎯 Próximos Passos

### Imediato (5 min)
1. ✅ Iniciar backend com `docker-compose up`
2. ✅ Acessar admin em `http://localhost:8000/admin`
3. ✅ Rodar testes com `python test_api.py`

### Curto prazo (15 min)
1. Integrar frontend Next.js
2. Atualizar lib/api.ts
3. Testar fluxo de login/register

### Médio prazo (1h)
1. Criar dados de teste
2. Customizar modelos se necessário
3. Implementar features adicionais

### Longo prazo (Produção)
1. Mudar DEBUG=False
2. Nova SECRET_KEY
3. Mudar senha admin
4. Configurar HTTPS
5. Deploy em servidor

---

## 📝 Credenciais Padrão

```
Admin Django:
  URL: http://localhost:8000/admin
  Usuário: admin
  Senha: admin123456

Banco de Dados:
  Host: localhost:5432
  Usuário: aps_user
  Senha: aps_password
  Database: aps_db
```

⚠️ **MUDE TODAS AS SENHAS EM PRODUÇÃO!**

---

## 🎬 Vídeo Rápido (imaginário)

1. Abra terminal em `APS/back`
2. Execute `docker-compose up -d`
3. Aguarde 15 segundos
4. Acesse http://localhost:8000/admin
5. Veja "API rodando com sucesso! 🎉"

---

## ✨ Features

- ✅ Backend Django REST API 100% funcional
- ✅ PostgreSQL em Docker
- ✅ Autenticação JWT
- ✅ CRUD propriedades
- ✅ Sistema de reservas
- ✅ Admin Django
- ✅ CORS configurado
- ✅ Documentação completa
- ✅ Testes inclusos

---

## 🚀 Você está pronto!

```
████████████████████████████████████████ 100%

Backend Django completo e rodando! 🎉
Frontend pronto para integrar!
Sistema de imóveis ativo!
```

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Port em uso | `docker-compose up -p 8001:8000` |
| Banco não conecta | `docker-compose logs db` |
| Token expirado | Login novamente |
| CORS error | Verifique `CORS_ALLOWED_ORIGINS` |
| 404 endpoint | Verifique `NEXT_PUBLIC_API_URL` |

---

## 🎓 Para aprender mais

- Django: https://docs.djangoproject.com
- DRF: https://www.django-rest-framework.org
- JWT: https://django-rest-framework-simplejwt.readthedocs.io
- Docker: https://docs.docker.com

---

**Que a força esteja com você! 🚀**

Qualquer dúvida, consulte os arquivos de documentação ou ajuste conforme necessário!
