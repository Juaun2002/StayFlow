"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#f5f5f5]/70 shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 20
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          onClick={() => router.push("/dashboard")}
        >
          <motion.span 
            className="script text-3xl md:text-4xl text-[#191970] font-bold"
            animate={{ 
              textShadow: scrolled 
                ? "0 0 20px rgba(25, 25, 112, 0.1)" 
                : "0 0 0px rgba(25, 25, 112, 0)"
            }}
            transition={{ duration: 0.3 }}
          >
            StayFlow
          </motion.span>
        </motion.div>

        <motion.nav
          className="flex items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Imóveis", href: "/properties" },
            { label: "Reservas", href: "/bookings" }
          ].map((item, i) => (
            <motion.button
              key={i}
              onClick={() => router.push(item.href)}
              className="text-sm text-[#191970] hover:text-[#ECEFF1] transition-colors relative py-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#191970]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </motion.button>
          ))}
          
          <motion.div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="text-sm px-5 py-2.5 rounded-lg bg-[#191970] text-[#f5f5f5] hover:bg-[#0a0a50] transition-all shadow-lg flex items-center gap-2"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <User size={16} />
              Perfil
            </motion.button>

            {showProfileMenu && (
              <motion.div
                className="absolute right-0 mt-2 w-48 bg-[#f5f5f5] rounded-lg shadow-xl border border-[#ECEFF1] overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => {
                    router.push("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-[#191970] hover:bg-[#ECEFF1] flex items-center gap-2 transition-colors border-b border-[#ECEFF1]"
                  whileHover={{ x: 5 }}
                >
                  <User size={16} />
                  Meu Perfil
                </motion.button>

                <motion.button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <LogOut size={16} />
                  Sair da Conta
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.nav>
        
        {/* Fechar menu ao clicar fora */}
        {showProfileMenu && (
          <motion.div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
    </motion.header>
  );
}
