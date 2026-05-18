"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "./components/Header";
import AuthContainer from "./components/AuthContainer";

export default function Home() {
  const router = useRouter();
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email obrigatório");
    if (!password) return setError("Senha obrigatória");
    
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("✅ Autenticação bem-sucedida!");
        console.log("🔐 Token JWT:", data.session?.access_token);
        console.log("👤 Usuário:", data.user.email);
        
        // O trigger já criou o usuário na tabela users quando ele fez signup
        // Apenas redireciona para dashboard
        console.log("✅ Redirecionando para dashboard...");
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
      console.error("❌ Erro no login:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!name) return setError("Nome obrigatório");
    if (!email) return setError("Email obrigatório");
    if (!password) return setError("Senha obrigatória");
    if (password.length < 6) return setError("Senha deve ter no mínimo 6 caracteres");
    
    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("✅ Registro bem-sucedido!");
        console.log("👤 Novo usuário:", data.user.email);
        console.log("🔐 User ID:", data.user.id);
        
        // Verificar se já tem sessão ativa (se email confirmation está desabilitado)
        if (data.session) {
          console.log("✅ Sessão ativa imediatamente após signup!");
          
          // Aguardar o trigger criar o usuário na tabela users
          await new Promise(resolve => setTimeout(resolve, 1500));

          console.log("💾 Usuário criado automaticamente pelo trigger!");
          console.log("✅ Fluxo de registro completo! Redirecionando para dashboard...");
          
          await new Promise(resolve => setTimeout(resolve, 800));
          router.push("/dashboard");
        } else {
          // Se não tem sessão, significa que email confirmation está ativado
          console.warn("⚠️ Email confirmation ativado. User precisa confirmar email.");
          setError("✅ Conta criada! Verifique seu email para confirmar o cadastro.");
          setLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar");
      console.error("❌ Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <Header />
        <AuthContainer
          isRegisterView={isRegisterView}
          setIsRegisterView={setIsRegisterView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          error={error}
          setError={setError}
          loading={loading}
          onLoginSubmit={handleSubmit}
          onRegisterSubmit={handleRegister}
        />
      </motion.div>
    </main>
  );
}
