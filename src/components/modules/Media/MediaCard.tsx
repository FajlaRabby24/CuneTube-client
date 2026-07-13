"use client";

import { PlayIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { MagicCard } from "@/components/ui/magic-card";
import { getYouTubeVideoId } from "@/lib/utils/getYoutubeVedioId";
import { IMediasResponse } from "@/services/Media/getMedia.service";

interface MediaCardProps {
  media: IMediasResponse;
  index: number;
  itemsLength: number;
}

const MediaCard = ({ media, index, itemsLength }: MediaCardProps) => {
  return (
    <motion.div
      key={media.id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % itemsLength) * 0.05 }}
      className="flex flex-col gap-3 rounded-2xl p-3 border border-white/5 bg-slate-900/40 backdrop-blur-md hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300 group"
    >
      {/* Aspect Video Image Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl cursor-pointer">
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Play overlay icon on image hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="p-3 rounded-full bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                <PlayIcon className="size-5 fill-current" />
              </div>
            </div>
          </MagicCard>
        </Link>
      </div>

      {/* Media Meta details at the bottom of the card */}
      <div className="px-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/media/${media.id}`} className="hover:text-red-500 transition-colors flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm sm:text-base truncate leading-tight uppercase font-outfit tracking-tight">
              {media.title}
            </h3>
          </Link>
          {media.pricingType === "PREMIUM" && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-600 text-white font-black uppercase tracking-wider shadow-[0_0_8px_rgba(234,88,12,0.3)] shrink-0">
              Premium
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1 font-outfit text-yellow-400">
            <StarIcon className="size-3 fill-current" /> {media.averageRating.toFixed(1)}
          </span>
          <span>•</span>
          <span className="font-outfit">{media.releaseYear}</span>
          <span>•</span>
          <span className="uppercase text-[10px] text-red-500/80">{media.type}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;
