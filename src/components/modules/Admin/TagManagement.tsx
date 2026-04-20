"use client";

import { motion } from "motion/react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createTag,
  deleteTag,
  getAllTags,
  ITagResponse,
  updateTag,
} from "@/services/Admin/tags.service";

import {
  EditIcon,
  FilmIcon,
  MessagesSquareIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const TagManagement = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITagResponse | null>(null);

  const [createForm, setCreateForm] = useState({ name: "", slug: "" });
  const [editForm, setEditForm] = useState({ name: "", slug: "" });

  const { data: tags = [], isLoading } = useQuery<ITagResponse[]>({
    queryKey: ["admin-tags"],
    queryFn: () => getAllTags() as Promise<ITagResponse[]>,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; slug: string }) => createTag(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Tag created successfully");
        setIsCreateOpen(false);
        setCreateForm({ name: "", slug: "" });
        queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: () => toast.error("Failed to create tag"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      tagId,
      payload,
    }: {
      tagId: string;
      payload: { name?: string; slug?: string };
    }) => updateTag(tagId, payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Tag updated successfully");
        setIsEditOpen(false);
        setSelectedTag(null);
        queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: () => toast.error("Failed to update tag"),
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: string) => deleteTag(tagId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Tag deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      } else {
        toast.error(res.message);
      }
    },
    onError: () => toast.error("Failed to delete tag"),
  });

  const handleOpenEdit = (tag: ITagResponse) => {
    setSelectedTag(tag);
    setEditForm({ name: tag.name, slug: tag.slug });
    setIsEditOpen(true);
  };

  const handleDelete = (tag: ITagResponse) => {
    Swal.fire({
      title: `Delete tag "${tag.name}"?`,
      text: "This will remove the tag from all associated media and reviews.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(tag.id);
      }
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name: createForm.name, slug: createForm.slug });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTag) return;
    updateMutation.mutate({
      tagId: selectedTag.id,
      payload: { name: editForm.name, slug: editForm.slug },
    });
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(search.toLowerCase()) ||
      tag.slug.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <TagIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
      {/* Cinematic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl text-red-600" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              Tag Registry
            </h1>
            <p className="text-neutral-500 font-medium tracking-wide">
              {tags.length} registered signal tag{tags.length !== 1 ? "s" : ""} in the system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
              />
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-wider text-xs px-5 py-2"
            >
              <PlusIcon className="mr-2 size-4" />
              Deploy Tag
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Tag Identity</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Slug Vector</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Media Links</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Review Links</TableHead>
              <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">Timestamp</TableHead>
              <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-neutral-500 font-bold uppercase tracking-widest text-xs"
                >
                  {search ? `No tags match "${search}"` : "No tags registered in the system"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag: ITagResponse) => (
                <TableRow key={tag.id} className="border-white/5 transition-colors hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TagIcon className="size-4 text-red-600/60 shrink-0" />
                      <span className="font-bold text-white">{tag.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-blue-600/20 text-blue-400 ring-1 ring-blue-600/40 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-widest font-mono">
                      {tag.slug}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FilmIcon className="size-4 text-neutral-500" />
                      <span className="font-bold text-white text-sm">{tag._count.mediaTags}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MessagesSquareIcon className="size-4 text-neutral-500" />
                      <span className="font-bold text-white text-sm">{tag._count.reviewTags}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-blue-600/20 hover:text-blue-400"
                        onClick={() => handleOpenEdit(tag)}
                      >
                        <EditIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600"
                        onClick={() => handleDelete(tag)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-sm border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Deploy New Tag
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-wide">
              Register a new signal tag for media and review classification.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="create-tag-name" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Tag Identifier
              </Label>
              <Input
                id="create-tag-name"
                placeholder="e.g. Classic"
                value={createForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCreateForm({
                    name,
                    slug: slugify(name),
                  });
                }}
                required
                className="border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-tag-slug" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Slug Vector
                <span className="ml-2 text-neutral-600">
                  (auto-generated)
                </span>
              </Label>
              <Input
                id="create-tag-slug"
                placeholder="e.g. classic"
                value={createForm.slug}
                onChange={(e) =>
                  setCreateForm({ ...createForm, slug: e.target.value })
                }
                className="font-mono text-sm border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers and hyphens allowed"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="border-white/10 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                Abort
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700 font-bold"
              >
                {createMutation.isPending ? "Deploying..." : "Deploy Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-sm border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Modify Tag
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-wide">
              Update the tag identifier and slug vector.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Tag Identifier
              </Label>
              <Input
                id="edit-tag-name"
                placeholder="e.g. Classic"
                value={editForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditForm({ name, slug: slugify(name) });
                }}
                required
                className="border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tag-slug" className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Slug Vector
              </Label>
              <Input
                id="edit-tag-slug"
                placeholder="e.g. classic"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm({ ...editForm, slug: e.target.value })
                }
                className="font-mono text-sm border-white/5 bg-white/5 text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:ring-0"
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers and hyphens allowed"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="border-white/10 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
              >
                Abort
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700 font-bold"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagManagement;
