"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, PlayIcon, PlusIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { getYouTubeVideoId } from "@/lib/utils/getYoutubeVedioId";
import {
  getAllMedia,
  IMediasResponse,
} from "@/services/Media/getMedia.service";

const TrendingMovies = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["trending-media"],
    queryFn: () => getAllMedia("isTrending=true"),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-muted mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-video w-[300px] md:w-[450px] shrink-0 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  const trendingItems =
    (movies as unknown as { data: IMediasResponse[] })?.data || [];

  return (
    <section className="relative w-full bg-background py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl uppercase font-outfit">
              Trending <span className="text-primary italic">Now</span>
            </h2>
            <div className="h-1 w-12 bg-primary rounded-full" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="group hover:bg-transparent"
          >
            <Link
              href="/media?isTrending=true"
              className="flex items-center gap-1 font-semibold group-hover:text-primary transition-colors"
            >
              Explore All{" "}
              <ChevronRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="relative group/row">
          <Marquee pauseOnHover className="[--duration:60s] [--gap:1rem]">
            {trendingItems.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % trendingItems.length) * 0.1 }}
                className="relative aspect-video w-[300px] md:w-[450px] shrink-0 overflow-hidden rounded-xl group cursor-pointer"
              >
                <Link href={`/media/${media.id}`}>
                  <MagicCard
                    className="w-full h-full rounded-xl p-0"
                    gradientColor="#3b82f6"
                    gradientOpacity={0.4}
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(media?.youtubeStreamUrl)}/hqdefault.jpg`}
                      alt={media.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Glass Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-bold text-white text-base line-clamp-2 leading-tight">
                          {media.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs font-bold text-white/80">
                          <span className="flex items-center gap-1 font-outfit">
                            <StarIcon className="size-3 text-yellow-400 fill-yellow-400" />{" "}
                            {media.averageRating}
                          </span>
                          <span>•</span>
                          <span className="font-outfit">
                            {media.releaseYear}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="size-10 rounded-full"
                          >
                            <PlayIcon className="size-5 fill-current" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-10 rounded-full border-white/40 text-white hover:bg-white/10"
                          >
                            <PlusIcon className="size-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </MagicCard>
                </Link>

                {/* Rank Badge for first 5 */}
                {index < 5 && (
                  <div className="absolute -left-3 -bottom-6 text-8xl font-black text-white/30 select-none italic font-outfit pointer-events-none drop-shadow-2xl">
                    {index + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
