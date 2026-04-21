"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Edit3Icon,
  MessageCircleIcon,
  SearchIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  deleteUserComment,
  getUserComments,
  IComment,
  updateUserComment,
} from "@/services/Dashboard/comment.service";

interface CommentsProps {
  initialQueryString: string;
}

const UserComments = ({ initialQueryString }: CommentsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) queryParams.set("searchTerm", debouncedSearch);
  queryParams.set("page", String(page));

  const {
    data: commentsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-comments", page, debouncedSearch],
    queryFn: () => getUserComments(queryParams.toString()),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(newPage));
    router.push(`/dashboard/comments?${params.toString()}`);
  };

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteUserComment(commentId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Comment deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["user-comments"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      updateUserComment(id, content),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Comment updated successfully");
        setIsEditOpen(false);
        queryClient.invalidateQueries({ queryKey: ["user-comments"] });
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Failed to update comment"),
  });

  const handleDelete = (comment: IComment) => {
    Swal.fire({
      title: "Delete Comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(comment.id);
      }
    });
  };

  const handleEdit = (comment: IComment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (editingComment && editContent.trim()) {
      updateMutation.mutate({ id: editingComment.id, content: editContent });
    }
  };

  const comments = commentsData?.data || [];
  const meta = commentsData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  if (isLoading && !commentsData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/5">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/10" />
          <MessageCircleIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cinematic Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-black/40 p-6 sm:p-8 backdrop-blur-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MessageCircleIcon className="h-32 w-32" />
        </div>
        <p className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase mb-2">
          Discussion Feed
        </p>
        <div className="relative z-10">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase sm:text-4xl">
            My Comments
          </h1>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            Manage your discussions, replies, and engage with the cinematic
            community.
          </p>
        </div>
      </motion.div>

      <div className="space-y-6 px-1 sm:px-4">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
            <input
              placeholder="Search comments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-9 w-full sm:w-[260px] rounded-xl border border-white/5 bg-black/20 pl-9 pr-3 text-[10px] font-black tracking-widest uppercase italic text-white placeholder:text-neutral-600 outline-none focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 transition-all"
            />
          </div>

          <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase italic">
            Records Detected: {meta.total}
          </p>
        </div>

        {/* Comments Table */}
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-black/40 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5">
                  <TableHead className="py-5 text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Media / Review
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Comment
                  </TableHead>
                  <TableHead className="text-center text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Activity
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Timestamp
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black tracking-widest text-neutral-500 uppercase px-6">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center opacity-30">
                        <MessageCircleIcon className="h-10 w-10 mb-2" />
                        <p className="text-xs font-black italic tracking-widest uppercase">
                          No Discussions Found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {comments.map((comment: IComment, i: number) => (
                      <motion.tr
                        key={comment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group border-white/5 hover:bg-white/[0.02] cursor-default"
                      >
                        <TableCell className="py-4 px-6 max-w-[200px]">
                          <div className="flex flex-col gap-1">
                            <p className="truncate text-sm font-bold text-white group-hover:text-red-500 transition-colors">
                              {comment.review?.media.title}
                            </p>
                            <p className="truncate text-[10px] text-neutral-600 italic">
                              Re: {comment.review?.title || "Review"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] px-6">
                          <div className="flex flex-col gap-1">
                            {comment.parentId && (
                              <Badge
                                variant="outline"
                                className="w-fit rounded-md border-blue-500/30 bg-blue-500/10 text-[8px] font-black tracking-widest text-blue-400 uppercase"
                              >
                                Reply
                              </Badge>
                            )}
                            <p className="text-xs text-neutral-300 line-clamp-2">
                              {comment.content}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUpIcon className="size-3" />
                              <span className="font-black text-white">
                                {comment._count.likes}
                              </span>
                            </span>
                            {!comment.parentId && (
                              <span className="flex items-center gap-1">
                                <MessageCircleIcon className="size-3" />
                                <span className="font-black text-white">
                                  {comment._count.replies}
                                </span>
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-neutral-500 italic px-6">
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(comment)}
                              className="h-8 w-8 rounded-xl bg-white/5 transition-all hover:bg-blue-600 hover:text-white"
                            >
                              <Edit3Icon className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(comment)}
                              className="h-8 w-8 rounded-xl bg-white/5 transition-all hover:bg-red-600 hover:text-white"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cinematic Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pb-8 pt-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest italic order-2 sm:order-1">
              Console Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                <ChevronLeft className="mr-1 h-3 w-3" />
                PREV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-xl border-white/5 bg-black/40 px-4 font-black uppercase tracking-widest text-[9px] italic hover:bg-red-600 hover:text-white"
              >
                NEXT
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md border-white/10 bg-neutral-950 p-0 text-white shadow-2xl overflow-hidden rounded-3xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-black p-8">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Edit3Icon className="h-32 w-32" />
            </div>

            <DialogHeader className="relative z-10 text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10">
                <Edit3Icon className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                Edit Comment
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black tracking-widest text-neutral-500 uppercase italic">
                RE: {editingComment?.review?.media.title}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                Your Response
              </p>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                className="w-full rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-neutral-200 placeholder:text-neutral-700 outline-none resize-none focus:border-red-600/40 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 bg-white text-black hover:bg-neutral-200 transition-colors rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11"
              >
                {updateMutation.isPending ? "Updating..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic h-11"
              >
                Cancel
              </Button>
            </div>

            <p className="text-center text-[8px] font-black text-neutral-800 uppercase tracking-[0.2em] pt-2 italic">
              Secure Encrypted Transmission • CineTube V2.0
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserComments;
