"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";
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
      const data = await login(email, password);
      console.log("✅ Login bem-sucedido!");
      console.log("🔐 Token JWT:", data.access);
      console.log("👤 Usuário:", data.user?.email);
      
      router.push("/dashboard");
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
      const data = await register(email, password, name);
      console.log("✅ Registro bem-sucedido!");
      console.log("👤 Novo usuário:", data.user?.email);
      console.log("🔐 Token JWT:", data.access);
      
      router.push("/dashboard");
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
