import { motion } from "framer-motion";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

interface RegisterFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackClick: () => void;
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

export default function RegisterForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onBackClick,
}: RegisterFormProps) {
  return (
    <div
      className="absolute inset-0"
      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
    >
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
          Criar nova conta
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="mb-6 text-sm text-[#454545]"
        >
          Abra sua conta para gerenciar Airbnb e hotelaria.
        </motion.p>

        <motion.div variants={itemVariants}>
          <FormInput
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormInput
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SubmitButton
            type="submit"
            loading={loading}
            loadingText="Criando..."
            submitText="Criar conta"
          />
        </motion.div>

        <motion.button
          type="button"
          onClick={onBackClick}
          variants={itemVariants}
          whileHover={{ opacity: 0.75, x: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mt-4 w-full text-sm text-[#454545] font-medium hover:text-[#191970] transition-colors relative py-2"
        >
          ← Voltar para login
          <motion.div
            className="absolute bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ECEFF1] to-transparent"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

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
