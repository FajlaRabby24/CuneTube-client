"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getReviewComments, createComment } from "@/services/Comment/comment.service";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { getUserInfo } from "@/services/Auth/getMe.service";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

interface CommentSectionProps {
  reviewId: string;
}

const CommentSection = ({ reviewId }: CommentSectionProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["comments", reviewId],
    queryFn: () => getReviewComments(reviewId),
  });

  const mutation = useMutation({
    mutationFn: (content: string) => createComment(reviewId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
      toast.success("Comment posted!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to post comment");
    },
  });

  const handleCommentSubmit = async (data: { content: string }) => {
    const user = await getUserInfo();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    mutation.mutate(data.content);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const comments = data?.data || [];

  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-white/5">
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Discussion ({comments.length})
        </h4>
        <CommentForm onSubmit={handleCommentSubmit} placeholder="Join the discussion..." />
      </div>

      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment: any) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center py-8 text-slate-500 text-sm font-medium">
            No comments yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
