"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Timeout de segurança: se após 5 segundos ainda não carregou, assume que não há user
    const timeout = setTimeout(() => {
      if (!hasChecked) {
        setHasChecked(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [hasChecked]);

  useEffect(() => {
    // Uma vez que terminou de carregar, marca como verificado
    if (!loading) {
      setHasChecked(true);
    }
  }, [loading]);

  // Se não está logado E já terminou de carregar, redireciona
  useEffect(() => {
    if (hasChecked && !user && !loading) {
      console.warn("❌ Acesso negado - User não autenticado");
      router.replace("/");
    }
  }, [hasChecked, user, loading, router]);

  // Enquanto está carregando, mostra loading
  if (loading || !hasChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-black mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </motion.div>
      </div>
    );
  }

  // Se não há user após verificação, retorna blank (redirecionamento acontecendo)
  if (!user) {
    return <div className="min-h-screen bg-white" />;
  }

  // User autenticado - renderiza conteúdo
  return <>{children}</>;
}
