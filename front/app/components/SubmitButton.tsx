import { motion } from "framer-motion";

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  submitText: string;
  type: "submit" | "button";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function SubmitButton({
  loading,
  loadingText,
  submitText,
  type,
  onClick,
  disabled = false,
  className = "",
}: SubmitButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={loading ? undefined : { scale: 1.03, boxShadow: "0 8px 24px rgba(25, 25, 112, 0.2)" }}
      whileTap={loading ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`w-full px-3 py-3 mt-2 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-[#191970] to-[#0a0a50] text-[#f5f5f5] border-none focus:outline-none focus:ring-2 focus:ring-[#191970] focus:ring-offset-2 ${
        loading 
          ? "opacity-80 cursor-not-allowed shadow-lg" 
          : "hover:shadow-xl hover:shadow-[#191970]/30"
      } ${className}`}
    >
      <motion.span 
        className="inline-flex items-center justify-center gap-3"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {loading && (
          <motion.span 
            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {loading ? loadingText : submitText}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
