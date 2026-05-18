# 🚀 Próximas Etapas - Backend + Frontend Integrado

## ✅ O que foi Feito

### Backend Django
- ✅ API REST completa criada em `/back`
- ✅ Autenticação JWT implementada
- ✅ 3 apps: users, properties, bookings
- ✅ PostgreSQL com Docker
- ✅ CORS configurado para localhost:3000
- ✅ Admin Django customizado
- ✅ 23+ endpoints documentados

### Frontend Next.js
- ✅ Removido Supabase completamente
- ✅ Novo `api.ts` consumindo Django REST API
- ✅ JWT token management implementado
- ✅ Login/Register funcionais
- ✅ useAuth hook atualizado
- ✅ Componentes prontos para integração

---

## 🎯 Como Testar a Integração

### Passo 1: Iniciar Backend

```bash
# Terminal 1 - Backend
cd APS/back

# Opção A: Com Docker (Recomendado)
docker-compose up -d

# Opção B: Localmente
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

✅ Aguarde até ver: `Starting development server at http://127.0.0.1:8000/`

---

### Passo 2: Verificar Backend

```bash
# Testar API
curl http://localhost:8000/api/v1/properties/

# Acessar Admin
# URL: http://localhost:8000/admin
# User: admin
# Password: admin123456
```

---

### Passo 3: Instalar dependências do Frontend

```bash
# Terminal 2 - Frontend
cd APS/front

# Remover Supabase (já deve estar removido)
npm install

# Verificar se @supabase/supabase-js não está mais lá
npm list @supabase/supabase-js  # Deve dar erro (esperado)
```

---

### Passo 4: Configurar .env.local

**File: `front/.env.local`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_TOKEN_KEY=stayflow_token
```

✅ Salve o arquivo

---

### Passo 5: Iniciar Frontend

```bash
npm run dev

# Deve aparecer:
# ▲ Next.js 16.2.4
# ✓ Ready in 2.5s
```

✅ Abra http://localhost:3000

---

## 🧪 Testes Manual

### 1️⃣ Teste de Registro

```
1. Acesse http://localhost:3000
2. Clique em "Criar nova conta"
3. Preencha:
   - Nome: "João Silva"
   - Email: "joao@example.com"
   - Senha: "senha123"
4. Clique em "Registrar"

✅ Esperado:
   - Console mostra: "✅ Registro bem-sucedido!"
   - Token JWT é salvo
   - Redireciona para /dashboard
```

### 2️⃣ Teste de Login

```
1. Acesse http://localhost:3000
2. Preencha:
   - Email: "joao@example.com"
   - Senha: "senha123"
3. Clique em "Entrar"

✅ Esperado:
   - Console mostra: "✅ Login bem-sucedido!"
   - Mostra token JWT
   - Redireciona para /dashboard
```

### 3️⃣ Verificar Token no Browser

```javascript
// No console do browser (F12)
localStorage.getItem('stayflow_token')

// Deve retornar algo como:
// "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 4️⃣ Testar Logout

```
1. Clique no avatar no canto superior direito
2. Clique em "Sair"

✅ Esperado:
   - Token é removido do localStorage
   - Redireciona para /
   - localStorage.getItem('stayflow_token') retorna null
```

---

## 🔍 Verificação Técnica

### Backend Logs

```bash
# Ver logs do Docker
docker-compose logs -f web

# Procure por:
✅ "Migrations applied"
✅ "Startup" (Gunicorn)
✅ Nenhum erro de conexão PostgreSQL
```

### Frontend Logs

```javascript
// F12 > Console
// Procure por:
✅ "Login bem-sucedido!"
✅ "Token JWT: eyJ..."
✅ Nenhum erro 404 ou 500
```

### Network Tab (DevTools)

```
1. Abra DevTools (F12)
2. Vá em Network
3. Faça login
4. Verifique requisições:
   ✅ POST /api/v1/auth/login/ → 200 OK
   ✅ Authorization header: Bearer eyJ...
   ✅ Response contém: { access, refresh, user }
```

---

## 🚨 Troubleshooting

### Erro: "Connection refused at http://localhost:8000"

**Solução:**
```bash
# Verificar se backend está rodando
docker-compose ps

# Se não tiver:
docker-compose up -d

# Aguarde 10 segundos
sleep 10

# Teste:
curl http://localhost:8000/api/v1/properties/
```

### Erro: "CORS error"

**Solução:**
```python
# Verificar em back/core/settings.py:

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Erro: "401 Unauthorized"

**Solução:**
```javascript
// Token expirou ou não foi salvo
localStorage.clear()

// Faça login novamente
// Novo token será gerado
```

### Erro: "Module not found: @supabase/supabase-js"

**Solução:**
```bash
# Remover node_modules e reinstalar
rm -r node_modules package-lock.json
npm install

# Verificar que Supabase não está lá
npm list | grep -i supabase  # Deve estar vazio
```

---

## 📊 Verificação de Endpoints

### Test com Postman ou Insomnia

#### 1. Registrar

```
POST http://localhost:8000/api/v1/auth/register/

Body:
{
  "email": "test@example.com",
  "password": "test123456",
  "username": "testuser"
}

Response:
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "username": "testuser"
  }
}
```

#### 2. Login

```
POST http://localhost:8000/api/v1/auth/login/

Body:
{
  "email": "test@example.com",
  "password": "test123456"
}

Response:
{
  "access": "eyJ...",
  "refresh": "eyJ...",
  "user": { ... }
}
```

#### 3. Obter Perfil

```
GET http://localhost:8000/api/v1/auth/me/

Headers:
Authorization: Bearer eyJ...

Response:
{
  "id": 1,
  "email": "test@example.com",
  "username": "testuser",
  "role": "buyer",
  ...
}
```

---

## 📝 Próximos Desenvolvimentos

### Curto Prazo (Esta semana)
- [ ] Testar CRUD de propriedades
- [ ] Implementar upload de imagens
- [ ] Testar sistema de bookings
- [ ] Validação de formulários
- [ ] Error handling melhorado

### Médio Prazo (Próximas 2 semanas)
- [ ] Refresh token automático
- [ ] Permissões (dono/admin)
- [ ] Dashboard com dados reais
- [ ] Filtros e busca funcional
- [ ] Paginação

### Longo Prazo (Produção)
- [ ] SSL/HTTPS
- [ ] Domain próprio
- [ ] Email notifications
- [ ] Payment gateway (se necessário)
- [ ] Mobile responsiveness melhor

---

## 📞 Checklist Final

- [ ] Backend rodando em http://localhost:8000
- [ ] PostgreSQL conectado (docker-compose logs db)
- [ ] Admin acessível em http://localhost:8000/admin
- [ ] Frontend instalado sem erros
- [ ] `.env.local` configurado
- [ ] Frontend rodando em http://localhost:3000
- [ ] Teste de registro OK
- [ ] Teste de login OK
- [ ] Token salvo em localStorage
- [ ] Logout funcional
- [ ] Nenhum erro CORS
- [ ] Nenhum erro 404/500

---

## 🎉 Pronto!

Quando todos os itens do checklist estiverem feitos:

✅ **Seu projeto está 100% integrado!**

Backend + Frontend comunicando via API Django REST com JWT!

---

## 📚 Documentação Adicional

- [Backend Docs](../back/README.md)
- [API Docs](../back/API_DOCS.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Django Integration Guide](../back/INTEGRATION_GUIDE.md)

---

**Sucesso! 🚀**
