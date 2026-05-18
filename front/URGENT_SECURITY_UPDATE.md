# ⚡ UPDATE URGENTE - Segurança do RLS

## 🚨 Problema Crítico

Havia uma brecha de segurança no SQL:
```sql
❌ INSEGURO:
WITH CHECK (true);  ← Qualquer um pode inserir!
```

Isso permitia:
- Criar usuários fake sem registro
- Fazer login contornando o sistema
- Acessar dados sem autenticação

---

## ✅ Solução: Executar SQL Atualizado

### 📋 Passo 1: Limpar Políticas Antigas

No Supabase SQL Editor, execute:

```sql
-- Remover policies antigas (inseguras)
DROP POLICY IF EXISTS "System can insert users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
```

### 📋 Passo 2: Executar SQL Novo

Copie **TODO** o conteúdo de:
```
front/SUPABASE_USERS_SETUP.sql
```

E execute no Supabase (a partir da linha que começa com `-- 5. CRIAR POLICIES...`)

Ou, resumidamente, execute isto:

```sql
-- 5. CRIAR POLICIES DE SEGURANÇA (VERSÃO SEGURA)

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "No direct user inserts"
  ON users FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No user deletes"
  ON users FOR DELETE
  USING (false);
```

---

## 🧪 Teste Imediatamente

### ✅ Teste 1: Registro Normal
```
1. Vá para http://localhost:3000
2. Faça um registro novo
3. Deve funcionar normalmente
```

### ✅ Teste 2: Login Válido
```
1. Faça login com a conta que criou
2. Deve entrar no dashboard
3. Console deve mostrar:
   ✅ Autenticação bem-sucedida!
   ✅ Usuário verificado no banco de dados
```

### ❌ Teste 3: Login Inválido (Tenta Hackear)
```
1. Tente fazer login com email que não existe
2. OU tente com conta criada direto em auth.users
3. Deve retornar:
   ❌ Erro: Usuário não registrado corretamente
```

---

## 🔍 Verificar se Funcionou

### No Supabase Dashboard:

1. **Tabela users**
   - Deve ter seus usuários de teste

2. **Tentar INSERT direto**
   ```sql
   -- Tente fazer isso:
   INSERT INTO users (auth_id, email, full_name) 
   VALUES ('fake-uuid', 'hacker@evil.com', 'Hacker');
   
   -- Deve retornar:
   ERROR: new row violates row-level security policy
   ```

3. **Verificar Policies**
   - Table Editor → users → Policies
   - Deve ter 4 policies:
     - ✅ Users can view their own profile
     - ✅ Users can update their own profile
     - ✅ No direct user inserts
     - ✅ No user deletes

---

## 📝 Resumo das Mudanças

| Antes | Depois |
|-------|--------|
| `WITH CHECK (true)` | `WITH CHECK (false)` |
| Sem validação no login | Valida `userExists()` |
| Sem policy DELETE | DELETE bloqueado |
| Sem dupla validação UPDATE | UPDATE com USING + WITH CHECK |

---

## ⏰ Tempo Estimado
- Executar SQL: **2 min**
- Testar: **3 min**
- Total: **5 min**

---

## 🆘 Se Algo Deu Errado

### ❌ Erro: "policy already exists"
Solução: Execute o DROP no Passo 1 primeiro

### ❌ Usuários antigos não funcionam mais
Solução: Normal! Eles foram criados com a policy insegura. Crie novos.

### ❌ Login não funciona
Solução: 
1. Verifique se o usuário está na tabela `users`
2. Abra DevTools → Console
3. Procure por erros
4. Verifique se `userExists()` retorna true

---

**Status**: 🔴 **CRÍTICO - FAÇA AGORA**

Execute no Supabase em 5 minutos! 🚀
