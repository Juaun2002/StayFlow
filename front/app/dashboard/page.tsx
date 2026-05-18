"use client";

import { motion } from "framer-motion";
import FloatingHeader from "@/app/components/FloatingHeader";
import CircularChart from "@/app/components/CircularChart";
import PropertyCard from "@/app/components/PropertyCard";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useProperties } from "@/hooks/useAuth";

function DashboardContent() {
  const router = useRouter();
  const { properties, loading, error, refetch } = useProperties();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#191970] mx-auto mb-4"></div>
          <p className="text-[#454545]">Carregando propriedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center pt-20">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-4">Erro ao carregar</p>
          <p className="text-[#454545] mb-4">{error}</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#191970] text-[#f5f5f5] rounded hover:bg-[#0a0a50]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
  const availableCount = properties.filter(p => p.status === 'available').length;
  const rentedCount = properties.filter(p => p.status === 'rented').length;
  const averagePrice = properties.length > 0 ? totalValue / properties.length : 0;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <FloatingHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <motion.section
          className="px-6 py-12 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold text-[#191970] mb-4 tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-xl text-[#454545] max-w-2xl">
              Aqui você pode gerenciar todas as suas propriedades, acompanhar
              seu portfólio e administrar seus imóveis de forma simples e intuitiva.
            </p>
          </motion.div>
        </motion.section>

        {/* Estatísticas com Gráficos */}
        {properties.length > 0 && (
          <motion.section
            className="px-6 max-w-7xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.h2
              className="text-2xl font-bold text-[#191970] mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Desempenho do Portfólio
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <CircularChart
                title="Valor Total do Portfólio"
                value={totalValue}
                currency="R$"
                data={[
                  { name: "Valor Total", value: totalValue, color: "#191970" },
                ]}
                delay={0.4}
              />
              <CircularChart
                title="Status das Propriedades"
                value={properties.length}
                currency=""
                data={[
                  { name: "Disponíveis", value: availableCount, color: "#191970" },
                  { name: "Alugadas", value: rentedCount, color: "#ECEFF1" },
                ]}
                delay={0.6}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { label: "Total de Imóveis", value: properties.length.toString(), change: "Em seu portfólio" },
                { label: "Propriedades Disponíveis", value: availableCount.toString(), change: "Prontas para aluguel" },
                { label: "Valor Médio", value: `R$ ${averagePrice.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`, change: "Preço médio por imóvel" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-[#f5f5f5] rounded-2xl p-6 border border-[#ECEFF1] shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -5 }}
                >
                  <p className="text-[#454545] text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-[#191970] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#454545]">{stat.change}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Propriedades */}
        <motion.section
          className="px-6 max-w-7xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              className="text-2xl font-bold text-[#191970]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Seus imóveis
            </motion.h2>

            <div className="flex gap-3">
              <motion.button
                onClick={() => refetch()}
                className="px-4 py-3 bg-[#ECEFF1] text-[#191970] rounded-lg hover:bg-[#d8dde5] transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ↻ Recarregar
              </motion.button>
              <motion.button
                onClick={() => router.push("/properties/new")}
                className="flex items-center gap-2 px-6 py-3 bg-[#191970] text-[#f5f5f5] rounded-lg hover:bg-[#0a0a50] transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                Novo imóvel
              </motion.button>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#454545] mb-4 text-lg">Nenhuma propriedade cadastrada</p>
              <button 
                onClick={() => router.push("/properties/new")}
                className="px-6 py-3 bg-[#191970] text-[#f5f5f5] rounded-lg hover:bg-[#0a0a50]"
              >
                Adicionar Propriedade
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  address={property.address}
                  city={property.city}
                  price={property.price}
                  property_type={property.property_type}
                  area={property.area}
                  delay={0.5 + index * 0.1}
                  onEdit={(id) => router.push(`/properties/${id}/edit`)}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
