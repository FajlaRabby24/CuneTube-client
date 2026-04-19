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
      if (res.success) {
        setReview((prev) => ({
          ...prev,
          likesCount: res.data.likesCount,
        }));
      }
    } catch (error) {
      toast.error("Failed to like review");
    }
  };

  return (
    <div className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-md transition-all hover:bg-white/[0.07] hover:border-white/20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* User Info & Rating */}
        <div className="w-full md:w-48 shrink-0 flex flex-col items-center md:items-start space-y-4">
          <div className="relative size-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/5 shadow-2xl">
            {review.user.image ? (
              <Image src={review.user.image} alt={review.user.name} fill className="object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center bg-slate-800 text-slate-500 font-black text-xl">
                {review.user.name[0]}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-white font-outfit uppercase tracking-tight line-clamp-1">
              {review.user.name}
            </h4>
            <div className="flex items-center gap-1.5 justify-center md:justify-start mt-1">
              <StarIcon className="size-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-black text-yellow-400 font-outfit">{review.rating}</span>
              <span className="text-slate-500 text-xs font-bold">/10</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              {review.title && (
                <h3 className="text-xl font-black uppercase font-outfit tracking-tight text-white">
                  {review.title}
                </h3>
              )}
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Posted {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>

            <button
              onClick={() => setIsReportOpen(true)}
              className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Report Review"
            >
              <FlagIcon className="size-4" />
            </button>
          </div>

          <div className="relative">
            {review.hasSpoiler && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                Contains Spoilers
              </div>
            )}
            <p className="text-slate-300 text-lg leading-relaxed font-medium">
              {review.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all group/btn"
            >
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-primary/20 group-hover/btn:scale-110 transition-all">
                <HeartIcon className={cn("size-5", review.likesCount > 0 && "fill-primary text-primary")} />
              </div>
              <span>{review.likesCount} Likes</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all group/btn"
            >
              <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/btn:bg-white/10 group-hover/btn:scale-110 transition-all">
                <MessageSquareIcon className="size-5" />
              </div>
              <span>{review.commentsCount} Comments</span>
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
