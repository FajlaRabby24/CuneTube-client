"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  AlertTriangleIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  EyeIcon, 
  MoreHorizontalIcon, 
  SearchIcon, 
  StarIcon, 
  ThumbsUpIcon, 
  ThumbsDownIcon,
  Trash2Icon, 
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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

import { getUserReviews, deleteUserReview, IReview } from "@/services/Dashboard/review.service";

interface ReviewsProps {
  initialQueryString: string;
}

const statusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
  if (status === "APPROVED")
    return (
      <Badge className="bg-green-500 text-white">
        <CheckCircle2Icon className="mr-1 size-3" />
        Approved
      </Badge>
    );
  if (status === "REJECTED")
    return (
      <Badge variant="destructive">
        <XCircleIcon className="mr-1 size-3" />
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-500 text-white">
      <ClockIcon className="mr-1 size-3" />
      Pending
    </Badge>
  );
};

const Reviews = ({ initialQueryString }: ReviewsProps) => {
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

  const { data: reviewsData, isLoading, refetch } = useQuery({
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
  const meta = reviewsData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Reviews</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your movie & show reviews
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reviews or media..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={status} onValueChange={(val) => handleFilterChange("status", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Media</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review: IReview) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {review.media.posterUrl && (
                          <div className="relative size-10 overflow-hidden rounded border shrink-0">
                            <Image
                              src={review.media.posterUrl}
                              alt={review.media.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <p className="max-w-[150px] truncate text-sm font-medium">
                          {review.media.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {review.title && (
                        <p className="truncate text-sm font-medium">{review.title}</p>
                      )}
                      <p className="truncate text-xs text-muted-foreground">
                        {review.content}
                      </p>
                      {review.hasSpoiler && (
                        <Badge variant="outline" className="mt-1 text-[10px] border-yellow-500 text-yellow-600">
                          Spoiler
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{review.rating}/10</span>
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(review.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(review)}>
                            <EyeIcon className="mr-2 size-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(review)}
                          >
                            <Trash2Icon className="mr-2 size-4" /> Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
              >
                Next
                <ChevronRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Full details for your review of {selectedReview?.media.title}</DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                {selectedReview.media.posterUrl && (
                  <div className="relative h-24 w-16 overflow-hidden rounded border shrink-0">
                    <Image
                      src={selectedReview.media.posterUrl}
                      alt={selectedReview.media.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold">{selectedReview.media.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{selectedReview.rating}/10</span>
                    </div>
                    {statusBadge(selectedReview.status)}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                {selectedReview.title && (
                  <h4 className="font-semibold">{selectedReview.title}</h4>
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedReview.content}
                </p>
                {selectedReview.hasSpoiler && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    <AlertTriangleIcon className="mr-1 size-3" /> Spoiler Warning
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUpIcon className="size-3" /> {selectedReview._count.likes} Likes
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDownIcon className="size-3" /> {selectedReview._count.comments} Comments
                </span>
              </div>

              {selectedReview.status === "REJECTED" && selectedReview.rejectedReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-950/30">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700 dark:text-red-400">{selectedReview.rejectedReason}</p>
                </div>
              )}

              <div className="text-[10px] text-muted-foreground italic">
                Submitted on {new Date(selectedReview.createdAt).toLocaleString()}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                   onClick={() => {
                    setIsDetailsOpen(false);
                    handleDelete(selectedReview);
                  }}
                >
                  <Trash2Icon className="mr-2 size-4" /> Delete Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Reviews;
