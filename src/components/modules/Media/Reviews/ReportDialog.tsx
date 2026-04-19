"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createReport } from "@/services/Report/report.service";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: "REVIEW" | "COMMENT";
}

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam" },
  { value: "SPOILER_WITHOUT_WARNING", label: "Spoiler without Warning" },
  { value: "HATE_SPEECH", label: "Hate Speech" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "MISINFORMATION", label: "Misinformation" },
  { value: "OTHER", label: "Other" },
];

const ReportDialog = ({ isOpen, onClose, targetId, targetType }: ReportDialogProps) => {
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        targetType,
        targetId,
        reason,
        description,
      };

      if (targetType === "REVIEW") {
        payload.reviewId = targetId;
      } else {
        payload.commentId = targetId;
      }

      const res = await createReport(payload);

      if (res.success) {
        toast.success("Report submitted successfully");
        onClose();
        setReason("");
        setDescription("");
      } else {
        toast.error(res.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Report error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase font-outfit">Report Content</DialogTitle>
          <DialogDescription className="text-slate-400">
            Why are you reporting this {targetType.toLowerCase()}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Reason</label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary h-12">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="focus:bg-primary focus:text-white">
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Description (Optional)</label>
            <Textarea
              placeholder="Provide more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 focus:ring-primary min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 text-white">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white hover:bg-white hover:text-primary transition-all font-black uppercase tracking-widest text-xs"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
