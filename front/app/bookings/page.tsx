"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FloatingHeader from "@/app/components/FloatingHeader";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Property {
  id: number;
  title: string;
  city: string;
  price: number;
}

interface Booking {
  id: number;
  property_id: number;
  start_date: string;
  end_date: string;
  is_monthly_rental: boolean;
  rental_duration_months?: number;
}

function BookingsContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 5)); // Maio/2026
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isMonthlyRental, setIsMonthlyRental] = useState(false);
  const [rentalMonths, setRentalMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carregar propriedades do usuário
  useEffect(() => {
    async function loadProperties() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("properties")
          .select("id, title, city, price")
          .eq("owner_id", user.id);

        if (error) throw error;
        if (data && data.length > 0) {
          setProperties(data);
          setSelectedProperty(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar propriedades");
      }
    }

    loadProperties();
  }, []);

  // Carregar bookings da propriedade selecionada
  useEffect(() => {
    async function loadBookings() {
      if (!selectedProperty) return;

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("property_id", selectedProperty.id);

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error("Erro ao carregar reservas:", err);
      }
    }

    loadBookings();
  }, [selectedProperty]);

  // Gera dias do mês
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateBooked = (day: number): boolean => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return bookings.some((booking) => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      return checkDate >= start && checkDate <= end;
    });
  };

  const isDateSelected = (day: number): boolean => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedDates.some(
      (d) => d.getDate() === day && d.getMonth() === currentDate.getMonth()
    );
  };

  const handleDayClick = (day: number) => {
    const clickDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (isDateBooked(day)) {
      setError("Essa data já está reservada");
      return;
    }

    setSelectedDates((prev) => {
      const exists = prev.find(
        (d) => d.getDate() === day && d.getMonth() === currentDate.getMonth()
      );
      if (exists) {
        return prev.filter(
          (d) => !(d.getDate() === day && d.getMonth() === currentDate.getMonth())
        );
      }
      return [...prev, clickDate];
    });
    setError("");
  };

  const handleSaveBooking = async () => {
    if (!selectedProperty) {
      setError("Selecione uma propriedade");
      return;
    }

    if (selectedDates.length === 0) {
      setError("Selecione pelo menos um dia");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Você precisa estar autenticado");
        setLoading(false);
        return;
      }

      const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
      const startDate = sortedDates[0];
      const endDate = sortedDates[sortedDates.length - 1];

      const { error: insertError } = await supabase.from("bookings").insert([
        {
          property_id: selectedProperty.id,
          user_id: user.id,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          is_monthly_rental: isMonthlyRental,
          rental_duration_months: isMonthlyRental ? rentalMonths : null,
          status: "booked",
        },
      ]);

      if (insertError) throw insertError;

      // Recarregar bookings
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("property_id", selectedProperty.id);
      setBookings(data || []);

      setSelectedDates([]);
      setIsMonthlyRental(false);
      setRentalMonths(1);
      alert("Reserva criada com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar reserva");
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextProperty = () => {
    const newIndex = (carouselIndex + 1) % properties.length;
    setCarouselIndex(newIndex);
    setSelectedProperty(properties[newIndex]);
  };

  const prevProperty = () => {
    const newIndex = (carouselIndex - 1 + properties.length) % properties.length;
    setCarouselIndex(newIndex);
    setSelectedProperty(properties[newIndex]);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <FloatingHeader />
        <main className="pt-20 px-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-[#454545] mb-4 text-lg">Nenhuma propriedade cadastrada</p>
            <p className="text-[#454545]">Crie uma propriedade para começar a gerenciar reservas</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <FloatingHeader />

      <main className="pt-20 px-6 max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-[#191970] mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Gerenciar Reservas
        </motion.h1>
        <p className="text-[#454545] mb-8">Marque os dias em que seus imóveis estão reservados ou alugados</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendário */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Header do Calendário */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-[#ECEFF1] rounded-lg transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-[#191970]">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-[#ECEFF1] rounded-lg transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-[#191970] py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && handleDayClick(day)}
                    disabled={!day || isDateBooked(day!)}
                    className={`
                      aspect-square rounded-lg font-medium text-sm transition
                      ${!day ? "bg-transparent" : ""}
                      ${day && isDateBooked(day) ? "bg-red-100 text-red-600 cursor-not-allowed" : ""}
                      ${day && isDateSelected(day) ? "bg-[#191970] text-[#f5f5f5]" : ""}
                      ${day && !isDateBooked(day) && !isDateSelected(day) ? "bg-[#ECEFF1] hover:bg-[#d8dde5] text-[#191970] cursor-pointer" : ""}"
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Legenda */}
              <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#191970] rounded"></div>
                  <span className="text-[#454545]">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span className="text-[#454545]">Já reservado</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carrossel de Propriedades e Opções */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="sticky top-24 space-y-6">
              {/* Carrossel */}
              <div className="bg-[#f5f5f5] border border-[#ECEFF1] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#191970] mb-4">Imóvel</h3>
                
                {selectedProperty && (
                  <div className="mb-4">
                    <div className="bg-[#ECEFF1] rounded-lg p-4 mb-4">
                      <p className="font-semibold text-[#191970] mb-1">{selectedProperty.title}</p>
                      <p className="text-sm text-[#191970] mb-2">{selectedProperty.city}</p>
                      <p className="text-lg font-bold text-[#191970]">R$ {selectedProperty.price.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={prevProperty}
                    className="p-2 border border-[#ECEFF1] rounded-lg hover:bg-[#ECEFF1] transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextProperty}
                    className="p-2 border border-[#ECEFF1] rounded-lg hover:bg-[#ECEFF1] transition flex-1"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <p className="text-xs text-[#454545] text-center mt-2">
                  {carouselIndex + 1} de {properties.length}
                </p>
              </div>

              {/* Opções de Aluguel */}
              <div className="bg-[#f5f5f5] border border-[#ECEFF1] rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#191970] mb-4">Tipo de Aluguel</h3>

                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMonthlyRental}
                    onChange={(e) => setIsMonthlyRental(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#191970] font-medium">Aluguel Mensal</span>
                </label>

                {isMonthlyRental && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#191970] mb-2">
                      Duração do Contrato (meses)
                    </label>
                    <select
                      value={rentalMonths}
                      onChange={(e) => setRentalMonths(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-[#ECEFF1] rounded-lg text-[#191970] focus:outline-none focus:border-[#191970]"
                    >
                      {[1, 2, 3, 6, 12, 24].map((months) => (
                        <option key={months} value={months}>
                          {months} mês{months > 1 ? "es" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <motion.button
                  onClick={handleSaveBooking}
                  disabled={loading || selectedDates.length === 0}
                  className="w-full px-4 py-3 bg-[#191970] text-[#f5f5f5] rounded-lg font-medium hover:bg-[#0a0a50] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Salvando..." : "Criar Reserva"}
                </motion.button>

                {selectedDates.length > 0 && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    {selectedDates.length} dia{selectedDates.length > 1 ? "s" : ""} selecionado{selectedDates.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
