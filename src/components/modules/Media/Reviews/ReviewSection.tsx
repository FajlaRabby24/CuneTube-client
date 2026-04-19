"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getUserInfo } from "@/services/Auth/getMe.service";
import {
  createReview,
  getMediaReviews,
} from "@/services/Review/review.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import ReviewCard from "./ReviewCard";

import { Skeleton } from "@/components/ui/skeleton";

interface ReviewSectionProps {
  mediaId: string;
}

const ReviewSection = ({ mediaId }: ReviewSectionProps) => {
  const queryClient = useQueryClient();
  const [hasSpoiler, setHasSpoiler] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", mediaId],
    queryFn: () => getMediaReviews(mediaId),
  });

  const mutation = useMutation({
    mutationFn: (data: {
      rating: number;
      content: string;
      hasSpoiler: boolean;
    }) => createReview(mediaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
      setHasSpoiler(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to post review");
    },
  });

  const handleReviewSubmit = async (data: {
    content: string;
    rating?: number;
  }) => {
    const user = await getUserInfo();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    if (!data.rating) {
      toast.error("Please provide a rating");
      return;
    }

    mutation.mutate({
      rating: data.rating,
      content: data.content,
      hasSpoiler,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 w-full py-4">
            <Skeleton className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-24 bg-white/5" />
                <Skeleton className="h-3 w-16 bg-white/5" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-white/5" />
                <Skeleton className="h-3 w-[80%] bg-white/5" />
              </div>
              <div className="flex gap-4 pt-1">
                <Skeleton className="h-4 w-12 rounded bg-white/5" />
                <Skeleton className="h-4 w-12 rounded bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const reviews = data?.data || [];
  console.log(reviews, "reviews");

  return (
    <section className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase font-outfit tracking-tighter">
            User Reviews
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            {reviews.length} total reviews verified by community
          </p>
        </div>
      </div>

      {/* Review Form */}
      <div className="space-y-3 pt-4 2xl:-mx-2">
        <div className="space-y-1 px-2">
          <h3 className="text-lg font-bold text-white">
            Rate this media
          </h3>
          <p className="text-[14px] text-slate-400">
            Share your thoughts and help others decide what to watch.
          </p>
        </div>

        <div className="px-2">
          <CommentForm
            onSubmit={handleReviewSubmit}
            showRating
            placeholder="What did you think of the story, acting, and visuals?"
            buttonText="Submit Review"
            ratingRightElement={
              <div className="flex items-center gap-2">
                <Checkbox
                  id="spoiler"
                  checked={hasSpoiler}
                  onCheckedChange={(checked) => setHasSpoiler(checked as boolean)}
                  className="border-white/20 data-[state=checked]:bg-primary h-4 w-4"
                />
                <Label
                  htmlFor="spoiler"
                  className="text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer"
                >
                  Contains Spoilers
                </Label>
              </div>
            }
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews?.length > 0 ? (
          reviews?.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
            <MessageSquareIcon className="size-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Be the first to share your experience with this title.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
