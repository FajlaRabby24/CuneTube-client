"use client";

import { motion } from "motion/react";
import { AnimatedAuthBackground } from "./AnimatedAuthBackground";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ModernAuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ModernAuthLayout({
  children,
  title,
  description,
  className,
}: ModernAuthLayoutProps) {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10 overflow-x-hidden">
      <AnimatedAuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("relative z-10 w-full max-w-lg", className)}
      >
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-block text-4xl font-black text-red-600 hover:text-red-500 transition-colors font-outfit tracking-tighter uppercase"
          >
            CT
          </Link>
          {title && (
            <h1 className="mt-4 text-3xl font-black text-white font-outfit tracking-tight uppercase">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-2 text-slate-400 font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="relative group">
          {/* Card Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 blur shadow-[0_0_30px_rgba(229,9,20,0.3)]" />
          
          {/* Main Card */}
          <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
