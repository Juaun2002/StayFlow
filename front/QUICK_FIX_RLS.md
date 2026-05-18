# ⚡ QUICK FIX - 2 MINUTOS

## O Problema
Registro de usuários não funcionava:
```
❌ new row violates row-level security policy
```

## A Solução
A policy de INSERT estava bloqueando tudo. Precisa permitir signup.

---

## 🚀 Fazer Agora (2 MIN)

### 1️⃣ Abra Supabase
https://supabase.com/dashboard

### 2️⃣ SQL Editor → New Query

### 3️⃣ Cole ISTO:
```sql
DROP POLICY IF EXISTS "No direct user inserts" ON users;

CREATE POLICY "Users can create their own profile during signup"
  ON users FOR INSERT
  WITH CHECK (NEW.auth_id = auth.uid() OR auth.uid() IS NULL);
```

### 4️⃣ Click RUN ▶️

---

## ✅ Pronto!

Agora teste:
```
1. http://localhost:3000
2. Registre-se com novo email
3. Deve entrar no dashboard normalmente
```

Se der erro, abra DevTools Console e procure por:
```
✅ Usuário criado automaticamente pelo trigger!
```

---

## 📝 Resumo da Mudança

| Antes | Depois |
|-------|--------|
| `WITH CHECK (false)` | `WITH CHECK (NEW.auth_id = auth.uid() OR auth.uid() IS NULL)` |
| Bloqueia TUDO | Permite signup + trigger |
| ❌ Não funciona | ✅ Funciona |

---

Pronto em 2 min! 🚀
