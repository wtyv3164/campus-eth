"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  isVisible?: boolean;
}

const NFTLogoAnimation = ({ isVisible = false }: PageTransitionProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme") as "light" | "dark";
    setTheme(currentTheme);
  }, []);

  const bgColor = theme === "dark" ? "var(--color-base-100)" : "var(--color-base-200)";

  const gradientFrom = theme === "dark" ? "var(--color-accent)" : "var(--color-primary)";
  const gradientTo = theme === "dark" ? "var(--color-primary)" : "var(--color-accent)";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: bgColor }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: [1, 1.03, 1],
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <motion.svg width="200" height="200" viewBox="0 0 41 49" fill="none">
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {[...Array(3)].map((_, i) => {
                  const paths = [
                    "M24.6207 2.49347L20.4872 0L0.798342 11.4399L20.3619 23.2893L26.5513 19.6333L19.3691 15.3217L31.6386 8.11129L27.5052 5.64786L15.0959 12.8339L11.0416 10.345L24.6207 2.49347Z",
                    "M14.8397 22.1843L20.2218 25.2901L20.2172 49L13.9377 45.1819L5.26708 27.7572V40.0909L0 36.9506V13.3829L5.52884 16.4393L14.8397 34.0137V22.1843Z",
                    "M41 13.5855L21.8212 24.8095V30.2702L28.5802 26.2771V44.1789L34.0468 41.0749V23.2559L40.9984 19.2223L41 13.5855Z",
                  ];
                  return (
                    <motion.path
                      key={i}
                      d={paths[i]}
                      stroke="url(#gradient)"
                      strokeWidth="0.6"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 1,
                      }}
                    />
                  );
                })}
              </motion.g>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="41" y2="49" gradientUnits="userSpaceOnUse">
                  <motion.stop
                    offset="0%"
                    animate={{ stopColor: [gradientFrom, gradientTo, gradientFrom] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.stop
                    offset="100%"
                    animate={{ stopColor: [gradientTo, gradientFrom, gradientTo] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </linearGradient>
              </defs>
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NFTLogoAnimation;
