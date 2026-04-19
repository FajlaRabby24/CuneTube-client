"use client";

import { motion } from "motion/react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  IMediasResponse,
} from "@/services/Media/getMedia.service";
import { deleteMedia } from "@/services/Media/mediaActions.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ActivityIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EditIcon,
  FilmIcon,
  FlameIcon,
  GlobeIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  TrashIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

import { ContentStatus } from "@/lib/enum";
import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { getYouTubeVideoId } from "../../../lib/utils/getYoutubeVedioId";
import { CreateMediaModal } from "./CreateMediaModal";
import { EditMediaModal } from "./EditMediaModal";

interface MediaManagementProps {
  initialQueryString: string;
}

const MEDIA_TYPES = [
  "MOVIE",
  "SERIES",
  "TRAILER",
  "EPISODE",
  "SHORT",
  "FUNNY",
  "SPORT",
  "MOTIVATIONAL",
  "EDUCATIONAL",
  "OTHER",
];

const PRICING_TYPES = ["FREE", "PREMIUM"];
const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "UNPUBLISHED"];

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Tactical Filter State - Initialized from URL
  const [type, setType] = useState<string>(searchParams.get("type") || "ALL");
  const [pricingType, setPricingType] = useState<string>(
    searchParams.get("pricingType") || "ALL",
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || "ALL",
  );
  const [isFeatured, setIsFeatured] = useState<string>(
    searchParams.get("isFeatured") || "ALL",
  );
  const [isTrending, setIsTrending] = useState<string>(
    searchParams.get("isTrending") || "ALL",
  );
  const [isEditorsPick, setIsEditorsPick] = useState<string>(
    searchParams.get("isEditorsPick") || "ALL",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryParams = new URLSearchParams(initialQueryString);
  if (debouncedSearch) queryParams.set("searchTerm", debouncedSearch);
  if (page) queryParams.set("page", String(page));
  if (type !== "ALL") queryParams.set("type", type);
  if (pricingType !== "ALL") queryParams.set("pricingType", pricingType);
  if (status !== "ALL") queryParams.set("status", status);
  if (isFeatured !== "ALL") queryParams.set("isFeatured", isFeatured);
  if (isTrending !== "ALL") queryParams.set("isTrending", isTrending);
  if (isEditorsPick !== "ALL") queryParams.set("isEditorsPick", isEditorsPick);

  const {
    data: mediaData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "admin-media",
      page,
      debouncedSearch,
      type,
      pricingType,
      status,
      isFeatured,
      isTrending,
      isEditorsPick,
    ],
    queryFn: () => getAllMedia(queryParams.toString()),
  });

  console.log(mediaData, "media managment");

  const { data: selectedMediaData, isLoading: isLoadingMedia } =
    useQuery<IMediaResponse | null>({
      queryKey: ["admin-media-details", selectedMediaSlug],
      queryFn: () => getMediaBySlug(selectedMediaSlug!),
      enabled: !!selectedMediaSlug && (isDetailsOpen || isEditOpen),
    });

  const selectedMedia = selectedMediaData;

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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Update local state and router
    if (key === "type") setType(value);
    if (key === "pricingType") setPricingType(value);
    if (key === "status") setStatus(value);
    if (key === "isFeatured") setIsFeatured(value);
    if (key === "isTrending") setIsTrending(value);
    if (key === "isEditorsPick") setIsEditorsPick(value);

    router.push(`/admin/dashboard/media-management?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) params.set("searchTerm", value);
    else params.delete("searchTerm");
    router.push(`/admin/dashboard/media-management?${params.toString()}`);
  };

  const handleViewDetails = (slug: string) => {
    setSelectedMediaSlug(slug);
    setIsDetailsOpen(true);
  };

  const handleEditMedia = (slug: string) => {
    setSelectedMediaSlug(slug);
    setIsEditOpen(true);
  };

  const handleDelete = (media: IMediasResponse) => {
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
      <div className="flex h-[600px] items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-600/10">
          <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
          <FilmIcon className="h-8 w-8 animate-pulse text-red-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen space-y-8 p-6 text-white lg:p-10">
        {/* Cinematic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-8 backdrop-blur-2xl"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                Media Intelligence
              </h1>
              <p className="text-neutral-500 font-medium mt-2">
                Manage and monitor holographic assets and cinematic
                transmissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-600" />
                <input
                  placeholder="Search tactical media..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchInput)
                  }
                  className="w-full rounded-xl border border-white/5 bg-white/5 py-2.5 pl-9 text-sm text-white placeholder:text-neutral-600 focus:border-red-600/40 focus:outline-none focus:ring-0 transition-all font-medium"
                />
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl border border-white/5 bg-red-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
              >
                <PlusIcon className="mr-2 size-4" />
                Deploy New Asset
              </Button>
            </div>
          </div>

          {/* Tactical Filter Console */}
          <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">
                Asset Type
              </label>
              <Select
                value={type}
                onValueChange={(val) => handleFilterChange("type", val)}
              >
                <SelectTrigger className="border-white/5 bg-black/40 text-neutral-400 rounded-xl h-10 font-bold text-xs uppercase tracking-tight focus:ring-0 focus:border-red-600/40">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="border-white/5 bg-black/95 text-white backdrop-blur-xl">
                  <SelectItem
                    value="ALL"
                    className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                  >
                    All Modules
                  </SelectItem>
                  {MEDIA_TYPES.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">
                Access Tier
              </label>
              <Select
                value={pricingType}
                onValueChange={(val) => handleFilterChange("pricingType", val)}
              >
                <SelectTrigger className="border-white/5 bg-black/40 text-neutral-400 rounded-xl h-10 font-bold text-xs uppercase tracking-tight focus:ring-0 focus:border-red-600/40">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent className="border-white/5 bg-black/95 text-white backdrop-blur-xl">
                  <SelectItem
                    value="ALL"
                    className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                  >
                    All Tiers
                  </SelectItem>
                  {PRICING_TYPES.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">
                Deployment
              </label>
              <Select
                value={status}
                onValueChange={(val) => handleFilterChange("status", val)}
              >
                <SelectTrigger className="border-white/5 bg-black/40 text-neutral-400 rounded-xl h-10 font-bold text-xs uppercase tracking-tight focus:ring-0 focus:border-red-600/40">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent className="border-white/5 bg-black/95 text-white backdrop-blur-xl">
                  <SelectItem
                    value="ALL"
                    className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                  >
                    All Phases
                  </SelectItem>
                  {CONTENT_STATUSES.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {[
              {
                key: "isFeatured",
                label: "Featured",
                icon: ZapIcon,
                color: "text-amber-500",
                glow: "shadow-amber-500/20",
                state: isFeatured,
              },
              {
                key: "isTrending",
                label: "Trending",
                icon: FlameIcon,
                color: "text-red-500",
                glow: "shadow-red-500/20",
                state: isTrending,
              },
              {
                key: "isEditorsPick",
                label: "Editor's Pick",
                icon: ActivityIcon,
                color: "text-blue-500",
                glow: "shadow-blue-500/20",
                state: isEditorsPick,
              },
            ].map((protocol) => (
              <div key={protocol.key} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 ml-1">
                  {protocol.label}
                </label>
                <Select
                  value={protocol.state}
                  onValueChange={(val) => handleFilterChange(protocol.key, val)}
                >
                  <SelectTrigger className="border-white/5 bg-black/40 text-neutral-400 rounded-xl h-10 font-bold text-xs uppercase tracking-tight focus:ring-0 focus:border-red-600/40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent className="border-white/5 bg-black/95 text-white backdrop-blur-xl">
                    <SelectItem
                      value="ALL"
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600 italic"
                    >
                      Select
                    </SelectItem>
                    <SelectItem
                      value="true"
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-green-600/20 focus:text-green-500 text-emerald-400"
                    >
                      Deployed
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className="font-bold text-xs uppercase cursor-pointer focus:bg-red-600/20 focus:text-red-600"
                    >
                      Offline
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-white/5 bg-black/40 p-1 backdrop-blur-xl"
        >
          {/* Table */}
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent transition-colors">
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                  Asset Intel
                </TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                  Deployment Status
                </TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                  Access Tier
                </TableHead>
                <TableHead className="font-bold text-neutral-400 uppercase tracking-wider text-xs">
                  Type
                </TableHead>
                <TableHead className="text-right font-bold text-neutral-400 uppercase tracking-wider text-xs">
                  Action Console
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mediaList.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FilmIcon className="size-10 text-neutral-800" />
                      <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
                        No holographic assets found in current grid
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                mediaList?.map((media) => (
                  <TableRow
                    key={media.id}
                    className="border-white/5 transition-colors hover:bg-white/5 group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/10 shadow-2xl transition-transform group-hover:scale-110">
                          {media.youtubeStreamUrl ? (
                            <Image
                              src={`https://img.youtube.com/vi/${getYouTubeVideoId(media.youtubeStreamUrl)}/hqdefault.jpg`}
                              alt={media.title}
                              width={48}
                              height={64}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm font-black text-red-600">
                              <FilmIcon className="size-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-white tracking-tight group-hover:text-red-500 transition-colors uppercase italic">
                            {media.title}
                          </p>
                          <p className="flex items-center gap-1.5 text-[10px] font-black text-neutral-500 uppercase tracking-tighter">
                            <StarIcon className="size-3 text-red-600 fill-red-600" />
                            {media.averageRating.toFixed(1)} / 10
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${
                          media.status === "PUBLISHED"
                            ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                            : media.status === "ARCHIVED"
                              ? "bg-amber-600/20 text-amber-400 ring-1 ring-amber-600/40"
                              : "bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40"
                        }`}
                      >
                        {media.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`rounded-md px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${
                          media.pricingType === "PREMIUM"
                            ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {media.pricingType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="ghost"
                        className="rounded-md border border-white/5 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-400"
                      >
                        {media.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="size-8 rounded-lg bg-white/5 p-0 text-neutral-400 transition-colors hover:bg-red-600/20 hover:text-red-600"
                          >
                            <MoreHorizontalIcon className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border-white/5 bg-black/95 p-2 text-white backdrop-blur-xl"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer font-bold uppercase tracking-widest text-[10px] items-center gap-2 transition-colors focus:bg-red-600/20 focus:text-red-600"
                            onClick={() => handleViewDetails(media.slug)}
                          >
                            <FilmIcon className="size-3" />
                            View Intelligence
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer font-bold uppercase tracking-widest text-[10px] items-center gap-2 transition-colors focus:bg-blue-600/20 focus:text-blue-600"
                            onClick={() => handleEditMedia(media.slug)}
                          >
                            <EditIcon className="size-3" />
                            Modify Parameters
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer font-bold uppercase tracking-widest text-[10px] items-center gap-2 text-red-600 transition-colors focus:bg-red-600/20"
                            onClick={() => handleDelete(media)}
                          >
                            <TrashIcon className="size-3" />
                            Purge Asset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between py-6">
            <p className="text-xs font-black text-neutral-600 uppercase tracking-widest italic">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              Asset Transmissions
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 disabled:opacity-20"
              >
                <ChevronLeftIcon className="mr-1 size-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                        meta.page === pageNum
                          ? "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                          : "bg-white/5 text-neutral-400 hover:bg-red-600/10 hover:text-red-600"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="rounded-xl border border-white/5 bg-white/5 text-xs font-bold uppercase tracking-widest text-neutral-400 transition-all hover:bg-red-600/10 hover:text-red-600 disabled:opacity-20"
              >
                Next
                <ChevronRightIcon className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Media Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/5 bg-black/95 p-8 text-white backdrop-blur-2xl">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-white">
              Media Intelligence Console
            </DialogTitle>
            <DialogDescription className="text-neutral-500 font-medium tracking-tight">
              Detailed holographic asset parameters for slug:{" "}
              {selectedMediaSlug}
            </DialogDescription>
          </DialogHeader>

          {isLoadingMedia ? (
            <div className="flex h-64 items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20" />
                <FilmIcon className="h-8 w-8 animate-pulse text-red-600" />
              </div>
            </div>
          ) : selectedMedia ? (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              {/* Profile Section */}
              <div className="flex flex-col gap-8 md:flex-row md:items-start">
                <div className="relative shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_0_50px_rgba(220,38,38,0.15)] transition-transform hover:scale-105 duration-500">
                  {selectedMedia.youtubeStreamUrl ? (
                    <Image
                      src={`https://img.youtube.com/vi/${getYouTubeVideoId(selectedMedia.youtubeStreamUrl)}/hqdefault.jpg`}
                      alt={selectedMedia.title}
                      width={200}
                      height={280}
                      className="h-72 w-52 object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="flex h-72 w-52 items-center justify-center text-4xl font-black text-red-600 italic">
                      NO_HOLO
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
                      {selectedMedia.title}
                    </h3>
                    <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-md">
                      {selectedMedia.synopsis}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge
                      className={`rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none ${
                        selectedMedia.status === ContentStatus.PUBLISHED
                          ? "bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-600/40"
                          : "bg-neutral-600/20 text-neutral-400 ring-1 ring-neutral-600/40"
                      }`}
                    >
                      {selectedMedia.status}
                    </Badge>
                    <Badge className="bg-red-600 text-white rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                      {selectedMedia.pricingType}
                    </Badge>
                    <Badge className="bg-white/5 text-neutral-400 rounded-xl px-4 py-1 text-[10px] font-black uppercase tracking-widest border border-white/10">
                      {selectedMedia.type}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    label: "Temporal Sync",
                    icon: CalendarIcon,
                    items: [
                      {
                        key: "Release Cycle",
                        val: selectedMedia.releaseYear,
                        icon: ClockIcon,
                      },
                      {
                        key: "Duration Flux",
                        val: selectedMedia.duration
                          ? `${selectedMedia.duration} Min`
                          : "N/A",
                        icon: FilmIcon,
                      },
                    ],
                  },
                  {
                    label: "Asset Source",
                    icon: GlobeIcon,
                    items: [
                      {
                        key: "Origin Grid",
                        val: selectedMedia.country,
                        icon: GlobeIcon,
                      },
                      {
                        key: "Native Encoding",
                        val: selectedMedia.language,
                        icon: ShieldIcon,
                      },
                    ],
                  },
                  {
                    label: "Engagement Hub",
                    icon: StarIcon,
                    items: [
                      {
                        key: "Global Rating",
                        val: `${selectedMedia.averageRating?.toFixed(1)} / 10`,
                        icon: StarIcon,
                      },
                      {
                        key: "Audience Syncs",
                        val: selectedMedia.totalViews,
                        icon: UsersIcon,
                      },
                    ],
                  },
                ].map((section) => (
                  <div
                    key={section.label}
                    className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.07]"
                  >
                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 group-hover:text-red-600">
                      <section.icon className="size-3" /> {section.label}
                    </h4>
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div key={item.key} className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg bg-white/5 p-1.5 ring-1 ring-white/5 group-hover:bg-red-600/10 group-hover:ring-red-600/20">
                            <item.icon className="size-3.5 text-neutral-500 group-hover:text-red-600" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-tighter">
                              {item.key}
                            </p>
                            <p className="text-sm font-black text-neutral-300 group-hover:text-white truncate italic">
                              {item.val}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Taxonomic Data */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                  <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                    Genre Classifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.genres?.map(
                      (g: { id: string; genre: string }) => (
                        <Badge
                          key={g.id}
                          className="rounded-lg bg-black/40 border border-white/5 px-3 py-1 text-[10px] font-bold text-neutral-400"
                        >
                          {g.genre}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
                  <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                    Tactical Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.tags?.map(
                      (t: { id: string; tag: { name: string } }) => (
                        <Badge
                          key={t.id}
                          className="rounded-lg bg-blue-600/10 border border-blue-600/20 px-3 py-1 text-[10px] font-bold text-blue-400"
                        >
                          {t.tag.name}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Personnel Records */}
              <div className="rounded-3xl border border-white/5 bg-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <UsersIcon className="size-12 text-white/5" />
                </div>
                <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
                  Strategic Personnel Records
                </h4>
                <div className="grid gap-12 md:grid-cols-2">
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase tracking-widest text-red-600 italic underline underline-offset-8 decoration-red-600/20 mb-6 flex items-center gap-2">
                      <ShieldIcon className="size-3" /> Command (Directors)
                    </p>
                    <div className="space-y-4">
                      {selectedMedia.directors?.map(
                        (d: { id: string; directorName: string }) => (
                          <div
                            key={d.id}
                            className="group flex items-center gap-4"
                          >
                            <div className="h-8 w-1 bg-red-600/40 group-hover:bg-red-600 transition-colors" />
                            <p className="font-bold text-neutral-300 group-hover:text-white uppercase tracking-tight">
                              {d.directorName}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600 italic underline underline-offset-8 decoration-blue-600/20 mb-6 flex items-center gap-2">
                      <UsersIcon className="size-3" /> Tactical Operatives
                      (Cast)
                    </p>
                    <div className="space-y-4">
                      {selectedMedia.castMembers
                        ?.slice(0, 5)
                        .map(
                          (c: {
                            id: string;
                            actorName: string;
                            character: string;
                          }) => (
                            <div key={c.id} className="group flex flex-col">
                              <p className="font-black text-white uppercase tracking-tighter italic">
                                {c.actorName}
                              </p>
                              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                                Role: {c.character}
                              </p>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Uplinks */}
              {selectedMedia.youtubeStreamUrl && (
                <div className="flex flex-col gap-4 p-8 rounded-3xl bg-red-600/5 border border-red-600/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                        Global Stream Uplink
                      </h4>
                      <p className="text-sm font-bold text-neutral-400">
                        Secure connection verified via YouTube parameters.
                      </p>
                    </div>
                    <a
                      href={selectedMedia.youtubeStreamUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs rounded-xl px-8 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                        Initiate Transmission
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center">
              <FilmIcon className="mx-auto size-12 text-neutral-800 mb-4" />
              <p className="text-xs font-black text-neutral-600 uppercase tracking-[0.2em]">
                Intel retrieval failed. Asset offline.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateMediaModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {isEditOpen && selectedMedia && (
        <EditMediaModal
          open={isEditOpen}
          onOpenChange={(val) => {
            setIsEditOpen(val);
            if (!val) {
              setTimeout(() => setSelectedMediaSlug(null), 300);
            }
          }}
          mediaId={selectedMedia.id}
          initialData={selectedMedia}
        />
      )}
    </>
  );
};

export default MediaManagement;
