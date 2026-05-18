"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

/**
 * Componente com animação de entrada elegante (fade + slide)
 */
export const FadeInUp = ({ children, delay = 0, duration = 0.5 }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de blur in (desfoque)
 */
export const BlurIn = ({ children, delay = 0, duration = 0.6 }: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(10px)" }}
    animate={{ opacity: 1, filter: "blur(0px)" }}
    transition={{ delay, duration, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de bounce elegante
 */
export const BounceIn = ({ children, delay = 0 }: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{
      delay,
      duration: 0.6,
      type: "spring",
      stiffness: 200,
      damping: 20,
    }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com efeito de glow no hover
 */
export const GlowHover = ({ children, className = "" }: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    whileHover={{
      boxShadow: "0 0 30px rgba(25, 25, 112, 0.4)",
    }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de stagger list
 */
export const StaggerContainer = ({ 
  children, 
  delay = 0,
  staggerDelay = 0.08 
}: {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
}) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Componente com animação de gradiente animado
 */
export const GradientText = ({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={`${className} animate-gradient`}
    style={{
      backgroundSize: "200% 200%",
      backgroundImage: "linear-gradient(45deg, #191970, #ECEFF1, #191970)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    }}
    transition={{ duration: 8, repeat: Infinity }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de scale no hover
 */
export const ScaleHover = ({ 
  children, 
  scale = 1.05,
  className = ""
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    whileHover={{ scale }}
    whileTap={{ scale: scale * 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de rotating spinner
 */
export const Spinner = ({ size = 24 }: { size?: number }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className="flex items-center justify-center"
  >
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        borderTop: "2px solid black",
        borderRight: "2px solid transparent",
      }}
    />
  </motion.div>
);

/**
 * Componente com animação de pulsação (glow pulse)
 */
export const PulseGlow = ({ 
  children,
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    animate={{
      opacity: [1, 0.6, 1],
      boxShadow: [
        "0 0 20px rgba(99, 102, 241, 0.3)",
        "0 0 40px rgba(99, 102, 241, 0.6)",
        "0 0 20px rgba(99, 102, 241, 0.3)",
      ],
    }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    {children}
  </motion.div>
);

/**
 * Componente com animação de float (flutuação)
 */
export const FloatingElement = ({ 
  children,
  className = "",
  duration = 3
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

/**
 * Componente wrapper para efeito de glass morphism
 */
export const GlassMorphism = ({ 
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={`glass-effect ${className}`}
    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);
