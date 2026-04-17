"use client";

import {
  CalendarIcon,
  ClockIcon,
  ExternalLinkIcon,
  PlusIcon,
  StarIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getYouTubeVideoId } from "@/lib/utils/getYoutubeVedioId";
import { getUserInfo } from "@/services/Auth/getMe.service";
import { IMediaResponse } from "@/services/Media/getMedia.service";
import { addToWatchlist } from "@/services/Watchlist/watchlist.service";

interface MediaDetailsProps {
  media: IMediaResponse;
}

const MediaDetails = ({ media }: MediaDetailsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoId = getYouTubeVideoId(media.youtubeStreamUrl);
  const router = useRouter();
  const pathname = usePathname();

  const handleAddToWatchlist = async () => {
    setIsSubmitting(true);
    try {
      const user = await getUserInfo();

      if (!user) {
        toast.error("Please login to add to watchlist");
        router.push(`/login?redirectPath=${pathname}`);
        return;
      }

      const res = await addToWatchlist(media.id);

      if (res.success) {
        toast.success("Added to watchlist successfully!");
      } else {
        toast.error(res.message || "Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Watchlist error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Hero Section with Backdrop / Player */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={media.title}
                fill
                priority
                className="object-cover opacity-40 blur-[2px]"
                onError={(e) => {
                  // Fallback if maxresdefault doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black"
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                title={media.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(false)}
                className="absolute top-6 right-6 size-12 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition-all z-40 border border-white/10"
              >
                <XIcon className="size-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Container */}
        <div className="container relative z-20 mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:block relative aspect-[2/3] w-64 shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-white/10"
            >
              <Image
                src={
                  `https://img.youtube.com/vi/${getYouTubeVideoId(media.youtubeStreamUrl)}/hqdefault.jpg` ||
                  "/placeholder-movie.jpg"
                }
                alt={media.title}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Meta Info */}
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap gap-2">
                {media.genres.map((g) => (
                  <Badge
                    key={g.id}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/5 uppercase tracking-widest text-[10px] font-black"
                  >
                    {g.genre}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-7xl font-black uppercase font-outfit tracking-tighter leading-none">
                {media.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-300">
                <div className="flex items-center gap-1.5 text-yellow-400">
                  <StarIcon className="size-5 fill-current" />
                  <span className="text-lg">
                    {media.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-500 text-xs">
                    ({media.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
                  <CalendarIcon className="size-4 text-primary" />
                  {media.releaseYear}
                </div>
                {media.duration > 0 && (
                  <div className="flex items-center gap-1.5 border-l border-white/10 pl-6">
                    <ClockIcon className="size-4 text-primary" />
                    {Math.floor(media.duration / 60)}h {media.duration % 60}m
                  </div>
                )}
                <Badge
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 px-2 py-0"
                >
                  {media.ageRating}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => setIsPlaying(true)}
                  className="h-14 px-8 rounded-2xl bg-primary text-white hover:bg-white hover:text-primary transition-all duration-300 font-black uppercase tracking-widest text-xs cursor-pointer"
                >
                  Watch Now
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToWatchlist}
                  disabled={isSubmitting}
                  className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  <PlusIcon className="mr-2 size-4" />{" "}
                  {isSubmitting ? "Adding..." : "Add to Watchlist"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid lg:grid-cols-3 gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Synopsis */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase font-outfit tracking-tight border-b border-white/5 pb-2">
              Synopsis
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              {media.synopsis}
            </p>
          </section>

          {/* Cast */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase font-outfit tracking-tight border-b border-white/5 pb-2">
              Top Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {media.castMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4 group">
                  <div className="relative size-14 shrink-0 rounded-full overflow-hidden bg-slate-800 border-2 border-white/5 group-hover:border-primary transition-colors">
                    {member.profileUrl ? (
                      <Image
                        src={member.profileUrl}
                        alt={member.actorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon className="size-full p-3 text-slate-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-primary transition-colors">
                      {member.actorName}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest line-clamp-1">
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Crew */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black uppercase font-outfit tracking-tight border-b border-white/5 pb-2">
              Directors
            </h2>
            <div className="flex gap-8">
              {media.directors.map((dir) => (
                <div key={dir.id} className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden bg-slate-800">
                    {dir.profileUrl && (
                      <Image
                        src={dir.profileUrl}
                        alt={dir.directorName}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-bold text-white font-outfit">
                    {dir.directorName}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-12">
          {/* Availability */}
          <section className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase font-outfit tracking-tight">
                Available On
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Official Streaming Platforms
              </p>
            </div>

            <div className="space-y-3">
              {media.platforms.map((p) => (
                <a
                  key={p.id}
                  href={p.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all duration-300 group"
                >
                  <span className="font-bold uppercase tracking-widest text-xs">
                    {p.platform}
                  </span>
                  <ExternalLinkIcon className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </section>

          {/* Quick Info */}
          <section className="space-y-6 px-4">
            <div className="border-l-2 border-primary pl-4 py-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                Language
              </h4>
              <p className="text-sm font-bold text-white uppercase">
                {media.language}
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                Country
              </h4>
              <p className="text-sm font-bold text-white uppercase">
                {media.country}
              </p>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
                View Count
              </h4>
              <p className="text-sm font-bold text-white uppercase tracking-widest">
                {media.totalViews.toLocaleString()} Views
              </p>
            </div>
          </section>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 px-4">
            {media.tags.map((t) => (
              <span
                key={t.id}
                className="text-xs text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                #{t.tag.name.toLowerCase().replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
