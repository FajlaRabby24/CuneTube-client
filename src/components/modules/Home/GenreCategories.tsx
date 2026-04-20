"use client";

import {
  CompassIcon,
  FilmIcon,
  GhostIcon,
  HeartIcon,
  ZapIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const genres = [
  {
    name: "Action",
    icon: ZapIcon,
    color: "from-red-500/20 to-red-900/40",
    border: "border-red-500/50",
  },
  {
    name: "Sci-Fi",
    icon: CompassIcon,
    color: "from-blue-500/20 to-blue-900/40",
    border: "border-blue-500/50",
  },
  {
    name: "Comedy",
    icon: ZapIcon,
    color: "from-yellow-500/20 to-yellow-900/40",
    border: "border-yellow-500/50",
  },
  {
    name: "Horror",
    icon: GhostIcon,
    color: "from-purple-500/20 to-purple-900/40",
    border: "border-purple-500/50",
  },
  {
    name: "Romance",
    icon: HeartIcon,
    color: "from-pink-500/20 to-pink-900/40",
    border: "border-pink-500/50",
  },
  {
    name: "Drama",
    icon: FilmIcon,
    color: "from-emerald-500/20 to-emerald-900/40",
    border: "border-emerald-500/50",
  },
];

const GenreCategories = () => {
  return (
    <section className="w-full bg-slate-950 py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-30" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-black text-white md:text-4xl uppercase font-outfit tracking-tighter">
            Browse by <span className="text-primary italic">Genre</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Find exactly what you're looking for by exploring our curated
            collections across all categories.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {genres?.map((genre, index) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/media?searchTerm=${genre.name}`}
                  className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border ${genre.border} bg-gradient-to-b ${genre.color} backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]`}
                >
                  <div className="mb-4 p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon className="size-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-lg font-bold text-white uppercase tracking-wider font-outfit">
                    {genre.name}
                  </span>

                  {/* Hover Accent */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full mx-8 mb-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreCategories;
