import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.1, 
        duration: 0.7,
        type: "spring",
        stiffness: 80,
        damping: 15
      }}
      className="mb-8 text-center"
    >
      <motion.p 
        className="script text-5xl md:text-6xl text-[#191970] leading-none font-bold"
        animate={{ 
          textShadow: [
            "0 0 0px rgba(25, 25, 112, 0)",
            "0 0 20px rgba(25, 25, 112, 0.3)",
            "0 0 0px rgba(25, 25, 112, 0)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        StayFlow
      </motion.p>
      <motion.p 
        className="mt-3 text-sm md:text-base text-[#454545] font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Gestão de Airbnb e hotelaria em um só lugar
      </motion.p>
      
      <motion.div
        className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-[#191970] to-transparent mx-auto w-24"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      />
    </motion.div>
  );
}
