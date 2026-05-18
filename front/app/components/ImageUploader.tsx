"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  maxFiles?: number;
  onChange?: (files: File[]) => void;
}

export default function ImageUploader({ maxFiles = 2, onChange }: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  function handleFiles(fileList: FileList | null) {
    const selected = Array.from(fileList || []);
    const merged = [...files, ...selected].slice(0, maxFiles);
    setFiles(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
    onChange?.(merged);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function removeAt(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
    onChange?.(next);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="block text-sm font-medium text-[#191970] mb-3">
        Fotos ({files.length}/{maxFiles})
      </label>
      
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 transition-all duration-300 ${
          isDragActive
            ? "border-[#191970] bg-[#191970]/5"
            : "border-dashed border-[#ECEFF1] bg-[#ECEFF1]/50 hover:border-[#ECEFF1] hover:bg-[#ECEFF1]"
        }`}
        animate={{
          borderColor: isDragActive ? "#191970" : "#ECEFF1",
          backgroundColor: isDragActive ? "rgba(25, 25, 112, 0.05)" : "rgba(0, 0, 0, 0)"
        }}
      >
        <label className="block p-6 cursor-pointer">
          <motion.div
            className="flex flex-col items-center justify-center gap-2"
            animate={{ scale: isDragActive ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ y: isDragActive ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload 
                size={28} 
              className={isDragActive ? "text-[#191970]" : "text-[#ECEFF1]"}
              />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#191970]">
                Arraste fotos ou clique para selecionar
              </p>
              <p className="text-xs text-[#454545] mt-1">
                Até {maxFiles} imagens, PNG, JPG
              </p>
            </div>
          </motion.div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </motion.div>

      {previews.length > 0 && (
        <motion.div
          className="flex gap-3 mt-4 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {previews.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.05 * i,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#ECEFF1] bg-[#ECEFF1] shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={src} 
                  alt={`preview-${i}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <motion.button
                onClick={() => removeAt(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                aria-label="Remover foto"
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
