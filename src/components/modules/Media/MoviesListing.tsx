"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
  SortAscIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { getAllMedia } from "@/services/Media/getMedia.service";
import MediaCard from "./MediaCard";

const genres = [
  "Action",
  "Sci-Fi",
  "Comedy",
  "Horror",
  "Romance",
  "Drama",
  "Animation",
  "Thriller",
];

const sortOptions = [
  { label: "Newest Releases", value: "releaseYear", order: "desc" },
  { label: "Oldest Releases", value: "releaseYear", order: "asc" },
  { label: "Top Rated", value: "averageRating", order: "desc" },
  { label: "Alphabetical", value: "title", order: "asc" },
];

interface MoviesListingProps {
  initialQueryString: string;
}

const MoviesListing = ({ initialQueryString }: MoviesListingProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || "";
  const genre = searchParams.get("genre") || "";
  const sortBy = searchParams.get("sortBy") || "releaseYear";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const [searchInput, setSearchInput] = useState(searchTerm);

  // Sync search input with URL search term
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 for any filter change that isn't pagination
    if (newParams.page === undefined) {
      params.set("page", "1");
    }

    startTransition(() => {
      router.push(`/media?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push("/media");
  };

  const { data: mediaData, isLoading } = useQuery({
    queryKey: ["media", searchParams.toString()],
    queryFn: () => getAllMedia(`type=MOVIE&${searchParams.toString()}`),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ searchTerm: searchInput });
  };

  const activeSort =
    sortOptions.find((o) => o.value === sortBy && o.order === sortOrder) ||
    sortOptions[0];

  const items = (mediaData as any)?.data || [];
  const meta = (mediaData as any)?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-10 group/listing">
      {/* Search & Filter Bar */}
      <div className="sticky top-20 z-40 bg-slate-950/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 shadow-2xl transition-all duration-300 group-hover/listing:border-primary/20">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <form
            onSubmit={handleSearch}
            className="relative w-full lg:max-w-md group"
          >
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search movies by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-12 pl-12 pr-12 bg-white/5 border-none rounded-2xl text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ searchTerm: null });
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Genre Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <FilterIcon className="mr-2 size-4 text-primary" />
                  {genre || "All Genres"}
                  <ChevronDownIcon className="ml-2 size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-white/10 text-white rounded-xl min-w-48">
                <DropdownMenuItem
                  onClick={() => updateFilters({ genre: null })}
                  className="cursor-pointer"
                >
                  All Genres
                </DropdownMenuItem>
                {genres.map((g) => (
                  <DropdownMenuItem
                    key={g}
                    onClick={() => updateFilters({ genre: g })}
                    className={`cursor-pointer ${genre === g ? "text-primary font-bold" : ""}`}
                  >
                    {g}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <SortAscIcon className="mr-2 size-4 text-primary" />
                  {activeSort.label}
                  <ChevronDownIcon className="ml-2 size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-white/10 text-white rounded-xl min-w-48">
                {sortOptions.map((opt) => (
                  <DropdownMenuItem
                    key={`${opt.value}-${opt.order}`}
                    onClick={() =>
                      updateFilters({ sortBy: opt.value, sortOrder: opt.order })
                    }
                    className={`cursor-pointer ${sortBy === opt.value && sortOrder === opt.order ? "text-primary font-bold" : ""}`}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(genre || searchTerm || sortBy !== "releaseYear") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-12 text-slate-500 hover:text-white hover:bg-transparent"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-xl bg-slate-900 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <SearchIcon className="size-10 text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-white uppercase font-outfit">
            No movies found
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            We couldn't find any movies matching your current filters. Try
            adjusting your search.
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="rounded-xl"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {items.map((media: any, index: number) => (
              <MediaCard
                key={media.id}
                media={media}
                index={index}
                itemsLength={items.length}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-white/5">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Showing <span className="text-white">{items.length}</span> of{" "}
            <span className="text-white">{meta.total}</span> movies
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={meta.page <= 1 || isPending}
              onClick={() => updateFilters({ page: meta.page - 1 })}
              className="h-10 px-4 rounded-xl bg-white/5 border-white/10 text-white"
            >
              <ChevronLeftIcon className="mr-2 size-4" /> Previous
            </Button>
            <div className="flex items-center gap-1.5 px-4 font-bold text-white">
              {meta.page} <span className="text-slate-700">/</span>{" "}
              {meta.totalPages}
            </div>
            <Button
              variant="outline"
              disabled={meta.page >= meta.totalPages || isPending}
              onClick={() => updateFilters({ page: meta.page + 1 })}
              className="h-10 px-4 rounded-xl bg-white/5 border-white/10 text-white"
            >
              Next <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesListing;
