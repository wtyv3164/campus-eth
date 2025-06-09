"use client";

import { motion } from "framer-motion";

export default function FancyLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-white text-4xl font-bold"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
      >
        🚀 加载中...
      </motion.div>
    </motion.div>
  );
}
