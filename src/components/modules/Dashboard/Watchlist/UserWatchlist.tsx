"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Trash2,
  Tv,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getYouTubeVideoId } from "@/lib/utils/getYoutubeVedioId";
import {
  getUserWatchlist,
  IWatchlistItem,
  removeFromWatchlist,
} from "@/services/Dashboard/watchlist.service";

interface WatchlistProps {
  initialQueryString: string;
}

const UserWatchlist = ({ initialQueryString }: WatchlistProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;

  const queryParams = new URLSearchParams(initialQueryString);
  queryParams.set("page", String(page));

  const {
    data: watchlistData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-watchlist", page],
    queryFn: () => getUserWatchlist(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(newPage));
    router.push(`/dashboard/watchlist?${params.toString()}`);
  };

  const removeMutation = useMutation({
    mutationFn: (mediaId: string) => removeFromWatchlist(mediaId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Removed from watchlist");
        queryClient.invalidateQueries({ queryKey: ["user-watchlist"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to remove item"),
  });

  const handleRemove = (mediaId: string, title: string) => {
    Swal.fire({
      title: "Remove from Watchlist?",
      text: `Are you sure you want to remove "${title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
      background: "#0a0a0a",
      color: "#fff",
      customClass: {
        popup: "rounded-3xl border border-white/10",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeMutation.mutate(mediaId);
      }
    });
  };

  const items = watchlistData?.data || [];
  const meta = watchlistData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading && !watchlistData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/5">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/10" />
          <BookmarkIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 px-4 py-4">
      {/* Cinematic Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BookmarkIcon className="h-32 w-32" />
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-2">
          Personal Curator
        </p>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl text-center md:text-left">
              My Watchlist
            </h1>
            <p className="mt-2 max-w-md text-sm text-neutral-500">
              Your personalized collection of cinematic journeys. Track what to
              experience next.
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md min-w-[120px]">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest text-center">
                Saved Items
              </p>
              <p className="text-2xl font-black text-white italic text-center">
                {meta.total}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {items?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/5 bg-black/40 p-8 sm:p-16 backdrop-blur-2xl text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-neutral-600/10 text-neutral-500">
              <BookmarkIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
              Your Watchlist is Silent
            </h3>
            <p className="mt-2 mx-auto max-w-[300px] text-sm text-neutral-500 leading-relaxed uppercase font-bold text-[10px] tracking-wider">
              Once you bookmark cinematic masterpieces, they will manifest here.
            </p>
            <Button
              asChild
              className="mt-8 bg-white text-black hover:bg-neutral-200 transition-colors rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11 px-8"
            >
              <Link href="/media">Discover Content</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items?.map((item: IWatchlistItem, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col rounded-3xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-2xl transition-all hover:border-red-600/20 shadow-2xl"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {item.media?.youtubeStreamUrl ? (
                      <Image
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(item.media.youtubeStreamUrl)}/hqdefault.jpg`}
                        alt={item.media.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900">
                        <Film className="h-12 w-12 text-neutral-800" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                    {/* Content type Badge */}
                    <Badge className="absolute left-4 top-4 bg-black/60 text-white backdrop-blur-xl border-white/5 px-2.5 py-1 text-[9px] font-black tracking-widest uppercase italic border h-6">
                      {item.media.type === "MOVIE" ? (
                        <Film className="h-3 w-3 mr-1.5 inline text-red-600" />
                      ) : (
                        <Tv className="h-3 w-3 mr-1.5 inline text-blue-500" />
                      )}
                      {item.media.type}
                    </Badge>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button
                        asChild
                        size="sm"
                        className="w-[140px] bg-white text-black hover:bg-neutral-100 rounded-xl font-black uppercase text-[10px] tracking-widest italic h-10 shadow-xl"
                      >
                        <Link href={`/media/${item.media.id}`}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Intel
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-[140px] bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 rounded-xl font-black uppercase text-[10px] tracking-widest italic h-10 backdrop-blur-md transition-all shadow-xl"
                        onClick={() =>
                          handleRemove(item.mediaId, item.media.title)
                        }
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Discard
                      </Button>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 relative">
                    <h3 className="line-clamp-1 text-sm font-black italic text-white uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                      {item.media.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-600 uppercase tracking-widest italic">
                        <Calendar className="h-3 w-3" />
                        {item.media.releaseYear}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Cinematic Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-8 pt-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest italic order-2 sm:order-1">
              Stream Index {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                PREV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                NEXT
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWatchlist;
