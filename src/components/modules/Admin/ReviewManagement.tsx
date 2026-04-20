"use client";

import { motion } from "motion/react";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  getAdminReviews,
  IAdminReview,
} from "@/services/Admin/getAdminReviews.service";
import {
  approveReview,
  deleteAdminReview,
  rejectReview,
} from "@/services/Admin/reviewActions.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  MoreHorizontalIcon,
  SearchIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";

import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface ReviewManagementProps {
  initialQueryString: string;
}

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Transmissions" },
  { value: "PENDING", label: "Pending Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

const statusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
  if (status === "APPROVED")
    return (
      <Badge className="bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
        <span className="h-1 w-1 rounded-full bg-emerald-400" />
        Approved
      </Badge>
    );
  if (status === "REJECTED")
    return (
      <Badge className="bg-red-600/20 text-red-400 ring-1 ring-red-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
        <span className="h-1 w-1 rounded-full bg-red-400" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit">
      <span className="h-1 w-1 rounded-full bg-yellow-400 animate-pulse" />
      Pending
    </Badge>
  );
};

const ReviewManagement = ({ initialQueryString }: ReviewManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";
  const statusFilter = searchParams.get("status") || "ALL";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedReview, setSelectedReview] = useState<IAdminReview | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const buildQueryParams = () => {
    const params = new URLSearchParams(initialQueryString);
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    if (statusFilter && statusFilter !== "ALL")
      params.set("status", statusFilter);
    params.set("page", String(page));
    return params;
  };

  const queryParams = buildQueryParams();

  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-reviews", page, debouncedSearch, statusFilter],
    queryFn: () => getAdminReviews(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = buildQueryParams();
    params.set("page", String(newPage));
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = buildQueryParams();
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    else params.delete("searchTerm");
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    const params = buildQueryParams();
    params.set("page", "1");
    if (value && value !== "ALL") params.set("status", value);
    else params.delete("status");
    router.push(`/admin/dashboard/review-management?${params.toString()}`);
  };

  const approveMutation = useMutation({
    mutationFn: (reviewId: string) => approveReview(reviewId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review approved successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to approve review"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason: string }) =>
      rejectReview(reviewId, reason),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review rejected");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to reject review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => deleteAdminReview(reviewId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review deleted");
        queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const handleApprove = (review: IAdminReview) => {
    Swal.fire({
      title: "Approve Review?",
      text: `Approve this review by ${review.user.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#22c55e",
    }).then((result) => {
      if (result.isConfirmed) {
        approveMutation.mutate(review.id);
      }
    });
  };

  const handleReject = (review: IAdminReview) => {
    Swal.fire({
      title: "Reject Review",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter the reason for rejecting this review...",
      inputAttributes: { "aria-label": "Rejection reason" },
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc2626",
      inputValidator: (value) => {
        if (!value || !value.trim()) return "Please provide a rejection reason";
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        rejectMutation.mutate({ reviewId: review.id, reason: result.value });
      }
    });
  };

  const handleDelete = (review: IAdminReview) => {
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

  const handleViewDetails = (review: IAdminReview) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  };

  const reviews = reviewsData?.data ?? [];
  const meta = reviewsData?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <StarIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
      {/* Cinematic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Review Intelligence
            </h1>
            <p className="text-neutral-500 font-medium tracking-wide">
              Monitor and moderate user review transmissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px] border-white/5 bg-white/5 text-white focus:border-red-600/40 focus:ring-0">
                <SelectValue placeholder="System State" />
              </SelectTrigger>
              <SelectContent className="border-white/5 bg-black/90 text-white backdrop-blur-xl">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="focus:bg-red-600/20 focus:text-red-400"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search transmissions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                className="pl-9 border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Operator / Media</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Transmission</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Signal Rating</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Operational Status</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Timestamp</TableHead>
              <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-neutral-500 font-bold uppercase tracking-widest text-xs"
                >
                  No review transmissions detected
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review: IAdminReview) => (
                <TableRow key={review.id} className="border-white/5 transition-colors hover:bg-white/5">
                  {/* User + Media */}
                  <TableCell className="min-w-[180px]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="size-7 overflow-hidden rounded-full bg-white/10 text-xs font-semibold flex items-center justify-center shrink-0">
                          {review.user.image ? (
                            <Image
                              src={review.user.image}
                              alt={review.user.name}
                              width={28}
                              height={28}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-white">{review.user.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-sm">{review.user.name}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                            {review.user.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.media.posterUrl && (
                          <Image
                            src={review.media.posterUrl}
                            alt={review.media.title}
                            width={24}
                            height={36}
                            className="rounded object-cover shrink-0"
                          />
                        )}
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 line-clamp-1">
                          {review.media.title}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Review Content */}
                  <TableCell className="max-w-[260px]">
                    {review.title && (
                      <p className="font-bold text-white text-sm mb-1 line-clamp-1">
                        {review.title}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 line-clamp-2 font-medium">
                      {review.content}
                    </p>
                    {review.hasSpoiler && (
                      <Badge className="mt-1 bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        <AlertTriangleIcon className="mr-1 size-3" />
                        Spoiler
                      </Badge>
                    )}
                  </TableCell>

                  {/* Rating */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-white text-sm">
                        {review.rating}
                        <span className="text-neutral-500">/10</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <span className="flex items-center gap-0.5">
                        <ThumbsUpIcon className="size-3" />
                        {review._count.likes}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <ThumbsDownIcon className="size-3" />
                        {review._count.comments}
                      </span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>{statusBadge(review.status)}</TableCell>

                  {/* Date */}
                  <TableCell className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 border-white/5 bg-black/90 p-1 text-white backdrop-blur-xl"
                      >
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 hover:text-red-600"
                          onClick={() => handleViewDetails(review)}
                        >
                          <EyeIcon className="size-4" />
                          Target Console
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        {review.status !== "APPROVED" && (
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-500"
                            onClick={() => handleApprove(review)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2Icon className="size-4" />
                            Approve Signal
                          </DropdownMenuItem>
                        )}
                        {review.status !== "REJECTED" && (
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-orange-600/20 text-orange-400 hover:text-orange-500"
                            onClick={() => handleReject(review)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircleIcon className="size-4" />
                            Reject Signal
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-red-600/20 text-red-400 hover:text-red-500"
                          onClick={() => handleDelete(review)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2Icon className="size-4" />
                          Purge Log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-white/5">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Logs
            </p>
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (meta.page > 1) handlePageChange(meta.page - 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page <= 1
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                         href="#"
                         onClick={(e) => {
                           e.preventDefault();
                           handlePageChange(pageNum);
                         }}
                         isActive={meta.page === pageNum}
                         className={`rounded-xl transition-all ${
                           meta.page === pageNum
                             ? "bg-red-600 text-white hover:bg-red-700 border-none"
                             : "bg-white/5 text-neutral-400 hover:bg-red-600/10 hover:text-red-600 border-white/5"
                         }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (meta.page < meta.totalPages)
                        handlePageChange(meta.page + 1);
                    }}
                    className={`rounded-xl border-white/5 bg-white/5 text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 ${
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-20"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      {/* Review Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Target Logistics
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-wide">
              Detailed intelligence on the review transmission.
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Reviewer Info */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Operator Origin</h4>
                <div className="flex items-start gap-4 mt-2">
                  <div className="size-12 overflow-hidden rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold shrink-0">
                    {selectedReview.user.image ? (
                      <Image
                        src={selectedReview.user.image}
                        alt={selectedReview.user.name}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-white">{selectedReview.user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm flex-1">
                    <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Name:</div>
                    <div className="font-bold text-white">{selectedReview.user.name}</div>
                    <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Transmission IP:</div>
                    <div className="font-bold text-neutral-300">{selectedReview.user.email}</div>
                    <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Status:</div>
                    <div>{statusBadge(selectedReview.status)}</div>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Target Media: <span className="text-blue-400">{selectedReview.media.title}</span>
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  {selectedReview.media.posterUrl && (
                    <Image
                      src={selectedReview.media.posterUrl}
                      alt={selectedReview.media.title}
                      width={40}
                      height={60}
                      className="rounded object-cover shrink-0"
                    />
                  )}
                  <div className="flex items-center gap-4">
                    <Badge className="bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <StarIcon className="size-3 fill-yellow-400" />
                      {selectedReview.rating}/10
                    </Badge>
                    {selectedReview.hasSpoiler && (
                      <Badge className="bg-yellow-600/20 text-yellow-400 ring-1 ring-yellow-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                        <AlertTriangleIcon className="mr-1 size-3" />
                        Spoiler
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Transmission Content</h4>
                <div className="mt-2 rounded-xl p-4 bg-black/40 border border-white/5 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 rounded-l-xl" />
                  {selectedReview.title && (
                    <p className="font-black text-sm mb-2 text-white">{selectedReview.title}</p>
                  )}
                  <p className="text-neutral-300 font-medium italic">
                    &quot;{selectedReview.content}&quot;
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Signal Likes</p>
                  <p className="text-2xl font-black text-white">{selectedReview._count.likes}</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Comm Threads</p>
                  <p className="text-2xl font-black text-white">{selectedReview._count.comments}</p>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedReview.status === "REJECTED" &&
                selectedReview.rejectedReason && (
                  <div className="grid gap-2 rounded-2xl border border-red-600/20 bg-red-600/5 p-6 backdrop-blur-sm">
                    <h4 className="text-xs font-black uppercase tracking-widest text-red-400">Rejection Intelligence</h4>
                    <div className="mt-2 rounded-xl bg-black/40 p-4 font-medium text-red-300 border border-red-600/20">
                      {selectedReview.rejectedReason}
                    </div>
                  </div>
                )}

              {/* Dates */}
              <div className="grid gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400">Operational Log</h4>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Logged At:</div>
                  <div className="font-bold text-neutral-300">
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </div>
                  {selectedReview.publishedAt && (
                    <>
                      <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Published At:</div>
                      <div className="font-bold text-neutral-300">
                        {new Date(selectedReview.publishedAt).toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-4">
                {selectedReview.status !== "APPROVED" && (
                  <Button
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleApprove(selectedReview);
                    }}
                    className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/20"
                  >
                    <CheckCircle2Icon className="mr-2 size-4" />
                    Approve Transmission
                  </Button>
                )}
                {selectedReview.status !== "REJECTED" && (
                  <Button
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleReject(selectedReview);
                    }}
                    className="bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-600/20"
                  >
                    <XCircleIcon className="mr-2 size-4" />
                    Reject Transmission
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleDelete(selectedReview);
                  }}
                  className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/20"
                >
                  <Trash2Icon className="mr-2 size-4" />
                  Purge Log
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewManagement;
