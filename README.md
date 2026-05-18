# APS - Apartment/Property System

## ✅ Estrutura Implementada

### Frontend (Next.js) - `/front`
- ✅ Configurado para conectar com Supabase
- ✅ Dependência `@supabase/supabase-js` adicionada
- ✅ Cliente Supabase configurado (`lib/supabase.ts`)
- ✅ Tipos TypeScript definidos (`lib/types.ts`)
- ✅ Funções de API prontas (`lib/api.ts`)
- ✅ Hooks customizados (`hooks/useAuth.ts`)

### Backend - `/back`
- ❌ Django removido (substituído por Supabase)
- ✅ Instruções de setup do Supabase (`SUPABASE_SETUP.md`)
- ✅ Credenciais configuradas (`package.json` como referência)

---

## 🚀 Próximas Etapas

### 1️⃣ Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL do projeto e a chave anônima
4. Cole em `front/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

### 2️⃣ Criar Tabelas no Supabase
- Siga as instruções em `back/SUPABASE_SETUP.md`
- Execute os comandos SQL no editor do Supabase
- Configure RLS (Row Level Security)

### 3️⃣ Instalar Dependências do Frontend
```bash
cd front
npm install
# ou yarn install
```

### 4️⃣ Rodar o Frontend
```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## 📚 Como Usar a API

### Autenticação
```typescript
import { signIn, signUp, signOut } from '@/lib/api'

// Sign up
await signUp('user@example.com', 'password')

// Sign in
await signIn('user@example.com', 'password')

// Sign out
await signOut()
```

### Gerenciar Propriedades
```typescript
import { 
  getProperties, 
  getPropertyById, 
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties 
} from '@/lib/api'

// Listar todas
const properties = await getProperties()

// Filtrar
const filtered = await getProperties({
  city: 'São Paulo',
  property_type: 'apartment',
  minPrice: 100000,
  maxPrice: 500000
})

// Uma propriedade
const property = await getPropertyById(1)

// Criar
const newProperty = await createProperty({
  title: 'Apartamento 2 quartos',
  price: 250000,
  // ... outros campos
  owner_id: userId
})

// Atualizar
await updateProperty(1, { status: 'sold' })

// Deletar
await deleteProperty(1)

// Minhas propriedades
const myProps = await getUserProperties(userId)
```

### Upload de Imagens
```typescript
import { uploadPropertyImage } from '@/lib/api'

const file = new File([...], 'property.jpg')
const imageUrl = await uploadPropertyImage(file, propertyId)
```

### Usar Hooks
```typescript
'use client'

import { useAuth, useProperties } from '@/hooks'

export default function Page() {
  const { user, loading, error } = useAuth()
  const { properties, loading: loadingProps } = useProperties()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {user && <p>Bem-vindo, {user.email}!</p>}
      {properties.map(prop => (
        <div key={prop.id}>{prop.title}</div>
      ))}
    </div>
  )
}
```

---

## 📁 Estrutura Final

```
APS/
├── front/               # Next.js App
│   ├── app/            # Pages e components
│   ├── lib/            # Supabase client, types, API
│   ├── hooks/          # Custom React hooks
│   ├── .env.local      # Credenciais Supabase
│   └── package.json    # @supabase/supabase-js
│
└── back/               # Documentação do Supabase
    ├── SUPABASE_SETUP.md
    └── package.json    # Referência
```

---

## 🔑 Variáveis de Ambiente

### `.env.local` (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

> ⚠️ Estas chaves são públicas (NEXT_PUBLIC_), use RLS no Supabase para segurança

---

## 🛡️ Segurança

- **RLS ativado** nas tabelas (controle por usuário)
- **Auth integrado** (Supabase Auth)
- **Uploads seguro** via Storage do Supabase
- **Chave anônima** usada no frontend (está seguro com RLS)

---

## ✨ Recursos

- ✅ Autenticação com email/password
- ✅ CRUD de propriedades
- ✅ Filtros avançados
- ✅ Upload de imagens
- ✅ Real-time (subscriptions disponíveis)
- ✅ Já integrado com Next.js 16

Tá tudo pronto para começar! 🎉
