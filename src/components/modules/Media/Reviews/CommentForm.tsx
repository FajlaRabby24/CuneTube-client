"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentFormProps {
  onSubmit: (data: { content: string; rating?: number }) => Promise<void>;
  placeholder?: string;
  showRating?: boolean;
  buttonText?: string;
  initialContent?: string;
  autoFocus?: boolean;
  ratingRightElement?: React.ReactNode;
}

const CommentForm = ({
  onSubmit,
  placeholder = "Write a comment...",
  showRating = false,
  buttonText = "Post",
  initialContent = "",
  autoFocus = false,
  ratingRightElement,
}: CommentFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (showRating && rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ content, rating: showRating ? rating : undefined });
      setContent("");
      setRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showRating && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-all hover:scale-110"
                >
                  <StarIcon
                    className={cn(
                      "size-5",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-slate-600 hover:text-yellow-500/50"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && <span className="text-sm font-bold text-yellow-500 ml-2 w-8">{rating}/10</span>}
          </div>
          {ratingRightElement && (
            <div>{ratingRightElement}</div>
          )}
        </div>
      )}

      <div className="relative group/input">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="bg-transparent border-0 border-b border-white/20 focus-visible:ring-0 focus-visible:border-white rounded-none px-0 py-2 min-h-[40px] text-sm text-white placeholder:text-slate-500 transition-all resize-none shadow-none"
        />
      </div>

      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim() || (showRating && rating === 0)}
          className="bg-primary text-black hover:bg-primary/90 transition-all font-bold text-xs h-9 px-4 rounded-full disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
