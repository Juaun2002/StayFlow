import { motion } from "framer-motion";
import * as React from "react";

interface FormInputProps {
  label: string;
  type: "text" | "email" | "password" | "number";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  delay?: number;
  required?: boolean;
  maxLength?: number;
}

export default function FormInput({
  label,
  type,
  value,
  onChange,
  delay = 0,
  required = false,
  maxLength,
}: FormInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <motion.label
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="block mb-4"
    >
      <motion.span 
        className="block text-sm font-medium text-[#191970] mb-2"
        animate={{ color: isFocused ? "#ECEFF1" : "#191970" }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </motion.span>
      <motion.div
        className="relative"
        animate={{
          boxShadow: isFocused 
            ? "0 0 0 3px rgba(25, 25, 112, 0.05)" 
            : "0 0 0 0px rgba(25, 25, 112, 0)"
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="block w-full px-4 py-3 rounded-lg border-2 border-[#ECEFF1] text-[#191970] placeholder-[#ECEFF1] focus:outline-none transition-all duration-300 focus:border-[#191970] focus:scale-[1.01] hover:border-[#ECEFF1]"
          required={required}
        />
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#191970] to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.label>
  );
}
