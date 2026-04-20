"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, InfoIcon, PlayIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { getYouTubeVideoId } from "@/lib/utils/getYoutubeVedioId";
import {
  getAllMedia,
  IMediasResponse,
} from "@/services/Media/getMedia.service";

const TopRatedMovies = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["top-rated-media"],
    queryFn: () => getAllMedia("sortBy=averageRating&limit=10"),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-muted mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-video w-[300px] shrink-0 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  const topRatedItems =
    (movies as unknown as { data: IMediasResponse[] })?.data || [];

  return (
    <section className="w-full bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl uppercase font-outfit">
              Top Rated{" "}
              <span className="text-yellow-400 italic">Favorites</span>
            </h2>
            <div className="h-1 w-12 bg-yellow-400 rounded-full" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:text-yellow-400 hover:bg-white/5 group"
          >
            <Link
              href="/media?sortBy=averageRating"
              className="flex items-center gap-1 font-semibold transition-colors"
            >
              See Leaderboard{" "}
              <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="relative group/row">
          <Marquee
            pauseOnHover
            reverse
            className="[--duration:60s] [--gap:1.5rem]"
          >
            {topRatedItems.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-video w-[280px] md:w-[350px] shrink-0 overflow-hidden rounded-2xl group cursor-pointer border border-white/5 shadow-2xl"
              >
                <Link href={`/media/${media.id}`}>
                  <Image
                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(media.youtubeStreamUrl)}/hqdefault.jpg`} // In a real app we'd use backdropUrl
                    alt={media.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />

                  {/* Immersive Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-yellow-400 text-slate-950 font-black px-2 py-0 border-none rounded-md">
                        ★ {media.averageRating.toFixed(1)}
                      </Badge>
                      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                        {media.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-yellow-400 transition-colors">
                      {media.title}
                    </h3>

                    <div className="flex items-center gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white text-slate-950 hover:bg-yellow-400 transition-colors font-bold h-7 px-3"
                      >
                        <PlayIcon className="mr-1 size-3 fill-current" /> Watch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10 h-7 px-3 font-bold"
                      >
                        <InfoIcon className="mr-1 size-3" /> Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </Marquee>
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
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
  >
    {children}
  </div>
);

export default TopRatedMovies;
