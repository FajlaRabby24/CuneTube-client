"use client";

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
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 p-3 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tag Management</h1>
            <p className="text-sm text-muted-foreground">
              {tags.length} total tag{tags.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusIcon className="mr-2 size-4" />
              Add Tag
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Media Uses</TableHead>
                <TableHead>Review Uses</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    {search ? `No tags match "${search}"` : "No tags yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map((tag: ITagResponse) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TagIcon className="size-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {tag.slug}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <FilmIcon className="size-4 text-muted-foreground" />
                        <span>{tag._count.mediaTags}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MessagesSquareIcon className="size-4 text-muted-foreground" />
                        <span>{tag._count.reviewTags}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleOpenEdit(tag)}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-destructive hover:text-destructive"
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
        </div>
      </div>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to categorize media and reviews.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-tag-name">Name</Label>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-tag-slug">
                Slug
                <span className="ml-1 text-xs text-muted-foreground">
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
                className="font-mono text-sm"
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers and hyphens allowed"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update the tag name and slug.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Name</Label>
              <Input
                id="edit-tag-name"
                placeholder="e.g. Classic"
                value={editForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditForm({ name, slug: slugify(name) });
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tag-slug">Slug</Label>
              <Input
                id="edit-tag-slug"
                placeholder="e.g. classic"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm({ ...editForm, slug: e.target.value })
                }
                className="font-mono text-sm"
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers and hyphens allowed"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TagManagement;
