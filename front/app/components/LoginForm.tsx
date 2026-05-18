import { motion } from "framer-motion";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegisterClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onRegisterClick,
}: LoginFormProps) {
  return (
    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
      <motion.form 
        onSubmit={onSubmit} 
        className="h-full flex flex-col justify-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="m-0 mb-2 text-2xl font-bold text-[#191970]"
        >
          Bem-vindo de volta
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mb-6 text-sm text-[#454545]"
        >
          Entre para gerenciar seus imóveis
        </motion.p>

        <motion.div variants={itemVariants}>
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            delay={0}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            delay={0}
            required
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={onRegisterClick}
          variants={itemVariants}
          whileHover={{ opacity: 0.75, x: 2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full mb-4 px-0 py-2 bg-transparent text-[#454545] text-sm font-medium hover:text-[#191970] transition-colors relative"
        >
          Não tem conta? Criar uma
          <motion.div
            className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ECEFF1] to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        <motion.div variants={itemVariants}>
          <SubmitButton
            type="submit"
            loading={loading}
            loadingText="Entrando..."
            submitText="Entrar"
          />
        </motion.div>

        {error && (
          <motion.p 
            className="text-red-500 mt-4 text-sm font-medium"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            ⚠️ {error}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}
