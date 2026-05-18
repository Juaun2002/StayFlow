"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface CircularChartProps {
  title: string;
  value: number;
  currency: string;
  data: Array<{ name: string; value: number; color: string }>;
  delay?: number;
}

export default function CircularChart({
  title,
  value,
  currency,
  data,
  delay = 0,
}: CircularChartProps) {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: delay + 0.5 + i * 0.05,
        duration: 0.4,
      },
    }),
  };

  return (
    <motion.div
      className={`bg-[#f5f5f5] rounded-3xl p-8 border border-[#ECEFF1] transition-all duration-500 cursor-pointer ${
        isHovered
          ? "shadow-2xl shadow-[#191970]/10"
          : "shadow-sm hover:shadow-lg"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="flex flex-col items-center justify-center">
        <motion.h3
          className="text-[#454545] text-sm font-semibold mb-6 uppercase tracking-widest"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          {title}
        </motion.h3>

        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={isHovered ? 1 : 0.8}
                    style={{ transition: "opacity 0.3s ease" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: delay + 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 150,
            damping: 20
          }}
        >
          <motion.p 
            className="text-4xl font-bold text-[#191970]"
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              color: isHovered ? "#ECEFF1" : "#191970"
            }}
            transition={{ duration: 0.3 }}
          >
            {currency}
            <span className="ml-2">
              {(value / 1000).toFixed(1)}
              <span className="text-2xl">k</span>
            </span>
          </motion.p>
          <motion.p 
            className="text-xs text-[#454545] mt-2 font-medium"
            animate={{ opacity: isHovered ? 0.7 : 0.6 }}
          >
            Este mês
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-8 w-full space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
        >
          {data.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-between text-sm hover:bg-[#ECEFF1] px-2 py-1 rounded-lg transition-colors"
              variants={itemVariants}
              custom={index}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <span className="text-[#191970] font-medium">{item.name}</span>
              </div>
              <motion.span 
                className="text-[#191970] font-bold"
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                  color: item.color
                }}
                transition={{ duration: 0.3 }}
              >
                {((item.value / value) * 100).toFixed(0)}%
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
