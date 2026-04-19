"use client";

import { CheckCircle2, LayoutDashboard, Play } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Cinematic Background Glow */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-red-900/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 text-center backdrop-blur-2xl"
        >
          {/* Animated Icon Container */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-[0_0_30px_rgba(229,9,20,0.3)]">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-3 text-4xl font-black italic tracking-tighter text-white uppercase"
          >
            Payment Successful
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 text-lg text-neutral-400"
          >
            Your cinematic journey begins now. Your premium access has been
            successfully activated.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/media"
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-black transition-all hover:bg-neutral-200"
            >
              <Play className="h-5 w-5 fill-current" />
              Start Watching
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </motion.div>

          {/* Subtle decoration */}
          <div className="mt-8 border-t border-white/5 pt-6 text-sm text-neutral-600">
            Thank you for choosing CineTube &bull; Experience the Magic
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
