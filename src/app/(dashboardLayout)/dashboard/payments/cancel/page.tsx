"use client";

import { motion } from "motion/react";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

const CancelPage = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="relative w-full max-w-lg">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-neutral-800/10 blur-3xl" />

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
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6 flex justify-center"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 shadow-xl">
              <XCircle className="h-10 w-10 text-neutral-400" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-3 text-3xl font-bold tracking-tight text-white"
          >
            Payment Cancelled
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 text-neutral-400"
          >
            The payment process was cancelled and no charges were made. If you
            had trouble with the payment, you can try again or contact us for
            help.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/pricing"
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-black transition-all hover:bg-neutral-200"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Homepage
            </Link>
          </motion.div>

          {/* Footer decoration */}
          <div className="mt-8 border-t border-white/5 pt-6 text-sm text-neutral-600">
            Need help? Contact our support team &bull; Available 24/7
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CancelPage;
