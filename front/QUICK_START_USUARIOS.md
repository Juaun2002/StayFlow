# ⚡ Quick Start - Ativar Salvamento de Usuários

## 📋 Resumo Rápido

**Problema**: Usuários não eram salvos no BD  
**Solução**: Executar SQL + código já implementado  
**Tempo**: 5 minutos ⏱️

---

## 🚀 Passo 1: Executar SQL (IMPORTANTE!)

### 1️⃣ Abra Supabase Dashboard
👉 https://supabase.com/dashboard/

### 2️⃣ Navegue até SQL Editor
```
Dashboard → SQL Editor → New Query
```

### 3️⃣ Copie TODO o conteúdo de:
```
front/SUPABASE_USERS_SETUP.sql
```

### 4️⃣ Cole no Supabase e clique RUN ▶️

✅ Se tudo correr bem, você verá:
```
✔ Database modified
```

---

## 🧪 Passo 2: Testar

### Teste 1️⃣ - Fazer Registro Novo
```
1. Abra http://localhost:3000
2. Clique "Registrar-se"
3. Preencha:
   Nome: "Seu Nome"
   Email: "seu.email@example.com"
   Senha: "123456"
4. Clique "Criar conta"
```

### Teste 2️⃣ - Verificar Console
```
Abra DevTools → Console
Você deve ver:
✅ Registro bem-sucedido!
👤 Novo usuário: seu.email@example.com
💾 Usuário salvo no banco de dados: {...}
```

### Teste 3️⃣ - Verificar Banco
```
1. Volta para Supabase Dashboard
2. Vai em: Table Editor → users
3. Clique em "users" table
4. ✅ Você deve ver seu usuário ali!
```

---

## 🎯 Verificação Final

### Checklist ✓
- [ ] SQL executou sem erros no Supabase
- [ ] Fiz um registro novo
- [ ] Vejo mensagens no console
- [ ] Usuário aparece na tabela `users` do Supabase
- [ ] Posso fazer login

---

## 🐛 Se Algo Não Funcionar

### ❌ Erro ao executar SQL
**Solução**: 
- Verifique se está logado no Supabase
- Tente em uma nova query em branco
- Copie o SQL novamente com cuidado

### ❌ Usuário não aparece no banco
**Solução**:
- Verifique se viu a mensagem "💾 Usuário salvo" no console
- Pode estar em uma aba diferente do Supabase (atualize F5)
- Verifique se está olhando na tabela correta (deve ser `users`)

### ❌ Erro "permission denied"
**Solução**:
- Você está logado no Supabase com admin rights?
- Tente logout/login novamente

---

## 📚 Documentação Completa

Para entender melhor:
👉 Leia: `front/USERS_DATABASE.md`

---

## ✨ Pronto!

Agora seus usuários serão salvos automaticamente! 🎉

**Quando usuário faz registro:**
```
1. auth.signUp() → Cria autenticação ✅
2. saveUserProfile() → Salva no BD ✅
3. Redireciona para dashboard ✅
```

**Dados salvos:**
- Email
- Nome completo
- Data de criação
- Data de atualização

---

**Próximas features:**
- [ ] Página de perfil para editar dados
- [ ] Upload de avatar
- [ ] Campo CPF validado
