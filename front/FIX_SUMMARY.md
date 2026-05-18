# ✅ SUPABASE FIX - COMPLETE SOLUTION

## 🔍 PROBLEMAS ENCONTRADOS

### 1. **Foreign Keys Apontando para `auth.users(id)` ❌**
A tabela `properties.owner_id` e `bookings.user_id` estavam referenciando `auth.users(id)`, que não é acessível por RLS.

**Erro:** `FOREIGN KEY VIOLATION`

**Solução:** Mudar para referenciar `users(auth_id)` que é a coluna UNIQUE que armazena o UUID do auth user.

### 2. **RLS Policy Insegura na Tabela `users` ❌**
```sql
WITH CHECK (auth_id = auth.uid() OR auth.uid() IS NULL);
```
Isso permitia qualquer um inserir com `auth_id = NULL`, criando registros órfãos.

**Solução:** Remover a condição `OR auth.uid() IS NULL`
```sql
WITH CHECK (auth_id = auth.uid());
```

### 3. **Falta de Triggers para `updated_at` ❌**
As tabelas `properties` e `bookings` não tinham triggers para auto-atualizar a coluna `updated_at`.

---

## 🛠️ CORREÇÕES APLICADAS

### ✅ SQL Corrigido
- **FK em `properties`:** `owner_id UUID NOT NULL REFERENCES users(auth_id)`
- **FK em `bookings`:** `user_id UUID NOT NULL REFERENCES users(auth_id)`
- **RLS Policy (`users`):** Removido `OR auth.uid() IS NULL`
- **Triggers:** Adicionados `update_properties_updated_at` e `update_bookings_updated_at`

---

## 📋 PASSO A PASSO PARA CORRIGIR

### **1. Limpar Banco de Dados (OPCIONAL - apenas se quer recomeçar)**
Se quer deletar tudo e recomeçar do zero:
```sql
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

### **2. Copiar o SQL Corrigido**
1. Abra o arquivo `SUPABASE_FINAL_SETUP.sql`
2. Copie TODO o conteúdo
3. Vá para [Supabase Dashboard](https://supabase.com/dashboard)
4. Selecione seu projeto
5. Vá para **SQL Editor**
6. Clique em **New Query**
7. Cole todo o SQL
8. Clique em **Run**

### **3. Verificar Sucesso**
Você vai ver:
```
✅ CREATE TABLE
✅ CREATE INDEX
✅ CREATE POLICY
✅ CREATE TRIGGER
```

---

## 🧪 TESTAR O FLUXO COMPLETO

### **1. Limpar Dados de Teste (Opcional)**
```bash
# No terminal, deletar usuários de teste
npm run clear-users  # Se você tem esse script
```

### **2. Testar Signup**
```
1. Ir para http://localhost:3000
2. Clicar em "Criar uma conta"
3. Preencher nome, email, senha
4. Clicar em "Criar conta"
5. Verificar console para erros
```

**Esperado:** Usuário criado com sucesso, redireciona para dashboard

### **3. Testar Criar Propriedade**
```
1. Fazer login
2. Ir para http://localhost:3000/properties/new
3. Preencher todos os campos
4. Clicar em "Criar propriedade"
5. Verificar console e Network tab
```

**Esperado:** Propriedade criada com `owner_id` = UUID do usuário

### **4. Verificar Banco de Dados**
No Supabase SQL Editor:
```sql
-- Ver usuários
SELECT id, auth_id, email FROM users;

-- Ver propriedades
SELECT id, title, owner_id FROM properties;

-- Ver se FK está funcionando
SELECT * FROM properties WHERE owner_id = 'YOUR_USER_UUID';
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO (AGORA CORRETO)

```
1. User faz signup
   ↓
2. Supabase cria auth.users(id = UUID)
   ↓
3. Trigger executa e insere em users(auth_id = UUID)
   ↓
4. User cria property com owner_id = auth.uid()
   ↓
5. RLS valida: SELECT * FROM properties WHERE owner_id = auth.uid()
   ✅ SUCESSO!
```

---

## 📝 ARQUIVOS ALTERADOS

| Arquivo | Alteração |
|---------|-----------|
| `SUPABASE_FINAL_SETUP.sql` | SQL corrigido com todas as FK e RLS |
| `SUPABASE_FULL_SETUP.sql` | (Mantém cópia antiga para referência) |

---

## ❓ PERGUNTAS COMUNS

**P: Por que mudar FK para `users(auth_id)`?**  
R: Porque `auth.users` não é acessível por RLS. A coluna `auth_id` é uma cópia do UUID do auth user na tabela `users` pública, e é UNIQUE, então pode ser FK.

**P: E se eu já criei properties/bookings?**  
R: Se ainda não tem dados de teste, é seguro deletar tudo e recomeçar. Se tem dados reais, você pode fazer uma migração manual, mas recomendo resetar.

**P: Qual é o `users.id`?**  
R: É um UUID gerado automaticamente. Não usamos no app porque queremos usar `users.auth_id` (que é o `auth.uid()`).

**P: Como sabe que funciona?**  
R: Teste o fluxo completo: signup → login → criar propriedade → verificar banco de dados

---

## 🚀 PRÓXIMOS PASSOS

- [ ] Executar SQL no Supabase
- [ ] Testar signup/login
- [ ] Testar criar propriedade
- [ ] Testar criar booking
- [ ] Verificar RLS com SQL queries

---

**Executado em:** 7 de maio de 2026  
**Status:** ✅ PRONTO PARA EXECUÇÃO
