import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthContainerProps {
  isRegisterView: boolean;
  setIsRegisterView: (value: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  onLoginSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function AuthContainer({
  isRegisterView,
  setIsRegisterView,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  error,
  setError,
  loading,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthContainerProps) {
  return (
    <motion.div
      className="w-full p-8 rounded-3xl bg-[#f5f5f5] shadow-2xl shadow-[#191970]/10 overflow-hidden border border-[#ECEFF1]/50"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 0.18, 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      <motion.div
        animate={{
          rotateY: isRegisterView ? 180 : 0,
          height: isRegisterView ? 460 : 360,
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeInOut",
          type: "spring",
          stiffness: 150,
          damping: 20
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={onLoginSubmit}
          onRegisterClick={() => {
            setError("");
            setIsRegisterView(true);
          }}
        />

        <RegisterForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={onRegisterSubmit}
          onBackClick={() => {
            setError("");
            setIsRegisterView(false);
          }}
        />
      </motion.div>
    </motion.div>
  );
}
