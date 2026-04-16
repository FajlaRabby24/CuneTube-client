"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, PlayIcon, PlusIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getAllMedia,
  IMediasResponse,
} from "@/services/Media/getMedia.service";

const TrendingMovies = () => {
  const { data: movies, isLoading } = useQuery({
    queryKey: ["trending-media"],
    queryFn: () => getAllMedia("isTrending=true&limit=10"),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-muted mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-[2/3] w-[200px] shrink-0 animate-pulse rounded-xl bg-muted"
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
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {trendingItems.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-[2/3] w-[180px] md:w-[220px] shrink-0 snap-start overflow-hidden rounded-xl group cursor-pointer"
              >
                <Link href={`/movies/${media.slug}`}>
                  <Image
                    src={(media as any).posterUrl || "/placeholder-movie.jpg"}
                    alt={media.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-white text-sm line-clamp-2 leading-tight">
                        {media.title}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                        <span className="flex items-center gap-0.5">
                          <StarIcon className="size-2 text-yellow-400 fill-yellow-400" />{" "}
                          {media.averageRating}
                        </span>
                        <span>•</span>
                        <span>{media.releaseYear}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="size-8 rounded-full"
                        >
                          <PlayIcon className="size-4 fill-current" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8 rounded-full border-white/40 text-white hover:bg-white/10"
                        >
                          <PlusIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Rank Badge for first 5 */}
                {index < 5 && (
                  <div className="absolute -left-2 -bottom-4 text-7xl font-black text-white/20 select-none italic font-outfit pointer-events-none">
                    {index + 1}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
