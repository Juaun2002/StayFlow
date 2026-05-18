# 👤 Solução: Salvar Usuários no Banco de Dados

## 🚨 Problema Encontrado

Quando o usuário fazia **login/registro**, o Supabase autenticava corretamente, mas **não salvava os dados do usuário na tabela `users` do banco de dados**.

```
❌ ANTES:
   Usuário faz registro → Supabase cria autenticação
   Mas → Nenhum registro na tabela `users` 📭
```

## ✅ Solução Implementada

### 1. **Arquivo SQL de Setup** 
- **Local**: `SUPABASE_USERS_SETUP.sql`
- **Contém**:
  - ✅ Criação da tabela `users`
  - ✅ Trigger automático para criar usuário na tabela
  - ✅ Row Level Security (RLS) policies
  - ✅ Índices para performance
  - ✅ Função para atualizar `updated_at`

### 2. **Novo Serviço: userService.ts**
- **Local**: `lib/userService.ts`
- **Funções**:
  - `saveUserProfile()` - Salva novo usuário
  - `getUserProfile()` - Busca perfil do usuário
  - `updateUserProfile()` - Atualiza dados do usuário
  - `deleteUserProfile()` - Deleta usuário completamente
  - `userExists()` - Verifica se usuário existe

### 3. **Novo Hook: useAuthWithProfile**
- **Local**: `hooks/useAuth.ts`
- **Retorna**: Usuário + Perfil do banco
- **Uso**: Em qualquer componente para acessar dados do usuário

### 4. **Modificação: page.tsx (Login)**
- Agora salva usuário no banco após `auth.signUp()`
- Registra tudo no console para debug

## 🔧 Como Implementar

### Passo 1: Executar SQL no Supabase

1. Abra o [Supabase Dashboard](https://supabase.com/dashboard/)
2. Vá para **SQL Editor**
3. Crie uma **new query**
4. Copie todo o conteúdo de `SUPABASE_USERS_SETUP.sql`
5. Clique em **Run** (ícone ▶️)

```sql
-- Isso vai:
-- ✅ Criar tabela `users`
-- ✅ Criar triggers automáticos
-- ✅ Configurar segurança (RLS)
```

### Passo 2: Verificar Tabela Criada

No Supabase Dashboard:
1. Vá para **Table Editor**
2. Procure por `users`
3. Você deve ver as colunas:
   - `id` (UUID)
   - `auth_id` (UUID, FK para auth.users)
   - `email`
   - `full_name`
   - `avatar_url`
   - `phone`
   - `cpf`
   - `created_at`
   - `updated_at`

### Passo 3: Testar Registro

```bash
1. Abra a aplicação
2. Faça registro com:
   - Nome: João Silva
   - Email: joao@example.com
   - Senha: 123456
3. Vai para o dashboard
4. Abra DevTools → Console
5. Veja as mensagens:
   ✅ Registro bem-sucedido!
   💾 Usuário salvo no banco de dados: {...}
```

### Passo 4: Verificar BD

No Supabase Dashboard:
1. **Table Editor** → `users`
2. Você verá o novo usuário com todos os dados

## 💻 Como Usar o userService

### Salvar Novo Usuário
```tsx
import { saveUserProfile } from '@/lib/userService'

const profile = await saveUserProfile(
  "joao@example.com",
  "João Silva"
)
```

### Buscar Perfil do Usuário Atual
```tsx
import { getUserProfile } from '@/lib/userService'

const profile = await getUserProfile()
if (profile) {
  console.log(profile.full_name) // "João Silva"
}
```

### Atualizar Perfil
```tsx
import { updateUserProfile } from '@/lib/userService'

const updated = await updateUserProfile({
  phone: "11999999999",
  avatar_url: "https://..."
})
```

## 🎣 Como Usar o Hook useAuthWithProfile

### Exemplo 1: Dashboard
```tsx
import { useAuthWithProfile } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user, profile, loading, error } = useAuthWithProfile()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h1>Bem-vindo, {profile?.full_name}!</h1>
      <p>Email: {profile?.email}</p>
    </div>
  )
}
```

### Exemplo 2: Mostrar Avatar
```tsx
export default function UserAvatar() {
  const { profile } = useAuthWithProfile()

  return (
    <img 
      src={profile?.avatar_url || '/default-avatar.png'} 
      alt={profile?.full_name}
    />
  )
}
```

## 🔐 Segurança Implementada

### Row Level Security (RLS)
```sql
-- Usuários só podem ver SEU perfil
SELECT * FROM users WHERE id = current_user_id()

-- Usuários só podem ATUALIZAR SEU perfil
UPDATE users SET ... WHERE id = current_user_id()
```

### Foreign Key Constraints
```sql
-- Se deletar auth.users → automaticamente deleta de users
ON DELETE CASCADE
```

### Trigger Automático
```sql
-- Quando cria novo usuário em auth.users
-- Automaticamente cria registro em users
handle_new_user() TRIGGER
```

## 📊 Estrutura da Tabela

```
users
├── id (UUID) - Primary Key
├── auth_id (UUID) - FK para auth.users
├── email (TEXT) - Unique
├── full_name (TEXT)
├── avatar_url (TEXT) - Opcional
├── phone (TEXT) - Opcional
├── cpf (TEXT) - Opcional
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🧪 Checklist de Verificação

- [ ] Executei SQL no Supabase
- [ ] Tabela `users` aparece em Table Editor
- [ ] Fiz um registro novo
- [ ] Usuário apareceu na tabela `users`
- [ ] `profile?.full_name` funciona no dashboard
- [ ] Logout funciona corretamente
- [ ] Posso atualizar perfil

## 🚀 Próximas Melhorias

1. **Página de Perfil**
   - Mostrar dados do usuário
   - Editar nome, phone, CPF
   - Upload de avatar

2. **Validação CPF**
   - Validar formato do CPF
   - Verificar duplicatas

3. **Confirmação de Email**
   - Enviar email de verificação
   - Marcar email como verificado

4. **Soft Delete**
   - Adicionar `deleted_at`
   - Usuários podem "desativar" conta

## 📝 Arquivos Criados/Modificados

**Criados:**
- ✅ `SUPABASE_USERS_SETUP.sql` - Setup do banco
- ✅ `lib/userService.ts` - Serviço de usuários
- ✅ Este documento

**Modificados:**
- ✅ `hooks/useAuth.ts` - Adicionado `useAuthWithProfile`
- ✅ `app/page.tsx` - Salva usuário após registro

## 🆘 Troubleshooting

### Erro: "permission denied for schema public"
- Solução: Verifique se está logado no Supabase como admin
- Ou: Execute SQL como um novo query (não em uma existente)

### Usuário não aparece no banco
- Verifique: O SQL executou sem erros?
- Verifique: O registro foi confirmado por email?
- Verifique: Pode ter erro no trigger

### Erro: "duplicate key value violates unique constraint"
- Solução: Email já existe
- Teste: Use outro email

---

**Status**: ✅ **IMPLEMENTADO**
**Data**: 05/05/2026
**Componentes**: 4 arquivos novos/modificados
