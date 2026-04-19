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
}

const CommentForm = ({
  onSubmit,
  placeholder = "Write a comment...",
  showRating = false,
  buttonText = "Post",
  initialContent = "",
  autoFocus = false,
}: CommentFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState<number>(0);
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
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rate It:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center transition-all border border-white/5",
                  rating >= star ? "bg-primary text-white border-primary" : "bg-white/5 text-slate-500 hover:bg-white/10"
                )}
              >
                {star}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="bg-white/5 border-white/10 focus:ring-primary min-h-[100px] rounded-2xl p-4 text-white placeholder:text-slate-500 transition-all resize-none font-medium"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim() || (showRating && rating === 0)}
          className="bg-primary text-white hover:bg-white hover:text-primary transition-all font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
