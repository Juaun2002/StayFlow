"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import FloatingHeader from "../../components/FloatingHeader";
import FormInput from "../../components/FormInput";
import SubmitButton from "../../components/SubmitButton";
import ProtectedRoute from "../../components/ProtectedRoute";

function NewPropertyContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("0");
  const [bathrooms, setBathrooms] = useState("0");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [status, setStatus] = useState("available");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title) return setError("Título obrigatório");
    if (!address) return setError("Endereço obrigatório");
    if (!city) return setError("Cidade obrigatória");
    if (!state) return setError("Estado obrigatório");
    if (!price) return setError("Valor obrigatório");
    if (!area) return setError("Área obrigatória");

    setLoading(true);

    try {
      // Pega o usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setError("Você precisa estar autenticado");
        setLoading(false);
        return;
      }

      // Cria a propriedade no Supabase
      const { data, error: insertError } = await supabase
        .from("properties")
        .insert([
          {
            title,
            description,
            address,
            city,
            state,
            zip_code: zipCode,
            price: parseFloat(price),
            area: parseFloat(area),
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            property_type: propertyType,
            status,
            owner_id: user.id,
            image_url: null,
          },
        ])
        .select();

      if (insertError) {
        setError("Erro ao criar propriedade: " + insertError.message);
        setLoading(false);
        return;
      }

      // Redireciona para dashboard com sucesso
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar propriedade");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <FloatingHeader />

      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-[#191970] mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Cadastrar novo imóvel
        </motion.h1>

        <motion.p className="text-[#454545] mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Preencha as informações da propriedade. Todos os campos são obrigatórios.
        </motion.p>

        <motion.form
          className="bg-[#f5f5f5] rounded-2xl p-6 border border-[#ECEFF1] shadow-sm"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormInput 
                label="Título" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#191970] mb-2">
                Tipo de Propriedade
              </label>
              <select 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 text-[#191970] border border-[#ECEFF1] rounded-lg focus:outline-none focus:border-[#191970]"
              >
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="land">Terreno</option>
                <option value="commercial">Comercial</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <FormInput 
              label="Endereço" 
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <FormInput 
              label="Cidade" 
              type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              required 
            />
            <FormInput 
              label="Estado" 
              type="text" 
              value={state} 
              onChange={(e) => setState(e.target.value)} 
              maxLength={2}
              required 
            />
            <FormInput 
              label="CEP" 
              type="text" 
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <FormInput 
              label="Preço (R$)" 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
            <FormInput 
              label="Área (m²)" 
              type="number" 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              required 
            />
            <FormInput 
              label="Quartos" 
              type="number" 
              value={bedrooms} 
              onChange={(e) => setBedrooms(e.target.value)} 
            />
            <FormInput 
              label="Banheiros" 
              type="number" 
              value={bathrooms} 
              onChange={(e) => setBathrooms(e.target.value)} 
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-black mb-2">
              Descrição
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              rows={4}
            />
          </div>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <div className="mt-6">
            <SubmitButton type="submit" loading={loading} loadingText="Salvando..." submitText="Criar imóvel" />
          </div>
        </motion.form>
      </main>
    </div>
  );
}

export default function NewPropertyPage() {
  return (
    <ProtectedRoute>
      <NewPropertyContent />
    </ProtectedRoute>
  );
}
