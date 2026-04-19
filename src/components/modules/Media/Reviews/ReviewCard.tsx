"use client";

import { cn } from "@/lib/utils";
import { getUserInfo } from "@/services/Auth/getMe.service";
import { likeReview } from "@/services/Review/review.service";
import { IReview } from "@/types/review.types";
import { formatDistanceToNow } from "date-fns";
import { FlagIcon, HeartIcon, MessageSquareIcon, StarIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import CommentSection from "./CommentSection";
import ReportDialog from "./ReportDialog";

interface ReviewCardProps {
  review: IReview;
}

const ReviewCard = ({ review: initialReview }: ReviewCardProps) => {
  const [review, setReview] = useState(initialReview);
  const [showComments, setShowComments] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleLike = async () => {
    try {
      const user = await getUserInfo();
      if (!user) {
        toast.error("Please login to like reviews");
        return;
      }

      const res = await likeReview(review.id);
      if (res?.success) {
        setReview((prev) => ({
          ...prev,
          likesCount: res?.data?.likesCount,
        }));
      }
    } catch (error) {
      toast.error("Failed to like review");
    }
  };

  return (
    <div className="group flex gap-4 w-full py-4 transition-all hover:bg-white/[0.02] rounded-xl px-2 -mx-2">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative size-10 rounded-full overflow-hidden bg-slate-800 border border-white/5">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-slate-800 text-slate-500 font-bold text-sm uppercase">
              {review.user.name[0]}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[13px] text-white">
            @{review.user.name.replace(/\s+/g, "").toLowerCase()}
          </span>
          <span className="text-[12px] text-slate-400">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1 ml-1 bg-white/5 px-2 py-0.5 rounded-full">
            <StarIcon className="size-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[11px] font-bold text-yellow-400">
              {review.rating}/10
            </span>
          </div>
        </div>

        {/* Action / Title space */}
        <div className="mt-1 space-y-1">
          {review.title && (
            <h3 className="text-sm font-bold text-white">
              {review.title}
            </h3>
          )}
          
          {review.hasSpoiler && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-red-400 bg-red-400/10 text-[10px] font-bold uppercase tracking-wider mb-1">
              Spoilers
            </div>
          )}
          <p className="text-[14px] text-slate-200 leading-relaxed break-words">
            {review.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-white transition-colors"
          >
            <HeartIcon
              className={cn(
                "size-4",
                review.likesCount > 0 && "fill-white text-white",
              )}
            />
            {review.likesCount > 0 && <span>{review.likesCount}</span>}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="text-[12px] font-medium text-slate-400 hover:text-white transition-colors"
          >
            Reply
          </button>
          
          {review.commentsCount > 0 && (
             <span className="text-[12px] text-slate-500">• {review.commentsCount} replies</span>
          )}

          <button
            onClick={() => setIsReportOpen(true)}
            className="text-[12px] font-medium text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            Report
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <CommentSection reviewId={review.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ReportDialog
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetId={review.id}
        targetType="REVIEW"
      />
    </div>
  );
};

export default ReviewCard;
