"use client";

import { cn } from "@/lib/utils";
import { getUserInfo } from "@/services/Auth/getMe.service";
import { createReply, likeComment } from "@/services/Comment/comment.service";
import { IComment } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import ReportDialog from "./ReportDialog";

interface CommentItemProps {
  comment: IComment;
  isReply?: boolean;
}

const CommentItem = ({
  comment: initialComment,
  isReply = false,
}: CommentItemProps) => {
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
      if (res?.success) {
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
      if (res?.success) {
        toast.success("Reply posted!");
        setComment((prev) => ({
          ...prev,
          replies: [res?.data],
        }));
        setIsReplying(false);
        setShowReplies(true);
      }
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  return (
    <div
      className={cn("group transition-all", isReply ? "ml-12 mt-2" : "py-2")}
    >
      <div className="flex gap-3">
        <div className="relative size-6 md:size-8 shrink-0 rounded-full overflow-hidden bg-slate-800 border border-white/5">
          {comment.user.image ? (
            <Image
              src={comment.user.image}
              alt={comment.user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-slate-800 text-slate-500 text-xs font-bold">
              {comment.user.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[13px]">
              @{comment.user.name.replace(/\s+/g, "").toLowerCase()}
            </span>
            <span className="text-[12px] text-slate-400">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="text-slate-200 text-[14px] mt-0.5 leading-relaxed break-words">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 pt-1.5">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              <HeartIcon
                className={cn(
                  "size-3.5",
                  comment.likesCount > 0 && "fill-white text-white",
                )}
              />
              {comment.likesCount > 0 && comment.likesCount}
            </button>

            {!isReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-[12px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                Reply
              </button>
            )}

            <button
              onClick={() => setIsReportOpen(true)}
              className="text-[12px] font-medium text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
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
