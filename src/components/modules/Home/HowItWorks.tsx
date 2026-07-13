"use client";

import { motion } from "motion/react";
import { Search, Star, Bookmark, Tv } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";

const steps = [
  {
    id: "01",
    title: "Discover Movies",
    description: "Explore categories, search for your favorite media titles, and discover popular trending cinematic releases.",
    icon: Search,
    glowFrom: "#dc2626",
    glowTo: "#ea580c",
  },
  {
    id: "02",
    title: "Rate & Review",
    description: "Express your opinions. Rate releases out of five stars, write reviews, and share feedback with other users.",
    icon: Star,
    glowFrom: "#ea580c",
    glowTo: "#eab308",
  },
  {
    id: "03",
    title: "Build Watchlist",
    description: "Personalize your cinema queue. Save media titles to your watchlist so you never lose track of what to watch next.",
    icon: Bookmark,
    glowFrom: "#eab308",
    glowTo: "#10b981",
  },
  {
    id: "04",
    title: "Unlock & Stream",
    description: "Choose a subscription plan, unlock premium streams, and start watching movies instantly in high definition.",
    icon: Tv,
    glowFrom: "#10b981",
    glowTo: "#3b82f6",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full bg-slate-950 py-24 border-y border-white/5 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white uppercase">
            How It <span className="text-red-500">Works</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto font-medium">
            Get started on CineTube in four simple steps and unlock a world of cinema.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="flex"
              >
                <MagicCard
                  mode="orb"
                  glowFrom={step.glowFrom}
                  glowTo={step.glowTo}
                  className="w-full p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm flex flex-col justify-between hover:border-white/10 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Icon and Step number */}
                    <div className="flex items-center justify-between">
                      <div
                        className="p-3 rounded-xl text-white border"
                        style={{
                          backgroundColor: `${step.glowFrom}15`,
                          borderColor: `${step.glowFrom}30`,
                          color: step.glowFrom,
                        }}
                      >
                        <Icon className="size-5" />
                      </div>
                      <span
                        className="text-2xl font-black italic"
                        style={{
                          color: `${step.glowFrom}`,
                          opacity: 0.8,
                        }}
                      >
                        {step.id}
                      </span>
                    </div>

                    {/* Step Title & Description */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </MagicCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
