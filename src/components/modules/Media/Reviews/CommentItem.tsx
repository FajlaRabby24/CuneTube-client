"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon, MessageSquareIcon, FlagIcon, CornerDownRightIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IComment } from "@/types/review.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CommentForm from "./CommentForm";
import { createReply, likeComment } from "@/services/Comment/comment.service";
import { toast } from "sonner";
import ReportDialog from "./ReportDialog";
import { getUserInfo } from "@/services/Auth/getMe.service";

interface CommentItemProps {
  comment: IComment;
  isReply?: boolean;
}

const CommentItem = ({ comment: initialComment, isReply = false }: CommentItemProps) => {
  const [comment, setComment] = useState(initialComment);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleLike = async () => {
    try {
      const user = await getUserInfo();
      if (!user) {
        toast.error("Please login to like comments");
        return;
      }

      const res = await likeComment(comment.id);
      if (res.success) {
        setComment((prev) => ({
          ...prev,
          likesCount: res.data.likesCount,
        }));
      }
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  const handleReplySubmit = async (data: { content: string }) => {
    try {
      const user = await getUserInfo();
      if (!user) {
        toast.error("Please login to reply");
        return;
      }

      const res = await createReply(comment.id, data.content);
      if (res.success) {
        toast.success("Reply posted!");
        setComment((prev) => ({
          ...prev,
          replies: [res.data, ...(prev.replies || [])],
        }));
        setIsReplying(false);
        setShowReplies(true);
      }
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  return (
    <div className={cn("group transition-all", isReply ? "ml-12 mt-4" : "py-6 border-b border-white/5")}>
      <div className="flex gap-4">
        <div className="relative size-10 shrink-0 rounded-full overflow-hidden bg-slate-800 border border-white/5">
          {comment.user.image ? (
            <Image src={comment.user.image} alt={comment.user.name} fill className="object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold">
              {comment.user.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{comment.user.name}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>

          <div className="flex items-center gap-6 pt-1">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
            >
              <HeartIcon className={cn("size-4", comment.likesCount > 0 && "fill-primary text-primary")} />
              {comment.likesCount}
            </button>

            {!isReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors"
              >
                <MessageSquareIcon className="size-4" />
                Reply
              </button>
            )}

            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FlagIcon className="size-4" />
              Report
            </button>
          </div>

          {isReplying && (
            <div className="pt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                placeholder={`Reply to ${comment.user.name}...`}
                buttonText="Reply"
                autoFocus
              />
            </div>
          )}

          {/* Replies Section */}
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
              >
                <CornerDownRightIcon className="size-4" />
                {showReplies ? "Hide Replies" : `Show ${comment.replies.length} Replies`}
              </button>

              {showReplies && (
                <div className="space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} isReply />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={comment.id}
        targetType="COMMENT"
      />
    </div>
  );
};

export default CommentItem;
