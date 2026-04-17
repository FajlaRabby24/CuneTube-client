"use client";

import { PlayIcon, PlusIcon, StarIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index % itemsLength) * 0.1 }}
      className="relative aspect-video w-full overflow-hidden rounded-xl group cursor-pointer"
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
                <span className="font-outfit">{media.releaseYear}</span>
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
    </motion.div>
  );
};

export default MediaCard;
