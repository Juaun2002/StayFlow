"use client";

import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  image_url?: string;
  property_type?: string;
  area?: number;
  delay?: number;
  onEdit?: (id: number) => void;
}

export default function PropertyCard({
  id,
  title,
  address,
  city,
  price,
  image_url,
  property_type,
  area,
  delay = 0,
  onEdit,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const location = `${address}, ${city}`;
  const propertyTypeLabel = {
    apartment: "Apartamento",
    house: "Casa",
    land: "Terreno",
    commercial: "Comercial",
  }[property_type as string] || "Propriedade";

  return (
    <motion.div
      className={`bg-[#f5f5f5] rounded-2xl overflow-hidden border border-[#ECEFF1] transition-all duration-500 ${
        isHovered
          ? "shadow-2xl shadow-[#191970]/20"
          : "shadow-sm hover:shadow-xl"
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={() => onEdit?.(id)}
      role="button"
      tabIndex={0}
    >
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-[#ECEFF1] to-[#191970]">
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#ECEFF1] to-[#191970]"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <motion.button
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={20}
            className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </motion.button>

        <motion.div
          className="absolute bottom-4 right-4 bg-[#191970] text-[#f5f5f5] px-3 py-1 rounded-full text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          Editar
        </motion.div>
      </div>

      <motion.div
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <motion.h3
              className="text-lg font-semibold text-black mb-1"
              whileHover={{ color: "#404040" }}
            >
              {title}
            </motion.h3>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              <p className="text-sm">{location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">
            {propertyTypeLabel}
          </span>
          {area && (
            <span className="text-xs text-gray-600">
              {area} m²
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <motion.p
            className="text-2xl font-bold text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            R${price.toLocaleString("pt-BR")}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
