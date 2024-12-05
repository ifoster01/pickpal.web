"use client";

import { motion } from "framer-motion";

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Primary Gradient */}
      <motion.div
        className="absolute -inset-[100%] opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(var(--chart-1)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Gradient */}
      <motion.div
        className="absolute -inset-[100%] opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(var(--chart-2)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Accent Gradient */}
      <motion.div
        className="absolute -inset-[100%] opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(var(--chart-4)) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 360, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}