"use client";

import { motion } from "motion/react";

export function AnimatedAuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#020617]">
      {/* Morphing Mesh Gradients - RED Theme */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] size-[120%] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.25_25_/_0.3)_0%,transparent_70%)] blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[20%] -right-[10%] size-[120%] rounded-full bg-[radial-gradient(circle,oklch(0.5_0.2_20_/_0.2)_0%,transparent_70%)] blur-[120px]"
        />
      </div>

      {/* Cinematic Scanning Beams - RED */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          initial={{ x: "-100%", skewX: -20 }}
          animate={{ x: "200%" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 3,
          }}
          className="absolute top-0 h-full w-64 bg-gradient-to-r from-transparent via-red-600/10 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ x: "200%", skewX: 20 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 5,
          }}
          className="absolute top-0 h-full w-96 bg-gradient-to-r from-transparent via-red-900/10 to-transparent blur-[100px]"
        />
      </div>

      {/* Top Red Glow */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.6_0.25_25_/_0.1)_0%,transparent_70%)]" />

      {/* Grain / Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
