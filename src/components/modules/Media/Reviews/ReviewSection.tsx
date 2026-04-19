"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMediaReviews, createReview } from "@/services/Review/review.service";
import ReviewCard from "./ReviewCard";
import CommentForm from "./CommentForm";
import { getUserInfo } from "@/services/Auth/getMe.service";
import { MessageSquareIcon, StarIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    mutationFn: (data: { rating: number; content: string; hasSpoiler: boolean }) => 
      createReview(mediaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", mediaId] });
      toast.success("Review submitted! It will appear after moderation.");
      setHasSpoiler(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to post review");
    },
  });

  const handleReviewSubmit = async (data: { content: string; rating?: number }) => {
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
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2Icon className="size-12 animate-spin text-primary" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Reviews...</p>
      </div>
    );
  }

  const reviews = data?.data || [];

  return (
    <section className="space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
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
      <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black uppercase font-outfit tracking-tight">
            Rate this media
          </h3>
          <p className="text-slate-400 font-medium">
            Share your thoughts and help others decide what to watch.
          </p>
        </div>

        <div className="space-y-6">
          <CommentForm
            onSubmit={handleReviewSubmit}
            showRating
            placeholder="What did you think of the story, acting, and visuals?"
            buttonText="Submit Review"
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="spoiler" 
              checked={hasSpoiler} 
              onCheckedChange={(checked) => setHasSpoiler(checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-primary"
            />
            <Label 
              htmlFor="spoiler" 
              className="text-sm font-bold text-slate-400 uppercase tracking-widest cursor-pointer"
            >
              This review contains spoilers
            </Label>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
            <MessageSquareIcon className="size-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No reviews yet</h3>
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
