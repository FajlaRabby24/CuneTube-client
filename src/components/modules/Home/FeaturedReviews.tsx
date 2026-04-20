"use client";

import { HeartIcon, QuoteIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    movieTitle: "The Dark Knight",
    user: {
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
    rating: 10,
    content:
      "A masterpiece of cinema. Heath Ledger's Joker is legendary. The pacing, the score, and the direction are all perfect.",
    likes: 245,
  },
  {
    id: 2,
    movieTitle: "Inception",
    user: {
      name: "Jane Smith",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
    rating: 9,
    content:
      "Mind-bending concept executed perfectly. The ending still leaves me thinking weeks later. Truly spectacular filmmaking.",
    likes: 189,
  },
  {
    id: 3,
    movieTitle: "Interstellar",
    user: {
      name: "Mike Wilson",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    },
    rating: 9,
    content:
      "Visually stunning and emotionally powerful. Hans Zimmer's score is a character of its own. A journey through space and time.",
    likes: 156,
  },
];

const FeaturedReviews = () => {
  return (
    <section className="w-full bg-slate-950 py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-white">
          <div className="space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              Audience Voice
            </Badge>
            <h2 className="text-3xl font-black md:text-5xl uppercase font-outfit tracking-tighter">
              What Fans Are <span className="text-primary italic">Saying</span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-sm">
            Discover trending reviews from our global community of move lovers
            and critics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group h-full"
            >
              <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10 group-hover:border-primary/30 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`size-4 ${i < review.rating / 2 ? "text-primary fill-primary" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                    <QuoteIcon className="size-8 text-white/10 group-hover:text-primary/20 transition-colors" />
                  </div>
                  <p className="text-slate-300 leading-relaxed italic text-lg line-clamp-4">
                    "{review.content}"
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="relative size-12 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                      <Image
                        src={review.user.avatar}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white font-outfit">
                        {review.user.name}
                      </h4>
                      <p className="text-xs text-primary font-bold uppercase tracking-widest line-clamp-1">
                        {review.movieTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-primary transition-colors text-xs font-bold">
                    <HeartIcon className="size-3 fill-current" />
                    {review.likes}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-colors ${className}`}
  >
    {children}
  </div>
);

export default FeaturedReviews;
