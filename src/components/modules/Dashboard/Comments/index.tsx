"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Edit3Icon,
  ExternalLinkIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ThumbsUpIcon,
  Trash2Icon
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";
import { deleteUserComment, getUserComments, IComment, updateUserComment } from "@/services/Dashboard/comment.service";

interface CommentsProps {
  initialQueryString: string;
}

const Comments = ({ initialQueryString }: CommentsProps) => {
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

  const { data: commentsData, isLoading, refetch } = useQuery({
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
    mutationFn: ({ id, content }: { id: string; content: string }) => updateUserComment(id, content),
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
  const meta = commentsData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Comments</h1>
            <p className="text-sm text-muted-foreground">
              Manage your discussions and replies
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search in your comments..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Media / Review</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-center">Activity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No comments found
                  </TableCell>
                </TableRow>
              ) : (
                comments.map((comment: IComment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="max-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <p className="truncate text-sm font-semibold">
                          {comment.review?.media.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground italic">
                          Re: {comment.review?.title || "Review"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="flex flex-col gap-1">
                        {comment.parentId && (
                          <Badge variant="secondary" className="w-fit text-[10px] py-0 h-4">
                            Reply
                          </Badge>
                        )}
                        <p className="text-sm line-clamp-2">{comment.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUpIcon className="size-3" /> {comment._count.likes}
                        </span>
                        {!comment.parentId && (
                          <span className="flex items-center gap-1">
                            <MessageCircleIcon className="size-3" /> {comment._count.replies}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/reviews/${comment.reviewId}`} target="_blank" className="flex items-center">
                              <ExternalLinkIcon className="mr-2 size-4" /> View Context
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(comment)}>
                            <Edit3Icon className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(comment)}
                          >
                            <Trash2Icon className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
              >
                Next
                <ChevronRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Update your response for {editingComment?.review?.media.title}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={5}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Comments;
