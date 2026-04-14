"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getAllMedia,
  getMediaBySlug,
  IMediaResponse,
} from "@/services/Media/getMedia.service";
import { deleteMedia } from "@/services/Media/mediaActions.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CalendarIcon,
  FilmIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
} from "lucide-react";

import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { CreateMediaModal } from "./CreateMediaModal";

interface MediaManagementProps {
  initialQueryString: string;
}

const MediaManagement = ({ initialQueryString }: MediaManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("searchTerm") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedMediaSlug, setSelectedMediaSlug] = useState<string | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) {
    queryParams.set("searchTerm", debouncedSearch);
  }
  if (page) {
    queryParams.set("page", String(page));
  }

  const {
    data: mediaData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-media", page, debouncedSearch],
    queryFn: () => getAllMedia(queryParams.toString()),
  });

  console.log(mediaData, "media managment");

  const { data: selectedMediaData, isLoading: isLoadingMedia } = useQuery<{
    data: IMediaResponse;
  } | null>({
    queryKey: ["admin-media-details", selectedMediaSlug],
    queryFn: () => getMediaBySlug(selectedMediaSlug!),
    enabled: !!selectedMediaSlug && isDetailsOpen,
  });

  const selectedMedia = selectedMediaData?.data;

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) => deleteMedia(mediaId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        refetch();
        queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      } else {
        toast.error(data.message);
      }
    },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(initialQueryString);
    params.set("page", String(newPage));
    if (debouncedSearch) params.set("searchTerm", debouncedSearch);
    router.push(`/admin/dashboard/media-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(initialQueryString);
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    router.push(`/admin/dashboard/media-management?${params.toString()}`);
  };

  const handleViewDetails = (slug: string) => {
    setSelectedMediaSlug(slug);
    setIsDetailsOpen(true);
  };

  const handleDelete = (media: IMediaResponse) => {
    Swal.fire({
      title: "Delete Media",
      text: `Are you sure you want to delete ${media.title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(media.id);
      }
    });
  };

  const mediaList = mediaData?.data || [];

  const meta = mediaData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

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
            <h1 className="text-2xl font-bold">Media Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all media
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchInput)
                }
                className="pl-9"
              />
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="shrink-0 cursor-pointer"
            >
              <PlusIcon className="mr-2 size-4" />
              Create Media
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Media</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Released</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mediaList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No media found
                </TableCell>
              </TableRow>
            ) : (
              mediaList?.map((media: IMediaResponse) => (
                <TableRow key={media.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 overflow-hidden rounded bg-muted">
                        {media.posterUrl ? (
                          <Image
                            src={media.posterUrl}
                            alt={media.title}
                            width={40}
                            height={56}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm font-medium">
                            <FilmIcon className="size-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{media.title}</p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <StarIcon className="size-3 text-yellow-500" />
                          {media.averageRating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {media.status === "PUBLISHED" ? (
                        <Badge className="bg-green-500">Published</Badge>
                      ) : media.status === "ARCHIVED" ? (
                        <Badge variant="secondary">Archived</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{media.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{media.releaseYear}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="cursor-pointer"
                          size="icon"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 space-y-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(media.slug)}
                        >
                          <FilmIcon className="mr-2 size-4" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={() => handleDelete(media)}
                        >
                          <TrashIcon className="mr-2 size-4" />
                          Delete Media
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              media
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page - 1);
                    }}
                    className={
                      meta.page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={meta.page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(meta.page + 1);
                    }}
                    className={
                      meta.page >= meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Media Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Media Details</DialogTitle>
            <DialogDescription>
              Complete information about the media
            </DialogDescription>
          </DialogHeader>

          {isLoadingMedia ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          ) : selectedMedia ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <div className="h-28 w-20 overflow-hidden rounded bg-muted">
                  {selectedMedia.posterUrl ? (
                    <Image
                      src={selectedMedia.posterUrl}
                      alt={selectedMedia.title}
                      width={80}
                      height={112}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-medium">
                      <FilmIcon className="size-10" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedMedia.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {selectedMedia.synopsis}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {selectedMedia.status === "PUBLISHED" ? (
                      <Badge className="bg-green-500">Published</Badge>
                    ) : selectedMedia.status === "ARCHIVED" ? (
                      <Badge variant="secondary">Archived</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                    <Badge variant="outline">{selectedMedia.type}</Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-500 text-blue-500"
                    >
                      {selectedMedia.pricingType}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Media Information</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Release Year
                      </p>
                      <p className="text-sm font-medium">
                        {selectedMedia.releaseYear}
                      </p>
                    </div>
                  </div>

                  {selectedMedia.duration && (
                    <div className="flex items-center gap-3">
                      <FilmIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="text-sm font-medium">
                          {selectedMedia.duration} minutes
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedMedia.totalSeasons && (
                    <div className="flex items-center gap-3">
                      <FilmIcon className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Total Seasons
                        </p>
                        <p className="text-sm font-medium">
                          {selectedMedia.totalSeasons}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <StarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-sm font-medium">
                        {selectedMedia.averageRating?.toFixed(1)} / 10 (
                        {selectedMedia?.totalReviews} reviews)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 rounded-lg border p-4">
                <h4 className="font-semibold">Engagement</h4>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <StarIcon className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-sm font-medium">
                        {selectedMedia.totalViews}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMedia.isFeatured && (
                      <Badge className="bg-purple-500">Featured</Badge>
                    )}
                    {selectedMedia.isEditorsPick && (
                      <Badge className="bg-indigo-500">Editor's Pick</Badge>
                    )}
                    {selectedMedia.isTrending && (
                      <Badge className="bg-pink-500">Trending</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              Unable to load media details
            </p>
          )}
        </DialogContent>
      </Dialog>

      <CreateMediaModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
};

export default MediaManagement;
