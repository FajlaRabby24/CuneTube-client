"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronLeft,
  ChevronRight,
  ClockIcon,
  EyeIcon,
  Info,
  MessageSquare,
  SearchIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  deleteUserReview,
  getUserReviews,
  IReview,
} from "@/services/Dashboard/review.service";

interface ReviewsProps {
  initialQueryString: string;
}

const statusConfig = {
  APPROVED: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    icon: CheckCircle2Icon,
    border: "border-green-500/20",
    label: "Approved",
  },
  PENDING: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    icon: ClockIcon,
    border: "border-amber-500/20",
    label: "Pending",
  },
  REJECTED: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    icon: XCircleIcon,
    border: "border-red-500/20",
    label: "Rejected",
  },
};

const UserReviews = ({ initialQueryString }: ReviewsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const status = searchParams.get("status") || "ALL";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) queryParams.set("searchTerm", debouncedSearch);
  if (status !== "ALL") queryParams.set("status", status);
  queryParams.set("page", String(page));

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-reviews", page, debouncedSearch, status],
    queryFn: () => getUserReviews(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(newPage));
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set(key, value);
    params.set("page", "1");
    if (value === "ALL") {
      params.delete(key);
    }
    router.push(`/dashboard/reviews?${params.toString()}`);
  };

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteUserReview(reviewId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const handleDelete = (review: IReview) => {
    Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(review.id);
      }
    });
  };

  const handleViewDetails = (review: IReview) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  };

  const reviews = reviewsData?.data || [];
  const meta = reviewsData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading && !reviewsData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/5">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/10" />
          <MessageSquare className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cinematic Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageSquare className="h-32 w-32" />
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-2">
          Critic&apos;s Archive
        </p>
        <div className="relative z-10">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
            My Reviews
          </h1>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            Manage your cinematic critiques, track approval status, and curate
            your film journal.
          </p>
        </div>
      </motion.div>

      <div className="space-y-6 px-1 sm:px-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
              <input
                placeholder="Search reviews..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-9 w-full sm:w-[220px] rounded-xl border border-white/5 bg-black/20 pl-9 pr-3 text-[10px] font-black tracking-widest uppercase italic text-white placeholder:text-neutral-600 outline-none focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>

            <Select
              value={status}
              onValueChange={(val) => handleFilterChange("status", val)}
            >
              <SelectTrigger className="w-full sm:w-[160px] rounded-xl border-white/5 bg-black/20 text-[10px] font-black tracking-widest uppercase italic">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-white/5 bg-black/90 backdrop-blur-xl">
                <SelectItem
                  value="ALL"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="PENDING"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="APPROVED"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Approved
                </SelectItem>
                <SelectItem
                  value="REJECTED"
                  className="text-[10px] font-black tracking-widest uppercase"
                >
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase italic">
            Records Detected: {meta.total}
          </p>
        </div>

        {/* Review Table */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5">
                  <TableHead className="py-5 text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Media
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Review
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Rating
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    State
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Submitted
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <MessageSquare className="h-10 w-10 mb-2" />
                        <p className="text-xs font-black italic tracking-widest uppercase">
                          No Reviews Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {reviews.map((review: IReview, i: number) => {
                      const cfg =
                        statusConfig[
                          review.status as keyof typeof statusConfig
                        ] || statusConfig.PENDING;
                      return (
                        <motion.tr
                          key={review.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group border-white/5 hover:bg-white/[0.02] cursor-default"
                        >
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {review.media.posterUrl && (
                                <div className="relative size-10 overflow-hidden rounded-lg border border-white/10 shrink-0">
                                  <Image
                                    src={review.media.posterUrl}
                                    alt={review.media.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <p className="max-w-[150px] truncate text-sm font-bold text-white group-hover:text-red-500 transition-colors">
                                {review.media.title}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] px-6">
                            {review.title && (
                              <p className="truncate text-xs font-bold text-neutral-300">
                                {review.title}
                              </p>
                            )}
                            <p className="truncate text-[10px] text-neutral-600 mt-0.5">
                              {review.content}
                            </p>
                            {review.hasSpoiler && (
                              <Badge
                                variant="outline"
                                className="mt-1 rounded-md border-yellow-500/30 bg-yellow-500/10 text-[8px] font-black tracking-widest text-yellow-500 uppercase"
                              >
                                Spoiler
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6">
                            <div className="flex items-center gap-1.5">
                              <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-black text-white italic">
                                {review.rating}/10
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6">
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 border ${cfg.border} ${cfg.bg} ${cfg.color}`}
                            >
                              <cfg.icon className="h-3 w-3" />
                              <span className="text-[9px] font-black tracking-tight uppercase">
                                {cfg.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-[10px] font-bold text-neutral-500 italic px-6">
                            {new Date(review.createdAt).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(review)}
                              className="h-8 w-8 rounded-xl bg-white/5 transition-all hover:bg-red-600 hover:text-white"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cinematic Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-8">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest italic order-2 sm:order-1">
              Console Page {meta.page} of {meta.totalPages}
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

      {/* Cinematic Review Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md border-white/10 bg-neutral-950 p-0 text-white shadow-2xl overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-red-600/20 to-black p-8">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MessageSquare className="h-32 w-32" />
            </div>

            <DialogHeader className="relative z-10 text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10">
                <EyeIcon className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                Review Details
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black tracking-widest text-neutral-500 uppercase italic">
                CRITIQUE OF: {selectedReview?.media.title}
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedReview && (
            <div className="p-8 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
              {/* Media Info */}
              <div className="flex items-start gap-4 border-b border-white/5 pb-6">
                {selectedReview.media.posterUrl && (
                  <div className="relative h-24 w-16 overflow-hidden rounded-xl border border-white/10 shrink-0">
                    <Image
                      src={selectedReview.media.posterUrl}
                      alt={selectedReview.media.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-black italic text-white tracking-tight">
                    {selectedReview.media.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <StarIcon className="size-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-black text-white italic">
                        {selectedReview.rating}/10
                      </span>
                    </div>
                    {(() => {
                      const cfg =
                        statusConfig[
                          selectedReview.status as keyof typeof statusConfig
                        ] || statusConfig.PENDING;
                      return (
                        <div
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border ${cfg.border} ${cfg.bg} ${cfg.color}`}
                        >
                          <cfg.icon className="h-3 w-3" />
                          <span className="text-[9px] font-black tracking-tight uppercase">
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                  Review Content
                </p>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                  {selectedReview.title && (
                    <h4 className="text-sm font-bold text-neutral-200 mb-2">
                      {selectedReview.title}
                    </h4>
                  )}
                  <p className="text-xs text-neutral-400 whitespace-pre-wrap leading-relaxed">
                    {selectedReview.content}
                  </p>
                </div>
                {selectedReview.hasSpoiler && (
                  <Badge
                    variant="outline"
                    className="rounded-lg border-yellow-500/30 bg-yellow-500/10 text-[9px] font-black tracking-widest text-yellow-500 uppercase"
                  >
                    <AlertTriangleIcon className="mr-1 size-3" /> Spoiler
                    Warning
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <ThumbsUpIcon className="h-4 w-4 mx-auto text-neutral-500 mb-1" />
                  <p className="text-lg font-black text-white italic">
                    {selectedReview._count.likes}
                  </p>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    Likes
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <ThumbsDownIcon className="h-4 w-4 mx-auto text-neutral-500 mb-1" />
                  <p className="text-lg font-black text-white italic">
                    {selectedReview._count.comments}
                  </p>
                  <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                    Comments
                  </p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedReview.status === "REJECTED" &&
                selectedReview.rejectedReason && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2">
                      Rejection Reason
                    </p>
                    <p className="text-xs text-red-400">
                      {selectedReview.rejectedReason}
                    </p>
                  </div>
                )}

              {/* Footer */}
              <div className="text-[10px] font-bold text-neutral-600 italic">
                Submitted on{" "}
                {new Date(selectedReview.createdAt).toLocaleString()}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleDelete(selectedReview);
                  }}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" /> Delete Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11"
                >
                  Close
                </Button>
              </div>

              <p className="text-center text-[8px] font-black text-neutral-800 uppercase tracking-[0.2em] pt-2 italic">
                Secure Encrypted Transmission • CineTube V2.0
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;
